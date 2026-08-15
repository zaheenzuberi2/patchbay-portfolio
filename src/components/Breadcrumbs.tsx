import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export type Crumb = { name: string; href: string };

// Renders the visible trail and the matching BreadcrumbList schema from one
// source, so the markup and the structured data can never disagree.
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${siteConfig.url}${c.href === "/" ? "" : c.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="Breadcrumb">
        {/* gap-x-1 rather than gap-x-2 because each link now carries its own
            px-2. Short crumbs like "Home" were 34px wide, under the 44px
            minimum, since the tap area was only ever as wide as the word. */}
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 font-mono text-xs sm:text-[11px] uppercase tracking-[0.1em] text-paper-dim">
          {trail.map((c, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-2">
                {last ? (
                  <span className="text-signal" aria-current="page">
                    {c.name}
                  </span>
                ) : (
                  <Link
                    href={c.href}
                    className="flex min-h-11 items-center justify-center px-2 transition-colors hover:text-paper"
                  >
                    {c.name}
                  </Link>
                )}
                {!last && <span className="text-line-strong">/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
