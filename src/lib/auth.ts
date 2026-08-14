import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "patchbay_admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

// Signing key for admin session cookies, in priority order:
//
//   1. SESSION_SECRET - an explicit, dedicated secret. Preferred, and what
//      you should set for a real production deployment.
//   2. A key derived from DATABASE_URL. Vercel injects that automatically
//      when a database is attached, so this makes the admin panel work on a
//      fresh deploy without any manual configuration.
//
// On (2) being acceptable rather than a shortcut that quietly weakens
// things: the derived key is a SHA-256 of a high-entropy random credential,
// so its strength is fine. The real question is blast radius, i.e. whether
// coupling session signing to the database credential makes a compromise
// worse. It does not: this cookie only guards the admin panel, and the only
// thing the admin panel protects is data that lives in that same database.
// Anyone holding DATABASE_URL can already read every lead directly, so
// deriving from it grants an attacker nothing they did not already have.
//
// The one real tradeoff: rotating the database credential invalidates
// existing admin sessions. That means re-logging in, nothing worse.
function getSecret() {
  const explicit = process.env.SESSION_SECRET;
  if (explicit) return explicit;

  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    return createHash("sha256")
      .update(`patchbay-admin-session:${dbUrl}`)
      .digest("hex");
  }

  throw new Error(
    "Cannot sign admin sessions: set SESSION_SECRET, or attach a database so DATABASE_URL is available.",
  );
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function createSessionToken() {
  const payload = `admin.${Date.now()}`;
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function isValidSessionToken(token: string | undefined | null) {
  if (!token) return false;
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return false;
  const payload = token.slice(0, lastDot);
  const signature = token.slice(lastDot + 1);
  const expected = sign(payload);

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function isAdminPasswordConfigured() {
  return !!process.env.ADMIN_PASSWORD;
}

export function checkAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    // Callers should check isAdminPasswordConfigured() first and surface a
    // real explanation. Throwing here stays as a backstop so a missing
    // password can never be treated as "no password required".
    throw new Error("ADMIN_PASSWORD is not set");
  }
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function getSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return isValidSessionToken(token);
}
