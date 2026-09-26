// Client-side helper shared by VoiceDemo and ChatWidget. Both widgets keep
// their own scripted/deterministic reply paths as the primary source for
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
