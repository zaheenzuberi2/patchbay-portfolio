import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatWidget } from "@/components/ChatWidget";
import { VoiceWidget } from "@/components/VoiceWidget";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq, FaqSchema } from "@/components/Faq";
import { Reveal } from "@/components/Reveal";
import { CategoryMarquee } from "@/components/CategoryMarquee";
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
        <section className="relative overflow-hidden border-b border-line pt-32 sm:pt-36">
          <div className="grid-veil pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-6 pb-16">
            <Breadcrumbs
              trail={[
                { name: "Home", href: "/" },
                { name: "FAQ", href: "/faq" },
              ]}
            />
            <div className="mt-8">
              <h1 className="text-balance text-4xl font-medium leading-[1.08] tracking-[-0.03em] sm:text-5xl">
                Every question, answered.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper-dim">
                {totalFaqCount} real questions across pricing, process, every
                channel we run, and what it is actually like working with
                this team. No invented numbers, no filler.
              </p>
            </div>
          </div>
        </section>

        <nav
          aria-label="FAQ categories"
          className="sticky top-[57px] z-20 border-b border-line bg-ink/90 backdrop-blur-md sm:top-[65px]"
        >
          <CategoryMarquee categories={FAQ_CATEGORIES} />
        </nav>

        {FAQ_CATEGORIES.map((cat) => (
          <Reveal key={cat.id}>
            <Faq items={cat.faqs} heading={cat.label} id={cat.id} />
          </Reveal>
        ))}

        <section className="py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="relative rounded-2xl border border-line-strong bg-ink-2/60 px-6 py-16 text-center sm:px-16">
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
