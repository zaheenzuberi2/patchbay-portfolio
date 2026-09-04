import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /u/ is one-click unsubscribe links: real but single-use per
      // recipient, never meant to be crawled or indexed.
      disallow: ["/admin", "/api", "/u"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
