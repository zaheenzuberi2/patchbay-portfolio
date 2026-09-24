import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticle } from "@/lib/articles";
import { services, getService } from "@/lib/services";
import { siteConfig, whatsappUrl } from "@/lib/site-config";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatWidget } from "@/components/ChatWidget";
import { VoiceWidget } from "@/components/VoiceWidget";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/Reveal";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) return {};

  const url = `${siteConfig.url}/blog/${article.slug}`;
  return {
    title: article.metaTitle,
    description: article.metaDescription,
    keywords: article.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: siteConfig.name,
      title: article.metaTitle,
      description: article.metaDescription,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle,
      description: article.metaDescription,
    },
  };
}

export default async function ArticlePage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) notFound();

  const url = `${siteConfig.url}/blog/${article.slug}`;
  const others = articles.filter((a) => a.slug !== article.slug);
  const relatedServices = article.relatedServices
    .map((s) => getService(s))
    .filter((s): s is (typeof services)[number] => Boolean(s));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.metaDescription,
    url,
    datePublished: article.datePublished,
    dateModified: article.datePublished,
    author: { "@id": `${siteConfig.url}/#person` },
    publisher: { "@id": `${siteConfig.url}/#business` },
    mainEntityOfPage: url,
  };

  return (
    <div className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <Nav />

      <main className="flex flex-1 flex-col">
        <section className="relative overflow-hidden border-b border-line pt-20 sm:pt-36">
          <div className="grid-veil pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-6 pb-14 sm:pb-20">
            <Breadcrumbs
              trail={[
                { name: "Home", href: "/" },
                { name: "Blog", href: "/blog" },
                { name: article.title, href: `/blog/${article.slug}` },
              ]}
            />

            <div className="mt-8 max-w-3xl">
              <p className="font-mono text-xs uppercase tracking-[0.1em] text-paper-dim">
                {new Date(article.datePublished).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </p>
              <h1 className="mt-4 text-balance text-4xl font-medium leading-[1.08] tracking-[-0.03em] sm:text-5xl">
                {article.title}
              </h1>
              <p className="mt-7 text-lg leading-relaxed text-paper-dim">
                {article.intro}
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-3xl px-6">
            <div className="space-y-12">
              {article.sections.map((s) => (
                <Reveal key={s.heading}>
                  <h2 className="text-balance text-2xl font-medium tracking-[-0.01em] text-paper">
                    {s.heading}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-paper-dim">
                    {s.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {relatedServices.length > 0 && (
          <section className="border-b border-line py-14 sm:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <Reveal>
                <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                  The service this is about.
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

        {others.length > 0 && (
          <section className="border-b border-line py-14 sm:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <Reveal>
                <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                  More from the blog.
                </h2>
              </Reveal>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {others.map((o, i) => (
                  <Reveal key={o.slug} delay={i * 50}>
                    <Link
                      href={`/blog/${o.slug}`}
                      className="group flex items-baseline justify-between gap-6 rounded-2xl border border-line-strong bg-ink-2/60 p-5 transition-colors hover:border-signal/50"
                    >
                      <span className="text-lg font-medium tracking-[-0.01em] text-paper transition-colors group-hover:text-signal">
                        {o.title}
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
