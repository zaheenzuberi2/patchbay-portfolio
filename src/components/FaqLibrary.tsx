"use client";

import { useState, useId } from "react";
import { Faq, faqMatches } from "./Faq";
import { CategoryMarquee } from "./CategoryMarquee";
import type { FaqCategory } from "@/lib/all-faqs";

// /faq carries 200 questions and ran 31 screens on a phone. Category jump
// links help, but nothing let a visitor search, which is what people actually
// do when they arrive with one specific question.
//
// Filtering is CSS only. Every question and answer stays mounted so the
// FAQPage schema keeps matching the page, and with an empty query nothing is
// hidden at all, which is the state a crawler sees.
export function FaqLibrary({ categories }: { categories: FaqCategory[] }) {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const q = query.trim().toLowerCase();

  const matchCount = q
    ? categories.reduce(
        (n, cat) => n + cat.faqs.filter((f) => faqMatches(f, q)).length,
        0,
      )
    : 0;

  return (
    <>
      <div className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-4 sm:py-6">
          <label htmlFor={inputId} className="sr-only">
            Search the questions
          </label>
          <div className="flex items-center gap-3 rounded-full border border-line-strong bg-ink-2/60 px-5 focus-within:border-signal/50">
            <span aria-hidden="true" className="font-mono text-sm text-signal">
              /
            </span>
            <input
              id={inputId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 200 questions"
              className="min-h-12 w-full bg-transparent text-base text-paper outline-none placeholder:text-paper-dim"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="min-h-11 shrink-0 px-2 font-mono text-xs uppercase tracking-[0.1em] text-paper-dim transition-colors hover:text-paper"
              >
                Clear
              </button>
            )}
          </div>

          {/* aria-live so a screen reader hears the count change as they
              type, rather than the results silently rearranging. */}
          <p
            aria-live="polite"
            className={`mt-3 font-mono text-xs uppercase tracking-[0.1em] ${
              q ? "text-paper-dim" : "sr-only"
            }`}
          >
            {q
              ? `${matchCount} ${matchCount === 1 ? "question" : "questions"} matching "${query.trim()}"`
              : ""}
          </p>
        </div>
      </div>

      {/* The category bar jumps to sections. While a search is active most of
          those are hidden, so the links would scroll to nothing. */}
      {!q && (
        <nav
          aria-label="FAQ categories"
          className="sticky top-[57px] z-20 border-b border-line bg-ink/90 backdrop-blur-md sm:top-[65px]"
        >
          <CategoryMarquee categories={categories} />
        </nav>
      )}

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
