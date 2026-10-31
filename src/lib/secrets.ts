import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { getDb } from "./db";

// API keys managed from the admin panel. Each name holds a LIST of keys so the
// site keeps working when one hits its quota or is revoked: callers try them
// in a random order and use the first that works (the same idea as the Habro
// Estate assistant). The environment variable of the same name is one more key
// in the pool, so a deploy with no panel entry behaves exactly as before.
//
// Stored AES-256-GCM encrypted, as one JSON array per name (a plain string
// from the first version of this panel is still read). The encryption key is
// derived from SESSION_SECRET (or DATABASE_URL, the same fallback auth.ts
// uses), which lives in the host environment and not in the database, so a
// copy of the table alone does not reveal a key. Same blast-radius reasoning as
// HANDOFF section 20. Tradeoff: rotating that secret makes stored keys
// undecryptable; they then read as "not set" (falling back to env) and are
// simply re-entered.

export const MANAGED_KEYS = [
  {
    name: "GEMINI_API_KEY",
    label: "Gemini API keys",
    help: "Power the website voice assistant and the chat widget's open-ended answers. Add several, from different Google AI Studio projects, and the site rotates through them if one fails or runs out of quota.",
  },
] as const;

export type ManagedKeyName = (typeof MANAGED_KEYS)[number]["name"];

export const MAX_KEYS = 10;

export function isManagedKey(name: unknown): name is ManagedKeyName {
  return MANAGED_KEYS.some((k) => k.name === name);
}

function cryptoKey() {
  const base = process.env.SESSION_SECRET || process.env.DATABASE_URL;
  if (!base) return null;
  return createHash("sha256").update(`patchbay-secrets:${base}`).digest();
}

export function encrypt(plain: string): string | null {
  const key = cryptoKey();
  if (!key) return null;
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([c.update(plain, "utf8"), c.final()]);
  return [iv, c.getAuthTag(), enc].map((b) => b.toString("base64")).join(".");
}

export function decrypt(stored: string): string | null {
  try {
    const key = cryptoKey();
    if (!key) return null;
    const [iv, tag, enc] = stored.split(".").map((p) => Buffer.from(p, "base64"));
    const d = createDecipheriv("aes-256-gcm", key, iv);
    d.setAuthTag(tag);
    return Buffer.concat([d.update(enc), d.final()]).toString("utf8");
  } catch {
    return null;
  }
}

/** Short stable id for a key, safe to show: lets the panel remove one key without ever sending it back. */
export function keyId(key: string) {
  return createHash("sha256").update(key).digest("hex").slice(0, 8);
}

function parseList(plain: string): string[] {
  if (plain.startsWith("[")) {
    try {
      const v = JSON.parse(plain);
      if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string" && !!x);
    } catch {
      /* fall through: treat as a single key */
    }
  }
  return plain ? [plain] : [];
}

const g = globalThis as typeof globalThis & {
  __patchbaySecretsReady?: Promise<void>;
};

async function ready() {
  if (!g.__patchbaySecretsReady) {
    g.__patchbaySecretsReady = (async () => {
      const sql = await getDb();
      await sql`CREATE TABLE IF NOT EXISTS secrets (
        name TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )`;
    })().catch((e) => {
      g.__patchbaySecretsReady = undefined;
      throw e;
    });
  }
  return g.__patchbaySecretsReady;
}

async function readStored(name: ManagedKeyName): Promise<{ keys: string[]; updatedAt: string } | null> {
  await ready();
  const sql = await getDb();
  const rows = (await sql`SELECT value, updated_at FROM secrets WHERE name = ${name}`) as {
    value: string;
    updated_at: string;
  }[];
  if (!rows[0]) return null;
  const plain = decrypt(rows[0].value);
  if (!plain) return null;
  const keys = parseList(plain);
  return keys.length ? { keys, updatedAt: rows[0].updated_at } : null;
}

async function writeStored(name: ManagedKeyName, keys: string[]) {
  await ready();
  const sql = await getDb();
  if (!keys.length) {
    await sql`DELETE FROM secrets WHERE name = ${name}`;
    return;
  }
  const enc = encrypt(JSON.stringify(keys));
  if (!enc) throw new Error("No SESSION_SECRET or DATABASE_URL to encrypt with");
  await sql`INSERT INTO secrets (name, value, updated_at) VALUES (${name}, ${enc}, now())
    ON CONFLICT (name) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`;
}

function shuffle<T>(a: T[]): T[] {
  const out = [...a];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Every usable key, panel keys and the env var together, in a random order so
 * load spreads across them. Callers try them in turn and stop at the first
 * that works. Never throws.
 */
export async function getApiKeys(name: ManagedKeyName): Promise<string[]> {
  let stored: string[] = [];
  try {
    stored = (await readStored(name))?.keys ?? [];
  } catch (err) {
    console.error("[secrets] could not read stored keys, using env", err);
  }
  const env = process.env[name];
  const all = env && !stored.includes(env) ? [...stored, env] : stored;
  return shuffle(all);
}

/** Add keys (already tested by the caller). Returns how many were new. */
export async function addApiKeys(name: ManagedKeyName, add: string[]) {
  const current = (await readStored(name))?.keys ?? [];
  const merged = [...current];
  let added = 0;
  for (const k of add) {
    if (!merged.includes(k) && merged.length < MAX_KEYS) {
      merged.push(k);
      added++;
    }
  }
  if (added) await writeStored(name, merged);
  return added;
}

export async function removeApiKey(name: ManagedKeyName, id: string) {
  const current = (await readStored(name))?.keys ?? [];
  await writeStored(name, current.filter((k) => keyId(k) !== id));
}

export async function clearApiKeys(name: ManagedKeyName) {
  await writeStored(name, []);
}

export type KeyStatus = {
  name: ManagedKeyName;
  label: string;
  help: string;
  /** Saved in the panel: only an id (for removal) and the last four characters. */
  keys: { id: string; last4: string }[];
  /** The server environment variable, if set, counts as one more key. */
  envLast4: string | null;
  updatedAt: string | null;
};

/** Never returns a value. */
export async function listKeyStatus(): Promise<KeyStatus[]> {
  const out: KeyStatus[] = [];
  for (const k of MANAGED_KEYS) {
    let stored: Awaited<ReturnType<typeof readStored>> = null;
    try {
      stored = await readStored(k.name);
    } catch (err) {
      console.error("[secrets] status read failed", err);
    }
    const env = process.env[k.name];
    out.push({
      ...k,
      keys: (stored?.keys ?? []).map((v) => ({ id: keyId(v), last4: v.slice(-4) })),
      envLast4: env ? env.slice(-4) : null,
      updatedAt: stored ? new Date(stored.updatedAt).toISOString() : null,
    });
  }
  return out;
}

/** Asks Google whether a Gemini key is accepted. Free call (lists one model). */
export async function testGeminiKey(
  key: string,
): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models?pageSize=1",
      { headers: { "x-goog-api-key": key }, signal: AbortSignal.timeout(10000) },
    );
    if (res.ok) return { ok: true, message: "accepted" };
    if (res.status === 400 || res.status === 401 || res.status === 403) {
      return { ok: false, message: "Google rejected it" };
    }
    return { ok: false, message: `Google returned ${res.status}` };
  } catch {
    return { ok: false, message: "could not reach Google" };
  }
}
