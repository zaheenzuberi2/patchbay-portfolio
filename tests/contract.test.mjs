import { test, describe, before } from "node:test";
import assert from "node:assert/strict";

// Contract tests for the deployed site.
//
// Why HTTP tests rather than unit tests: everything that can actually cost
// Zaheen money lives in behaviour that only exists once deployed. Lead capture
// writing to a real database, admin endpoints refusing unauthenticated
// callers, canonical tags resolving to the right origin. A unit test on a
// pure function would not have caught a single bug found in this project so
// far; every real one (canonical pointing at localhost, admin edits not
// showing until restart, mobile mic conflict) was a wiring or environment
// problem.
//
// No test framework and no dependencies: node:test ships with Node. This
// matches the same reasoning as notify.ts using plain fetch rather than the
// Resend SDK.
//
//   npm test                          # against production
//   BASE_URL=http://localhost:3000 npm test
//
// DELIBERATELY NOT TESTED: a real lead submission. That writes a row to the
// production database and there are already stale test rows in /admin from
// earlier manual checks. The honeypot path is tested instead because it is
// specified to return 200 while storing nothing.

const BASE = (process.env.BASE_URL || "https://zaheenzuberi.com").replace(
  /\/$/,
  "",
);

const PAGES = [
  "/",
  "/services",
  "/faq",
  "/services/ai-voice-agents",
  "/services/ai-chatbots",
  "/services/business-automation",
  "/services/web-development",
  "/services/marketing-and-social",
];

// Every endpoint that mutates data or reveals leads. All must refuse an
// unauthenticated caller. GET /api/projects and /api/reviews are public reads
// used by the marketing page, so they are not in this list.
const PROTECTED = [
  { method: "POST", path: "/api/projects" },
  { method: "PATCH", path: "/api/projects/1" },
  { method: "DELETE", path: "/api/projects/1" },
  { method: "GET", path: "/api/leads" },
  { method: "PATCH", path: "/api/leads/1" },
  { method: "DELETE", path: "/api/leads/1" },
  { method: "POST", path: "/api/reviews" },
  { method: "DELETE", path: "/api/reviews/1" },
  // Prospects are outbound cold-outreach targets: people who never asked to
  // be contacted. Unlike projects and reviews there is no public read here,
  // so GET is listed too. A regression that exposed this would leak a list of
  // third-party businesses and their contact addresses.
  { method: "GET", path: "/api/prospects" },
  { method: "POST", path: "/api/prospects" },
  { method: "PATCH", path: "/api/prospects/1" },
  { method: "DELETE", path: "/api/prospects/1" },
  // Triggers a real batch of cold emails. Must refuse anyone who isn't
  // either an admin session or Vercel Cron with the right bearer secret.
  { method: "GET", path: "/api/outreach/send" },
];

const OG_IMAGES = [
  "/opengraph-image",
  "/services/opengraph-image",
  "/faq/opengraph-image",
  ...PAGES.filter((p) => p.startsWith("/services/")).map(
    (p) => `${p}/opengraph-image`,
  ),
];

let homeHtml = "";

before(async () => {
  const res = await fetch(BASE + "/");
  homeHtml = await res.text();
});

describe("pages", () => {
  for (const path of PAGES) {
    test(`${path} returns 200`, async () => {
      const res = await fetch(BASE + path);
      assert.equal(res.status, 200, `${path} returned ${res.status}`);
    });
  }

  test("unknown route returns a real 404, not a soft 200", async () => {
    const res = await fetch(BASE + "/definitely-not-a-real-page-xyz");
    assert.equal(res.status, 404);
  });
});

describe("admin is not reachable without a session", () => {
  test("/admin redirects away", async () => {
    const res = await fetch(BASE + "/admin", { redirect: "manual" });
    assert.ok(
      [301, 302, 307, 308].includes(res.status),
      `expected a redirect, got ${res.status}`,
    );
  });

  for (const { method, path } of PROTECTED) {
    test(`${method} ${path} returns 401`, async () => {
      const res = await fetch(BASE + path, {
        method,
        headers: { "content-type": "application/json" },
        body: method === "GET" || method === "DELETE" ? undefined : "{}",
      });
      assert.equal(
        res.status,
        401,
        `${method} ${path} returned ${res.status}, expected 401`,
      );
    });
  }
});

describe("unsubscribe is public but requires a real signed token", () => {
  // Public by design (a real recipient clicks this with no session), but it
  // must not do anything to an address without proof this server actually
  // sent that address mail — otherwise it's an open tool for suppressing
  // anyone's inbox.
  test("no token at all is rejected", async () => {
    const res = await fetch(BASE + "/api/unsubscribe?email=test@example.com");
    assert.equal(res.status, 400);
  });

  test("a forged token is rejected", async () => {
    const res = await fetch(
      BASE + "/api/unsubscribe?email=test@example.com&token=0000000000000000000000000000000",
    );
    assert.equal(res.status, 400);
  });
});

describe("lead capture spam protection", () => {
  test("honeypot submission is absorbed with a normal-looking 200", async () => {
    // A populated `website` field is the tell: the real widget never sends it.
    // The endpoint must answer 200 so a bot cannot learn it was caught.
    const res = await fetch(BASE + "/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "contract-test honeypot",
        contact: "noreply@example.com",
        interest: "test",
        website: "https://spam.example.com",
      }),
    });
    assert.equal(res.status, 200);
  });
});

describe("canonical identity", () => {
  test("no localhost anywhere in the homepage HTML", () => {
    assert.ok(
      !/localhost:\d+/.test(homeHtml),
      "found a localhost URL in the served HTML",
    );
  });

  test("canonical, og:url and JSON-LD all point at the same origin", () => {
    const canonical = homeHtml.match(
      /rel="canonical"\s+href="([^"]+)"/,
    )?.[1];
    const ogUrl = homeHtml.match(
      /property="og:url"\s+content="([^"]+)"/,
    )?.[1];
    assert.ok(canonical, "no canonical tag found");
    assert.ok(ogUrl, "no og:url found");
    assert.equal(new URL(canonical).origin, new URL(ogUrl).origin);
    assert.ok(
      homeHtml.includes(`"@id":"${new URL(canonical).origin}/#person`),
      "JSON-LD Person @id origin does not match the canonical origin",
    );
  });

  test("sitemap lists 8 URLs, all on the canonical origin", async () => {
    const canonical = homeHtml.match(/rel="canonical"\s+href="([^"]+)"/)?.[1];
    const origin = new URL(canonical).origin;
    const xml = await (await fetch(BASE + "/sitemap.xml")).text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    assert.equal(locs.length, 8, `sitemap had ${locs.length} URLs`);
    for (const loc of locs) {
      assert.equal(new URL(loc).origin, origin, `${loc} is off-origin`);
    }
  });

  test("robots.txt keeps crawlers out of /admin and /api", async () => {
    const txt = await (await fetch(BASE + "/robots.txt")).text();
    assert.match(txt, /Disallow:\s*\/admin/);
    assert.match(txt, /Disallow:\s*\/api/);
  });
});

describe("structured data", () => {
  test("root graph holds exactly Person, ProfessionalService and WebSite", () => {
    const blocks = [
      ...homeHtml.matchAll(
        /<script type="application\/ld\+json">(.*?)<\/script>/gs,
      ),
    ].map((m) => JSON.parse(m[1]));
    const graph = blocks.find((b) => b["@graph"]);
    assert.ok(graph, "no @graph block on the homepage");
    const types = graph["@graph"].map((n) => n["@type"]).sort();
    assert.deepEqual(types, ["Person", "ProfessionalService", "WebSite"]);
  });

  test("ProfessionalService carries a real aggregateRating, not a fabricated one", () => {
    // A regression here would be invisible on the page itself: the star
    // rating only shows in Google's own search result, never on the site.
    // Reviews.tsx staying empty-safe when the table is empty is already
    // covered by it rendering nothing; this locks in the schema side, where
    // silently losing the property would just mean the snippet quietly
    // stops appearing with no visible symptom anywhere.
    const blocks = [
      ...homeHtml.matchAll(
        /<script type="application\/ld\+json">(.*?)<\/script>/gs,
      ),
    ].map((m) => JSON.parse(m[1]));
    const graph = blocks.find((b) => b["@graph"]);
    const business = graph["@graph"].find(
      (n) => n["@type"] === "ProfessionalService",
    );
    assert.ok(business.aggregateRating, "no aggregateRating on the business");
    assert.ok(
      business.aggregateRating.reviewCount >= 1,
      "aggregateRating.reviewCount should reflect at least one real review",
    );
    assert.ok(
      business.aggregateRating.ratingValue >= 1 &&
        business.aggregateRating.ratingValue <= 5,
      "ratingValue out of the declared 1-5 scale",
    );
    assert.ok(Array.isArray(business.review), "no review array");
    assert.ok(
      business.review.every((r) => r.author?.name && r.reviewBody),
      "a review entry is missing author or body",
    );
  });

  test("service pages own a Service entity carrying its own OG image", async () => {
    const html = await (
      await fetch(BASE + "/services/ai-voice-agents")
    ).text();
    const blocks = [
      ...html.matchAll(
        /<script type="application\/ld\+json">(.*?)<\/script>/gs,
      ),
    ].map((m) => JSON.parse(m[1]));
    const service = blocks.find((b) => b["@type"] === "Service");
    assert.ok(service, "no Service entity on the service page");
    assert.ok(
      service.image?.endsWith("/services/ai-voice-agents/opengraph-image"),
      `Service image was ${service.image}`,
    );
    // The site-wide entities must not be repeated per page.
    assert.ok(
      !blocks.some((b) => b["@type"] === "ProfessionalService"),
      "ProfessionalService is duplicated on a service page",
    );
  });
});

describe("share cards", () => {
  for (const path of OG_IMAGES) {
    test(`${path} is a real PNG`, async () => {
      const res = await fetch(BASE + path);
      assert.equal(res.status, 200);
      assert.equal(res.headers.get("content-type"), "image/png");
      const bytes = (await res.arrayBuffer()).byteLength;
      assert.ok(bytes > 10_000, `only ${bytes} bytes, likely a broken render`);
    });
  }
});

describe("security headers", () => {
  // A regression here is invisible on the page itself — the site looks and
  // works identically with or without these, so nothing short of a test
  // would ever catch one going missing after a future next.config.ts edit.
  test("homepage carries the hardened header set", async () => {
    const res = await fetch(BASE + "/");
    assert.equal(res.headers.get("x-content-type-options"), "nosniff");
    assert.equal(res.headers.get("x-frame-options"), "DENY");
    assert.equal(
      res.headers.get("referrer-policy"),
      "strict-origin-when-cross-origin",
    );
    assert.ok(
      res.headers.get("permissions-policy")?.includes("camera=()"),
      "permissions-policy missing or does not restrict camera",
    );
    const csp = res.headers.get("content-security-policy");
    assert.ok(csp, "no Content-Security-Policy header");
    assert.match(csp, /frame-ancestors 'none'/);
    assert.match(csp, /default-src 'self'/);
  });

  test("framework fingerprint is not disclosed", async () => {
    const res = await fetch(BASE + "/");
    assert.equal(res.headers.get("x-powered-by"), null);
  });

  test("headers apply past the homepage too, not just to /", async () => {
    const res = await fetch(BASE + "/faq");
    assert.equal(res.headers.get("x-frame-options"), "DENY");
  });
});

describe("theme toggle", () => {
  test("toggle button ships in the served HTML with a real label", async () => {
    // Defaults to dark, so the served (un-hydrated) markup should read
    // "Switch to light mode" — the label a visitor would see before any
    // client JS or localStorage has run.
    assert.match(homeHtml, /aria-label="Switch to light mode"/);
  });

  test("the anti-flash init script ships inline, not as a separate request", async () => {
    // If this ever moved to an external script or got deferred, a visitor
    // who chose light mode would see one dark frame before it corrects —
    // exactly the flash this script exists to prevent.
    assert.match(homeHtml, /localStorage\.getItem/);
  });

  test("light-mode CSS actually shipped in the built stylesheet", async () => {
    const cssHref = homeHtml.match(
      /<link rel="stylesheet" href="([^"]+\.css)"/,
    )?.[1];
    assert.ok(cssHref, "no stylesheet link found in the homepage HTML");
    const css = await (await fetch(BASE + cssHref)).text();
    assert.match(css, /data-theme=.?light/);
  });
});
