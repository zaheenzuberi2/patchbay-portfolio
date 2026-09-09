import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { services } from "@/lib/services";
import { faqCategoryPages } from "@/lib/faq-categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...services.map((s) => ({
      url: `${siteConfig.url}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      // ai-voice-agents gets a small edge over the other four: it's the
      // service currently getting the most focused content and technical
      // SEO work, so the sitemap hint should honestly reflect that instead
      // of treating all five as equally important.
      priority: s.slug === "ai-voice-agents" ? 0.85 : 0.8,
    })),
    // The 11 FAQ category pages. Priority 0.7: below the service pages,
    // which are the commercial-intent entry points, but above nothing, since
    // several of these target real query clusters of their own (cost
    // questions and the Islamabad ones especially). Pricing and Islamabad
    // get the small edge for the same honest reason ai-voice-agents does
    // above: they are the two doing the most work.
    ...faqCategoryPages.map((c) => ({
      url: `${siteConfig.url}/faq/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: c.slug === "pricing" || c.slug === "islamabad" ? 0.75 : 0.7,
    })),
  ];
}
