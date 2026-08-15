"use client";

import { useEffect, useRef, useState } from "react";
import { AudioVisualizer } from "./AudioVisualizer";
import { findFaqAnswer } from "@/lib/faq-search";
import { buildProsodySegments } from "@/lib/prosody";
import { pickBestVoice } from "@/lib/voice-selection";

// Honest scope: there is no telephony wired into this project (no Twilio
// number, no Vapi config, no server-side call-initiation code), and
// standing that up costs real money per call and needs real accounts this
// component has no business creating. This is a real, working two-way
// exchange (type or, where the browser supports it, speak a line; the
// agent replies and speaks the reply back) using only the browser's
// built-in speech APIs, no account or ongoing cost. Replies are matched
// against a small set of scripted intents plus the real FAQ library
// (faq-search.ts, the same matcher the chat widget uses) — deterministic
// keyword matching, not a live AI conversation. The copy says so, the same
// honesty rule as ChatWidget.tsx (see its module comment / HANDOFF.md).
// English-only by request (Urdu language support was tried and removed).
//
// Voice/prosody: replies are spoken through prosody.ts's segment planner
// (clause-level pauses, tiny rate/pitch jitter) via a queue of chained
// utterances, using the best-scoring installed voice from
// voice-selection.ts. Both are real, working browser-side techniques, not
// SSML — the Web Speech API has no SSML support, so this is the closest
// achievable approximation with standard APIs.

type Phase = "idle" | "call";
type Turn = { role: "agent" | "user"; text: string };

type SpeechRecognitionResult = { transcript: string };
type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous?: boolean;
  onresult: ((e: { results: SpeechRecognitionResult[][] }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error?: string }) => void) | null;
  start: () => void;
  stop: () => void;
};

// Speech recognition fails in a lot of ordinary ways (permission denied, no
// speech detected, no network, unsupported browser) and the API reports them
// only through onerror. Previously every one of these just flipped the
// button back to idle with no message, which is indistinguishable from the
// agent ignoring you — the exact symptom reported: typing works, speaking
// appears to do nothing.
const RECOGNITION_ERRORS: Record<string, string> = {
  "not-allowed":
    "I could not access the microphone. Check that this site is allowed to use it in your browser settings, then tap the mic again.",
  "service-not-allowed":
    "Your browser blocked speech recognition. Try Chrome, or type your message instead.",
  "no-speech": "I did not hear anything. Tap the mic and try again.",
  "audio-capture":
    "No microphone was found on this device. You can still type your message.",
  network:
    "Speech recognition needs a network connection and could not reach it. Typing still works.",
  aborted: "",
};
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

const GREETING =
  "Hey, thanks for calling Patchbay. I'm the AI voice agent, on call around the clock so no one hits voicemail. What can I help with today?";

const REPLIES = {
  human:
    "Of course. I'll flag this so Zaheen calls you back directly, no need to repeat yourself when he does.",
  booking:
    "Sure, I can check availability for that. In a real deployment this books straight into the calendar and texts you a confirmation before we hang up.",
  hours:
    "I'm on call around the clock, including nights, weekends, and holidays. Nobody hits voicemail.",
  generalHelp:
    "Patchbay runs voice agents like me, chatbots, automation, full-stack websites, and the marketing an agency would run, all from one team. Tell me more specifically what's costing you time or business and I can point you at the right one.",
  leads:
    "More leads usually comes down to one of three things: more traffic, a faster response to the traffic you already get, or catching people who leave without buying. A voice agent like me covers the second one outright, since every call gets answered instead of missed. Tell Zaheen your numbers and he'll tell you honestly which lever actually moves for your business.",
  pricing:
    "Pricing depends entirely on what kind of project it is, because every business needs something different. The goal here is actually growing your business, not selling you a package, so the first step is working out whether we're the right fit for what you need. Have a quick conversation with Zaheen and you'll get a real quote for your specific project.",
  miss: "I didn't catch a clear request there. Try asking about booking, hours, pricing, or ask to talk to a person.",
} as const;

// Uses (?<![\p{L}\p{N}])...(?![\p{L}\p{N}]) instead of \b: JavaScript's \b
// is defined purely in terms of ASCII word characters ([A-Za-z0-9_]). The
// Unicode property escapes require the "u" flag and are the more correct
// general-purpose word boundary.
function wordPattern(alternatives: string) {
  return new RegExp(
    `(?<![\\p{L}\\p{N}])(${alternatives})(?![\\p{L}\\p{N}])`,
    "iu",
  );
}

const BOOKING_PATTERN = wordPattern("book|appointment|schedule|reschedule|slot");
const HOURS_PATTERN = wordPattern("hours?|open|available|weekend|night|closed");
const HUMAN_PATTERN = wordPattern(
  "human|person|someone|real person|zaheen|call ?back|contact me|reach me|my number|talk to (a|someone)",
);
const GENERAL_HELP_PATTERN = wordPattern(
  "help|business|service|services|offer|work with|what (do|can) you|what is patchbay",
);
const LEADS_PATTERN = wordPattern(
  "leads?|customers?|clients?|sales?|convert|conversion|grow|growth|prospects?",
);
const PRICING_PATTERN = wordPattern(
  "prices?|pricing|costs?|budget|cheap|expensive|afford",
);

// Last resort before giving up: real messages get typed messily ("tell
// mehow can i get moreleads", words run together with no spaces) and the
// strict word-boundary patterns above correctly refuse to match "leads"
// inside "moreleads" — that boundary check is what stops false positives
// elsewhere, so loosening it globally isn't the fix. Instead, only once
// every stricter check above has already failed, fall back to plain
// substring containment against a short list of high-value keywords. Lower
// precision, used only as the final net, not the first pass.
const LOOSE_FALLBACK: { includes: string[]; key: keyof typeof REPLIES }[] = [
  { includes: ["lead", "custom", "client", "sale", "convert", "grow"], key: "leads" },
  { includes: ["pric", "cost", "budget", "cheap", "expensive", "afford"], key: "pricing" },
  { includes: ["book", "appoint", "schedul"], key: "booking" },
  { includes: ["hour", "open", "clos"], key: "hours" },
  { includes: ["person", "human", "zaheen", "callback"], key: "human" },
  { includes: ["help", "busines", "servic", "offer"], key: "generalHelp" },
];

function looseFallback(userText: string): string | null {
  const normalized = userText.toLowerCase();
  for (const rule of LOOSE_FALLBACK) {
    if (rule.includes.some((kw) => normalized.includes(kw))) {
      return REPLIES[rule.key];
    }
  }
  return null;
}

function craftReply(userText: string): string {
  if (HUMAN_PATTERN.test(userText)) return REPLIES.human;
  if (BOOKING_PATTERN.test(userText)) return REPLIES.booking;
  if (HOURS_PATTERN.test(userText)) return REPLIES.hours;
  if (LEADS_PATTERN.test(userText)) return REPLIES.leads;
  if (PRICING_PATTERN.test(userText)) return REPLIES.pricing;
  const faq = findFaqAnswer(userText);
  if (faq) return faq.a;
  if (GENERAL_HELP_PATTERN.test(userText)) return REPLIES.generalHelp;
  return looseFallback(userText) ?? REPLIES.miss;
}

export function VoiceDemo({ onClose }: { onClose?: () => void } = {}) {
  // Both default to false so server and first client render agree (see
  // Reveal.tsx / SiteBackgroundMount.tsx for the same pattern): real
  // support is checked after mount, never inside a useState initializer.
  const [supported, setSupported] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // Bumped every time a new speak() call starts, so a queued chain of
  // prosody segments from a *previous* reply can tell it's been superseded
  // and stop scheduling further segments instead of talking over the new
  // one.
  const speakGenRef = useRef(0);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const w = window as unknown as {
      speechSynthesis?: unknown;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
      SpeechRecognition?: SpeechRecognitionCtor;
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect -- default-then-effect hydration pattern, see comment above the state declarations
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    setMicSupported(!!(w.webkitSpeechRecognition || w.SpeechRecognition));

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      stopMicAnalysis();
      try {
        recognitionRef.current?.stop();
      } catch {
        // already stopped
      }
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [turns]);

  function stopMicAnalysis() {
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    micStreamRef.current = null;
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setAnalyser(null);
  }

  async function startMicAnalysis() {
    // Opens a SECOND microphone stream, separate from the one
    // SpeechRecognition holds internally, purely to drive the visualizer
    // (the recognition API exposes no audio data at all).
    //
    // Desktop browsers tolerate two concurrent captures. Mobile browsers
    // frequently do not: the second getUserMedia can preempt the
    // recognizer's stream, so recognition either never fires onresult or
    // aborts immediately. That is the reported bug — typing worked, speaking
    // silently did nothing on a phone.
    //
    // The visualizer is decoration; speech input is the actual feature. So
    // on touch/coarse-pointer devices we skip the analyser entirely and let
    // the visualizer run its procedural listening animation instead.
    const isCoarsePointer =
      typeof window !== "undefined" &&
      window.matchMedia?.("(pointer: coarse)").matches;
    if (isCoarsePointer) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const source = ctx.createMediaStreamSource(stream);
      const node = ctx.createAnalyser();
      node.fftSize = 128;
      source.connect(node);
      micStreamRef.current = stream;
      audioCtxRef.current = ctx;
      setAnalyser(node);
    } catch {
      // No mic access for visualization purposes — fine, non-essential.
    }
  }

  // Queues buildProsodySegments() as a chain of small utterances (see
  // prosody.ts for why: the Web Speech API has no SSML, so there is no way
  // to vary rate/pitch or insert a pause mid-utterance — this is the
  // closest real approximation, not true prosody synthesis).
  function speak(text: string) {
    window.speechSynthesis.cancel();
    const myGen = ++speakGenRef.current;

    const voice = pickBestVoice(window.speechSynthesis.getVoices(), "en");
    const segments = buildProsodySegments(text);
    let started = false;

    function speakNext(index: number) {
      if (speakGenRef.current !== myGen) return; // superseded, stop here
      if (index >= segments.length) {
        setSpeaking(false);
        return;
      }
      const seg = segments[index];
      const utterance = new SpeechSynthesisUtterance(seg.text);
      utterance.lang = "en-US";
      if (voice) utterance.voice = voice;
      utterance.rate = Math.min(2, Math.max(0.5, seg.rateMul));
      utterance.pitch = Math.min(2, Math.max(0, seg.pitchMul));
      utterance.onstart = () => {
        if (speakGenRef.current !== myGen) return;
        if (!started) {
          started = true;
          setSpeaking(true);
        }
      };
      utterance.onerror = () => {
        if (speakGenRef.current === myGen) setSpeaking(false);
      };
      utterance.onend = () => {
        if (speakGenRef.current !== myGen) return;
        window.setTimeout(() => speakNext(index + 1), seg.pauseAfterMs);
      };
      window.speechSynthesis.speak(utterance);
    }

    speakNext(0);
  }

  function beginCall() {
    setPhase("call");
    setTurns([{ role: "agent", text: GREETING }]);
    speak(GREETING);
  }

  // Agent-side status message with no user turn preceding it, used for
  // microphone problems. Deliberately not spoken aloud: if the mic just
  // failed, the visitor is looking at the screen, and speaking an error
  // over a failed voice interaction is more confusing than helpful.
  function pushAgent(text: string) {
    setTurns((t) => [...t, { role: "agent", text }]);
  }

  function respondTo(userText: string) {
    const reply = craftReply(userText);
    setTurns((t) => [
      ...t,
      { role: "user", text: userText },
      { role: "agent", text: reply },
    ]);
    speak(reply);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    setInput("");
    respondTo(value);
  }

  function toggleListening() {
    if (listening) {
      try {
        recognitionRef.current?.stop();
      } catch {
        // already stopped
      }
      stopMicAnalysis();
      setListening(false);
      return;
    }

    const w = window as unknown as {
      webkitSpeechRecognition?: SpeechRecognitionCtor;
      SpeechRecognition?: SpeechRecognitionCtor;
    };
    const Ctor = w.webkitSpeechRecognition || w.SpeechRecognition;
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // Tracked so onend can tell "user spoke and we handled it" apart from
    // "session ended having heard nothing", which needs to say so rather
    // than silently going idle.
    let gotResult = false;
    let reportedError = false;

    recognition.onresult = (e) => {
      const transcript = e.results[0]?.[0]?.transcript;
      if (transcript && transcript.trim()) {
        gotResult = true;
        respondTo(transcript);
      }
    };
    recognition.onerror = (e) => {
      reportedError = true;
      const code = e?.error ?? "";
      // "aborted" maps to empty string: that is the user tapping stop, not a
      // failure, so it should not produce a message.
      const message =
        code in RECOGNITION_ERRORS
          ? RECOGNITION_ERRORS[code]
          : "Something went wrong with the microphone. You can type your message instead.";
      if (message) pushAgent(message);
      stopMicAnalysis();
      setListening(false);
    };
    recognition.onend = () => {
      if (!gotResult && !reportedError) {
        pushAgent(RECOGNITION_ERRORS["no-speech"]);
      }
      stopMicAnalysis();
      setListening(false);
    };
    recognitionRef.current = recognition;

    try {
      recognition.start();
      setListening(true);
      void startMicAnalysis();
    } catch {
      // start() throws if a session is already running, or if the browser
      // refuses outright. Either way the user needs to know why nothing
      // happened.
      pushAgent(
        "I could not start the microphone. Try again, or type your message instead.",
      );
      setListening(false);
    }
  }

  if (!supported) return null;

  const subtitle =
    phase === "idle"
      ? "Runs in your browser. Not a real phone call."
      : "Type or speak a line. Scripted replies, not a real call.";

  const visualizerState = speaking ? "speaking" : listening ? "listening" : "idle";

  return (
    // Solid background, not bg-ink-2/60. At 60% opacity the page behind the
    // panel showed straight through it, which looked like a rendering fault
    // when the widget floats over content. The chat widget's panel has
    // always been solid; this now matches.
    <div className="rounded-2xl border border-line-strong bg-ink-2 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-signal">
            Voice demo
          </p>
          <p className="mt-1 text-sm text-paper-dim">{subtitle}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span
            className={`flex items-center gap-1.5 font-mono text-xs sm:text-[11px] uppercase tracking-[0.1em] ${
              speaking || listening ? "text-online" : "text-paper-dim"
            }`}
          >
            <span
              className={`status-dot h-1.5 w-1.5 rounded-full ${
                speaking || listening ? "bg-online" : "bg-paper-dim"
              }`}
            />
            {listening ? "Listening" : speaking ? "Live" : "Idle"}
          </span>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close voice demo"
              className="flex h-6 w-6 items-center justify-center text-paper-dim hover:text-paper"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 h-16">
        <AudioVisualizer state={visualizerState} analyser={analyser} />
      </div>

      {phase === "idle" ? (
        <button
          onClick={beginCall}
          className="mt-5 flex min-h-11 w-full items-center justify-center rounded-full bg-signal px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-ink transition-transform hover:scale-[1.02]"
        >
          Start the call
        </button>
      ) : (
        <>
          <div
            ref={scrollRef}
            className="mt-5 max-h-56 space-y-2 overflow-y-auto"
          >
            {turns.map((t, i) => (
              <p
                key={i}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  t.role === "agent"
                    ? "bg-ink-3 text-paper"
                    : "ml-auto bg-signal text-ink"
                }`}
              >
                {t.text}
              </p>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type what you'd say..."
              className="min-h-11 flex-1 rounded-lg border border-line-strong bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
            />
            {micSupported && (
              <button
                type="button"
                onClick={toggleListening}
                aria-label={listening ? "Stop listening" : "Speak instead"}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  listening
                    ? "border-online bg-online/10 text-online"
                    : "border-line-strong text-paper-dim hover:border-signal/60 hover:text-signal"
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" />
                  <path d="M19 12a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V21a1 1 0 1 0 2 0v-2.08A7 7 0 0 0 19 12Z" />
                </svg>
              </button>
            )}
            <button
              type="submit"
              aria-label="Send"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-signal text-ink"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="m3 12 18-9-4.5 9L21 21 3 12Z" />
              </svg>
            </button>
          </form>
        </>
      )}
    </div>
  );
}
