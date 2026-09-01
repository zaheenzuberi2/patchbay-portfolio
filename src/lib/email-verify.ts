import { promises as dns } from "node:dns";

// Email verification without a paid API. Two checks, in cost order:
//
//   1. Syntax  — free, instant, catches typos.
//   2. MX      — one DNS lookup, catches domains that cannot receive mail at
//                all (parked domains, typo'd TLDs, dead companies).
//
// What this deliberately does NOT do is SMTP probing (connecting to the mail
// server and issuing RCPT TO to see if the mailbox exists). That is what paid
// verification services sell. It is skipped on purpose: many providers answer
// "yes" to everything (catch-all) so the result is often meaningless, repeated
// probing from one IP gets that IP blocked by the very providers we later need
// to deliver to, and it is the kind of behaviour that gets a sender flagged
// before a single real email is sent. MX is the honest ceiling for free
// verification.
//
// So a "valid" result here means "this domain can receive mail and the address
// is well formed", not "this mailbox exists". That is still worth doing: it
// removes the bounces that do the most damage to a new sending domain.

export type EmailCheck = {
  email: string;
  status: "valid" | "invalid";
  reason: string;
};

// Deliberately not RFC 5322-complete. A fully compliant regex is famously
// enormous and accepts addresses no real provider issues; this covers the
// shapes that actually occur and rejects the typos that actually happen.
const SYNTAX = /^[^\s@,;:<>()[\]\\"]+@[^\s@.]+(\.[^\s@.]+)+$/;

// Addresses that are almost always a shared inbox nobody reads, a spam trap,
// or an automated system. Contacting them wastes send volume and, in the case
// of trap addresses, actively damages sender reputation.
const RISKY_LOCAL_PARTS = new Set([
  "abuse",
  "postmaster",
  "noreply",
  "no-reply",
  "donotreply",
  "do-not-reply",
  "spam",
  "webmaster",
  "hostmaster",
]);

export function checkSyntax(raw: string): EmailCheck {
  const email = raw.trim().toLowerCase();

  if (!email) return { email, status: "invalid", reason: "empty" };
  if (!SYNTAX.test(email)) {
    return { email, status: "invalid", reason: "malformed address" };
  }
  if (email.length > 254) {
    return { email, status: "invalid", reason: "address too long" };
  }

  const [local, domain] = email.split("@");
  if (local.length > 64) {
    return { email, status: "invalid", reason: "local part too long" };
  }
  if (RISKY_LOCAL_PARTS.has(local)) {
    return { email, status: "invalid", reason: `role address (${local}@)` };
  }
  if (domain.startsWith("-") || domain.endsWith("-")) {
    return { email, status: "invalid", reason: "malformed domain" };
  }

  return { email, status: "valid", reason: "syntax ok" };
}

// Cache per process: a scrape of one industry in one city routinely contains
// dozens of addresses on the same handful of mail providers, and there is no
// reason to re-query DNS for gmail.com forty times in one import.
const mxCache = new Map<string, boolean>();

export async function hasMx(domain: string): Promise<boolean> {
  const key = domain.toLowerCase();
  const cached = mxCache.get(key);
  if (cached !== undefined) return cached;

  let ok = false;
  try {
    const records = await dns.resolveMx(key);
    ok = records.length > 0;
  } catch {
    // NXDOMAIN, no MX record, or a DNS failure. Some domains legitimately
    // accept mail on an A record with no MX, but for cold outreach that is a
    // weak enough signal to skip rather than risk the bounce.
    ok = false;
  }

  mxCache.set(key, ok);
  return ok;
}

export async function verifyEmail(raw: string): Promise<EmailCheck> {
  const syntax = checkSyntax(raw);
  if (syntax.status === "invalid") return syntax;

  const domain = syntax.email.split("@")[1];
  const mx = await hasMx(domain);

  return mx
    ? { email: syntax.email, status: "valid", reason: "syntax + MX ok" }
    : {
        email: syntax.email,
        status: "invalid",
        reason: "domain cannot receive mail",
      };
}
