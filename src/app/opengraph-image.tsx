import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image";

// This file used to be a standalone, hand-written duplicate of the template
// in src/lib/og-image.tsx, predating that shared module. It never got
// migrated when the other four opengraph-image routes did, so the homepage
// card, the one actually shared most often, silently drifted: no logo, no
// 3-day cache headers, different layout from every other card on the site.
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Patchbay, AI Automation, Chatbots & Full-Stack Websites";

export default async function Image() {
  return renderOgImage({
    marker: "HOME",
    title: "One team. Every channel.",
    subtitle:
      "AI voice agents, chatbots, automation, and full-stack websites, run by Zaheen Zuberi in Islamabad.",
  });
}
