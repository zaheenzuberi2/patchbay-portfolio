"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { ServiceFaq } from "@/lib/services";
import { SectionGlow } from "./SectionGlow";
import { SECTION_ACCENTS } from "@/lib/section-theme";

// Answers stay in the DOM whether or not the item is expanded, so crawlers
// read the full text and the FAQPage schema matches what is on the page.
// Only the height is animated.
export function Faq({
  items,
  heading = "Common questions",
  id = "faq",
}: {
  items: ServiceFaq[];
  heading?: string;
  id?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const reduced = useReducedMotion();

  return (
    <section
      className="relative scroll-mt-28 overflow-hidden border-b border-line py-24"
      id={id}
    >
      <SectionGlow color={SECTION_ACCENTS.faq} />
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
          {heading}
        </h2>

        <div className="mt-10 divide-y divide-line border-y border-line">
          {items.map((item, i) => {
            const expanded = open === i;
            return (
              <div key={item.q}>
                <h3>
                  <motion.button
                    onClick={() => setOpen(expanded ? null : i)}
                    aria-expanded={expanded}
                    whileTap={reduced ? undefined : { scale: 0.99 }}
                    className="flex w-full items-start justify-between gap-6 py-5 text-left"
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
                    <p className="max-w-2xl pb-6 text-sm leading-relaxed text-paper-dim">
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
