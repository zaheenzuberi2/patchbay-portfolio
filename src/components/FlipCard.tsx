"use client";

import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

export function FlipCard({
  front,
  back,
  className = "",
}: {
  front: ReactNode;
  back: ReactNode;
  className?: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const reduced = useReducedMotion();

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label="Flip card for details"
      onClick={() => setFlipped((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFlipped((v) => !v);
        }
      }}
      // The 3D flip itself stays purely CSS (flip-card-inner), unchanged.
      // Motion only adds a lift-on-hover and press-down on this outer
      // element, so the two motion systems never fight over the same
      // transform.
      whileHover={reduced ? undefined : { y: -4 }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`flip-card group cursor-pointer outline-none ${flipped ? "is-flipped" : ""} ${className}`}
    >
      <div className="flip-card-inner h-full w-full">
        <div className="flip-card-face flip-card-front h-full w-full">
          {front}
          {/* Every card carries its own affordance rather than relying on one
              hint above the grid. On a phone there is no hover state to
              stumble into, so without this the card looks like a plain panel
              and the whole back face goes undiscovered. It rides on the front
              face, so the 3D flip takes it away on its own once opened. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-4 z-10 flip-hint-tap items-center gap-1.5 rounded-full border border-line-strong bg-ink/80 px-2.5 py-1 font-mono text-xs sm:text-[11px] uppercase tracking-[0.1em] text-paper-dim"
          >
            <span className="text-signal">&#8635;</span>
            Tap
          </span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-4 z-10 flip-hint-hover items-center gap-1.5 rounded-full border border-line-strong bg-ink/80 px-2.5 py-1 font-mono text-xs sm:text-[11px] uppercase tracking-[0.1em] text-paper-dim"
          >
            <span className="text-signal">&#8635;</span>
            Hover
          </span>
        </div>
        <div className="flip-card-face flip-card-back h-full w-full">
          {back}
        </div>
      </div>
    </motion.div>
  );
}
