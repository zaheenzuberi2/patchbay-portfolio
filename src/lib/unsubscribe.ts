import { createHmac, timingSafeEqual } from "node:crypto";

// One-click unsubscribe links have to work with no login, which means the
// token in the URL must prove on its own that this server actually generated
// it for this exact address — otherwise the link could be used to suppress
// an arbitrary competitor's email, or replayed against other addresses.
// HMAC-signing the address is the same approach auth.ts uses for the admin
// session cookie, kept as its own function rather than shared so a leak of
// one signature scheme's output is never a skeleton key for the other. There
// is nothing sensitive being protected here beyond "did this server really
// send this address an email" — not an authentication boundary — so a
// truncated HMAC in a plain query string is proportionate.
function getSecret() {
  return (
    process.env.SESSION_SECRET ||
    process.env.DATABASE_URL ||
    "patchbay-unsubscribe-fallback"
  );
}

export function makeUnsubscribeToken(email: string) {
  return createHmac("sha256", getSecret())
    .update(`unsubscribe:${email.toLowerCase().trim()}`)
    .digest("hex")
    .slice(0, 32);
}

export function verifyUnsubscribeToken(email: string, token: string) {
  if (!token) return false;
  const expected = makeUnsubscribeToken(email);
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
