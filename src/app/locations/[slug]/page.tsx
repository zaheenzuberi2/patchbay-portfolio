import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locations, getLocation } from "@/lib/locations";
import { services } from "@/lib/services";
import { siteConfig, whatsappUrl } from "@/lib/site-config";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatWidget } from "@/components/ChatWidget";
import { VoiceWidget } from "@/components/VoiceWidget";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq, FaqSchema } from "@/components/Faq";
import { Reveal } from "@/components/Reveal";

export function generateStaticParams() {
  return locations.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata(
  props: PageProps<"/locations/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const location = getLocation(slug);
  if (!location) return {};

  const url = `${siteConfig.url}/locations/${location.slug}`;
  return {
    title: location.metaTitle,
    description: location.metaDescription,
    keywords: location.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: siteConfig.name,
      title: location.metaTitle,
      description: location.metaDescription,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: location.metaTitle,
      description: location.metaDescription,
    },
  };
}

export default async function LocationPage(
  props: PageProps<"/locations/[slug]">,
) {
  const { slug } = await props.params;
  const location = getLocation(slug);
  if (!location) notFound();

  const url = `${siteConfig.url}/locations/${location.slug}`;

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#page`,
    url,
    name: location.metaTitle,
    description: location.metaDescription,
    about: { "@id": `${siteConfig.url}/#business` },
    areaServed: { "@type": "City", name: location.city },
  };

  return (
    <div className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <FaqSchema items={location.faqs} />

      <Nav />

      <main className="flex flex-1 flex-col">
        <section className="relative overflow-hidden border-b border-line pt-20 sm:pt-36">
          <div className="grid-veil pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-6 pb-14 sm:pb-20">
            <Breadcrumbs
              trail={[
                { name: "Home", href: "/" },
                { name: location.city, href: `/locations/${location.slug}` },
              ]}
            />

            <div className="mt-8 max-w-3xl">
              <h1 className="text-balance text-4xl font-medium leading-[1.08] tracking-[-0.03em] sm:text-5xl">
                {location.h1}
              </h1>
              <p className="mt-7 text-lg leading-relaxed text-paper-dim">
                {location.intro}
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

        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                What&apos;s covered for a {location.city} business.
              </h2>
            </Reveal>
            <ul className="mt-10 divide-y divide-line border-y border-line">
              {location.covers.map((c, i) => (
                <Reveal key={c} delay={i * 50}>
                  <li className="flex items-baseline gap-5 py-5">
                    <span className="font-mono text-xs text-signal">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-base leading-relaxed text-paper">
                      {c}
                    </span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                Every channel, one team.
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

        <Faq items={location.faqs} heading={`${location.city}: questions`} />

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
