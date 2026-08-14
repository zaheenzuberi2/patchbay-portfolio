"use client";

import { motion, useReducedMotion } from "motion/react";

// Extracted from Hero.tsx (a server component) so the hero's LCP text stays
// server-rendered; only these two buttons pay for the motion runtime.
export function HeroCtas() {
  const reduced = useReducedMotion();

  return (
    <div className="mt-10 flex flex-wrap items-center gap-4">
      <motion.a
        href="#contact"
        whileHover={reduced ? undefined : { scale: 1.03 }}
        whileTap={reduced ? undefined : { scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
        className="flex min-h-11 items-center rounded-full bg-signal px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-ink"
      >
        Open a channel
      </motion.a>
      <motion.a
        href="#work"
        whileHover={reduced ? undefined : { scale: 1.03 }}
        whileTap={reduced ? undefined : { scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
        className="flex min-h-11 items-center rounded-full border border-line-strong px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-paper transition-colors hover:border-signal/60 hover:text-signal"
      >
        See the projects
      </motion.a>
    </div>
  );
}
