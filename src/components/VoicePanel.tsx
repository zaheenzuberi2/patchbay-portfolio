"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LiveSession, liveSupported } from "@/lib/liveVoice";
import {
  VOICE_CAP_MESSAGES,
  VOICE_MAX_SESSION_MS,
  type VoiceCapReason,
} from "@/lib/voice-limits";
import { whatsappUrl } from "@/lib/site-config";

// Same engine as the Habro Estate assistant: the microphone streams to Gemini
// Live and the answer streams back as it is produced, hands-free, and the
// visitor can talk over it. Everything about the session (model, voice,
// instructions, expiry) is locked into a one-use token minted by
// /api/assistant/live, so this component holds no key and cannot change the
// prompt or extend the time limit.

type Line = { role: "user" | "agent"; text: string };
type Status = "off" | "connecting" | "listening" | "speaking" | "muted" | "capped";

const GREETING: Line = {
  role: "agent",
  text: "Hi, I am the Patchbay website assistant. Tap Start talking and ask what we build. You can speak over me at any time.",
};

export default function VoicePanel({ onClose }: { onClose: () => void }) {
  const [lines, setLines] = useState<Line[]>([GREETING]);
  const [status, setStatus] = useState<Status>("off");
  const [notice, setNotice] = useState("");
  // The panel only ever renders in the browser (ssr:false), so this is safe.
  const [supported] = useState(() => liveSupported());

  const session = useRef<LiveSession | null>(null);
  const capTimer = useRef(0);
  const statusRef = useRef<Status>("off");
  const log = useRef<HTMLDivElement>(null);
  const primary = useRef<HTMLButtonElement>(null);

  const setS = useCallback((s: Status) => {
    statusRef.current = s;
    setStatus(s);
  }, []);

  const speakPlain = useCallback((text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-GB";
    window.speechSynthesis.speak(u);
  }, []);

  const teardown = useCallback(() => {
    window.clearTimeout(capTimer.current);
    session.current?.close();
    session.current = null;
  }, []);

  const endWith = useCallback(
    (reason: VoiceCapReason) => {
      teardown();
      const text = VOICE_CAP_MESSAGES[reason];
      setLines((l) => [...l, { role: "agent", text }]);
      setS("capped");
      speakPlain(text);
    },
    [setS, speakPlain, teardown],
  );

  useEffect(() => {
    primary.current?.focus();
    return () => {
      teardown();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, [teardown]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [lines, notice]);

  // Must run inside the tap: a phone only lets audio and the microphone start
  // from a gesture, and a context created later stays silent.
  const start = useCallback(() => {
    if (!supported) return;
    teardown();
    setNotice("");
    setS("connecting");
    const s = new LiveSession(
      {
        speaking: () => setS("speaking"),
        turn: (heard, said) => {
          const add: Line[] = [];
          if (heard) add.push({ role: "user", text: heard });
          if (said) add.push({ role: "agent", text: said });
          if (add.length) setLines((l) => [...l, ...add]);
        },
        idle: () => setS(statusRef.current === "muted" ? "muted" : "listening"),
        interrupted: () => setS("listening"),
        paused: () => {
          setS("muted");
          setNotice("Paused after a minute of quiet. Tap the mic to carry on.");
        },
        failed: (reason, spoke) => {
          window.clearTimeout(capTimer.current);
          session.current = null;
          if (spoke) {
            setS("off");
            return;
          }
          if (reason === "token 429") return endWith("busy");
          if (reason.startsWith("token")) return endWith("down");
          setS("off");
          setNotice("The connection dropped before I could answer. Tap Start talking to try again.");
        },
      },
      "en",
      true,
    );
    session.current = s;
    capTimer.current = window.setTimeout(() => endWith("time"), VOICE_MAX_SESSION_MS);
    s.begin()
      .then(() => {
        if (session.current === s && statusRef.current === "connecting") setS("listening");
      })
      .catch((e: unknown) => {
        const name = (e as { name?: string })?.name;
        if (name === "NotAllowedError" || name === "NotFoundError") {
          teardown();
          setS("off");
          setNotice(
            name === "NotFoundError"
              ? "No microphone was found on this device."
              : "Microphone access was blocked. Allow it in your browser settings and tap Start talking again.",
          );
        }
      });
  }, [endWith, setS, supported, teardown]);

  // One button once the line is open: cut the answer off, or mute and unmute.
  const toggleMic = () => {
    const s = session.current;
    if (!s?.alive || !s.listening) return start();
    if (statusRef.current === "speaking") {
      s.stopPlayback();
      return setS("listening");
    }
    const next = !s.isMuted;
    s.setMuted(next);
    setNotice("");
    setS(next ? "muted" : "listening");
  };

  const end = () => {
    teardown();
    setS("off");
  };

  const active = status === "listening" || status === "speaking" || status === "muted";
  const label =
    status === "connecting"
      ? "Connecting"
      : status === "listening"
        ? "Listening"
        : status === "speaking"
          ? "Speaking"
          : status === "muted"
            ? "Mic muted"
            : status === "capped"
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
            {label}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            teardown();
            onClose();
          }}
          aria-label="Close voice assistant"
          className={`rounded-md p-2 text-paper-dim hover:text-paper ${ring}`}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
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
              l.role === "user" ? "ml-8 rounded-xl bg-ink-3 px-3 py-2 text-paper" : "mr-8 text-paper"
            }
          >
            <span className="sr-only">{l.role === "user" ? "You: " : "Assistant: "}</span>
            {l.text}
          </p>
        ))}
        {!supported && (
          <p role="alert" className="text-xs text-signal">
            Voice is not supported in this browser. Message Zaheen on WhatsApp instead.
          </p>
        )}
        {notice && (
          <p role="alert" className="text-xs text-signal">
            {notice}
          </p>
        )}
        {status === "capped" && (
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
              onClick={start}
              className={`rounded-md border border-line-strong px-3 py-1.5 text-xs text-paper ${ring}`}
            >
              Start a new conversation
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-line px-4 py-3">
        <div className="flex items-center gap-3">
          {active ? (
            <>
              <button
                ref={primary}
                type="button"
                onClick={toggleMic}
                aria-pressed={status === "muted"}
                aria-label={
                  status === "speaking"
                    ? "Stop the answer and speak"
                    : status === "muted"
                      ? "Unmute microphone"
                      : "Mute microphone"
                }
                className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink ${
                  status === "muted" ? "bg-paper-dim" : "bg-signal"
                } ${ring}`}
              >
                {status === "listening" && (
                  <span className="absolute inset-0 rounded-full bg-signal/50 motion-safe:animate-ping" aria-hidden="true" />
                )}
                <svg viewBox="0 0 24 24" className="relative h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="9" y="3" width="6" height="11" rx="3" />
                  <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
                  {status === "muted" && <path d="m4 4 16 16" />}
                </svg>
              </button>
              <button
                type="button"
                onClick={end}
                className={`rounded-md border border-line-strong px-3 py-2 text-sm text-paper ${ring}`}
              >
                End conversation
              </button>
            </>
          ) : (
            <button
              ref={primary}
              type="button"
              onClick={start}
              disabled={!supported || status === "connecting" || status === "capped"}
              className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-signal px-4 text-sm font-medium text-ink disabled:opacity-40 ${ring}`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="9" y="3" width="6" height="11" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
              </svg>
              {status === "connecting" ? "Connecting..." : "Start talking"}
            </button>
          )}
        </div>
        <p className="mt-2 text-[11px] leading-snug text-paper-dim">
          Your voice is sent to Google&apos;s Gemini to produce the reply. Demo limit: 3 minutes.
        </p>
      </div>
    </div>
  );
}
