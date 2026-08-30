import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services, getService } from "@/lib/services";
import { siteConfig, whatsappUrl } from "@/lib/site-config";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatWidget } from "@/components/ChatWidget";
import { VoiceWidget } from "@/components/VoiceWidget";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq, FaqSchema } from "@/components/Faq";
import { SignalBars } from "@/components/SignalBars";
import { Reveal } from "@/components/Reveal";
// Code-split and client-only; see VoiceDemoLazy.tsx for why.
import { VoiceDemoLazy as VoiceDemo } from "@/components/VoiceDemoLazy";
import { ServiceWork } from "@/components/ServiceWork";
import { ServiceReviews } from "@/components/ServiceReviews";
import { TEAM_ROLES } from "@/lib/team";
import { listReviews } from "@/lib/db";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

// Statically generated, but ServiceWork and ServiceReviews both read from
// the database (projects, reviews). Without this, a review or project added
// through /admin would never appear on these pages without a full redeploy,
// since a static page with no revalidate is cached indefinitely.
export const revalidate = 300;

export async function generateMetadata(
  props: PageProps<"/services/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const service = getService(slug);
  if (!service) return {};

  const url = `${siteConfig.url}/services/${service.slug}`;
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    keywords: service.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: siteConfig.name,
      title: service.metaTitle,
      description: service.metaDescription,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: service.metaTitle,
      description: service.metaDescription,
    },
  };
}

export default async function ServicePage(
  props: PageProps<"/services/[slug]">,
) {
  const { slug } = await props.params;
  const service = getService(slug);
  if (!service) notFound();

  const url = `${siteConfig.url}/services/${service.slug}`;
  const others = services.filter((s) => s.slug !== service.slug);

  // Same resilience contract as StructuredData.tsx and Reviews.tsx: a
  // database blip must not break this page, and an empty result just omits
  // the rating fields rather than fabricating one. Filtered to reviews
  // tagged with this specific service, distinct from the site-wide rating
  // on the ProfessionalService node, so this page's own Service entity can
  // carry a star-rating snippet for the reviews that are actually about it.
  let serviceReviews: Awaited<ReturnType<typeof listReviews>> = [];
  try {
    serviceReviews = (await listReviews()).filter(
      (r) => r.service_slug === service.slug,
    );
  } catch (err) {
    console.error(
      "[ServicePage] could not load reviews, omitting rating schema:",
      err,
    );
  }
  const ratingSchema =
    serviceReviews.length > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue:
              serviceReviews.reduce((sum, r) => sum + r.rating, 0) /
              serviceReviews.length,
            reviewCount: serviceReviews.length,
            bestRating: 5,
            worstRating: 1,
          },
          review: serviceReviews.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.client_name },
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.rating,
              bestRating: 5,
              worstRating: 1,
            },
            reviewBody: r.quote,
            datePublished: new Date(r.created_at).toISOString().slice(0, 10),
          })),
        }
      : {};

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.name,
    serviceType: service.name,
    description: service.metaDescription,
    url,
    // Points at this page's own generated card, not the site-wide one, so a
    // result or panel that pulls an image for this Service gets the card
    // naming this service rather than the generic homepage one.
    image: `${url}/opengraph-image`,
    provider: { "@id": `${siteConfig.url}/#business` },
    areaServed: [
      { "@type": "City", name: "Islamabad" },
      { "@type": "Country", name: "Pakistan" },
      { "@type": "Place", name: "Worldwide" },
    ],
    audience: { "@type": "BusinessAudience", audienceType: service.goodFor },
    ...ratingSchema,
  };

  return (
    <div className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <FaqSchema items={service.faqs} />

      <Nav />

      <main className="flex flex-1 flex-col">
        {/* Hero. pt-20: matches Hero.tsx and the other page heroes, sized
            against Nav's 78px closed mobile header (Nav.tsx). pt-32 was
            tuned against the header's old, taller always-visible mobile
            link row and left a large visible gap once that row became a
            collapsed dropdown menu. */}
        <section className="relative overflow-hidden border-b border-line pt-20 sm:pt-36">
          <div className="grid-veil pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-6 pb-20">
            <Breadcrumbs
              trail={[
                { name: "Home", href: "/" },
                { name: "Services", href: "/services" },
                { name: service.name, href: `/services/${service.slug}` },
              ]}
            />

            <div className="mt-8 grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
              <div>
                <p className="font-mono text-xs tracking-[0.15em] text-signal">
                  CH.{service.channel}
                </p>
                <h1 className="mt-4 text-balance text-4xl font-medium leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
                  {service.h1}
                </h1>
                <p className="mt-7 max-w-2xl text-lg leading-relaxed text-paper-dim">
                  {service.intro}
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

              <div className="floaty rounded-2xl border border-line-strong bg-ink-2/60 p-5">
                <div className="flex items-center justify-between font-mono text-xs sm:text-[11px] uppercase tracking-[0.1em] text-paper-dim">
                  <span>Channel</span>
                  <span className="flex items-center gap-1.5 text-online">
                    <span className="status-dot h-1.5 w-1.5 rounded-full bg-online" />
                    Open
                  </span>
                </div>
                <SignalBars count={14} className="mt-4 h-16" />
                <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                  {service.stack.map((s) => (
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

        {/* Outcomes */}
        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                What you get out of it.
              </h2>
            </Reveal>
            <ul className="mt-10 divide-y divide-line border-y border-line">
              {service.outcomes.map((o, i) => (
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

        {/* Voice demo, only where it's actually relevant. On phones the
            card naturally fills most of the narrow viewport, so a single
            stacked column already looks intentional. On desktop, that same
            max-w-md card left-aligned inside max-w-6xl left roughly 700px
            of empty space beside it, a real bug reported from a desktop
            screen. Fixed with a two-column layout at lg: instead of
            widening the card itself (which would stretch its internals
            past what they were designed for), pair it with real supporting
            content, prompts the demo can actually answer, since it matches
            against the same FAQ library as the chat widget. */}
        {service.slug === "ai-voice-agents" && (
          <section className="border-b border-line py-14 sm:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                <div>
                  <Reveal>
                    <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                      Hear it for yourself.
                    </h2>
                    <p className="mt-4 max-w-xl text-paper-dim">
                      A real, working sample of the agent&apos;s voice, not a
                      mockup. Runs in your browser, not a live phone system.
                    </p>
                  </Reveal>
                  <Reveal delay={80}>
                    <div className="mt-8 hidden lg:block">
                      <p className="font-mono text-xs uppercase tracking-[0.15em] text-paper-dim">
                        Try asking
                      </p>
                      <ul className="mt-4 space-y-3 text-sm text-paper-dim">
                        <li className="border-l border-line-strong pl-4">
                          &ldquo;How much does this cost?&rdquo;
                        </li>
                        <li className="border-l border-line-strong pl-4">
                          &ldquo;Can you handle Urdu callers?&rdquo;
                        </li>
                        <li className="border-l border-line-strong pl-4">
                          &ldquo;What happens if you can&apos;t answer
                          something?&rdquo;
                        </li>
                      </ul>
                    </div>
                  </Reveal>
                </div>
                <div className="max-w-md lg:mx-auto lg:w-full">
                  <Reveal variant="scale">
                    <VoiceDemo />
                  </Reveal>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* What's included */}
        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                What the build includes.
              </h2>
              <p className="mt-4 max-w-xl text-paper-dim">{service.goodFor}</p>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {service.includes.map((item, i) => (
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

        <ServiceWork />

        {/* Who's on this channel */}
        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                Who&apos;s on this channel.
              </h2>
              <p className="mt-4 max-w-xl text-paper-dim">
                Real specialists, not one person covering every discipline.
              </p>
            </Reveal>
            <div className="mt-10 flex flex-wrap gap-3">
              {service.roles.map((key, i) => {
                const member = TEAM_ROLES.find((r) => r.key === key);
                if (!member) return null;
                return (
                  <Reveal key={key} delay={i * 60}>
                    <div className="flex items-center gap-3 rounded-full border border-line-strong bg-ink-2/60 py-2.5 pl-4 pr-5">
                      <span className="font-mono text-xs text-signal">
                        {member.role}
                      </span>
                      <span className="text-sm text-paper-dim">
                        {member.title}
                      </span>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <ServiceReviews service={service} />

        <Faq items={service.faqs} heading={`${service.name}: questions`} />

        {/* Other services */}
        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                Other channels on the board.
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {others.map((o, i) => (
                <Reveal key={o.slug} delay={i * 50}>
                  <Link
                    href={`/services/${o.slug}`}
                    className="group flex items-baseline justify-between gap-6 rounded-2xl border border-line-strong bg-ink-2/60 p-5 transition-colors hover:border-signal/50"
                  >
                    <span>
                      <span className="font-mono text-xs text-signal">
                        CH.{o.channel}
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
