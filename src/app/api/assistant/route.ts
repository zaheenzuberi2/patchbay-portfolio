import { NextRequest, NextResponse } from "next/server";
import { buildAssistantSystemPrompt } from "@/lib/assistant-context";

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

const rateLimitStore = globalThis as typeof globalThis & {
  __patchbayAssistantHits?: Map<string, number[]>;
};

function isRateLimited(ip: string) {
  if (!rateLimitStore.__patchbayAssistantHits) {
    rateLimitStore.__patchbayAssistantHits = new Map();
  }
  const hits = rateLimitStore.__patchbayAssistantHits;
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= REQUEST_LIMIT) {
    hits.set(ip, recent);
    return true;
  }

  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

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
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Not a client error: the site works fine without this configured, both
    // widgets just fall back to their scripted replies. Log server-side so
    // a missing key in a given environment is visible without exposing
    // anything to the visitor.
    console.error("[assistant] GEMINI_API_KEY is not set");
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
    system_instruction: { parts: [{ text: buildAssistantSystemPrompt() }] },
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

  // One retry, only on a 503 (observed in practice: "model is currently
  // experiencing high demand... usually temporary"), which is Google's own
  // free-tier capacity signal, not an error worth giving up on immediately.
  // Any other status or an outright network failure/timeout goes straight
  // to the caller's scripted fallback instead.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: requestBody,
        },
      );
      clearTimeout(timer);

      if (!res.ok) {
        console.error(
          "[assistant] Gemini upstream error",
          res.status,
          await res.text().catch(() => ""),
        );
        if (res.status === 503 && attempt === 0) {
          await new Promise((r) => setTimeout(r, 500));
          continue;
        }
        return NextResponse.json({ error: "upstream error" }, { status: 502 });
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

      if (!text) {
        return NextResponse.json({ error: "empty reply" }, { status: 502 });
      }

      return NextResponse.json({ reply: text });
    } catch (err) {
      console.error("[assistant] request failed", err);
      return NextResponse.json({ error: "request failed" }, { status: 502 });
    }
  }

  return NextResponse.json({ error: "upstream error" }, { status: 502 });
}
