import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/lib/articles";
import { siteConfig } from "@/lib/site-config";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatWidget } from "@/components/ChatWidget";
import { VoiceWidget } from "@/components/VoiceWidget";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Reveal } from "@/components/Reveal";

const title = "Blog";
const description =
  "Comparisons and explainers on AI automation, web development, and software, written from real builds rather than general advice.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${siteConfig.url}/blog` },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    title,
    description,
    locale: siteConfig.locale,
  },
  twitter: { card: "summary_large_image", title, description },
};

export default function BlogIndexPage() {
  const listSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Blog",
    itemListElement: articles.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: a.title,
      url: `${siteConfig.url}/blog/${a.slug}`,
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
        <section className="relative overflow-hidden border-b border-line pt-20 sm:pt-36">
          <div className="grid-veil pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-6 pb-20">
            <Breadcrumbs trail={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }]} />
            <h1 className="mt-8 max-w-3xl text-balance text-4xl font-medium leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              Comparisons and explainers, not filler.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-paper-dim">
              Written from actual builds and actual client questions, not
              general advice recycled from every other agency blog.
            </p>
          </div>
        </section>

        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="divide-y divide-line border-y border-line">
              {articles.map((a, i) => (
                <Reveal key={a.slug} delay={i * 60}>
                  <Link
                    href={`/blog/${a.slug}`}
                    className="group grid gap-x-8 gap-y-3 py-8 sm:grid-cols-[10rem_1fr] sm:items-start"
                  >
                    <span className="font-mono text-xs uppercase tracking-[0.1em] text-paper-dim">
                      {new Date(a.datePublished).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                        timeZone: "UTC",
                      })}
                    </span>
                    <span>
                      <h2 className="text-2xl font-medium tracking-[-0.01em] text-paper transition-colors group-hover:text-signal">
                        {a.title}
                      </h2>
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-paper-dim">
                        {a.intro}
                      </p>
                    </span>
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
