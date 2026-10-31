import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { getDb } from "./db";

// API keys managed from the admin panel. The panel value wins; the
// environment variable of the same name is the fallback, so a deploy with no
// panel entry behaves exactly as before.
//
// Stored AES-256-GCM encrypted. The encryption key is derived from
// SESSION_SECRET (or DATABASE_URL, the same fallback auth.ts uses), which
// lives in the host environment and not in the database, so a copy of the
// table alone does not reveal a key. Same blast-radius reasoning as HANDOFF
// section 20. Tradeoff: rotating that secret makes stored keys undecryptable;
// they then read as "not set" (falling back to env) and are simply re-entered.

export const MANAGED_KEYS = [
  {
    name: "GEMINI_API_KEY",
    label: "Gemini API key",
    help: "Powers the website voice assistant and the chat widget's open-ended answers. Create one in Google AI Studio.",
  },
] as const;

export type ManagedKeyName = (typeof MANAGED_KEYS)[number]["name"];

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

async function readStored(name: ManagedKeyName) {
  await ready();
  const sql = await getDb();
  const rows = (await sql`SELECT value, updated_at FROM secrets WHERE name = ${name}`) as {
    value: string;
    updated_at: string;
  }[];
  if (!rows[0]) return null;
  const plain = decrypt(rows[0].value);
  return plain ? { plain, updatedAt: rows[0].updated_at } : null;
}

/** Panel value first, then the environment variable. Never throws. */
export async function getApiKey(name: ManagedKeyName): Promise<string | undefined> {
  try {
    const stored = await readStored(name);
    if (stored) return stored.plain;
  } catch (err) {
    console.error("[secrets] could not read stored key, using env", err);
  }
  return process.env[name] || undefined;
}

export async function setApiKey(name: ManagedKeyName, value: string) {
  const enc = encrypt(value);
  if (!enc) throw new Error("No SESSION_SECRET or DATABASE_URL to encrypt with");
  await ready();
  const sql = await getDb();
  await sql`INSERT INTO secrets (name, value, updated_at) VALUES (${name}, ${enc}, now())
    ON CONFLICT (name) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`;
}

export async function deleteApiKey(name: ManagedKeyName) {
  await ready();
  const sql = await getDb();
  await sql`DELETE FROM secrets WHERE name = ${name}`;
}

export type KeyStatus = {
  name: ManagedKeyName;
  label: string;
  help: string;
  source: "panel" | "env" | "none";
  last4: string | null;
  updatedAt: string | null;
};

/** Never returns a value: only where it comes from and its last four characters. */
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
      source: stored ? "panel" : env ? "env" : "none",
      last4: stored ? stored.plain.slice(-4) : env ? env.slice(-4) : null,
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
    if (res.ok) return { ok: true, message: "Google accepted this key." };
    if (res.status === 400 || res.status === 401 || res.status === 403) {
      return {
        ok: false,
        message:
          "Google rejected this key. Check it was copied whole and is a Gemini API key from AI Studio.",
      };
    }
    return { ok: false, message: `Google returned ${res.status}. Try again in a minute.` };
  } catch {
    return { ok: false, message: "Could not reach Google to check the key. Try again." };
  }
}
