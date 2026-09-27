import { siteConfig } from "@/lib/site-config";

// A plain Route Handler instead of the app/robots.ts metadata-route
// convention: that convention's Robots type has no field for a raw
// directive line, and Content-Signal (search=yes, ai-input=yes,
// ai-train=no) isn't one of its named fields. This is not enforced by any
// crawler today, it's an explicit, machine-readable statement of
// preference for engines that start reading it.
export async function GET() {
  const body = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Disallow: /u
Content-Signal: search=yes, ai-input=yes, ai-train=no

Sitemap: ${siteConfig.url}/sitemap.xml
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
