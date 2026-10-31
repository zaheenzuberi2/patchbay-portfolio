import { NextRequest, NextResponse } from "next/server";
import { buildAssistantSystemPrompt } from "@/lib/assistant-context";
import { createRateLimiter } from "@/lib/rate-limit";
import { getApiKeys } from "@/lib/secrets";
import { VOICE_MAX_SESSION_MS, VOICE_SESSIONS_PER_HOUR } from "@/lib/voice-limits";

// Mints a one-use Gemini Live token for the browser, the same design as the
// Habro Estate assistant. The real key never leaves the server. Model, voice,
// instructions and expiry are locked inside the token, so a visitor cannot
// change the prompt or hold the line open longer than the cap: Google closes
// the connection when expireTime passes. That is the server-side cap on
// session length (and so on spend). Turns cannot be counted here because the
// audio goes browser to Google, so time is the cap.
const LIVE_MODEL = "gemini-3.1-flash-live-preview";
const TOKEN_URL = "https://generativelanguage.googleapis.com/v1alpha/auth_tokens";
const VOICE = "Kore";

const sessionLimited = createRateLimiter(
  "assistant-voice-sessions",
  VOICE_SESSIONS_PER_HOUR,
  60 * 60 * 1000,
);

export async function POST(request: NextRequest) {
  const keys = await getApiKeys("GEMINI_API_KEY");
  if (!keys.length) {
    console.error("[live] no Gemini key (admin panel or GEMINI_API_KEY)");
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  if (sessionLimited(ip)) {
    return NextResponse.json({ error: "busy" }, { status: 429 });
  }

  // English or Urdu, fixed for the life of the token.
  const lang: "en" | "ur" =
    (await request.json().catch(() => null))?.lang === "ur" ? "ur" : "en";

  const now = Date.now();
  const body = JSON.stringify({
    uses: 1,
    expireTime: new Date(now + VOICE_MAX_SESSION_MS).toISOString(),
    newSessionExpireTime: new Date(now + 60_000).toISOString(),
    bidiGenerateContentSetup: {
      model: `models/${LIVE_MODEL}`,
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } } },
      },
      systemInstruction: { parts: [{ text: buildAssistantSystemPrompt("voice", lang) }] },
      inputAudioTranscription: {},
      outputAudioTranscription: {},
      // Answer soon after the visitor stops, but do not take a noise for the
      // start of a question.
      realtimeInputConfig: {
        automaticActivityDetection: {
          startOfSpeechSensitivity: "START_SENSITIVITY_LOW",
          endOfSpeechSensitivity: "END_SENSITIVITY_HIGH",
          prefixPaddingMs: 150,
          silenceDurationMs: 500,
        },
      },
    },
  });

  // The keys come in a random order; the first that mints a token wins, so a
  // revoked or out-of-quota key never takes the voice assistant down.
  for (const apiKey of keys.slice(0, 5)) {
    try {
      const res = await fetch(TOKEN_URL, {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
        body,
        signal: AbortSignal.timeout(6000),
      });
      if (!res.ok) {
        console.error("[live] token mint failed", res.status, "key ending", apiKey.slice(-4));
        continue;
      }
      const j = (await res.json()) as { name?: string };
      if (j.name) return NextResponse.json({ token: j.name, maxMs: VOICE_MAX_SESSION_MS });
    } catch (err) {
      console.error("[live] token mint error", err);
    }
  }
  return NextResponse.json({ error: "unavailable" }, { status: 503 });
}
