"use client";

import { Faq, faqMatches } from "./Faq";
import { useFaqQuery } from "@/lib/faq-query-context";
import type { FaqCategory } from "@/lib/all-faqs";

// The results half of FaqSearchBar.tsx's split — see that file for why the
// two are separate. Filtering is CSS only. Every question and answer stays
// mounted so the FAQPage schema keeps matching the page, and with an empty
// query nothing is hidden at all, which is the state a crawler sees.
export function FaqResults({ categories }: { categories: FaqCategory[] }) {
  const { query, setQuery } = useFaqQuery();
  const q = query.trim().toLowerCase();

  const matchCount = q
    ? categories.reduce(
        (n, cat) => n + cat.faqs.filter((f) => faqMatches(f, q)).length,
        0,
      )
    : 0;

  return (
    <>
      {/* No Reveal wrapper here on purpose, unlike the homepage's cards.
          Reveal's IntersectionObserver uses a 12% threshold, and 12% of a
          normal few-hundred-pixel card is a small, quick scroll. 12% of an
          entire category (every question in it, 2000px+) is thirty-plus
          questions from the top of the section, so the heading sat at
          opacity 0 long after it had visibly scrolled onto screen. Confirmed
          live: getComputedStyle reported opacity "0" on a heading whose own
          getBoundingClientRect placed it inside the viewport. Reported from
          a real phone, not just found here. A scroll-fade doesn't add much
          to a list of questions being read anyway, so removing it here
          fixes the bug and drops a fairly pointless animation together. */}
      {categories.map((cat) => (
        <Faq
          key={cat.id}
          items={cat.faqs}
          heading={cat.label}
          id={cat.id}
          filter={q}
          dense
        />
      ))}

      {q && matchCount === 0 && (
        <section className="border-b border-line py-16">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <p className="text-lg text-paper">
              Nothing matches &ldquo;{query.trim()}&rdquo;.
            </p>
            <p className="mt-3 text-paper-dim">
              Try a shorter word, or ask it directly using the chat button.
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-6 inline-flex min-h-11 items-center rounded-full border border-line-strong px-5 font-mono text-xs uppercase tracking-[0.1em] text-paper transition-colors hover:border-signal/60 hover:text-signal"
            >
              Show all questions
            </button>
          </div>
        </section>
      )}
    </>
  );
}
