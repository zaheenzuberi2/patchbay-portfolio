"use client";

import Link from "next/link";
import { faqMatches } from "./Faq";
import { Reveal } from "./Reveal";
import { useFaqQuery } from "@/lib/faq-query-context";
import type { FaqCategoryPage } from "@/lib/faq-categories";

// The body of /faq, which is now a hub rather than the library itself.
//
// This replaced FaqResults.tsx, which rendered all 216 questions inline. The
// reason for the change is ranking, not layout: 11 distinct query clusters
// (pricing, voice agents, Islamabad, hiring remotely) were competing for one
// URL. Each category now has its own page and owns its own FAQPage schema,
// and this page links to them instead of repeating their content.
//
// ⚠️ The "filtering is CSS only, nothing unmounts" rule from HANDOFF §27
// deliberately does NOT apply here any more, and this is the one place that
// is true. That rule existed because /faq emitted FAQPage structured data
// and the schema had to match visible content. /faq no longer emits any FAQ
// schema at all (the spokes own it), so there is nothing here for hidden
// answers to contradict. Answers are now rendered only for matches, which
// means with an empty query this page contains no answer text at all, and
// no answer exists at two URLs. That rule is still live and still load
// bearing on the spoke pages, where Faq renders with no filter and every
// answer stays mounted.
//
// This is not cloaking. A crawler and a person who has not typed anything
// see exactly the same thing: the category cards. Nothing is keyed off the
// user agent, and typing a query is an ordinary interaction available to
// anyone.
export function FaqHub({ categories }: { categories: FaqCategoryPage[] }) {
  const { query, setQuery } = useFaqQuery();
  const q = query.trim().toLowerCase();

  if (!q) {
    return (
      <section className="border-b border-line py-12 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <Reveal key={cat.slug} delay={i * 40}>
                <Link
                  href={`/faq/${cat.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-line-strong bg-ink-2/60 p-6 transition-colors hover:border-signal/50"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-lg font-medium tracking-[-0.01em] text-paper transition-colors group-hover:text-signal">
                      {cat.label}
                    </h2>
                    <span className="shrink-0 font-mono text-xs text-signal">
                      {cat.faqs.length}
                    </span>
                  </div>

                  {/* Three real questions from the category rather than a
                      written summary: they are the actual thing a visitor is
                      scanning for, and they cannot drift out of sync with
                      the page they link to. */}
                  <ul className="mt-4 flex-1 space-y-2">
                    {cat.faqs.slice(0, 3).map((f) => (
                      <li
                        key={f.q}
                        className="border-l border-line-strong pl-3 text-sm leading-relaxed text-paper-dim"
                      >
                        {f.q}
                      </li>
                    ))}
                  </ul>

                  <span className="mt-5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-paper-dim transition-colors group-hover:text-signal">
                    All {cat.faqs.length} answers
                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-1"
                    >
                      &rarr;
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const groups = categories
    .map((cat) => ({ cat, matches: cat.faqs.filter((f) => faqMatches(f, q)) }))
    .filter((g) => g.matches.length > 0);

  if (groups.length === 0) {
    return (
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
            Browse by category
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-line py-10 sm:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="space-y-10">
          {groups.map(({ cat, matches }) => (
            <div key={cat.slug}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line pb-3">
                <h2 className="text-sm font-medium tracking-[-0.01em] text-paper">
                  {cat.label}
                </h2>
                <Link
                  href={`/faq/${cat.slug}`}
                  className="font-mono text-xs uppercase tracking-[0.1em] text-paper-dim transition-colors hover:text-signal"
                >
                  All {cat.faqs.length} &rarr;
                </Link>
              </div>

              <div className="divide-y divide-line">
                {matches.map((item) => (
                  <div key={item.q} className="py-5">
                    <h3 className="text-base font-medium tracking-[-0.01em] text-paper">
                      {item.q}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-paper-dim">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
