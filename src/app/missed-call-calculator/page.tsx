import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig, whatsappUrl } from "@/lib/site-config";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatWidget } from "@/components/ChatWidget";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MissedCallCalculator } from "@/components/MissedCallCalculator";

const title = "Missed Call Revenue Calculator";
const description =
  "Free calculator: enter your monthly calls, how many go unanswered, your booking rate and job value to see roughly how much revenue missed calls cost your business each month.";
const url = `${siteConfig.url}/missed-call-calculator`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "missed call calculator",
    "cost of missed calls",
    "missed calls revenue loss",
    "AI receptionist ROI",
  ],
  alternates: { canonical: url },
  openGraph: {
    type: "website",
    url,
    siteName: siteConfig.name,
    title,
    description,
    locale: siteConfig.locale,
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function MissedCallCalculatorPage() {
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${url}#app`,
    url,
    name: title,
    description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": `${siteConfig.url}/#business` },
  };

  return (
    <div className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <Nav />
      <main className="flex flex-1 flex-col">
        <section className="relative overflow-hidden border-b border-line pt-20 sm:pt-36">
          <div className="grid-veil pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-6 pb-14 sm:pb-20">
            <Breadcrumbs
              trail={[
                { name: "Home", href: "/" },
                { name: "Missed Call Calculator", href: "/missed-call-calculator" },
              ]}
            />
            <div className="mt-8 max-w-3xl">
              <h1 className="text-balance text-4xl font-medium leading-[1.08] tracking-[-0.03em] sm:text-5xl">
                What do missed calls cost your business each month?
              </h1>
              <p className="mt-7 text-lg leading-relaxed text-paper-dim">
                Put in your own numbers. The calculator multiplies them out so
                you can see the size of the gap before deciding whether an AI
                receptionist is worth looking at.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-line py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-6">
            <MissedCallCalculator />
          </div>
        </section>

        <section className="border-b border-line py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
              How to read the result
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-paper-dim">
              <p>
                Start with your real call log, not a guess. Most phone systems
                and mobile carriers show how many calls went to voicemail or
                were never picked up. If you do not track it, count for one
                typical week and multiply.
              </p>
              <p>
                The booking rate is the share of answered callers who become a
                job, visit, or new client. If you answer ten calls and book
                three, it is 30 percent. Use your own history. A caller who
                reaches voicemail often calls the next business instead, which
                is why the estimate is an upper bound and not a forecast.
              </p>
              <p>
                An AI receptionist answers every call, asks your intake
                questions, books into your calendar, and sends you a written
                summary. It does not catch every lost caller, and in regulated
                fields such as health, law, and insurance it collects
                information and schedules without giving advice. See the{" "}
                <Link
                  href="/ai-receptionist-for"
                  className="text-signal underline-offset-4 hover:underline"
                >
                  industry pages
                </Link>{" "}
                for how each one is set up.
              </p>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="flex min-h-11 items-center rounded-full bg-signal px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-ink transition-transform hover:scale-[1.03]"
              >
                Get a quote
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center rounded-full border border-line-strong px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-paper transition-colors hover:border-signal/60 hover:text-signal"
              >
                Ask on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
      <ChatWidget />
    </div>
  );
}
