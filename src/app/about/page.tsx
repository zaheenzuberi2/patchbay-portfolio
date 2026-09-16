import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteConfig, whatsappUrl } from "@/lib/site-config";
import { services } from "@/lib/services";
import { caseStudies } from "@/lib/case-studies";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatWidget } from "@/components/ChatWidget";
import { VoiceWidget } from "@/components/VoiceWidget";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/Reveal";

// The one canonical, linkable, directly-indexable page for "what is
// Patchbay and who runs it" — everywhere else this fact set is either
// woven into marketing copy (Hero, About section on the homepage) or
// collapsed by default (Footer's details block). Neither is a URL a search
// result or an AI answer engine can point at on its own; this page is that
// URL. Content is the same real facts stated elsewhere, in plainer
// language, not a new claim. See Footer.tsx and components/About.tsx for
// the original copy this draws from.
const title = "About Patchbay & Zaheen Zuberi";
const description =
  "Patchbay is an AI automation and web development agency in Islamabad, run by Zaheen Zuberi and a team of specialists. Who we are, what we build, and how a project runs.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${siteConfig.url}/about` },
  openGraph: {
    type: "profile",
    url: `${siteConfig.url}/about`,
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

export default function AboutPage() {
  const url = `${siteConfig.url}/about`;

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${url}#page`,
    url,
    name: title,
    description,
    mainEntity: { "@id": `${siteConfig.url}/#business` },
    about: [
      { "@id": `${siteConfig.url}/#business` },
      { "@id": `${siteConfig.url}/#person` },
    ],
  };

  return (
    <div className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      <Nav />

      <main className="flex flex-1 flex-col">
        <section className="relative overflow-hidden border-b border-line pt-20 sm:pt-36">
          <div className="grid-veil pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-6 pb-20">
            <Breadcrumbs
              trail={[
                { name: "Home", href: "/" },
                { name: "About", href: "/about" },
              ]}
            />

            <div className="mt-8 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <Reveal variant="left">
                <div className="floaty-slow overflow-hidden rounded-2xl border border-line-strong bg-ink-2">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src="/zaheen-about.jpg"
                      alt="Zaheen Zuberi, founder of Patchbay, AI automation and full-stack web developer in Islamabad"
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </Reveal>

              <div>
                <Reveal variant="right">
                  <h1 className="text-balance text-4xl font-medium leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
                    Patchbay is an AI automation and web development agency
                    in Islamabad, run by Zaheen Zuberi.
                  </h1>
                  <p className="mt-7 max-w-2xl text-lg leading-relaxed text-paper-dim">
                    One accountable team, not a solo freelancer and not a
                    directory of subcontractors: Zaheen plus specialists in
                    design, copy, SEO, and development, covering everything a
                    marketing agency runs alongside the AI and dev systems
                    most agencies quietly outsource.
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* Plain facts, extraction-friendly */}
        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                What Patchbay does.
              </h2>
            </Reveal>
            <div className="mt-8 max-w-3xl space-y-4 text-base leading-relaxed text-paper-dim">
              <p>
                Patchbay builds AI voice agents and calling agents that
                answer inbound calls, qualify callers, and book
                appointments, with bilingual English and Urdu handling for
                Pakistani businesses. AI chatbot development covers
                websites, WhatsApp, and Instagram, trained on a business&apos;s
                own content rather than a generic script.
              </p>
              <p>
                On the automation side, Patchbay works as an n8n developer
                and workflow automation agency, connecting CRMs, calendars,
                forms, and invoicing through n8n, Zapier, Make, and custom
                API integrations so data moves without manual re-entry.
              </p>
              <p>
                Patchbay also works as a full-stack web developer in
                Islamabad, building websites and web apps in Next.js and
                TypeScript with server-side rendering, technical SEO, and
                structured data built in rather than bolted on afterwards.
              </p>
              <p>
                Alongside the AI and development work, Patchbay runs the
                services a marketing agency covers: brand identity, content
                production, and day-to-day social media management. Patchbay
                works with clients across Pakistan and remotely worldwide,
                with every service delivered by the same accountable team
                rather than split across separate vendors.
              </p>
            </div>
          </div>
        </section>

        {/* Founder */}
        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                Who runs it.
              </h2>
            </Reveal>
            <div className="mt-8 max-w-3xl space-y-4 text-base leading-relaxed text-paper-dim">
              <p>
                Zaheen Zuberi is 19, based in Islamabad, and founded and
                runs Patchbay. His father runs an IT company, and growing up
                around that taught him to think in systems before he wrote
                a line of code. Before any of this, he played competitive
                cricket up to the national level at U16.
              </p>
              <p>
                He taught himself to build software and has shipped real,
                working products: Voicely (tryvoicely.com), a free
                text-to-speech tool for Urdu and Hindi creators; PakEngine
                Rent Ledger (pakengine.com), offline-first software for
                Pakistani rent-a-car showrooms; client work including Lex
                Justitia, AB Juris, and AD Real Estate; and Patchbay itself.
                Software development is the underlying skill behind all of
                it, including the voice agents, chatbots, and automation
                work.
              </p>
            </div>
          </div>
        </section>

        {/* How a project runs */}
        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                How a project runs.
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: "Brief",
                  body: "Scope the real workflow, not just the feature request.",
                },
                {
                  step: "Build",
                  body: "Ship the agent, bot, or app as a working system, fast.",
                },
                {
                  step: "Automate",
                  body: "Wire it into the tools that already run the business.",
                },
                {
                  step: "Ship",
                  body: "Live, monitored, and handed off. Not a demo.",
                },
              ].map((s, i) => (
                <Reveal key={s.step} delay={i * 60}>
                  <div className="h-full rounded-2xl border border-line-strong bg-ink-2/60 p-6">
                    <span className="font-mono text-xs text-signal">
                      0{i + 1}
                    </span>
                    <p className="mt-3 font-medium text-paper">{s.step}</p>
                    <p className="mt-1 text-sm leading-relaxed text-paper-dim">
                      {s.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Services hub */}
        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                Every channel Patchbay runs.
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {services.map((s, i) => (
                <Reveal key={s.slug} delay={i * 50}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="group flex items-baseline justify-between gap-6 rounded-2xl border border-line-strong bg-ink-2/60 p-5 transition-colors hover:border-signal/50"
                  >
                    <span>
                      <span className="font-mono text-xs text-signal">
                        CH.{s.channel}
                      </span>
                      <span className="mt-2 block text-lg font-medium tracking-[-0.01em] text-paper transition-colors group-hover:text-signal">
                        {s.name}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="font-mono text-paper-dim transition-transform group-hover:translate-x-1 group-hover:text-signal"
                    >
                      &rarr;
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Projects hub */}
        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                Real, running sessions.
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {caseStudies.map((c, i) => (
                <Reveal key={c.slug} delay={i * 50}>
                  <Link
                    href={`/work/${c.slug}`}
                    className="group flex items-baseline justify-between gap-6 rounded-2xl border border-line-strong bg-ink-2/60 p-5 transition-colors hover:border-signal/50"
                  >
                    <span>
                      <span className="font-mono text-xs text-signal">
                        SESSION {c.sessionId}
                      </span>
                      <span className="mt-2 block text-lg font-medium tracking-[-0.01em] text-paper transition-colors group-hover:text-signal">
                        {c.name}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="font-mono text-paper-dim transition-transform group-hover:translate-x-1 group-hover:text-signal"
                    >
                      &rarr;
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="relative rounded-2xl border border-line-strong bg-ink-2/60 px-6 py-16 text-center sm:px-16">
                <span className="absolute right-6 top-6 flex items-center gap-2 rounded-full border border-online/30 px-2.5 py-1 font-mono text-xs sm:text-[10px] uppercase tracking-[0.1em] text-online">
                  <span className="status-dot h-1.5 w-1.5 rounded-full bg-online" />
                  Channel open
                </span>
                <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                  Talk to the team behind Patchbay.
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-paper-dim">
                  Describe the job and you get a specific quote and a real
                  timeline, not a brochure.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <a
                    href={`mailto:${siteConfig.contactEmail}`}
                    className="flex min-h-11 items-center break-all font-mono text-lg text-signal underline decoration-signal/30 underline-offset-8 transition-colors hover:decoration-signal sm:text-xl"
                  >
                    {siteConfig.contactEmail}
                  </a>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex min-h-11 items-center rounded-full border border-line-strong px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-paper transition-colors hover:border-signal/60 hover:text-signal"
                >
                  Ask on WhatsApp
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
