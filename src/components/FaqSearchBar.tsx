"use client";

import { useId } from "react";
import { faqMatches } from "./Faq";
import { CategoryMarquee } from "./CategoryMarquee";
import { useFaqQuery } from "@/lib/faq-query-context";
import type { FaqCategory } from "@/lib/all-faqs";

// The top-of-page half of what FaqLibrary.tsx used to be in one piece: the
// search input, the live match count, and the category marquee. Placed
// above the page's own heading so a visitor can search or jump to a
// category before scrolling past any copy. FaqResults.tsx is the other
// half, rendered lower on the page in its original position, sharing state
// through FaqQueryContext rather than through props, since the two are no
// longer siblings in one render tree.
export function FaqSearchBar({ categories }: { categories: FaqCategory[] }) {
  const { query, setQuery } = useFaqQuery();
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
    </>
  );
}
