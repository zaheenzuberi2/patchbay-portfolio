// One place that calls Gemini's text model for the routes that need it
// (/api/assistant and /api/assistant/script), so they share the same failover:
//
//  - Keys come in a random order and are tried in turn.
//  - A key Google rejects (401/403, "API key not valid") is skipped for ten
//    minutes instead of costing every request an extra round trip. A dead key
//    in the pool (for example a stale environment variable) is then free.
//  - When the main model is overloaded ("high demand", 503) or too slow, the
//    lighter Flash model answers instead. Overload is per model, so the second
//    model usually works when the first does not.
//
// Gemini Live (the voice itself) does not go through here.

const MODELS = ["gemini-flash-latest", "gemini-flash-lite-latest"];
const DEAD_FOR_MS = 10 * 60 * 1000;

const g = globalThis as typeof globalThis & { __patchbayDeadKeys?: Map<string, number> };
function dead() {
  return (g.__patchbayDeadKeys ??= new Map());
}

export type GeminiResult = { ok: true; text: string } | { ok: false; why: string[] };

export async function generateText(
  keys: string[],
  body: Record<string, unknown>,
  opts: { timeoutMs: number; maxAttempts?: number },
): Promise<GeminiResult> {
  const why: string[] = [];
  const now = Date.now();
  const usable = keys.filter((k) => (dead().get(k) ?? 0) < now);
  // If every key is marked dead, still try them once rather than give up.
  const pool = (usable.length ? usable : keys).slice(0, 4);
  const payload = JSON.stringify(body);
  let attempts = 0;
  const max = opts.maxAttempts ?? 4;

  for (const key of pool) {
    for (const model of MODELS) {
      if (attempts >= max) return { ok: false, why };
      attempts++;
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: "POST",
            // Header, not ?key=, so the key never lands in a URL or a log line.
            headers: { "content-type": "application/json", "x-goog-api-key": key },
            signal: AbortSignal.timeout(opts.timeoutMs),
            body: payload,
          },
        );
        if (!res.ok) {
          const detail = (await res.text().catch(() => "")).slice(0, 200);
          why.push(`${model} ${res.status} key..${key.slice(-4)}`);
          if (res.status === 401 || res.status === 403 || /API key not valid/i.test(detail)) {
            dead().set(key, Date.now() + DEAD_FOR_MS);
            break; // no point trying the other model with a rejected key
          }
          continue;
        }
        const data = await res.json();
        // Gemini sometimes splits one reply across several parts even with a
        // STOP finish reason, so join every text part (HANDOFF section 45).
        const parts: { text?: string }[] | undefined = data?.candidates?.[0]?.content?.parts;
        const text = parts?.map((p) => p.text ?? "").join("").trim();
        if (text) return { ok: true, text };
        why.push(`${model} empty key..${key.slice(-4)}`);
      } catch (err) {
        why.push(`${model} ${String(err).slice(0, 40)} key..${key.slice(-4)}`);
      }
    }
  }
  return { ok: false, why };
}
