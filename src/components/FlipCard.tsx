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
        </div>
        <div className="flip-card-face flip-card-back h-full w-full">
          {back}
        </div>
      </div>
    </motion.div>
  );
}
