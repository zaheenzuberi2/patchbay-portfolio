"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { askVoice, type AssistantTurn } from "@/lib/ask-assistant";
import { pickBestVoice } from "@/lib/voice-selection";
import { VOICE_MAX_TURNS } from "@/lib/voice-limits";
import { whatsappUrl } from "@/lib/site-config";

// Minimal typing for the prefixed/unprefixed Web Speech recognition API,
// which is not in lib.dom.
type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: RecognitionEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
};
type RecognitionEvent = {
  resultIndex: number;
  results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
};
type RecognitionCtor = new () => Recognition;

function getRecognitionCtor(): RecognitionCtor | null {
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

// Every failure gets a plain sentence. `aborted` is empty on purpose: that is
// the visitor tapping stop, not a fault (HANDOFF section 17, bug 2).
const RECOGNITION_ERRORS: Record<string, string> = {
  "not-allowed":
    "Microphone access was blocked. You can allow it in your browser settings, or just type below.",
  "service-not-allowed":
    "This browser does not allow voice input here. You can type below instead.",
  "no-speech": "I did not hear anything. Tap the mic and try again, or type below.",
  "audio-capture": "No microphone was found. You can type below instead.",
  network: "Voice input needs a network connection. Try again, or type below.",
  aborted: "",
};

type Line = { role: "user" | "agent"; text: string };
type Status = "idle" | "listening" | "thinking" | "speaking";

const GREETING: Line = {
  role: "agent",
  text: "Hi, I am the Patchbay website assistant. Tap the mic and ask what we build, or type your question.",
};

export default function VoicePanel({ onClose }: { onClose: () => void }) {
  const [lines, setLines] = useState<Line[]>([GREETING]);
  const [status, setStatus] = useState<Status>("idle");
  const [interim, setInterim] = useState("");
  const [notice, setNotice] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const [turnsLeft, setTurnsLeft] = useState(VOICE_MAX_TURNS);
  const [capped, setCapped] = useState(false);
  const [draft, setDraft] = useState("");
  // The panel only ever renders in the browser (ssr:false), so this is safe.
  const [canListen, setCanListen] = useState(() => getRecognitionCtor() !== null);

  const recRef = useRef<Recognition | null>(null);
  const sessionRef = useRef<string | null>(null);
  const linesRef = useRef<Line[]>([GREETING]);
  const soundRef = useRef(true);
  const mic = useRef<HTMLButtonElement>(null);
  const log = useRef<HTMLDivElement>(null);

  useEffect(() => {
    soundRef.current = soundOn;
    if (!soundOn && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, [soundOn]);

  useEffect(() => {
    mic.current?.focus();
    return () => {
      recRef.current?.abort();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    // Stop talking and listening if the tab goes to the background.
    const onHide = () => {
      if (document.hidden) {
        recRef.current?.abort();
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
        setStatus("idle");
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [onClose]);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [lines, interim, notice]);

  const push = useCallback((line: Line) => {
    linesRef.current = [...linesRef.current, line];
    setLines(linesRef.current);
  }, []);

  const speak = useCallback((text: string) => {
    if (!soundRef.current || !("speechSynthesis" in window)) {
      setStatus("idle");
      return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    // Voices load asynchronously in Chrome and Edge, so read them at speak
    // time, and set the utterance language from the chosen voice (not a
    // hardcoded en-US) or the browser can fall back to its default voice.
    const voice = pickBestVoice(synth.getVoices(), "en");
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang;
    } else {
      u.lang = "en-US";
    }
    u.onstart = () => setStatus("speaking");
    u.onend = () => setStatus("idle");
    u.onerror = () => setStatus("idle");
    synth.speak(u);
  }, []);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text) return;
      setNotice("");
      setInterim("");
      const history: AssistantTurn[] = linesRef.current
        .slice(1)
        .map((l) => ({ role: l.role, text: l.text }));
      push({ role: "user", text });
      setStatus("thinking");

      const result = await askVoice(text, history, sessionRef.current);
      if (result.kind === "ok") {
        sessionRef.current = result.session;
        setTurnsLeft(result.turnsLeft);
        push({ role: "agent", text: result.reply });
        speak(result.reply);
      } else if (result.kind === "cap") {
        setCapped(true);
        push({ role: "agent", text: result.message });
        speak(result.message);
      } else {
        if (result.session) sessionRef.current = result.session;
        const msg =
          "I could not reach the assistant just now. Try again, or message Zaheen on WhatsApp.";
        push({ role: "agent", text: msg });
        setStatus("idle");
      }
    },
    [push, speak],
  );

  const stopListening = useCallback(() => recRef.current?.stop(), []);

  const startListening = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setCanListen(false);
      return;
    }
    setNotice("");
    if ("speechSynthesis" in window) {
      // iOS only lets speech start from a tap. Speaking a silent utterance
      // inside this tap unlocks synthesis for the reply that arrives later.
      const prime = new SpeechSynthesisUtterance(" ");
      prime.volume = 0;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(prime);
    }
    // No analyser and no getUserMedia: a second mic stream preempts speech
    // recognition on mobile (HANDOFF section 17, bug 1). The recognizer is
    // the only thing that touches the microphone, and only after this tap.
    const rec = new Ctor();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false;
    let finalText = "";
    rec.onresult = (e) => {
      let live = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else live += r[0].transcript;
      }
      setInterim(live || finalText);
    };
    rec.onerror = (e) => {
      const msg = RECOGNITION_ERRORS[e.error] ?? "Voice input stopped unexpectedly. You can type below.";
      if (msg) setNotice(msg);
      if (e.error === "not-allowed" || e.error === "service-not-allowed") setCanListen(false);
    };
    rec.onend = () => {
      recRef.current = null;
      setInterim("");
      if (finalText.trim()) void send(finalText);
      else setStatus((s) => (s === "listening" ? "idle" : s));
    };
    recRef.current = rec;
    setStatus("listening");
    try {
      rec.start();
    } catch {
      setStatus("idle");
      setNotice("Voice input could not start. You can type below.");
    }
  }, [send]);

  const onMic = () => {
    if (capped || status === "thinking") return;
    if (status === "listening") return stopListening();
    if (status === "speaking" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    startListening();
  };

  const restart = () => {
    sessionRef.current = null;
    linesRef.current = [GREETING];
    setLines([GREETING]);
    setTurnsLeft(VOICE_MAX_TURNS);
    setCapped(false);
    setNotice("");
  };

  const statusText =
    status === "listening"
      ? "Listening"
      : status === "thinking"
        ? "Thinking"
        : status === "speaking"
          ? "Speaking"
          : capped
            ? "Demo limit reached"
            : "Ready";

  const ring =
    "outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-ink-2";

  return (
    <div
      role="dialog"
      aria-label="Patchbay voice assistant"
      className="fixed bottom-[72px] right-4 z-50 flex h-[min(30rem,calc(100dvh-140px))] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-line-strong bg-ink-2 text-paper shadow-[0_16px_48px_rgba(0,0,0,0.35)] sm:bottom-24 sm:right-6"
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-signal">Patchbay</p>
          <p className="font-mono text-xs text-paper-dim" aria-live="polite">
            {statusText}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSoundOn((v) => !v)}
            aria-pressed={!soundOn}
            aria-label={soundOn ? "Mute spoken replies" : "Unmute spoken replies"}
            className={`rounded-md p-2 text-paper-dim hover:text-paper ${ring}`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 5 6 9H3v6h3l5 4V5Z" />
              {soundOn ? <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /> : <path d="m16 9 5 6m0-6-5 6" />}
            </svg>
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close voice assistant"
            className={`rounded-md p-2 text-paper-dim hover:text-paper ${ring}`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={log}
        role="log"
        aria-label="Conversation transcript"
        aria-live="polite"
        className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm leading-relaxed"
      >
        {lines.map((l, i) => (
          <p
            key={i}
            className={
              l.role === "user"
                ? "ml-8 rounded-xl bg-ink-3 px-3 py-2 text-paper"
                : "mr-8 text-paper"
            }
          >
            <span className="sr-only">{l.role === "user" ? "You: " : "Assistant: "}</span>
            {l.text}
          </p>
        ))}
        {interim && (
          <p className="ml-8 rounded-xl bg-ink-3 px-3 py-2 text-paper-dim">{interim}</p>
        )}
        {notice && (
          <p role="alert" className="text-xs text-signal">
            {notice}
          </p>
        )}
        {capped && (
          <div className="flex flex-wrap gap-2 pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className={`rounded-md bg-signal px-3 py-1.5 text-xs font-medium text-ink ${ring}`}
            >
              Message on WhatsApp
            </a>
            <button
              type="button"
              onClick={restart}
              className={`rounded-md border border-line-strong px-3 py-1.5 text-xs text-paper ${ring}`}
            >
              Start a new conversation
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            ref={mic}
            type="button"
            onClick={onMic}
            disabled={capped || !canListen}
            aria-pressed={status === "listening"}
            aria-label={status === "listening" ? "Stop listening" : "Tap to speak"}
            className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-signal text-ink disabled:opacity-40 ${ring}`}
          >
            {status === "listening" && (
              <span className="absolute inset-0 rounded-full bg-signal/50 motion-safe:animate-ping" aria-hidden="true" />
            )}
            <svg viewBox="0 0 24 24" className="relative h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="9" y="3" width="6" height="11" rx="3" />
              <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
            </svg>
          </button>
          <form
            className="flex min-w-0 flex-1 gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (capped || status === "thinking") return;
              const t = draft;
              setDraft("");
              void send(t);
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={capped}
              maxLength={500}
              aria-label="Type a question"
              placeholder={canListen ? "Or type here" : "Type your question"}
              className={`min-w-0 flex-1 rounded-md border border-line-strong bg-ink px-3 py-2 text-base text-paper placeholder:text-paper-dim disabled:opacity-40 sm:text-sm ${ring}`}
            />
            <button
              type="submit"
              disabled={capped || !draft.trim() || status === "thinking"}
              className={`rounded-md border border-line-strong px-3 text-sm text-paper disabled:opacity-40 ${ring}`}
            >
              Send
            </button>
          </form>
        </div>
        <p className="mt-2 text-[11px] leading-snug text-paper-dim">
          {canListen
            ? "Your browser's speech service handles the audio. "
            : "Voice input is not available in this browser. "}
          Demo limit: {VOICE_MAX_TURNS} questions or 3 minutes. {capped ? 0 : turnsLeft} left.
        </p>
      </div>
    </div>
  );
}
