import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/services";
import { siteConfig } from "@/lib/site-config";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatWidget } from "@/components/ChatWidget";
import { VoiceWidget } from "@/components/VoiceWidget";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/Reveal";
import { SignalBars } from "@/components/SignalBars";

const title =
  "Services: AI Automation, Chatbots, Voice Agents & Web Development";
const description =
  "AI voice agents, chatbots, business automation, full-stack website development, and social media management. Built end to end by Zaheen Zuberi in Islamabad.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${siteConfig.url}/services` },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/services`,
    siteName: siteConfig.name,
    title,
    description,
    locale: siteConfig.locale,
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function ServicesIndexPage() {
  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Services",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      url: `${siteConfig.url}/services/${s.slug}`,
    })),
  };

  return (
    <div className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listSchema) }}
      />
      <Nav />

      <main className="flex flex-1 flex-col">
        <section className="relative overflow-hidden border-b border-line pt-32 sm:pt-36">
          <div className="grid-veil pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-6 pb-20">
            <Breadcrumbs
              trail={[
                { name: "Home", href: "/" },
                { name: "Services", href: "/services" },
              ]}
            />
            <h1 className="mt-8 max-w-3xl text-balance text-4xl font-medium leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              Every channel a marketing agency runs, plus the AI and dev work
              they outsource.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-paper-dim">
              Five services, one team accountable for all of them. Pick the
              channel that matches what you need built.
            </p>
          </div>
        </section>

        <section className="border-b border-line py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="divide-y divide-line border-y border-line">
              {services.map((s, i) => (
                <Reveal key={s.slug} delay={i * 60}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="group grid gap-x-8 gap-y-3 py-8 sm:grid-cols-[4rem_1fr_auto] sm:items-start"
                  >
                    <span className="font-mono text-xs text-signal">
                      CH.{s.channel}
                    </span>
                    <span>
                      <h2 className="text-2xl font-medium tracking-[-0.01em] text-paper transition-colors group-hover:text-signal">
                        {s.name}
                      </h2>
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-paper-dim">
                        {s.intro}
                      </p>
                      <span className="mt-4 flex flex-wrap gap-2">
                        {s.stack.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-line-strong px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-paper-dim"
                          >
                            {t}
                          </span>
                        ))}
                      </span>
                    </span>
                    <SignalBars
                      count={7}
                      className="hidden h-10 opacity-40 transition-opacity group-hover:opacity-100 sm:flex"
                    />
                  </Link>
                </Reveal>
              ))}
            </div>
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
