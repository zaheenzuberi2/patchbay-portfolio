import { NextRequest, NextResponse } from "next/server";
import { createRateLimiter } from "@/lib/rate-limit";
import { generateText } from "@/lib/gemini";
import { getApiKeys } from "@/lib/secrets";

// Gemini Live speaks Urdu well but writes what it heard and said in
// Devanagari (the Hindi script), which an Urdu reader cannot read. The speech
// is untouched; this rewrites the two lines of transcript into Urdu script for
// the screen. It runs after the answer has started playing, so nobody waits on
// it. Same approach as the Habro Estate assistant.
const SPLIT = "-----";
const limited = createRateLimiter("assistant-script", 40, 10 * 60 * 1000);

export async function POST(request: NextRequest) {
  const keys = await getApiKeys("GEMINI_API_KEY");
  if (!keys.length) return NextResponse.json({ error: "unavailable" }, { status: 503 });

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (limited(ip)) return NextResponse.json({ error: "rate limited" }, { status: 429 });

  const body = await request.json().catch(() => null);
  const heard = typeof body?.heard === "string" ? body.heard.slice(0, 400) : "";
  const said = typeof body?.said === "string" ? body.said.slice(0, 800) : "";
  if (!heard && !said) return NextResponse.json({ error: "bad request" }, { status: 400 });

  const out = await generateText(
    keys,
    {
      system_instruction: {
        parts: [
          {
            text:
              "You rewrite text into another script. The text is Urdu, or Hindi-Urdu, written in Devanagari. Rewrite it in Urdu script, keeping the words and the meaning exactly. " +
              "Leave digits, English words and names (Patchbay, WhatsApp, chatbot, website, Zaheen) as they are. If a line is already in Urdu script, return it unchanged. " +
              `The input has two parts separated by a line containing only ${SPLIT}. Return the same two parts in the same order, separated by the same line, and nothing else.`,
          },
        ],
      },
      contents: [{ role: "user", parts: [{ text: [heard, SPLIT, said].join("\n") }] }],
      generationConfig: { maxOutputTokens: 600, temperature: 0, thinkingConfig: { thinkingBudget: 0 } },
    },
    { timeoutMs: 6000 },
  );
  if (!out.ok) {
    console.error("[script] all attempts failed", out.why);
    return NextResponse.json({ error: "unavailable", why: out.why }, { status: 503 });
  }
  const [h, s2] = out.text.split(SPLIT).map((x) => x.trim());
  return NextResponse.json({ heard: heard ? (h ?? "") : "", said: said ? (s2 ?? "") : "" });
}
