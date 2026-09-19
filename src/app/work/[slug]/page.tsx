import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy } from "@/lib/case-studies";
import { services, getService } from "@/lib/services";
import { siteConfig, whatsappUrl } from "@/lib/site-config";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatWidget } from "@/components/ChatWidget";
import { VoiceWidget } from "@/components/VoiceWidget";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SignalBars } from "@/components/SignalBars";
import { Reveal } from "@/components/Reveal";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const study = getCaseStudy(slug);
  if (!study) return {};

  const url = `${siteConfig.url}/work/${study.slug}`;
  return {
    title: study.metaTitle,
    description: study.metaDescription,
    keywords: study.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: siteConfig.name,
      title: study.metaTitle,
      description: study.metaDescription,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: study.metaTitle,
      description: study.metaDescription,
    },
  };
}

export default async function CaseStudyPage(
  props: PageProps<"/work/[slug]">,
) {
  const { slug } = await props.params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const url = `${siteConfig.url}/work/${study.slug}`;
  const others = caseStudies.filter((c) => c.slug !== study.slug);
  const relatedServices = study.relatedServices
    .map((slug) => getService(slug))
    .filter((s): s is (typeof services)[number] => Boolean(s));

  // CreativeWork rather than Article: this is a record of a built product,
  // not a piece of editorial writing, and `about` ties it to the live
  // product's own URL rather than treating the case study as the primary
  // entity.
  const caseStudySchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#case-study`,
    name: study.name,
    headline: study.h1,
    description: study.metaDescription,
    url,
    image: `${url}/opengraph-image`,
    author: { "@id": `${siteConfig.url}/#person` },
    creator: { "@id": `${siteConfig.url}/#person` },
    publisher: { "@id": `${siteConfig.url}/#business` },
    about: {
      "@type": "SoftwareApplication",
      name: study.name,
      url: study.liveUrl,
    },
  };

  return (
    <div className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudySchema) }}
      />

      <Nav />

      <main className="flex flex-1 flex-col">
        <section className="relative overflow-hidden border-b border-line pt-20 sm:pt-36">
          <div className="grid-veil pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-6 pb-20">
            <Breadcrumbs
              trail={[
                { name: "Home", href: "/" },
                { name: "Projects", href: "/#work" },
                { name: study.name, href: `/work/${study.slug}` },
              ]}
            />

            <div className="mt-8 grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
              <div>
                <p className="font-mono text-xs tracking-[0.15em] text-signal">
                  SESSION {study.sessionId}
                </p>
                <h1 className="mt-4 text-balance text-4xl font-medium leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
                  {study.h1}
                </h1>
                <p className="mt-7 max-w-2xl text-lg leading-relaxed text-paper-dim">
                  {study.intro}
                </p>

                <p className="mt-5 font-mono text-xs uppercase tracking-[0.1em] text-paper-dim">
                  Built end to end by{" "}
                  <Link
                    href="/about"
                    className="text-signal transition-colors hover:text-paper"
                  >
                    Zaheen Zuberi
                  </Link>
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <a
                    href={study.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-11 items-center rounded-full bg-signal px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-ink transition-transform hover:scale-[1.03]"
                  >
                    Visit {study.liveLabel}
                  </a>
                  <Link
                    href="/#contact"
                    className="flex min-h-11 items-center rounded-full border border-line-strong px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-paper transition-colors hover:border-signal/60 hover:text-signal"
                  >
                    Build something like this
                  </Link>
                </div>
              </div>

              <div className="floaty rounded-2xl border border-line-strong bg-ink-2/60 p-5">
                <div className="flex items-center justify-between font-mono text-xs sm:text-[11px] uppercase tracking-[0.1em] text-paper-dim">
                  <span>{study.kind}</span>
                  <span className="flex items-center gap-1.5 text-online">
                    <span className="status-dot h-1.5 w-1.5 rounded-full bg-online" />
                    {study.status}
                  </span>
                </div>
                <SignalBars count={14} className="mt-4 h-16" />
                <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                  {study.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-line-strong px-2.5 py-0.5 font-mono text-xs sm:text-[10px] uppercase tracking-[0.08em] text-paper-dim"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The problem */}
        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                The problem.
              </h2>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-paper-dim">
                {study.problem}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Approach */}
        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                How it was built.
              </h2>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {study.approach.map((item, i) => (
                <Reveal key={item.title} delay={i * 60}>
                  <div className="h-full rounded-2xl border border-line-strong bg-ink-2/60 p-6">
                    <h3 className="text-lg font-medium tracking-[-0.01em] text-paper">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-paper-dim">
                      {item.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Outcome */}
        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                What it does today.
              </h2>
              <p className="mt-4 max-w-xl text-paper-dim">{study.goodFor}</p>
            </Reveal>
            <ul className="mt-10 divide-y divide-line border-y border-line">
              {study.outcome.map((o, i) => (
                <Reveal key={o} delay={i * 50}>
                  <li className="flex items-baseline gap-5 py-5">
                    <span className="font-mono text-xs text-signal">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base leading-relaxed text-paper">
                      {o}
                    </span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* Related services. Proof-to-sales-page link: a visitor who just
            read how this was built is one click from the page that sells
            it, and the anchor text tells a crawler what this build is
            evidence of. */}
        {relatedServices.length > 0 && (
          <section className="border-b border-line py-14 sm:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <Reveal>
                <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                  Built as part of.
                </h2>
              </Reveal>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {relatedServices.map((s, i) => (
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
        )}

        {/* Other projects */}
        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                Other sessions.
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {others.map((o, i) => (
                <Reveal key={o.slug} delay={i * 50}>
                  <Link
                    href={`/work/${o.slug}`}
                    className="group flex items-baseline justify-between gap-6 rounded-2xl border border-line-strong bg-ink-2/60 p-5 transition-colors hover:border-signal/50"
                  >
                    <span>
                      <span className="font-mono text-xs text-signal">
                        SESSION {o.sessionId}
                      </span>
                      <span className="mt-2 block text-lg font-medium tracking-[-0.01em] text-paper transition-colors group-hover:text-signal">
                        {o.name}
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
                  Got a project like this one?
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
