"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { VoiceDemo } from "./VoiceDemo";
import { speakOnce } from "@/lib/speak";

// Third floating button, stacked above ChatWidget (which stacks above
// WhatsAppButton). Same offsets math as the other two, one level higher:
// WhatsApp sits at bottom-4/bottom-6 (44px/56px tall), Chat sits at
// bottom-[72px]/bottom-24 (44px/56px tall + a matching gap above
// WhatsApp), so this sits at bottom-[128px]/bottom-[168px] — Chat's own
// offset plus its height plus the same gap. If either lower button's
// size/position changes, this offset needs to move with it (same
// invariant DESIGN.md documents for WhatsApp/Chat).

const HOOK_LINE =
  "Welcome to Patchbay, by Zaheen. I'm Zaheen's Assistant. Need a hand finding something, or want to know how I can help your business?";
const GREETED_SESSION_KEY = "patchbay_voice_hook_shown";

export function VoiceWidget() {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const [supported, setSupported] = useState(false);
  const [hookVisible, setHookVisible] = useState(false);
  const reduced = useReducedMotion();
  const openRef = useRef(open);
  const spokenRef = useRef(false);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- default-then-effect hydration pattern, same as VoiceDemo.tsx
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  useEffect(() => {
    if (!supported || typeof window === "undefined") return;

    let alreadyShown = false;
    try {
      alreadyShown = window.sessionStorage.getItem(GREETED_SESSION_KEY) === "1";
    } catch {
      // sessionStorage unavailable (private browsing etc.) — proceed
      // without persistence rather than blocking the feature entirely.
    }
    if (alreadyShown) return;

    const timers: number[] = [];
    let gestureCleanup: (() => void) | null = null;

    timers.push(
      window.setTimeout(() => {
        // Don't interrupt someone who already opened the panel themselves
        // in the first 3 seconds.
        if (openRef.current) return;

        setHookVisible(true);
        try {
          window.sessionStorage.setItem(GREETED_SESSION_KEY, "1");
        } catch {
          // non-fatal
        }

        // Browser autoplay policies mean speak() can be silently blocked
        // with zero prior user interaction on the page — genuinely varies
        // by browser and even by session. Attempt it; if audio hasn't
        // actually started within ~700ms, treat it as blocked and retry
        // once on the visitor's first real interaction with the page,
        // rather than the greeting just never being heard.
        speakOnce(HOOK_LINE, {
          onStart: () => {
            spokenRef.current = true;
          },
        });

        timers.push(
          window.setTimeout(() => {
            if (spokenRef.current) return;
            const retry = () => {
              if (spokenRef.current) return;
              spokenRef.current = true;
              speakOnce(HOOK_LINE);
              gestureCleanup?.();
            };
            document.addEventListener("click", retry, { once: true });
            document.addEventListener("keydown", retry, { once: true });
            document.addEventListener("touchstart", retry, { once: true });
            gestureCleanup = () => {
              document.removeEventListener("click", retry);
              document.removeEventListener("keydown", retry);
              document.removeEventListener("touchstart", retry);
            };
          }, 700),
        );

        timers.push(window.setTimeout(() => setHookVisible(false), 9000));
      }, 3000),
    );

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      gestureCleanup?.();
    };
  }, [supported]);

  if (!supported) return null;

  function openFromHook() {
    setHookVisible(false);
    setOpen(true);
    setEverOpened(true);
  }

  return (
    <>
      <AnimatePresence>
        {hookVisible && (
          <motion.div
            initial={reduced ? undefined : { opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, scale: 0.94, y: 6 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-[184px] right-4 z-40 w-64 max-w-[calc(100vw-2rem)] sm:bottom-[240px] sm:right-6"
          >
            <button
              onClick={openFromHook}
              className="block w-full rounded-2xl border border-signal/40 bg-ink-2 p-4 text-left shadow-[0_16px_48px_rgba(0,0,0,0.5)] transition-colors hover:border-signal/70"
            >
              <span className="flex items-center gap-1.5 font-mono text-xs sm:text-[10px] uppercase tracking-[0.1em] text-signal">
                <span className="status-dot h-1.5 w-1.5 rounded-full bg-signal" />
                Zaheen&apos;s Assistant
              </span>
              <span className="mt-2 block text-sm leading-relaxed text-paper">
                {HOOK_LINE}
              </span>
            </button>
            <button
              onClick={() => setHookVisible(false)}
              aria-label="Dismiss"
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-line-strong bg-ink-2 text-paper-dim hover:text-paper"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floaty bob lives on this wrapper, not on the motion.button below
          (see the matching comment in WhatsAppButton.tsx / ChatWidget.tsx):
          motion.button already drives its own transform every frame for
          the entrance spring and hover/tap scale, and a CSS keyframe
          animation on the same transform property would fight it. */}
      <div
        className={`floaty-slower fixed bottom-[128px] right-4 z-40 sm:bottom-[168px] sm:right-6 ${
          open ? "hidden" : ""
        }`}
      >
        <motion.button
          onClick={() => {
            setHookVisible(false);
            setOpen(true);
            setEverOpened(true);
          }}
          aria-label="Try Zaheen's Assistant"
          initial={reduced ? undefined : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.7 }}
          whileHover={reduced ? undefined : { scale: 1.08 }}
          whileTap={reduced ? undefined : { scale: 0.94 }}
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-signal text-ink shadow-[0_8px_24px_rgba(255,90,31,0.35)] sm:h-14 sm:w-14"
        >
          {(!everOpened || hookVisible) && (
            <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-signal/60" />
          )}
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1L6.6 10.8Z" />
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
            className="fixed bottom-[128px] right-4 z-40 w-[22rem] max-w-[calc(100vw-2rem)] sm:bottom-[168px] sm:right-6"
          >
            <VoiceDemo onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
