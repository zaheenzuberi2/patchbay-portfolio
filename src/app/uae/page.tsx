import type { Metadata } from "next";
import { VoiceDemoButton } from "@/components/VoiceDemoButton";
import Link from "next/link";
import { uaeCities } from "@/lib/uae/cities";
import { siteConfig, whatsappUrl, defaultOgImages } from "@/lib/site-config";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatWidget } from "@/components/ChatWidget";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/Reveal";

const title = "AI Voice Agents & Web Development for the UAE";
const description =
  "AI receptionists, calling agents, websites, trading bots, and automation for businesses in Dubai and Abu Dhabi, built remotely from Islamabad, one hour off UAE time.";
const url = `${siteConfig.url}/uae`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "AI voice agent UAE",
    "AI receptionist Dubai",
    "AI calling agent Abu Dhabi",
    "web development UAE",
    "AI automation agency UAE",
  ],
  alternates: { canonical: url },
  openGraph: {
    type: "article",
    url,
    siteName: siteConfig.name,
    title,
    description,
    locale: siteConfig.locale,
    images: defaultOgImages,
  },
  twitter: {
    card: "summary_large_image",
    images: defaultOgImages.map((i) => i.url),
    title,
    description,
  },
};

export default function UaeHubPage() {
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#page`,
    url,
    name: title,
    description,
    about: { "@id": `${siteConfig.url}/#business` },
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
                { name: "UAE", href: "/uae" },
              ]}
            />
            <div className="mt-8 max-w-3xl">
              <h1 className="text-balance text-4xl font-medium leading-[1.08] tracking-[-0.03em] sm:text-5xl">
                AI voice agents, websites, and automation for UAE businesses.
              </h1>
              <p className="mt-7 text-lg leading-relaxed text-paper-dim">
                We build AI receptionists and calling agents, websites,
                WhatsApp chatbots, and trading bots for businesses in Dubai and
                Abu Dhabi. The team works from Islamabad, one hour ahead of UAE
                time, so calls fit your working day. We have no UAE office, and
                the agents we build answer around the clock.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <VoiceDemoButton />
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
          </div>
        </section>

        <section className="border-b border-line py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                Pick your city
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-paper-dim">
                The two cities run differently, so each page covers its own
                sectors, regulators, and call patterns.
              </p>
            </Reveal>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {uaeCities.map((c, i) => (
                <Reveal key={c.slug} delay={i * 40}>
                  <Link
                    href={`/uae/${c.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-line-strong bg-ink-2/60 p-6 transition-colors hover:border-signal/50"
                  >
                    <span className="text-lg font-medium tracking-[-0.01em] text-paper transition-colors group-hover:text-signal">
                      {c.name}
                    </span>
                    <span className="mt-3 text-sm leading-relaxed text-paper-dim">
                      {c.market}
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-line py-14 sm:py-20">
          <div className="mx-auto max-w-3xl px-6">
            <Reveal>
              <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                How does it work for a UAE business?
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-paper-dim">
                <p>
                  You describe how calls reach you in a short scoping call:
                  the call types, your hours, and what a good outcome looks
                  like. We write the agent around those rules, then agree the
                  scope, the timeline, and the price in a written quote before
                  any build starts. Bank transfer is the default for clients
                  outside Pakistan.
                </p>
                <p>
                  UAE rules limit internet-based calling, so the agent
                  connects to your line through a licensed telecom provider.
                  We confirm the exact route while scoping. Outbound calling
                  is only for people who asked to be contacted, and in
                  regulated sectors such as healthcare and finance the agent
                  collects information and books without giving advice.
                </p>
                <p>
                  The agents are built English-first. Arabic is scoped as its
                  own piece of work and only promised after the voice has been
                  tested with you. Call recordings and transcripts are
                  personal data, so the greeting wording and how long they are
                  kept are decided with you and your legal adviser.
                </p>
                <p>
                  For a closer look, read the{" "}
                  <Link
                    href="/uae/dubai"
                    className="text-signal underline-offset-4 hover:underline"
                  >
                    Dubai page
                  </Link>{" "}
                  or the{" "}
                  <Link
                    href="/uae/abu-dhabi"
                    className="text-signal underline-offset-4 hover:underline"
                  >
                    Abu Dhabi page
                  </Link>
                  , or try the{" "}
                  <Link
                    href="/missed-call-calculator"
                    className="text-signal underline-offset-4 hover:underline"
                  >
                    missed call calculator
                  </Link>{" "}
                  with your own numbers.
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
      <ChatWidget />
    </div>
  );
}
