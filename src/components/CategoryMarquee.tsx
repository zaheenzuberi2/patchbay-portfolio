"use client";

import { useReducedMotion } from "motion/react";
import type { FaqCategory } from "@/lib/all-faqs";

// Auto-scrolling marquee instead of a manually-scrollable chip row. The list
// is rendered twice back to back so a CSS translateX(-50%) loop is seamless;
// pausing on hover/focus (globals.css) is what keeps a link actually
// clickable despite the constant motion. Under prefers-reduced-motion this
// falls back to the original static, manually-scrollable row rather than a
// single frozen half-loop.
export function CategoryMarquee({
  categories,
}: {
  categories: FaqCategory[];
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className="overflow-x-auto">
        <div className="mx-auto flex max-w-6xl gap-2 px-6 py-3">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="flex min-h-11 shrink-0 items-center rounded-full border border-line-strong px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-paper-dim transition-colors hover:border-signal/50 hover:text-paper"
            >
              {cat.label}
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="marquee overflow-hidden">
      <div className="marquee-track flex w-max gap-2 py-3 pl-6">
        {[...categories, ...categories].map((cat, i) => (
          <a
            key={`${cat.id}-${i}`}
            href={`#${cat.id}`}
            tabIndex={i < categories.length ? 0 : -1}
            aria-hidden={i >= categories.length}
            className="flex min-h-11 shrink-0 items-center rounded-full border border-line-strong px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-paper-dim transition-colors hover:border-signal/50 hover:text-paper"
          >
            {cat.label}
          </a>
        ))}
      </div>
    </div>
  );
}
