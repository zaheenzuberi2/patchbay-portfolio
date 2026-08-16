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

  // The floating chat/voice/WhatsApp buttons are fixed to the bottom-right
  // corner at right-4/right-6 with a 44-56px footprint (ChatWidget.tsx,
  // VoiceWidget.tsx, WhatsAppButton.tsx). On a short viewport, before this
  // nav has scrolled into its own `sticky` position, it can land at the same
  // vertical band as that button column. Unlike the "buttons briefly graze
  // scrolling text" case already accepted as fine, this nav is interactive:
  // confirmed with elementFromPoint that a click landing on an obscured pill
  // hits the floating widget's own button instead, not just visual overlap.
  //
  // Fixed with a genuinely narrower box, not padding. `overflow` clips at
  // the padding edge, and with no border on this element the padding edge
  // and the border-box edge are the same line, so `padding-right` on an
  // `overflow-hidden`/`overflow-x-auto` box does not stop content from
  // scrolling or translating into that space, it only nudges where content
  // starts. Shrinking the box's actual width leaves a true dead zone past
  // its own right edge that content can never render into, regardless of
  // scroll offset or animation position. 80px / 96px covers the button
  // footprint (60px / 80px) with a small margin.
  if (reduced) {
    return (
      <div className="w-[calc(100%-5rem)] overflow-x-auto sm:w-[calc(100%-6rem)]">
        <div className="mx-auto flex max-w-6xl gap-2 px-6 py-3">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="flex min-h-11 shrink-0 items-center rounded-full border border-line-strong px-3.5 py-2 font-mono text-xs sm:text-[11px] uppercase tracking-[0.1em] text-paper-dim transition-colors hover:border-signal/50 hover:text-paper"
            >
              {cat.label}
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="marquee w-[calc(100%-5rem)] overflow-hidden sm:w-[calc(100%-6rem)]">
      <div className="marquee-track flex w-max gap-2 py-3 pl-6">
        {[...categories, ...categories].map((cat, i) => (
          <a
            key={`${cat.id}-${i}`}
            href={`#${cat.id}`}
            tabIndex={i < categories.length ? 0 : -1}
            aria-hidden={i >= categories.length}
            className="flex min-h-11 shrink-0 items-center rounded-full border border-line-strong px-3.5 py-2 font-mono text-xs sm:text-[11px] uppercase tracking-[0.1em] text-paper-dim transition-colors hover:border-signal/50 hover:text-paper"
          >
            {cat.label}
          </a>
        ))}
      </div>
    </div>
  );
}
