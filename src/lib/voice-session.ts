import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { VOICE_MAX_SESSION_MS, VOICE_MAX_TURNS } from "./voice-limits";

// Stateless voice-session token: `start.turns.nonce.signature`. The server
// is the only party that can mint or advance it, so session length and turn
// count are enforced here and not in the UI. Replaying an older token to
// "reset" the turn count is bounded by the per-IP limiters in the route and
// by the hard time cap (start never moves).
function getSecret() {
  const explicit = process.env.SESSION_SECRET;
  if (explicit) return explicit;
  const base = process.env.DATABASE_URL || process.env.GEMINI_API_KEY;
  if (!base) return null;
  return createHash("sha256").update(`patchbay-voice-session:${base}`).digest("hex");
}

function sign(secret: string, payload: string) {
  return createHmac("sha256", secret).update(payload).digest("hex").slice(0, 32);
}

export type VoiceSession = { start: number; turns: number; nonce: string };

export function mintSession(): string | null {
  const secret = getSecret();
  if (!secret) return null;
  return encode(secret, { start: Date.now(), turns: 0, nonce: randomBytes(6).toString("hex") });
}

function encode(secret: string, s: VoiceSession) {
  const payload = `${s.start}.${s.turns}.${s.nonce}`;
  return `${payload}.${sign(secret, payload)}`;
}

export type Checked =
  | { ok: true; next: string; turnsLeft: number; msLeft: number }
  | { ok: false; reason: "invalid" | "time" | "turns" };

/** Verifies the token and, if allowed, returns the advanced token for the reply. */
export function checkAndAdvance(token: unknown): Checked {
  const secret = getSecret();
  if (!secret || typeof token !== "string") return { ok: false, reason: "invalid" };
  const parts = token.split(".");
  if (parts.length !== 4) return { ok: false, reason: "invalid" };
  const [startRaw, turnsRaw, nonce, sig] = parts;
  const expected = sign(secret, `${startRaw}.${turnsRaw}.${nonce}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false, reason: "invalid" };

  const start = Number(startRaw);
  const turns = Number(turnsRaw);
  if (!Number.isFinite(start) || !Number.isInteger(turns) || turns < 0) {
    return { ok: false, reason: "invalid" };
  }
  const elapsed = Date.now() - start;
  if (elapsed > VOICE_MAX_SESSION_MS) return { ok: false, reason: "time" };
  if (turns >= VOICE_MAX_TURNS) return { ok: false, reason: "turns" };

  return {
    ok: true,
    next: encode(secret, { start, turns: turns + 1, nonce }),
    turnsLeft: VOICE_MAX_TURNS - (turns + 1),
    msLeft: VOICE_MAX_SESSION_MS - elapsed,
  };
}
