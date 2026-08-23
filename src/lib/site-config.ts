// Canonical origin, in priority order:
//
//   1. NEXT_PUBLIC_SITE_URL  - set this once the real domain is live. It is
//      the only option available to client components, since Next only
//      exposes NEXT_PUBLIC_* to the browser bundle.
//   2. VERCEL_PROJECT_PRODUCTION_URL - injected automatically by Vercel on
//      every deployment, no dashboard configuration needed, and stable
//      across deploys (unlike VERCEL_URL, which changes per deployment and
//      would churn canonical tags). Server-only, which is fine: every
//      consumer of siteConfig.url (metadata, sitemap, robots, JSON-LD,
//      Breadcrumbs) is a server component.
//   3. localhost - local development.
//
// Without step 2 the first production deploy emitted canonical tags,
// Open Graph URLs, JSON-LD @ids, and a full sitemap all pointing at
// http://localhost:3000, which tells crawlers the real page lives at an
// address they cannot reach. Deriving it automatically means a fresh deploy
// is never silently wrong just because someone missed an env var.
//
// NOTE: if siteConfig.url is ever needed in a *client* component, option 2
// resolves to undefined there and it would fall through to localhost. Set
// NEXT_PUBLIC_SITE_URL explicitly before doing that.
function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "Patchbay",
  ownerName: "Zaheen Zuberi",
  title: "Zaheen Zuberi | Patchbay: AI Automation & Web Dev, Islamabad",
  description:
    "AI voice agents, chatbots, automation, and full-stack websites — built by one team in Islamabad. See the work, get in touch today.",
  url: resolveSiteUrl(),
  locale: "en_US",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "zaheenzuberi2@gmail.com",
  contactPhoneDisplay: process.env.NEXT_PUBLIC_CONTACT_PHONE_DISPLAY || "+92 346 1223692",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923461223692",
  location: "Islamabad, Pakistan",
  keywords: [
    "Zaheen Zuberi",
    "Patchbay",
    "AI automation agency Islamabad",
    "AI chatbot developer Pakistan",
    "voice agent developer",
    "calling agent developer",
    "full-stack web developer Islamabad",
    "web developer in Islamabad",
    "web developers in Islamabad",
    "website development Pakistan",
    "full-stack websites",
    "marketing agency Islamabad",
    "social media management Pakistan",
    "n8n automation developer",
    "Next.js developer Pakistan",
  ],
};

export const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}`;
