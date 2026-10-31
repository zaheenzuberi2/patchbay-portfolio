import { NextRequest, NextResponse } from "next/server";
import { buildAssistantSystemPrompt } from "@/lib/assistant-context";
import { generateText } from "@/lib/gemini";
import { getApiKeys } from "@/lib/secrets";
import { createRateLimiter } from "@/lib/rate-limit";

const MESSAGE_MAX_LEN = 500;
const HISTORY_MAX_TURNS = 8;
const UPSTREAM_TIMEOUT_MS = 8000;

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

  // Keys and models fail over inside generateText (src/lib/gemini.ts); if every
  // attempt fails the caller falls back to its scripted reply.
  const out = await generateText(keys, JSON.parse(requestBody), {
    timeoutMs: UPSTREAM_TIMEOUT_MS,
  });
  if (out.ok) return NextResponse.json({ reply: out.text });
  console.error("[assistant] all attempts failed", out.why);
  return NextResponse.json({ error: "upstream error" }, { status: 502 });
}
