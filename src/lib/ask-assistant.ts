// Client-side helper used by ChatWidget. The widget keeps its own
// scripted/deterministic reply paths as the primary source for
// known intents and FAQ matches (fast, free, guaranteed accurate); this is
// only called for open-ended messages that fall through those checks. A
// null return means "the LLM path did not produce anything usable" for any
// reason (not configured, rate-limited, timed out, empty response) — the
// caller falls back to its own scripted reply rather than going silent.

export type AssistantTurn = { role: "user" | "agent"; text: string };

// Longer than the server route's own timeout (12s, plus a possible one
// retry on a transient 503) so the client never gives up before the server
// would have.
const TIMEOUT_MS = 20000;

export async function askAssistant(
  message: string,
  history: AssistantTurn[],
): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({ message, history: history.slice(-8) }),
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.reply === "string" && data.reply.trim()
      ? data.reply.trim()
      : null;
  } catch {
    return null;
  }
}

export type VoiceReply =
  | { kind: "ok"; reply: string; session: string; turnsLeft: number }
  | { kind: "cap"; reason: "turns" | "time" | "busy"; message: string }
  | { kind: "fail"; session?: string };

// Voice turns go through the same /api/assistant route in voice mode. The
// session token is minted and advanced by the server, which also enforces the
// session length and turn caps; this helper only carries it back and forth.
export async function askVoice(
  message: string,
  history: AssistantTurn[],
  session: string | null,
): Promise<VoiceReply> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const res = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        message,
        history: history.slice(-8),
        voice: true,
        ...(session ? { session } : {}),
      }),
    });
    clearTimeout(timer);
    const data = await res.json().catch(() => null);
    if (res.status === 429 && data?.error === "cap" && typeof data.message === "string") {
      return { kind: "cap", reason: data.reason, message: data.message };
    }
    if (res.status === 429) {
      return {
        kind: "cap",
        reason: "busy",
        message:
          "You have sent a lot of requests in a short time. Please wait a few minutes, or message Zaheen on WhatsApp.",
      };
    }
    if (!res.ok || typeof data?.reply !== "string" || !data.reply.trim()) {
      return {
        kind: "fail",
        ...(typeof data?.session === "string" ? { session: data.session } : {}),
      };
    }
    return {
      kind: "ok",
      reply: data.reply.trim(),
      session: data.session,
      turnsLeft: data.turnsLeft,
    };
  } catch {
    return { kind: "fail" };
  }
}
