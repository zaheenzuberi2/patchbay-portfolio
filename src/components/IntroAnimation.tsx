"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { siteConfig } from "@/lib/site-config";

// One-time brand intro on a fresh session: the signal bars power on, amber
// against the near-black canvas, then resolve into the logo mark and
// wordmark before the whole overlay clears. Reuses the same visual language
// as SignalBars.tsx and the OG image template rather than inventing a new
// one — this is "the signal chain" the hero copy already talks about,
// animated once at the door.
//
// Session-gated, not page-gated: mounted once in the root layout, so it
// naturally does not replay on client-side navigation between pages (layouts
// persist across route changes in the App Router, only page content swaps).
// A hard reload or a fresh tab is a new session and plays it again.
const SHOWN_SESSION_KEY = "patchbay_intro_shown";
const BAR_HEIGHTS = [16, 30, 44, 24, 38, 20, 34, 18];
const AUTO_DISMISS_MS = 1900;

export function IntroAnimation() {
  // Defaults to true so server and first client render agree (same
  // default-then-effect pattern as Reveal.tsx / SiteBackgroundMount.tsx):
  // the server cannot know sessionStorage, so both render the overlay's
  // initial state and only an effect, after hydration, can hide it.
  const [visible, setVisible] = useState(true);
  const reduced = useReducedMotion();

  // useLayoutEffect, not useEffect: it runs before the browser paints, so a
  // returning visitor within the same session gets setVisible(false) before
  // the overlay is ever shown on screen, rather than a one-frame flash of it
  // appearing and immediately disappearing.
  useLayoutEffect(() => {
    let alreadyShown = false;
    try {
      alreadyShown = window.sessionStorage.getItem(SHOWN_SESSION_KEY) === "1";
    } catch {
      // sessionStorage unavailable (private browsing etc.) — proceed as if
      // this were a fresh session rather than blocking the intro entirely.
    }
    if (alreadyShown) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- default-then-effect hydration pattern, see comment above the state declaration
      setVisible(false);
      return;
    }
    try {
      window.sessionStorage.setItem(SHOWN_SESSION_KEY, "1");
    } catch {
      // non-fatal
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(() => setVisible(false), AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [visible]);

  // Purely decorative, unlike Reveal.tsx which reveals real content — under
  // reduced motion the right answer is to skip it outright, not play it
  // instantly. `reduced` is null on the server and on the first client
  // render (Framer Motion's own default-then-effect internally), so this
  // check only ever removes the overlay on a later re-render, never causes
  // a hydration mismatch.
  if (reduced || !visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          onClick={() => setVisible(false)}
          role="presentation"
          aria-hidden="true"
          className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center gap-6 bg-ink"
        >
          <div className="flex items-end gap-1.5">
            {BAR_HEIGHTS.map((h, i) => (
              <motion.span
                key={i}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{
                  delay: 0.15 + i * 0.05,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ height: h, transformOrigin: "bottom" }}
                className="w-[5px] rounded-full bg-signal"
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-2.5"
          >
            {/* Plain <img>, not next/image: this overlay unmounts within
                ~2s and next/image's responsive-loading machinery is
                pointless overhead for something shown once and thrown
                away. logo-mark.png is already an eagerly-fetched priority
                image via Nav.tsx, so it is warm in cache by the time this
                paints. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-mark.png"
              alt=""
              className="h-8 w-8 rounded-full"
            />
            <span className="font-mono text-lg tracking-tight text-paper">
              {siteConfig.name.toUpperCase()}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
