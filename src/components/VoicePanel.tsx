"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LiveSession, liveSupported } from "@/lib/liveVoice";
import {
  VOICE_CAP_MESSAGES,
  VOICE_CAP_MESSAGES_UR,
  VOICE_MAX_SESSION_MS,
  type VoiceCapReason,
} from "@/lib/voice-limits";
import { whatsappUrl } from "@/lib/site-config";

// Same engine as the Habro Estate assistant: the microphone streams to Gemini
// Live and the answer streams back as it is produced, hands-free, and the
// visitor can talk over it. Everything about the session (model, voice,
// instructions, language, expiry) is locked into a one-use token minted by
// /api/assistant/live, so this component holds no key and cannot change the
// prompt or extend the time limit.

type Lang = "en" | "ur";
type Line = { role: "user" | "agent"; text: string };
type Status = "off" | "connecting" | "listening" | "speaking" | "muted" | "capped";

// The greeting is the same words every time, so it is a recording
// (public/media/voice/greet-{lang}.wav, said by the same voice as the
// conversation) and plays the instant Start is tapped. The text below must
// match what the recording says.
const T = {
  en: {
    dir: "ltr" as const,
    states: {
      off: "Ready",
      connecting: "Connecting",
      listening: "Listening",
      speaking: "Speaking",
      muted: "Mic muted",
      capped: "Demo limit reached",
    },
    hint: "Tap Start talking and ask what we build. You can speak over me at any time.",
    greeting:
      "Hi, I am the Patchbay website assistant. Ask me what we build, or how an AI voice agent could help your business.",
    start: "Start talking",
    connecting: "Connecting...",
    mute: "Mute microphone",
    unmute: "Unmute microphone",
    interrupt: "Stop the answer and speak",
    end: "End conversation",
    whatsapp: "Message on WhatsApp",
    again: "Start a new conversation",
    close: "Close voice assistant",
    unsupported: "Voice is not supported in this browser. Message Zaheen on WhatsApp instead.",
    paused: "Paused after a minute of quiet. Tap the mic to carry on.",
    dropped: "The connection dropped before I could answer. Tap Start talking to try again.",
    blocked:
      "Microphone access was blocked. Allow it in your browser settings and tap Start talking again.",
    noMic: "No microphone was found on this device.",
    footer: "Your voice is sent to Google's Gemini to produce the reply. Demo limit: 3 minutes.",
    caps: VOICE_CAP_MESSAGES,
  },
  ur: {
    dir: "rtl" as const,
    states: {
      off: "تیار",
      connecting: "جڑ رہا ہے",
      listening: "سن رہا ہوں",
      speaking: "جواب دے رہا ہوں",
      muted: "مائیکروفون بند ہے",
      capped: "ڈیمو کی حد پوری ہو گئی",
    },
    hint: "بولنا شروع کریں دبائیں اور پوچھیں ہم کیا بناتے ہیں۔ آپ کسی بھی وقت میرے اوپر بول سکتے ہیں۔",
    greeting:
      "السلام علیکم، میں پیچ بے کی ویب سائٹ کا اسسٹنٹ ہوں۔ پوچھیں ہم کیا بناتے ہیں، یا اے آئی وائس ایجنٹ آپ کے کاروبار کی کیسے مدد کر سکتا ہے۔",
    start: "بولنا شروع کریں",
    connecting: "جڑ رہا ہے...",
    mute: "مائیکروفون بند کریں",
    unmute: "مائیکروفون کھولیں",
    interrupt: "جواب روک کر بولیں",
    end: "گفتگو ختم کریں",
    whatsapp: "واٹس ایپ پر میسج کریں",
    again: "نئی گفتگو شروع کریں",
    close: "وائس اسسٹنٹ بند کریں",
    unsupported: "یہ براؤزر آواز کی سہولت نہیں دیتا۔ واٹس ایپ پر ظہین کو میسج کریں۔",
    paused: "ایک منٹ کی خاموشی کے بعد روک دیا گیا۔ جاری رکھنے کے لیے مائیکروفون دبائیں۔",
    dropped: "جواب دینے سے پہلے رابطہ ٹوٹ گیا۔ دوبارہ کوشش کے لیے بولنا شروع کریں دبائیں۔",
    blocked:
      "مائیکروفون کی اجازت بند تھی۔ براؤزر کی سیٹنگ میں اجازت دیں اور دوبارہ کوشش کریں۔",
    noMic: "اس ڈیوائس پر مائیکروفون نہیں ملا۔",
    footer: "آپ کی آواز جواب بنانے کے لیے گوگل کے جیمنی کو بھیجی جاتی ہے۔ ڈیمو کی حد: 3 منٹ۔",
    caps: VOICE_CAP_MESSAGES_UR,
  },
};

const DEVANAGARI = /[ऀ-ॿ]/;

export default function VoicePanel({ onClose }: { onClose: () => void }) {
  const [lang, setLang] = useState<Lang>("en");
  const [lines, setLines] = useState<Line[]>([]);
  const [status, setStatus] = useState<Status>("off");
  const [notice, setNotice] = useState("");
  // The panel only ever renders in the browser (ssr:false), so this is safe.
  const [supported] = useState(() => liveSupported());

  const t = T[lang];
  const session = useRef<LiveSession | null>(null);
  const capTimer = useRef(0);
  const statusRef = useRef<Status>("off");
  const langRef = useRef<Lang>("en");
  const greetEls = useRef<Partial<Record<Lang, HTMLAudioElement>>>({});
  const log = useRef<HTMLDivElement>(null);
  const primary = useRef<HTMLButtonElement>(null);

  const setS = useCallback((s: Status) => {
    statusRef.current = s;
    setStatus(s);
  }, []);

  // Urdu is only spoken by the browser if the device has an Urdu voice:
  // reading Urdu letters with an English voice is worse than silence, and the
  // message is on screen either way.
  const speakPlain = useCallback((text: string, l: Lang) => {
    if (!("speechSynthesis" in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (l === "ur" && !voices.some((v) => v.lang.toLowerCase().startsWith("ur"))) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = l === "ur" ? "ur-PK" : "en-GB";
    window.speechSynthesis.speak(u);
  }, []);

  const stopGreeting = useCallback(() => {
    Object.values(greetEls.current).forEach((e) => e?.pause());
  }, []);

  const teardown = useCallback(() => {
    window.clearTimeout(capTimer.current);
    stopGreeting();
    session.current?.close();
    session.current = null;
  }, [stopGreeting]);

  const endWith = useCallback(
    (reason: VoiceCapReason) => {
      teardown();
      const l = langRef.current;
      const text = T[l].caps[reason];
      setLines((x) => [...x, { role: "agent", text }]);
      setS("capped");
      speakPlain(text, l);
    },
    [setS, speakPlain, teardown],
  );

  useEffect(() => {
    primary.current?.focus();
    // Load both recordings now so the greeting plays the instant Start is tapped.
    (["en", "ur"] as const).forEach((l) => {
      const el = new Audio(`/media/voice/greet-${l}.wav`);
      el.preload = "auto";
      el.load();
      greetEls.current[l] = el;
    });
    return () => {
      teardown();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, [teardown]);

  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

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

  const addTurn = useCallback((heard: string, said: string) => {
    const add: Line[] = [];
    if (heard) add.push({ role: "user", text: heard });
    if (said) add.push({ role: "agent", text: said });
    if (add.length) setLines((l) => [...l, ...add]);
  }, []);

  // Must run inside the tap: a phone only lets audio and the microphone start
  // from a gesture, and a context created later stays silent.
  const start = useCallback(() => {
    if (!supported) return;
    teardown();
    const want = langRef.current;
    const tt = T[want];
    setNotice("");
    setS("connecting");
    setLines([{ role: "agent", text: tt.greeting }]);

    const s = new LiveSession(
      {
        speaking: () => setS("speaking"),
        turn: (heard, said) => {
          if (!heard && !said) return;
          // Live writes Urdu transcripts in Devanagari. The speech has already
          // started; the words on screen follow once they are in a script the
          // visitor reads. Better no words than words they cannot read.
          if (want === "ur" && DEVANAGARI.test(`${heard}${said}`)) {
            fetch("/api/assistant/script", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ heard, said }),
            })
              .then((r) => (r.ok ? r.json() : Promise.reject()))
              .then((j: { heard: string; said: string }) => addTurn(j.heard.trim(), j.said.trim()))
              .catch(() => undefined);
            return;
          }
          addTurn(heard.trim(), said.trim());
        },
        idle: () => setS(statusRef.current === "muted" ? "muted" : "listening"),
        interrupted: () => setS("listening"),
        paused: () => {
          setS("muted");
          setNotice(tt.paused);
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
          setNotice(tt.dropped);
        },
      },
      want,
      true,
    );
    session.current = s;
    // The microphone is held shut until the greeting has finished, or it would
    // hear the recording.
    s.hold(true);
    const greet = greetEls.current[want];
    if (greet) {
      const release = () => session.current === s && s.hold(false);
      greet.onended = release;
      greet.onpause = release;
      greet.onerror = release;
      greet.currentTime = 0;
      greet.play().catch(release);
    } else {
      s.hold(false);
    }
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
          setNotice(name === "NotFoundError" ? tt.noMic : tt.blocked);
        }
      });
  }, [addTurn, endWith, setS, supported, teardown]);

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

  // A conversation is set up in one language: switching starts over.
  const switchLang = (next: Lang) => {
    if (next === lang) return;
    teardown();
    setS("off");
    setNotice("");
    setLines([]);
    setLang(next);
  };

  const active = status === "listening" || status === "speaking" || status === "muted";
  const ring =
    "outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-ink-2";

  return (
    <div
      role="dialog"
      aria-label="Patchbay voice assistant"
      lang={lang}
      dir={t.dir}
      className="fixed bottom-[72px] right-4 z-50 flex h-[min(30rem,calc(100dvh-140px))] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-line-strong bg-ink-2 text-paper shadow-[0_16px_48px_rgba(0,0,0,0.35)] sm:bottom-24 sm:right-6"
    >
      <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-signal">Patchbay</p>
          <p className="font-mono text-xs text-paper-dim" aria-live="polite">
            {t.states[status]}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <div role="group" aria-label="Language" dir="ltr" className="flex overflow-hidden rounded-md border border-line-strong text-xs">
            {(["en", "ur"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => switchLang(l)}
                aria-pressed={lang === l}
                lang={l}
                className={`px-2.5 py-1.5 ${
                  lang === l ? "bg-signal text-ink" : "text-paper-dim hover:text-paper"
                } ${ring}`}
              >
                {l === "en" ? "English" : "اردو"}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              teardown();
              onClose();
            }}
            aria-label={t.close}
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
        {lines.length === 0 && <p className="text-paper-dim">{t.hint}</p>}
        {lines.map((l, i) => (
          <p
            key={i}
            dir="auto"
            className={
              l.role === "user" ? "mx-0 rounded-xl bg-ink-3 px-3 py-2 text-paper" : "text-paper"
            }
          >
            <span className="sr-only">{l.role === "user" ? "You: " : "Assistant: "}</span>
            {l.text}
          </p>
        ))}
        {!supported && (
          <p role="alert" className="text-xs text-signal">
            {t.unsupported}
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
              {t.whatsapp}
            </a>
            <button
              type="button"
              onClick={start}
              className={`rounded-md border border-line-strong px-3 py-1.5 text-xs text-paper ${ring}`}
            >
              {t.again}
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
                aria-label={status === "speaking" ? t.interrupt : status === "muted" ? t.unmute : t.mute}
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
                {t.end}
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
              {status === "connecting" ? t.connecting : t.start}
            </button>
          )}
        </div>
        <p className="mt-2 text-[11px] leading-snug text-paper-dim">{t.footer}</p>
      </div>
    </div>
  );
}
