import type { Metadata } from "next";
import Link from "next/link";
import { voiceNiches, voiceNicheGroups } from "@/lib/voice-niches";
import { siteConfig, whatsappUrl } from "@/lib/site-config";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatWidget } from "@/components/ChatWidget";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/Reveal";

const title = "AI Receptionists & Voice Agents by Industry";
const description =
  "AI receptionists, voice agents, and calling agents built for the industries that live on the phone: healthcare, home services, law, finance, and local business. Pick yours to see the calls it handles and how it is set up.";
const url = `${siteConfig.url}/ai-receptionist-for`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "AI receptionist by industry",
    "AI voice agent for small business",
    "AI calling agent",
    "AI answering service",
    "virtual receptionist AI",
  ],
  alternates: { canonical: url },
  openGraph: {
    type: "article",
    url,
    siteName: siteConfig.name,
    title,
    description,
    locale: siteConfig.locale,
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function VoiceNicheHubPage() {
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
                { name: "AI Receptionists", href: "/ai-receptionist-for" },
              ]}
            />
            <div className="mt-8 max-w-3xl">
              <h1 className="text-balance text-4xl font-medium leading-[1.08] tracking-[-0.03em] sm:text-5xl">
                AI receptionists and calling agents for businesses that live on
                the phone.
              </h1>
              <p className="mt-7 text-lg leading-relaxed text-paper-dim">
                A voice agent answers inbound calls, qualifies the caller
                against your own script, books the appointment, and hands you a
                written summary. It can also call people who asked to hear from
                you. Each industry below has its own page, because a dental
                office, a plumber, and a law firm get different calls and need
                different rules.
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-paper-dim">
                We build for US businesses remotely, from Pakistan. Outbound
                calling goes only to people who agreed to be contacted. In
                regulated fields (health, law, insurance, lending) the agent
                collects information and schedules, and never gives advice.
              </p>
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
          </div>
        </section>

        {voiceNicheGroups.map((group) => {
          const items = voiceNiches.filter((n) => n.group === group);
          if (items.length === 0) return null;
          return (
            <section key={group} className="border-b border-line py-12 sm:py-16">
              <div className="mx-auto max-w-6xl px-6">
                <Reveal>
                  <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                    {group}
                  </h2>
                </Reveal>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((n) => (
                    <Link
                      key={n.slug}
                      href={`/ai-receptionist-for/${n.slug}`}
                      className="group flex min-h-11 flex-col rounded-2xl border border-line-strong bg-ink-2/60 p-5 transition-colors hover:border-signal/50"
                    >
                      <span className="text-base font-medium text-paper transition-colors group-hover:text-signal">
                        {n.plural}
                      </span>
                      <span className="mt-2 text-sm leading-relaxed text-paper-dim">
                        {n.inbound[0]}
                      </span>
                    </Link>
                  ))}
                  {group === "Professional services" && (
                    <Link
                      href="/ai-voice-agent-real-estate"
                      className="group flex min-h-11 flex-col rounded-2xl border border-line-strong bg-ink-2/60 p-5 transition-colors hover:border-signal/50"
                    >
                      <span className="text-base font-medium text-paper transition-colors group-hover:text-signal">
                        Real Estate Agencies
                      </span>
                      <span className="mt-2 text-sm leading-relaxed text-paper-dim">
                        Property inquiries answered and qualified by budget and
                        area.
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </main>
      <Footer />
      <WhatsAppButton />
      <ChatWidget />
    </div>
  );
}
