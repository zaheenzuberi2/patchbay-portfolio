"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { getStoredTheme, setStoredTheme, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  // Defaults to "dark" so server and first client render agree (same
  // default-then-effect pattern as Reveal.tsx / SiteBackgroundMount.tsx):
  // the server cannot read localStorage, so both render the dark icon and
  // only an effect, after hydration, can correct it. The inline script in
  // layout.tsx already set the real theme on <html> before paint — this is
  // only about the toggle's own icon catching up, a one-frame lag already
  // accepted everywhere else in this codebase for the same reason.
  const [theme, setTheme] = useState<Theme>("dark");
  const reduced = useReducedMotion();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- default-then-effect hydration pattern, see comment above the state declaration
    setTheme(getStoredTheme());
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setStoredTheme(next);
    setTheme(next);
  }

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-strong text-paper-dim transition-colors hover:border-signal/60 hover:text-signal"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isLight ? "sun" : "moon"}
          initial={reduced ? undefined : { rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={reduced ? undefined : { rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          className="flex"
        >
          {isLight ? (
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
            </svg>
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
