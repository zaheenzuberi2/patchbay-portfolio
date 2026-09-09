import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatWidget } from "@/components/ChatWidget";
import { VoiceWidget } from "@/components/VoiceWidget";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq, FaqSchema } from "@/components/Faq";
import { Reveal } from "@/components/Reveal";
import { siteConfig, whatsappUrl } from "@/lib/site-config";
import { getService } from "@/lib/services";
import { faqCategoryPages, getFaqCategory } from "@/lib/faq-categories";

export function generateStaticParams() {
  return faqCategoryPages.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/faq/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const cat = getFaqCategory(slug);
  if (!cat) return {};

  const url = `${siteConfig.url}/faq/${cat.slug}`;
  return {
    title: cat.metaTitle,
    description: cat.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: siteConfig.name,
      title: cat.metaTitle,
      description: cat.metaDescription,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: cat.metaTitle,
      description: cat.metaDescription,
    },
  };
}

export default async function FaqCategoryPage(
  props: PageProps<"/faq/[slug]">,
) {
  const { slug } = await props.params;
  const cat = getFaqCategory(slug);
  if (!cat) notFound();

  const others = faqCategoryPages.filter((c) => c.slug !== cat.slug);
  const related = cat.relatedServices
    .map((s) => getService(s))
    .filter((s) => s !== undefined);

  return (
    <div className="flex flex-1 flex-col">
      {/* This page owns the FAQPage entity for its own questions. /faq is a
          hub and deliberately emits none, so no question is claimed by two
          URLs. Same ownership split as the service pages: the root layout
          holds the site-wide @graph, a page emits only what it owns. */}
      <FaqSchema items={cat.faqs} />
      <Nav />

      <main className="flex flex-1 flex-col">
        {/* pt-20 clears the fixed header, the same value every other page
            hero uses against Nav's 78px closed mobile height. */}
        <section className="relative overflow-hidden border-b border-line pt-20 sm:pt-36">
          <div className="grid-veil pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-6 pb-14 sm:pb-20">
            <Breadcrumbs
              trail={[
                { name: "Home", href: "/" },
                { name: "FAQ", href: "/faq" },
                { name: cat.label, href: `/faq/${cat.slug}` },
              ]}
            />

            <div className="mt-8 max-w-3xl">
              <p className="font-mono text-xs tracking-[0.15em] text-signal">
                {cat.faqs.length} QUESTIONS
              </p>
              <h1 className="mt-4 text-balance text-4xl font-medium leading-[1.08] tracking-[-0.03em] sm:text-5xl">
                {cat.h1}
              </h1>
              <p className="mt-7 text-lg leading-relaxed text-paper-dim">
                {cat.intro}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/#contact"
                  className="flex min-h-11 items-center rounded-full bg-signal px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-ink transition-transform hover:scale-[1.03]"
                >
                  Ask your own question
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

        {/* No filter prop: there is no search on a spoke, so nothing is ever
            hidden here and every answer is in the DOM for the schema above. */}
        <Faq
          items={cat.faqs}
          heading={`All ${cat.faqs.length} questions`}
          id={cat.id}
        />

        {/* Hand-off to the service pages this category is actually about.
            Descriptive anchors (the service's own name plus what it is) so
            the link tells a crawler what the target covers, and so a visitor
            who just read the pricing answers is one click from the thing
            they want quoted. */}
        {related.length > 0 && (
          <section className="border-b border-line py-14 sm:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <Reveal>
                <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                  The work behind these answers.
                </h2>
              </Reveal>
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((s, i) => (
                  <Reveal key={s.slug} delay={i * 50}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="group flex h-full flex-col rounded-2xl border border-line-strong bg-ink-2/60 p-6 transition-colors hover:border-signal/50"
                    >
                      <span className="font-mono text-xs text-signal">
                        CH.{s.channel}
                      </span>
                      <span className="mt-2 text-lg font-medium tracking-[-0.01em] text-paper transition-colors group-hover:text-signal">
                        {s.name}
                      </span>
                      <span className="mt-3 text-sm leading-relaxed text-paper-dim">
                        {s.goodFor}
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Every other category, so each spoke links to all ten siblings
            rather than only back up to the hub. A visitor reading about
            pricing is often one question away from a different category,
            and it keeps any single spoke from being a dead end. */}
        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                Other questions people ask.
              </h2>
            </Reveal>
            <div className="mt-10 flex flex-wrap gap-3">
              {others.map((o, i) => (
                <Reveal key={o.slug} delay={i * 30}>
                  <Link
                    href={`/faq/${o.slug}`}
                    className="flex min-h-11 items-center gap-3 rounded-full border border-line-strong bg-ink-2/60 py-2.5 pl-4 pr-5 transition-colors hover:border-signal/50 hover:text-signal"
                  >
                    <span className="text-sm text-paper-dim transition-colors">
                      {o.label}
                    </span>
                    <span className="font-mono text-xs text-signal">
                      {o.faqs.length}
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>

            <div className="mt-10">
              <Link
                href="/faq"
                className="inline-flex min-h-11 items-center font-mono text-xs uppercase tracking-[0.1em] text-paper-dim underline decoration-line-strong underline-offset-8 transition-colors hover:text-signal hover:decoration-signal"
              >
                Search all questions
              </Link>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="relative rounded-2xl border border-line-strong bg-ink-2/60 px-6 py-12 text-center sm:px-16 sm:py-16">
                <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                  Still not answered?
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-paper-dim">
                  Ask it directly and you get a specific answer, not a guess.
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
