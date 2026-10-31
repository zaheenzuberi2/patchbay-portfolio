import { NextRequest, NextResponse } from "next/server";
import { buildAssistantSystemPrompt } from "@/lib/assistant-context";
import { getApiKeys } from "@/lib/secrets";
import { createRateLimiter } from "@/lib/rate-limit";

const MESSAGE_MAX_LEN = 500;
const HISTORY_MAX_TURNS = 8;
const UPSTREAM_TIMEOUT_MS = 12000;
// "gemini-flash-latest" is a Google-maintained alias to the current
// generally-available Flash model, not a pinned version. Pinning an exact
// version (e.g. gemini-2.0-flash) risks a hard failure the day Google
// deprecates it; the alias absorbs that upgrade silently.
const MODEL = "gemini-flash-latest";

// Same in-memory-per-instance rate limit as /api/leads (see that file's
// comment for the honest caveat about serverless instances not sharing
// memory). Slightly more generous here since this is read-only Q&A, not a
// form submission, but it exists mainly to keep the free Gemini quota from
// being burned by a script rather than a real visitor.
const REQUEST_LIMIT = 20;
const WINDOW_MS = 10 * 60 * 1000;

const isRateLimited = createRateLimiter("assistant", REQUEST_LIMIT, WINDOW_MS);

type IncomingTurn = { role: "user" | "agent"; text: string };

function cleanHistory(raw: unknown): IncomingTurn[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (t): t is IncomingTurn =>
        t &&
        typeof t === "object" &&
        (t.role === "user" || t.role === "agent") &&
        typeof t.text === "string" &&
        t.text.trim().length > 0,
    )
    .slice(-HISTORY_MAX_TURNS)
    .map((t) => ({ role: t.role, text: t.text.trim().slice(0, MESSAGE_MAX_LEN) }));
}

export async function POST(request: NextRequest) {
  // Panel keys and the GEMINI_API_KEY env var, in a random order (src/lib/secrets.ts).
  const keys = await getApiKeys("GEMINI_API_KEY");
  if (!keys.length) {
    // Not a client error: the site works fine without this configured, both
    // widgets just fall back to their scripted replies. Log server-side so
    // a missing key in a given environment is visible without exposing
    // anything to the visitor.
    console.error("[assistant] no Gemini key (admin panel or GEMINI_API_KEY)");
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const message =
    body && typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "rate limited" }, { status: 429 });
  }

  const history = cleanHistory(body?.history);
  const contents = [
    ...history.map((t) => ({
      role: t.role === "agent" ? "model" : "user",
      parts: [{ text: t.text }],
    })),
    { role: "user", parts: [{ text: message.slice(0, MESSAGE_MAX_LEN) }] },
  ];

  const requestBody = JSON.stringify({
    system_instruction: { parts: [{ text: buildAssistantSystemPrompt("text") }] },
    contents,
    generationConfig: {
      maxOutputTokens: 220,
      temperature: 0.4,
      // Flash models spend part of maxOutputTokens on internal "thinking"
      // tokens before the visible reply by default, which was silently
      // truncating short answers mid-sentence. Nothing here needs
      // multi-step reasoning, so turn it off: faster and leaves the full
      // budget for the actual reply.
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  // Try each key in turn: a revoked, rate-limited or briefly overloaded key
  // moves on to the next. With a single key, that key is tried twice, since a
  // 503 ("high demand... usually temporary") is Google's own capacity signal.
  // If every attempt fails the caller falls back to its scripted reply.
  const attempts = keys.length === 1 ? [keys[0], keys[0]] : keys.slice(0, 4);
  for (const apiKey of attempts) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
        {
          method: "POST",
          // Header, not ?key=, so the key never lands in a URL or a log line.
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          signal: controller.signal,
          body: requestBody,
        },
      );
      clearTimeout(timer);

      if (!res.ok) {
        console.error(
          "[assistant] Gemini upstream error",
          res.status,
          "key ending",
          apiKey.slice(-4),
        );
        continue;
      }

      const data = await res.json();
      // Gemini sometimes splits one reply across multiple parts (observed:
      // the visible answer in parts[0], a trailing clause in parts[1] with
      // its own thoughtSignature) even with thinking disabled and a STOP
      // finish reason, i.e. it is not truncation. Reading only parts[0] was
      // silently cutting replies off mid-sentence, so join every text part.
      const parts: { text?: string }[] | undefined =
        data?.candidates?.[0]?.content?.parts;
      const text = parts?.map((p) => p.text ?? "").join("").trim();

      if (text) return NextResponse.json({ reply: text });
    } catch (err) {
      console.error("[assistant] request failed", err);
    }
  }

  return NextResponse.json({ error: "upstream error" }, { status: 502 });
}
