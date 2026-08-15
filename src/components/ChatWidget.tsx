"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { whatsappUrl } from "@/lib/site-config";
import { findFaqAnswer, looksLikeQuestion } from "@/lib/faq-search";

type Message = { role: "bot" | "user"; text: string };

type Step =
  | "interest"
  | "name"
  | "contact"
  | "budget"
  | "message"
  | "sending"
  | "done";

// Framed as the bottleneck the visitor is feeling, not the service category,
// so they can identify their own problem before they know what to call the
// fix. Each still maps to a real channel under the hood.
const INTERESTS = [
  "Missing calls or slow response times",
  "Low lead volume",
  "Manual busywork eating my time",
  "No website, or an outdated one",
  "Marketing isn't consistent",
  "Something else",
];

const BUDGETS = [
  "Under $500",
  "$500 to $2k",
  "$2k to $5k",
  "$5k+",
  "Not sure yet",
];

// This is a scripted flow, not an LLM (see ChatWidget's module docs in
// HANDOFF.md), so it cannot actually understand an objection. What it could
// do, and previously didn't, was silently store "why should i tell u" as a
// literal name/contact value and barrel forward as if that were a real
// answer — that read as the bot not listening. Instead of pretending to
// understand, it recognizes the common shape of a refusal and offers an
// honest way out (skip to WhatsApp) rather than accepting garbage as data.
const REFUSAL_PATTERN =
  /^(why( should)?|no\b|nah|nope|idk|i ?dont ?know|dunno|skip|pass|none|not telling|prefer not|no thanks|not sure why)/i;

function looksLikeRefusal(value: string) {
  return value.length < 40 && REFUSAL_PATTERN.test(value.trim());
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const [step, setStep] = useState<Step>("interest");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hey, I'm the front desk for Patchbay. Ask me anything about how we work, or tell me the biggest bottleneck right now.",
    },
  ]);
  const [askedCount, setAskedCount] = useState(0);
  const [input, setInput] = useState("");
  const [lead, setLead] = useState({
    interest: "",
    name: "",
    contact: "",
    budget: "",
    message: "",
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, step]);

  function openWidget() {
    setOpen(true);
    setEverOpened(true);
  }

  function pushBot(text: string) {
    setMessages((m) => [...m, { role: "bot", text }]);
  }

  function pushUser(text: string) {
    setMessages((m) => [...m, { role: "user", text }]);
  }

  function chooseInterest(value: string) {
    pushUser(value);
    setLead((l) => ({ ...l, interest: value }));
    pushBot("Got it. What's your name?");
    setStep("name");
  }

  function chooseBudget(value: string) {
    pushUser(value);
    const next = { ...lead, budget: value };
    setLead(next);
    pushBot("Anything specific I should pass along? Or hit skip.");
    setStep("message");
  }

  async function submitLead(finalLead: typeof lead) {
    setStep("sending");
    pushBot("Sending that over...");
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalLead),
      });
    } catch {
      // Fall through to the confirmation regardless. The WhatsApp link
      // below still works even if the request failed.
    }
    pushBot(
      `Thanks, ${finalLead.name}. That's with Zaheen now. He'll reach out at ${finalLead.contact}. Want to skip the wait and message him directly?`,
    );
    setStep("done");
  }

  function handleTextSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;
    setInput("");

    // Real Q&A, not just lead capture: anything that reads as a question
    // gets checked against the actual FAQ library (same content as /faq and
    // every service page) before falling through to the scripted flow. A
    // question at any step gets answered in place, without advancing or
    // overwriting whatever field that step was collecting.
    if (step !== "sending" && step !== "done" && looksLikeQuestion(value)) {
      const match = findFaqAnswer(value);
      if (match) {
        pushUser(value);
        pushBot(match.a);
        setAskedCount((n) => n + 1);
        if (step === "interest" && askedCount === 1) {
          pushBot(
            "Happy to answer more, or if you want a specific quote: what's the biggest bottleneck right now?",
          );
        }
        return;
      }
    }

    // Interest and budget used to be button-only: typing anything at those
    // steps was silently dropped since no input was even rendered. That
    // read as the widget ignoring the user. Free text now works exactly
    // like tapping a preset at every step.
    if (step === "interest") {
      chooseInterest(value);
      return;
    }

    if (step === "budget") {
      chooseBudget(value);
      return;
    }

    if (step === "name") {
      pushUser(value);
      if (looksLikeRefusal(value)) {
        pushBot(
          "Fair enough, no pressure. A first name is enough if you want to keep going, or tap below to skip straight to WhatsApp instead.",
        );
        return;
      }
      setLead((l) => ({ ...l, name: value }));
      pushBot("Best way to reach you? Email or WhatsApp number.");
      setStep("contact");
      return;
    }

    if (step === "contact") {
      pushUser(value);
      if (looksLikeRefusal(value)) {
        pushBot(
          "Understood, that's only ever used to follow up once. An email or WhatsApp number works, or skip to WhatsApp below.",
        );
        return;
      }
      setLead((l) => ({ ...l, contact: value }));
      pushBot("What's the rough budget for this?");
      setStep("budget");
      return;
    }

    if (step === "message") {
      pushUser(value);
      const next = { ...lead, message: value };
      setLead(next);
      submitLead(next);
      return;
    }
  }

  function skipMessage() {
    pushUser("Skipped");
    submitLead(lead);
  }

  return (
    <>
      {/* Floaty bob lives on this wrapper, not on the motion.button below
          (see the matching comment in WhatsAppButton.tsx): motion.button
          already drives its own transform every frame for the entrance
          spring and hover/tap scale, and a CSS keyframe animation on the
          same transform property would fight it. */}
      <div
        className={`floaty-slow fixed bottom-[72px] right-4 z-40 sm:bottom-24 sm:right-6 ${
          open ? "hidden" : ""
        }`}
      >
        <motion.button
          onClick={openWidget}
          aria-label="Open chat"
          initial={reduced ? undefined : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.55 }}
          whileHover={reduced ? undefined : { scale: 1.08 }}
          whileTap={reduced ? undefined : { scale: 0.94 }}
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-signal text-ink shadow-[0_8px_24px_rgba(255,90,31,0.35)] sm:h-14 sm:w-14"
        >
          {!everOpened && (
            <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-signal/60" />
          )}
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
          </svg>
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? undefined : { opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="fixed bottom-[72px] right-4 z-40 flex h-[min(28rem,calc(100vh-140px))] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-line-strong bg-ink-2 shadow-[0_16px_48px_rgba(0,0,0,0.5)] sm:bottom-24 sm:right-6"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.1em] text-signal">
                  Patchbay
                </p>
                <p className="flex items-center gap-1.5 font-mono text-xs sm:text-[11px] text-online">
                  <span className="status-dot h-1.5 w-1.5 rounded-full bg-online" />
                  Front desk
                </p>
              </div>
              <motion.button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                whileHover={reduced ? undefined : { rotate: 90 }}
                whileTap={reduced ? undefined : { scale: 0.85 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
                className="text-paper-dim hover:text-paper"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={reduced ? undefined : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === "bot"
                      ? "bg-ink-3 text-paper"
                      : "ml-auto bg-signal text-ink"
                  }`}
                >
                  {m.text}
                </motion.div>
              ))}

              {step === "interest" && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {INTERESTS.map((option) => (
                    <motion.button
                      key={option}
                      onClick={() => chooseInterest(option)}
                      whileHover={reduced ? undefined : { scale: 1.04 }}
                      whileTap={reduced ? undefined : { scale: 0.96 }}
                      className="rounded-full border border-line-strong px-3 py-1.5 font-mono text-xs sm:text-[11px] text-paper-dim transition-colors hover:border-signal/60 hover:text-signal"
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              )}

              {step === "budget" && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {BUDGETS.map((option) => (
                    <motion.button
                      key={option}
                      onClick={() => chooseBudget(option)}
                      whileHover={reduced ? undefined : { scale: 1.04 }}
                      whileTap={reduced ? undefined : { scale: 0.96 }}
                      className="rounded-full border border-line-strong px-3 py-1.5 font-mono text-xs sm:text-[11px] text-paper-dim transition-colors hover:border-signal/60 hover:text-signal"
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              )}

              {step === "done" && (
                <motion.a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  initial={reduced ? undefined : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={reduced ? undefined : { scale: 1.05 }}
                  whileTap={reduced ? undefined : { scale: 0.96 }}
                  className="mt-1 inline-block rounded-full bg-[#25D366] px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] text-white"
                >
                  Message on WhatsApp
                </motion.a>
              )}
            </div>

            {(step === "name" || step === "contact") && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center justify-center gap-1.5 border-t border-line bg-ink-3/60 font-mono text-xs sm:text-[11px] uppercase tracking-[0.08em] text-paper-dim transition-colors hover:text-signal"
              >
                Prefer WhatsApp instead? Skip straight there
                <span aria-hidden="true">&rarr;</span>
              </a>
            )}

            {step !== "sending" && step !== "done" && (
              <form
                onSubmit={handleTextSubmit}
                className="flex items-center gap-2 border-t border-line p-3"
              >
                <input
                  autoFocus
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    step === "interest"
                      ? "Ask a question, or describe your bottleneck..."
                      : step === "name"
                        ? "Your name"
                        : step === "contact"
                          ? "Email or WhatsApp number"
                          : step === "budget"
                            ? "Or type your own..."
                            : "Type a message..."
                  }
                  className="min-h-11 flex-1 rounded-lg border border-line-strong bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
                />
                {step === "message" && (
                  <button
                    type="button"
                    onClick={skipMessage}
                    className="flex h-11 shrink-0 items-center font-mono text-xs sm:text-[11px] uppercase tracking-[0.08em] text-paper-dim hover:text-paper"
                  >
                    Skip
                  </button>
                )}
                <motion.button
                  type="submit"
                  aria-label="Send"
                  whileHover={reduced ? undefined : { scale: 1.08 }}
                  whileTap={reduced ? undefined : { scale: 0.9 }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-signal text-ink"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="currentColor"
                  >
                    <path d="m3 12 18-9-4.5 9L21 21 3 12Z" />
                  </svg>
                </motion.button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
