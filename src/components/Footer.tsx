// The collapsed "About Patchbay" block exists for a specific reason worth
// recording: the site's own voice is deliberately metaphor-forward ("the
// whole agency in one signal chain"), which reads well to a person but
// gives an AI answer engine (Google AI Overviews, Perplexity) very little
// literal text to lift when answering "what does Patchbay do". This block
// states the same facts in plain, unglamorous language, and carries exact
// phrasings ("custom n8n developer", "bilingual AI voice agents") that do
// not belong in the brand copy elsewhere.
//
// It is a real <details> element, genuinely visible to any visitor who
// clicks it, NOT text hidden from users and shown only to crawlers. That
// distinction matters: hidden-but-indexed text is cloaking under Google's
// Search Essentials and risks a manual penalty, while collapsed content in
// an accordion is explicitly fine. Collapsed by default only so the footer
// stays a single quiet row, matching the rest of the console chrome.
//
// Same content rules as everywhere else on this site: no invented prices,
// client counts, or results, and team-framed rather than solo.
export function Footer() {
  return (
    <footer className="border-t border-line py-8">
      <div className="mx-auto max-w-6xl px-6">
        <details className="group">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 font-mono text-xs uppercase tracking-[0.1em] text-paper-dim transition-colors hover:text-paper focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal sm:text-[11px] [&::-webkit-details-marker]:hidden">
            About Patchbay
            <span
              aria-hidden="true"
              className="text-signal transition-transform duration-200 group-open:rotate-180"
            >
              &darr;
            </span>
          </summary>

          <div className="max-w-3xl space-y-4 pb-6 pt-4 text-sm leading-relaxed text-paper-dim">
            <p>
              Patchbay is an AI automation and web development agency based in
              Islamabad, Pakistan, run by Zaheen Zuberi and a team of
              specialists. We build AI voice agents and calling agents that
              answer inbound calls, qualify callers, and book appointments,
              with bilingual English and Urdu handling for Pakistani
              businesses. Our AI chatbot development covers websites,
              WhatsApp, and Instagram, trained on your own content rather than
              a generic script.
            </p>
            <p>
              On the automation side we work as a custom n8n developer and
              workflow automation agency, connecting CRMs, calendars, forms,
              and invoicing through n8n, Zapier, Make, and custom API
              integrations so data moves without manual re-entry.
            </p>
            <p>
              We also work as full-stack web developers in Islamabad, building
              websites and web apps in Next.js and TypeScript with
              server-side rendering, technical SEO, and structured data built
              in rather than bolted on afterwards.
            </p>
            <p>
              Alongside the AI and development work, we run the services a
              marketing agency covers: brand identity, content production, and
              day-to-day social media management. Patchbay works with clients
              across Pakistan and remotely worldwide, with every service
              delivered by one accountable team rather than split across
              separate vendors.
            </p>
          </div>
        </details>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 font-mono text-xs uppercase tracking-[0.1em] text-paper-dim sm:text-[11px]">
          <span>
            &copy; {new Date().getFullYear()} Patchbay, Zaheen Zuberi,
            Islamabad, PK
          </span>
          <span className="flex items-center gap-2">
            <span className="status-dot h-1.5 w-1.5 rounded-full bg-online" />
            All systems online
          </span>
        </div>
      </div>
    </footer>
  );
}
