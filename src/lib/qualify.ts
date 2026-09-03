// Prospect qualification by measuring the prospect's own website.
//
// The point is NOT to score leads. It is to produce a specific, checkable
// observation that justifies the email: "your booking page has no mobile
// viewport set" is a reason to make contact. "Hi, we do web development" is
// not, and is what every other cold email in their inbox already says.
//
// A prospect with no finding is REJECTED rather than mailed with a generic
// pitch. That is the whole differentiator, and it is also what keeps volume
// low enough to stay deliverable.
//
// Everything here uses a plain fetch against a public page. No API, no key,
// no cost. It reads only what a browser would read.

export type Pitch = "voice" | "web" | "";

export type Qualification = {
  pitch: Pitch;
  signal: string;
  status: "qualified" | "rejected";
};

const TIMEOUT_MS = 12_000;
// Identify honestly rather than impersonating a browser. A site owner reading
// their logs can see exactly who this was and why.
const UA =
  "PatchbayQualifier/1.0 (+https://zaheenzuberi.com; site health check)";

function normalizeUrl(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  const withScheme = /^https?:\/\//i.test(t) ? t : `https://${t}`;
  try {
    const u = new URL(withScheme);
    if (!u.hostname.includes(".")) return null;
    return u.toString();
  } catch {
    return null;
  }
}

/**
 * No website at all is the single strongest signal for the web pitch, so it is
 * handled before any network call.
 */
export async function qualify(website: string): Promise<Qualification> {
  const url = normalizeUrl(website);

  if (!url) {
    return {
      pitch: "web",
      signal: "I couldn't find a website for your business when I looked.",
      status: "qualified",
    };
  }

  const started = Date.now();
  let res: Response;
  let html = "";

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "user-agent": UA },
    });
    html = (await res.text()).slice(0, 200_000);
    clearTimeout(timer);
  } catch {
    // Unreachable, DNS failure, TLS failure, or slower than the timeout. From
    // a customer's point of view the site is down, which is a real and
    // specific thing to open with.
    return {
      pitch: "web",
      signal: "Your website didn't load when I checked it just now (timed out or unreachable).",
      status: "qualified",
    };
  }

  const elapsed = Date.now() - started;

  if (res.status >= 400) {
    return {
      pitch: "web",
      signal: `Your website is returning an HTTP ${res.status} error right now.`,
      status: "qualified",
    };
  }

  // Ordered by how compelling the observation is to a business owner, not by
  // how easy it is to detect. The first match wins and becomes the hook.

  if (!res.url.startsWith("https://")) {
    return {
      pitch: "web",
      signal:
        "Your site is served over plain HTTP, so browsers show visitors a 'Not secure' warning.",
      status: "qualified",
    };
  }

  if (!/<meta[^>]+name=["']viewport["']/i.test(html)) {
    return {
      pitch: "web",
      signal:
        "Your site has no mobile viewport set, so it renders desktop-width on phones.",
      status: "qualified",
    };
  }

  if (elapsed > 5000) {
    return {
      pitch: "web",
      signal: `Your homepage took ${(elapsed / 1000).toFixed(1)}s to load when I checked it.`,
      status: "qualified",
    };
  }

  if (!/<title[^>]*>[^<]{3,}<\/title>/i.test(html)) {
    return {
      pitch: "web",
      signal: "Your homepage has no title tag, so search results show a bare URL for it.",
      status: "qualified",
    };
  }

  if (!/<meta[^>]+name=["']description["']/i.test(html)) {
    return {
      pitch: "web",
      signal:
        "Your homepage has no meta description, so Google is writing its own snippet for it.",
      status: "qualified",
    };
  }

  // The site is technically fine. That rules out the web pitch but says
  // nothing about whether they are losing calls, so look for the voice-agent
  // signal instead: a phone-first business with no way to book online.
  const hasPhone = /(tel:|call us|phone|contact us)/i.test(html);
  const hasBooking =
    /(book (now|online|an? appointment)|schedule|calendly|appointment)/i.test(
      html,
    );

  if (hasPhone && !hasBooking) {
    return {
      pitch: "voice",
      signal:
        "Phone looks like your only way in, with no online booking, so every missed call is a lost customer.",
      status: "qualified",
    };
  }

  // Nothing specific to say. Deliberately not mailed.
  return {
    pitch: "",
    signal: "",
    status: "rejected",
  };
}
