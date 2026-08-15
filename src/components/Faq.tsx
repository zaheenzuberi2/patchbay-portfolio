"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { ServiceFaq } from "@/lib/services";
import { SectionGlow } from "./SectionGlow";
import { SECTION_ACCENTS } from "@/lib/section-theme";

// Answers stay in the DOM whether or not the item is expanded, so crawlers
// read the full text and the FAQPage schema matches what is on the page.
// Only the height is animated.
/** Case-insensitive substring match over the question and its answer.
 *  Deliberately not the scored matcher in faq-search.ts: that one picks the
 *  single best answer for the chat bot, where a filter needs every hit. */
export function faqMatches(item: ServiceFaq, query: string) {
  if (!query) return true;
  return (
    item.q.toLowerCase().includes(query) || item.a.toLowerCase().includes(query)
  );
}

export function Faq({
  items,
  heading = "Common questions",
  id = "faq",
  filter = "",
  dense = false,
}: {
  items: ServiceFaq[];
  heading?: string;
  id?: string;
  /** Lowercased query. Non-matching items are hidden with CSS, never
   *  unmounted: the answers have to stay in the DOM so the FAQPage schema
   *  keeps matching the page. With no query nothing is hidden at all. */
  filter?: string;
  /** Tighter mobile-only spacing for /faq, where this renders back-to-back
   *  8 times as one long list rather than as a single section among
   *  visually distinct ones. The homepage and service pages use one Faq
   *  each as a real section boundary, so they keep the roomier default;
   *  changing the base spacing here would have flattened their rhythm too.
   *  Only the mobile values move — sm and up are identical either way. */
  dense?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const reduced = useReducedMotion();

  const hasMatch = items.some((item) => faqMatches(item, filter));

  return (
    <section
      className={`relative scroll-mt-28 overflow-hidden border-b border-line ${
        dense ? "py-8 sm:py-24" : "py-14 sm:py-24"
      } ${hasMatch ? "" : "hidden"}`}
      id={id}
    >
      <SectionGlow color={SECTION_ACCENTS.faq} />
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
          {heading}
        </h2>

        <div
          className={`divide-y divide-line border-y border-line ${dense ? "mt-6 sm:mt-10" : "mt-10"}`}
        >
          {items.map((item, i) => {
            const matched = faqMatches(item, filter);
            // While searching, matches open themselves. Someone who typed a
            // question wants the answer, not another tap to reveal it.
            const expanded = filter ? matched : open === i;
            return (
              <div key={item.q} className={matched ? "" : "hidden"}>
                <h3>
                  <motion.button
                    onClick={() => setOpen(expanded ? null : i)}
                    aria-expanded={expanded}
                    whileTap={reduced ? undefined : { scale: 0.99 }}
                    className={`flex w-full items-start justify-between text-left ${
                      dense ? "gap-4 py-4 sm:gap-6 sm:py-5" : "gap-6 py-5"
                    }`}
                  >
                    <span className="text-lg font-medium tracking-[-0.01em] text-paper">
                      {item.q}
                    </span>
                    <motion.span
                      aria-hidden="true"
                      animate={{ rotate: expanded ? 45 : 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 22 }}
                      className="mt-1 shrink-0 font-mono text-signal"
                    >
                      +
                    </motion.span>
                  </motion.button>
                </h3>
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p
                      className={`max-w-2xl text-sm leading-relaxed text-paper-dim ${
                        dense ? "pb-4 sm:pb-6" : "pb-6"
                      }`}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FaqSchema({ items }: { items: ServiceFaq[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
