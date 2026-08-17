import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatWidget } from "@/components/ChatWidget";
import { VoiceWidget } from "@/components/VoiceWidget";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqSchema } from "@/components/Faq";
import { Reveal } from "@/components/Reveal";
import { FaqSearchBar } from "@/components/FaqSearchBar";
import { FaqResults } from "@/components/FaqResults";
import { FaqQueryProvider } from "@/lib/faq-query-context";
import { siteConfig } from "@/lib/site-config";
import { FAQ_CATEGORIES, allFaqsFlat, totalFaqCount } from "@/lib/all-faqs";

const url = `${siteConfig.url}/faq`;
const title = `${totalFaqCount}+ Questions Answered | ${siteConfig.name} FAQ`;
const description = `Every question we get asked about AI voice agents, chatbots, automation, web development, marketing, pricing, and working with ${siteConfig.ownerName}'s team, answered in one place.`;

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

export default function FaqPage() {
  return (
    <div className="flex flex-1 flex-col">
      <FaqSchema items={allFaqsFlat} />
      <Nav />

      <main className="flex flex-1 flex-col">
        <FaqQueryProvider>
          {/* Search and the category marquee moved to the very top of the
              page, ahead of the heading and breadcrumb, so a visitor can
              search or jump to a category before scrolling past any copy.
              The actual results (FaqResults) stay in their original
              position below the intro rather than moving up too — a page
              opening straight into 200 questions with the H1 buried after
              all of them read badly, so only the controls moved, not the
              content they control. The two share query state through
              FaqQueryContext since they're no longer siblings in one
              render tree. pt-20 clears the fixed header (Nav.tsx, 78px
              closed on mobile), the same value Hero.tsx and the other page
              heroes use for the same header height. */}
          <div className="pt-20 sm:pt-24">
            <FaqSearchBar categories={FAQ_CATEGORIES} />
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
                  {totalFaqCount} real questions across pricing, process,
                  every channel we run, and what it is actually like working
                  with this team. No invented numbers, no filler.
                </p>
              </div>
            </div>
          </section>

          <FaqResults categories={FAQ_CATEGORIES} />
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
