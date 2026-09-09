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

// The 11 FAQ category pages. /faq is a hub that links to these and repeats
// none of their answers, so each question lives at exactly one URL. Kept as
// its own list because several assertions below care specifically about the
// hub/spoke split rather than about pages in general.
const FAQ_CATEGORY_PAGES = [
  "/faq/pricing",
  "/faq/process",
  "/faq/ai-voice-agents",
  "/faq/ai-chatbots",
  "/faq/business-automation",
  "/faq/web-development",
  "/faq/marketing-and-social",
  "/faq/working-together",
  "/faq/technical-and-security",
  "/faq/hiring-remotely",
  "/faq/islamabad",
];

const PAGES = [
  "/",
  "/services",
  "/faq",
  "/services/ai-voice-agents",
  "/services/ai-chatbots",
  "/services/business-automation",
  "/services/web-development",
  "/services/marketing-and-social",
  ...FAQ_CATEGORY_PAGES,
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
  // Cold-calling CRM: real businesses and phone numbers Zaheen dials
  // himself. Same "no public read" reasoning as prospects.
  { method: "GET", path: "/api/call-campaigns" },
  { method: "POST", path: "/api/call-campaigns" },
  { method: "PATCH", path: "/api/call-campaigns/1" },
  { method: "DELETE", path: "/api/call-campaigns/1" },
  { method: "GET", path: "/api/call-leads" },
  { method: "POST", path: "/api/call-leads" },
  { method: "PATCH", path: "/api/call-leads/1" },
  { method: "DELETE", path: "/api/call-leads/1" },
  { method: "POST", path: "/api/call-leads/import" },
  { method: "GET", path: "/api/call-team-members" },
  { method: "POST", path: "/api/call-team-members" },
  { method: "DELETE", path: "/api/call-team-members/1" },
];

const OG_IMAGES = [
  "/opengraph-image",
  "/services/opengraph-image",
  "/faq/opengraph-image",
  ...PAGES.filter((p) => p.startsWith("/services/")).map(
    (p) => `${p}/opengraph-image`,
  ),
  ...FAQ_CATEGORY_PAGES.map((p) => `${p}/opengraph-image`),
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

describe("unsubscribe is public but requires a real signed link", () => {
  // Public by design (a real recipient clicks this with no session), but it
  // must not do anything to an address without proof this server actually
  // sent that address mail — otherwise it's an open tool for suppressing
  // anyone's inbox. Lives at /u/<slug>, not a query string — see
  // outreach-templates.ts on why a visible "?email=...&token=..." reads as
  // mail-merge software.
  test("a garbage slug is rejected", async () => {
    const res = await fetch(BASE + "/u/not-a-real-slug");
    assert.equal(res.status, 400);
  });

  test("a well-formed but forged slug is rejected", async () => {
    const fakeEmail = Buffer.from("test@example.com").toString("base64url");
    const res = await fetch(BASE + `/u/${fakeEmail}.0000000000000000`);
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

  test("sitemap lists every page, all on the canonical origin", async () => {
    const canonical = homeHtml.match(/rel="canonical"\s+href="([^"]+)"/)?.[1];
    const origin = new URL(canonical).origin;
    const xml = await (await fetch(BASE + "/sitemap.xml")).text();
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    assert.equal(
      locs.length,
      PAGES.length,
      `sitemap had ${locs.length} URLs, expected ${PAGES.length}`,
    );
    for (const loc of locs) {
      assert.equal(new URL(loc).origin, origin, `${loc} is off-origin`);
    }
    // A page that exists but is missing from the sitemap is the failure mode
    // that actually happens: adding a route and forgetting sitemap.ts.
    const paths = locs.map((l) => new URL(l).pathname.replace(/\/$/, "") || "/");
    for (const page of PAGES) {
      assert.ok(paths.includes(page), `${page} is missing from the sitemap`);
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

  // The hub/spoke split is the whole reason /faq stopped listing its own
  // answers. If a regression puts the answers back on /faq, every question
  // exists at two URLs again and the 11 category pages start competing with
  // their own hub for the same queries. These two tests are what catch that.
  test("/faq is a hub: it owns no FAQPage and repeats no answers", async () => {
    const html = await (await fetch(BASE + "/faq")).text();
    const blocks = [
      ...html.matchAll(
        /<script type="application\/ld\+json">(.*?)<\/script>/gs,
      ),
    ].map((m) => JSON.parse(m[1]));
    assert.ok(
      !blocks.some((b) => b["@type"] === "FAQPage"),
      "/faq emitted FAQPage schema; the category pages own that now",
    );
    for (const path of FAQ_CATEGORY_PAGES) {
      assert.ok(html.includes(`href="${path}"`), `/faq does not link ${path}`);
    }
  });

  test("each FAQ category page owns a FAQPage with its answers in the DOM", async () => {
    const html = await (await fetch(BASE + "/faq/pricing")).text();
    const blocks = [
      ...html.matchAll(
        /<script type="application\/ld\+json">(.*?)<\/script>/gs,
      ),
    ].map((m) => JSON.parse(m[1]));
    const faq = blocks.find((b) => b["@type"] === "FAQPage");
    assert.ok(faq, "no FAQPage entity on /faq/pricing");
    assert.ok(
      faq.mainEntity.length >= 15,
      `only ${faq.mainEntity.length} questions, expected a real page's worth`,
    );
    assert.ok(
      blocks.some((b) => b["@type"] === "BreadcrumbList"),
      "no BreadcrumbList on a FAQ category page",
    );
    assert.ok(
      !blocks.some((b) => b["@type"] === "ProfessionalService"),
      "ProfessionalService is duplicated on a FAQ category page",
    );
    // Schema has to match visible content: every answer it claims must
    // actually be rendered, expanded or not (HANDOFF section 7 and 27).
    for (const entry of faq.mainEntity) {
      const answer = entry.acceptedAnswer.text.slice(0, 40);
      assert.ok(
        html.includes(answer.replace(/&/g, "&amp;")) || html.includes(answer),
        `answer missing from the DOM: "${entry.name}"`,
      );
    }
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
