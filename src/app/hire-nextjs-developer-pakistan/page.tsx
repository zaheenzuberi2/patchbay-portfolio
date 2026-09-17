import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig, whatsappUrl } from "@/lib/site-config";
import { getService } from "@/lib/services";
import { caseStudies } from "@/lib/case-studies";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatWidget } from "@/components/ChatWidget";
import { VoiceWidget } from "@/components/VoiceWidget";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq, FaqSchema } from "@/components/Faq";
import { Reveal } from "@/components/Reveal";

// A standalone landing page for the exact non-branded commercial query
// "hire a Next.js developer in Pakistan", separate from /services/web-development
// because that page targets the broader "web developer in Islamabad" cluster.
// This page answers the more specific hiring-intent query with its own FAQs,
// none of which duplicate the ones already answered on the service page or
// in /faq/web-development (no answer exists at two URLs, same rule as the
// FAQ hub/spoke split). Content is the same real facts and real projects
// used elsewhere, no invented claims.
const title = "Hire a Next.js Developer in Pakistan";
const description =
  "A Next.js developer who builds the full stack: frontend, backend, and database, not just pages. Real live projects, based in Islamabad, working with clients worldwide.";
const url = `${siteConfig.url}/hire-nextjs-developer-pakistan`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "hire Next.js developer Pakistan",
    "Next.js developer for hire",
    "Next.js developer Islamabad",
    "full-stack Next.js developer",
    "remote Next.js developer Pakistan",
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
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const faqs = [
  {
    q: "Why Next.js instead of WordPress or a page builder?",
    a: "A page builder is fine for a site that only displays information. The moment a site needs to do something, a booking flow, a CRM sync, a dashboard, a page builder starts fighting you. Next.js is a real application framework, so the same codebase handles the pages and the logic behind them, with no plugin stack held together with hope.",
  },
  {
    q: "Do you build the backend too, or only the Next.js frontend?",
    a: "The whole stack. Next.js handles both sides of a project in one codebase, so the database, the API routes, and the pages that call them are built together rather than as separate frontend and backend hires who have to coordinate.",
  },
  {
    q: "Can you take over and extend an existing Next.js codebase?",
    a: "Yes. That is a different job from a fresh build, since the priority is understanding what is already there and why, before changing anything. I would ask to see the codebase and current pain points before quoting rather than assuming it needs a rewrite.",
  },
  {
    q: "Do you work with clients outside Pakistan hiring remotely?",
    a: "Yes. The work is remote by nature: a shared project board, a live preview link, and calls at a time that overlaps your day. Being based in Islamabad affects the rate, not who the work is available to.",
  },
  {
    q: "What does actually working together look like day to day?",
    a: "A conversation about what you need, a fixed quote and timeline agreed in writing, then regular updates during the build rather than a single reveal at the end. You are not left wondering what happened to your project for two weeks straight.",
  },
];

export default function HireNextjsDeveloperPage() {
  const webDev = getService("web-development");
  const nextjsProjects = caseStudies.filter((c) => c.stack.includes("Next.js"));

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
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
      <FaqSchema items={faqs} />

      <Nav />

      <main className="flex flex-1 flex-col">
        <section className="relative overflow-hidden border-b border-line pt-20 sm:pt-36">
          <div className="grid-veil pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-6 pb-14 sm:pb-20">
            <Breadcrumbs
              trail={[
                { name: "Home", href: "/" },
                { name: "Services", href: "/services" },
                {
                  name: "Hire a Next.js Developer",
                  href: "/hire-nextjs-developer-pakistan",
                },
              ]}
            />

            <div className="mt-8 max-w-3xl">
              <h1 className="text-balance text-4xl font-medium leading-[1.08] tracking-[-0.03em] sm:text-5xl">
                Hire a Next.js developer who builds the whole stack.
              </h1>
              <p className="mt-7 text-lg leading-relaxed text-paper-dim">
                Based in Islamabad, working with clients across Pakistan and
                internationally. Next.js is the actual stack behind every
                full-stack build here, frontend, backend, and database
                together, not a page builder with plugins bolted on.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/#contact"
                  className="flex min-h-11 items-center rounded-full bg-signal px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-ink transition-transform hover:scale-[1.03]"
                >
                  Get a quote
                </Link>
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

        {nextjsProjects.length > 0 && (
          <section className="border-b border-line py-14 sm:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <Reveal>
                <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                  Real Next.js builds, not a portfolio of mockups.
                </h2>
              </Reveal>
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {nextjsProjects.map((c, i) => (
                  <Reveal key={c.slug} delay={i * 50}>
                    <Link
                      href={`/work/${c.slug}`}
                      className="group flex h-full flex-col rounded-2xl border border-line-strong bg-ink-2/60 p-6 transition-colors hover:border-signal/50"
                    >
                      <span className="font-mono text-xs text-signal">
                        {c.kind === "Own product" ? "Own product" : "Client"}
                      </span>
                      <span className="mt-2 text-lg font-medium tracking-[-0.01em] text-paper transition-colors group-hover:text-signal">
                        {c.name}
                      </span>
                      <span className="mt-3 text-sm leading-relaxed text-paper-dim">
                        {c.liveLabel}
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        <Faq items={faqs} heading="Hiring a Next.js developer: questions" />

        {webDev && (
          <section className="border-b border-line py-14 sm:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <Reveal>
                <Link
                  href={`/services/${webDev.slug}`}
                  className="group flex items-baseline justify-between gap-6 rounded-2xl border border-line-strong bg-ink-2/60 p-6 transition-colors hover:border-signal/50"
                >
                  <span>
                    <span className="font-mono text-xs text-signal">
                      CH.{webDev.channel}
                    </span>
                    <span className="mt-2 block text-lg font-medium tracking-[-0.01em] text-paper transition-colors group-hover:text-signal">
                      {webDev.name}
                    </span>
                    <span className="mt-3 block text-sm leading-relaxed text-paper-dim">
                      The full service page: pricing, process, and everything
                      a build includes.
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
            </div>
          </section>
        )}

        <section className="py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="relative rounded-2xl border border-line-strong bg-ink-2/60 px-6 py-16 text-center sm:px-16">
                <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                  Tell me what it needs to do.
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-paper-dim">
                  Describe the job and you get a specific quote and a real
                  timeline, not a brochure.
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
