import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUaeCity, uaeCities } from "@/lib/uae/cities";
import { siteConfig, whatsappUrl } from "@/lib/site-config";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatWidget } from "@/components/ChatWidget";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq, FaqSchema } from "@/components/Faq";
import { LeadForm } from "@/components/LeadForm";
import { Reveal } from "@/components/Reveal";

// See src/lib/uae/cities.ts for the editing rules. These pages are written per
// city, not swapped, because the earlier city pages were removed as doorway
// pages.

export function generateStaticParams() {
  return uaeCities.map((c) => ({ city: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/uae/[city]">,
): Promise<Metadata> {
  const { city } = await props.params;
  const c = getUaeCity(city);
  if (!c) return {};

  const url = `${siteConfig.url}/uae/${c.slug}`;
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: [
      `AI voice agent ${c.name}`,
      `AI receptionist ${c.name}`,
      `AI calling agent ${c.name}`,
      `website development ${c.name}`,
      `AI automation agency ${c.name}`,
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: siteConfig.name,
      title: c.metaTitle,
      description: c.metaDescription,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: c.metaTitle,
      description: c.metaDescription,
    },
  };
}

export default async function UaeCityPage(props: PageProps<"/uae/[city]">) {
  const { city } = await props.params;
  const c = getUaeCity(city);
  if (!c) notFound();

  const url = `${siteConfig.url}/uae/${c.slug}`;
  const other = uaeCities.find((x) => x.slug !== c.slug);

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    url,
    name: c.metaTitle,
    description: c.metaDescription,
    provider: { "@id": `${siteConfig.url}/#business` },
    areaServed: { "@type": "City", name: c.name },
    serviceType: "AI voice agents, web development, and automation",
  };

  return (
    <div className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <FaqSchema items={c.faqs} />
      <Nav />

      <main className="flex flex-1 flex-col">
        <section className="relative overflow-hidden border-b border-line pt-20 sm:pt-36">
          <div className="grid-veil pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-6 pb-14 sm:pb-20">
            <Breadcrumbs
              trail={[
                { name: "Home", href: "/" },
                { name: "UAE", href: "/uae" },
                { name: c.name, href: `/uae/${c.slug}` },
              ]}
            />
            <div className="mt-8 max-w-3xl">
              <Link
                href="/about"
                className="font-mono text-xs uppercase tracking-[0.1em] text-paper-dim transition-colors hover:text-signal"
              >
                By Zaheen Zuberi
              </Link>
              <h1 className="mt-4 text-balance text-4xl font-medium leading-[1.08] tracking-[-0.03em] sm:text-5xl">
                {c.h1}.
              </h1>
              <p className="mt-7 text-lg leading-relaxed text-paper-dim">
                {c.intro}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="#contact"
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

        <section className="border-b border-line py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="max-w-3xl text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                How calls work in {c.name}
              </h2>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-paper-dim">
                {c.market}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="border-b border-line py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                Who it is for in {c.name}
              </h2>
            </Reveal>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {c.sectors.map((s, i) => {
                const href = s.nicheSlug
                  ? `/ai-receptionist-for/${s.nicheSlug}`
                  : s.href;
                const body = (
                  <>
                    <span className="text-lg font-medium tracking-[-0.01em] text-paper transition-colors group-hover:text-signal">
                      {s.name}
                    </span>
                    <span className="mt-3 text-sm leading-relaxed text-paper-dim">
                      {s.calls}
                    </span>
                  </>
                );
                return (
                  <Reveal key={s.name} delay={i * 30}>
                    {href ? (
                      <Link
                        href={href}
                        className="group flex h-full flex-col rounded-2xl border border-line-strong bg-ink-2/60 p-6 transition-colors hover:border-signal/50"
                      >
                        {body}
                      </Link>
                    ) : (
                      <div className="flex h-full flex-col rounded-2xl border border-line-strong bg-ink-2/60 p-6">
                        {body}
                      </div>
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-line py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                What we build for {c.name} businesses
              </h2>
            </Reveal>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {c.services.map((s, i) => (
                <Reveal key={s.name} delay={i * 30}>
                  <Link
                    href={s.href}
                    className="group flex h-full flex-col rounded-2xl border border-line-strong bg-ink-2/60 p-6 transition-colors hover:border-signal/50"
                  >
                    <span className="text-lg font-medium tracking-[-0.01em] text-paper transition-colors group-hover:text-signal">
                      {s.name}
                    </span>
                    <span className="mt-3 text-sm leading-relaxed text-paper-dim">
                      {s.body}
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-line py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                Rules we build around
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-paper-dim">
                We are a build team, not legal counsel. These are the points we
                design for, and you should confirm the current position with
                your own adviser.
              </p>
            </Reveal>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {c.rules.map((r, i) => (
                <Reveal key={r.title} delay={i * 40}>
                  <div className="h-full rounded-2xl border border-line-strong bg-ink-2/60 p-6">
                    <span className="block text-base font-medium text-paper">
                      {r.title}
                    </span>
                    <span className="mt-3 block text-sm leading-relaxed text-paper-dim">
                      {r.body}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-line py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                Working across the border
              </h2>
              <p className="mt-5 max-w-3xl leading-relaxed text-paper-dim">
                We work from Islamabad, which is one hour ahead of UAE time, so
                calls fit your working day. Projects run over calls, WhatsApp,
                and a shared project board, with a live preview link so you can
                see progress without waiting for a handover. We have no{" "}
                {c.name} office, and the live agent answers around the clock
                whatever the time zone. More on{" "}
                <Link
                  href="/international-clients"
                  className="text-signal underline decoration-signal/30 underline-offset-4 hover:decoration-signal"
                >
                  how we work with clients outside Pakistan
                </Link>
                .
              </p>
            </Reveal>
          </div>
        </section>

        <Faq items={c.faqs} heading={`Working with Patchbay from ${c.name}: questions`} />

        {other && (
          <section className="border-b border-line py-12">
            <div className="mx-auto flex max-w-6xl flex-wrap gap-3 px-6">
              <Link
                href={`/uae/${other.slug}`}
                className="flex min-h-11 items-center rounded-full border border-line-strong px-5 py-2 text-sm text-paper transition-colors hover:border-signal/60 hover:text-signal"
              >
                Also serving {other.name}
              </Link>
              <Link
                href="/ai-receptionist-for"
                className="flex min-h-11 items-center rounded-full border border-line-strong px-5 py-2 text-sm text-paper-dim transition-colors hover:border-signal/60 hover:text-signal"
              >
                AI receptionists by industry
              </Link>
            </div>
          </section>
        )}

        <section id="contact" className="py-14 sm:py-24">
          <div className="mx-auto max-w-3xl px-6">
            <Reveal>
              <div className="rounded-2xl border border-line-strong bg-ink-2/60 px-6 py-12 sm:px-12">
                <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                  Tell us what you need in {c.name}.
                </h2>
                <p className="mt-4 text-paper-dim">
                  Describe your calls, your website, or the process you want
                  automated, and you get a specific quote and a real timeline.
                </p>
                <div className="mt-8">
                  <LeadForm
                    interest={`UAE enquiry: ${c.name}`}
                    source={`form:uae-${c.slug}`}
                  />
                </div>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="mt-6 inline-flex min-h-11 items-center break-all font-mono text-sm text-signal underline decoration-signal/30 underline-offset-8 transition-colors hover:decoration-signal"
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
    </div>
  );
}
