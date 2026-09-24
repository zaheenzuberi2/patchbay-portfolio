// City landing pages for the two cities already named in StructuredData's
// areaServed and in the web-development FAQ ("Do you work with businesses
// in Lahore or Karachi") — this gives that same real fact its own indexable
// URL instead of leaving it as one FAQ answer on a different page's URL.
// Same claim-free rule as services.ts: no physical office in either city,
// remote-friendly is the honest framing throughout, matching what the
// business node's address actually says (Islamabad).

export type LocationFaq = { q: string; a: string };

export type Location = {
  slug: string;
  city: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  intro: string;
  covers: string[];
  faqs: LocationFaq[];
};

export const locations: Location[] = [
  {
    slug: "lahore",
    city: "Lahore",
    h1: "AI automation, web development, and software for Lahore businesses",
    metaTitle: "AI Automation & Web Developer for Lahore",
    metaDescription:
      "AI voice agents, chatbots, automation, web development, and custom software for businesses in Lahore, delivered remotely by an Islamabad-based team led by Zaheen Zuberi.",
    keywords: [
      "web developer in Lahore",
      "AI automation Lahore",
      "AI chatbot developer Lahore",
      "software house Lahore",
      "business automation Lahore",
      "social media agency Lahore",
      "web development company Lahore",
    ],
    intro:
      "Based in Islamabad, working with businesses in Lahore the same way as everywhere else: calls, a shared project board, and a live preview or demo link instead of in-person meetings. Distance affects nothing about how the work gets scoped, built, or handed over.",
    covers: [
      "AI voice agents that answer and qualify calls for a Lahore business around the clock",
      "AI chatbots trained on your own content for your website or WhatsApp",
      "Workflow automation connecting the CRM, calendar, and invoicing tools you already use",
      "Full-stack websites built end to end, not assembled from a page builder",
      "Custom software and internal tools for the parts of the business a website can't run",
      "Custom bots for Discord, Telegram, Slack, or a repetitive form",
      "Brand, content, and social media management run as one accountable team",
    ],
    faqs: [
      {
        q: "Do you work with businesses in Lahore even though you're based in Islamabad?",
        a: "Yes. The base is Islamabad, but every part of the process, the discovery call, the quote, the build, the handover, works the same for a Lahore client as it does locally. Nothing about the process assumes you're in the same city.",
      },
      {
        q: "Is there a difference in cost or timeline for a Lahore client versus an Islamabad one?",
        a: "No. Pricing is scoped to what the project needs to do, not where the client is based. The only thing that changes for a remote client is that meetings happen over a call instead of in person.",
      },
      {
        q: "Can I see the work before committing, without traveling to Islamabad?",
        a: "Yes. Live projects like Lex Justitia and AB Juris, both real law firm builds, are sites you can visit directly. During a build itself, you get a live preview or demo link to check progress, not a single reveal at the end.",
      },
      {
        q: "Which service is the right starting point for a Lahore business?",
        a: "It depends on where the actual time is being lost: missed calls point to an AI voice agent, repeat questions point to a chatbot, manual data entry points to automation, and an outdated or non-functional site points to a rebuild. Describe what's slow or breaking and the right starting point becomes obvious.",
      },
    ],
  },
  {
    slug: "karachi",
    city: "Karachi",
    h1: "AI automation, web development, and software for Karachi businesses",
    metaTitle: "AI Automation & Web Developer for Karachi",
    metaDescription:
      "AI voice agents, chatbots, automation, web development, and custom software for businesses in Karachi, delivered remotely by an Islamabad-based team led by Zaheen Zuberi.",
    keywords: [
      "web developer in Karachi",
      "AI automation Karachi",
      "AI chatbot developer Karachi",
      "software house Karachi",
      "business automation Karachi",
      "social media agency Karachi",
      "web development company Karachi",
    ],
    intro:
      "Based in Islamabad, working with businesses in Karachi the same way as everywhere else: calls, a shared project board, and a live preview or demo link instead of in-person meetings. Distance affects nothing about how the work gets scoped, built, or handed over.",
    covers: [
      "AI voice agents that answer and qualify calls for a Karachi business around the clock",
      "AI chatbots trained on your own content for your website or WhatsApp",
      "Workflow automation connecting the CRM, calendar, and invoicing tools you already use",
      "Full-stack websites built end to end, not assembled from a page builder",
      "Custom software and internal tools for the parts of the business a website can't run",
      "Custom bots for Discord, Telegram, Slack, or a repetitive form",
      "Brand, content, and social media management run as one accountable team",
    ],
    faqs: [
      {
        q: "Do you work with businesses in Karachi even though you're based in Islamabad?",
        a: "Yes. The base is Islamabad, but every part of the process, the discovery call, the quote, the build, the handover, works the same for a Karachi client as it does locally. Nothing about the process assumes you're in the same city.",
      },
      {
        q: "Is there a difference in cost or timeline for a Karachi client versus an Islamabad one?",
        a: "No. Pricing is scoped to what the project needs to do, not where the client is based. The only thing that changes for a remote client is that meetings happen over a call instead of in person.",
      },
      {
        q: "Can I see the work before committing, without traveling to Islamabad?",
        a: "Yes. Live projects like Lex Justitia and AB Juris, both real law firm builds, are sites you can visit directly. During a build itself, you get a live preview or demo link to check progress, not a single reveal at the end.",
      },
      {
        q: "Which service is the right starting point for a Karachi business?",
        a: "It depends on where the actual time is being lost: missed calls point to an AI voice agent, repeat questions point to a chatbot, manual data entry points to automation, and an outdated or non-functional site points to a rebuild. Describe what's slow or breaking and the right starting point becomes obvious.",
      },
    ],
  },
];

export function getLocation(slug: string) {
  return locations.find((l) => l.slug === slug);
}
