import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatWidget } from "@/components/ChatWidget";
import { VoiceWidget } from "@/components/VoiceWidget";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/Reveal";
import { FaqSearchBar } from "@/components/FaqSearchBar";
import { FaqHub } from "@/components/FaqHub";
import { FaqQueryProvider } from "@/lib/faq-query-context";
import { siteConfig } from "@/lib/site-config";
import { services } from "@/lib/services";
import { totalFaqCount } from "@/lib/all-faqs";
import { faqCategoryPages } from "@/lib/faq-categories";

const url = `${siteConfig.url}/faq`;
const title = `FAQ: ${totalFaqCount} Answers on AI, Web & Social`;
const description = `Search ${totalFaqCount} answers on AI voice agents, chatbots, automation, web development, pricing, and working with ${siteConfig.ownerName}'s team in Islamabad.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    type: "website",
    url,
    siteName: siteConfig.name,
    title,
    description,
    locale: siteConfig.locale,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

// This page is a hub. It deliberately emits no FAQPage schema and repeats no
// answers: each of the 11 categories owns its own page, its own questions and
// its own structured data (see faq-categories.ts for why). Search still
// covers all of them, and FaqHub.tsx explains what that means for the
// "answers stay in the DOM" rule this page used to be governed by.
export default function FaqPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Nav />

      <main className="flex flex-1 flex-col">
        <FaqQueryProvider>
          {/* Search sits above the page's own heading so a visitor can search
              or jump to a category before scrolling past any copy. pt-20
              clears the fixed header (Nav.tsx, 78px closed on mobile), the
              same value Hero.tsx and the other page heroes use. */}
          <div className="pt-20 sm:pt-24">
            <FaqSearchBar categories={faqCategoryPages} />
          </div>

          <section className="relative overflow-hidden border-b border-line py-10 sm:py-16">
            <div className="grid-veil pointer-events-none absolute inset-0" />
            <div className="relative mx-auto max-w-6xl px-6">
              <Breadcrumbs
                trail={[
                  { name: "Home", href: "/" },
                  { name: "FAQ", href: "/faq" },
                ]}
              />
              <div className="mt-6 sm:mt-8">
                <h1 className="text-balance text-4xl font-medium leading-[1.08] tracking-[-0.03em] sm:text-5xl">
                  Every question, answered.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper-dim">
                  {totalFaqCount} real questions across pricing, process, every
                  channel we run, and what it is actually like working with this
                  team. Search all of them, or pick a category below. No
                  invented numbers, no filler.
                </p>
              </div>
            </div>
          </section>

          <FaqHub categories={faqCategoryPages} />
        </FaqQueryProvider>

        <section className="py-10 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="relative rounded-2xl border border-line-strong bg-ink-2/60 px-6 py-10 text-center sm:px-16 sm:py-16">
                <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                  Didn&apos;t see your question?
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-paper-dim">
                  Ask it directly and you get a specific answer, not a guess.
                </p>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="mt-8 inline-flex min-h-11 items-center break-all font-mono text-lg text-signal underline decoration-signal/30 underline-offset-8 transition-colors hover:decoration-signal sm:text-xl"
                >
                  {siteConfig.contactEmail}
                </a>

                {/* Anchor text is each service's own name from services.ts
                    rather than a generic "learn more", both because
                    descriptive anchors are what actually describe the target
                    page to a crawler and so these can never drift out of sync
                    with the real service names.

                    Deliberately one grouped row rather than links scattered
                    inline through the answers: that reads as SEO filler in
                    the copy, and hundreds of links pointing at five pages
                    dilutes rather than concentrates. */}
                <div className="mt-10 border-t border-line pt-8">
                  <p className="font-mono text-xs uppercase tracking-[0.15em] text-paper-dim sm:text-[11px]">
                    Or go straight to a channel
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-1">
                    {services.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className="flex min-h-11 items-center text-sm text-paper-dim underline decoration-line-strong underline-offset-4 transition-colors hover:text-signal hover:decoration-signal"
                      >
                        {s.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
      <ChatWidget />
      <VoiceWidget />
    </div>
  );
}
