import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { services } from "@/lib/services";
import { caseStudies } from "@/lib/case-studies";
import { faqCategoryPages } from "@/lib/faq-categories";
import { articles } from "@/lib/articles";

// Real `git log -1 --format=%cI -- <file>` dates for each page's content
// source, captured 2026-09-27, not build/request time. A build-time "now"
// on every entry told Google every URL changed on every deploy regardless
// of whether its content actually did, which is exactly the signal that
// trains a crawler to stop trusting lastmod. Update the relevant date here
// when meaningfully editing that source file — it's a manual step, same as
// any other lastModified field, but an honest stale date beats a dishonest
// fresh one.
const CONTENT_DATES = {
  homepage: "2026-08-14T19:19:03+01:00",
  services: "2026-09-27T22:55:05+01:00",
  servicesHub: "2026-09-27T20:37:38+01:00",
  about: "2026-09-24T20:54:52+01:00",
  faqHub: "2026-09-09T17:20:43+01:00",
  faqCategories: "2026-09-09T17:20:43+01:00",
  caseStudies: "2026-09-27T21:06:52+01:00",
  blogHub: "2026-09-24T22:35:41+01:00",
  hireNextjs: "2026-09-27T20:54:24+01:00",
  aiAgencyVsTraditional: "2026-09-27T22:55:05+01:00",
  tradingBots: "2026-09-27T20:54:24+01:00",
  internationalClients: "2026-09-27T20:54:24+01:00",
} as const;

// Extracted so /api/indexnow can submit the same URL list to IndexNow
// without a second, drifting copy of it.
export function sitemapEntries(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: CONTENT_DATES.homepage,
    },
    {
      url: `${siteConfig.url}/services`,
      lastModified: CONTENT_DATES.servicesHub,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: CONTENT_DATES.about,
    },
    {
      url: `${siteConfig.url}/faq`,
      lastModified: CONTENT_DATES.faqHub,
    },
    ...services.map((s) => ({
      url: `${siteConfig.url}/services/${s.slug}`,
      lastModified: CONTENT_DATES.services,
    })),
    ...caseStudies.map((c) => ({
      url: `${siteConfig.url}/work/${c.slug}`,
      lastModified: CONTENT_DATES.caseStudies,
    })),
    ...faqCategoryPages.map((c) => ({
      url: `${siteConfig.url}/faq/${c.slug}`,
      lastModified: CONTENT_DATES.faqCategories,
    })),
    // Standalone non-branded commercial-intent landing pages, each targeting
    // one specific query cluster that neither the service pages nor the FAQ
    // hub/spoke pages own on their own (see each page's own top-of-file
    // comment for why it does not duplicate an existing answer).
    {
      url: `${siteConfig.url}/hire-nextjs-developer-pakistan`,
      lastModified: CONTENT_DATES.hireNextjs,
    },
    {
      url: `${siteConfig.url}/ai-agency-vs-traditional-marketing-agency`,
      lastModified: CONTENT_DATES.aiAgencyVsTraditional,
    },
    {
      url: `${siteConfig.url}/trading-bots`,
      lastModified: CONTENT_DATES.tradingBots,
    },
    {
      url: `${siteConfig.url}/international-clients`,
      lastModified: CONTENT_DATES.internationalClients,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: CONTENT_DATES.blogHub,
    },
    ...articles.map((a) => ({
      url: `${siteConfig.url}/blog/${a.slug}`,
      lastModified: new Date(a.datePublished),
    })),
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries();
}
