import { FAQ_CATEGORIES, type FaqCategory } from "./all-faqs";

// Per-category page metadata for the /faq/[slug] spokes.
//
// Kept as a separate map keyed by category id rather than as extra fields on
// FAQ_CATEGORIES itself, deliberately: all-faqs.ts is a 950-line content
// file and this is routing/SEO concern, not content. Joining them here means
// adding a category there is a content edit, and giving it a page is one
// entry here, with the type system catching a category that has one and not
// the other (see the throw in faqCategoryPages below).
//
// Why these pages exist at all: all 216 answers used to live on /faq alone,
// so 11 distinct query clusters (pricing, voice agents, Islamabad, hiring
// remotely) competed for one URL's worth of ranking. Each category is 16 to
// 22 questions, which is a real page, not thin content. /faq is now a hub
// that links here instead of repeating the answers, so no answer exists at
// two URLs and the spokes never compete with their own hub.
//
// Same copy rules as everywhere else on this site: no em dashes, no invented
// prices or results, team-framed.
type FaqCategoryMeta = {
  /** URL segment. Where a category maps onto a real service, this matches
   *  that service's slug so /faq/<x> and /services/<x> read as a pair. */
  slug: string;
  /** layout.tsx appends " | Patchbay" to every title, so the real budget
   *  here is roughly 49 characters, not 60. */
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  /** Service pages this category should hand a visitor off to. A person who
   *  read the pricing answers is one click from the thing they want quoted,
   *  and the descriptive anchor tells a crawler what the target is about. */
  relatedServices: string[];
};

const FAQ_CATEGORY_META: Record<string, FaqCategoryMeta> = {
  pricing: {
    slug: "pricing",
    metaTitle: "How Much Do AI Agents & Websites Cost?",
    metaDescription:
      "What a chatbot, voice agent, or full website actually costs, what drives the number up or down, and what you keep paying for after launch.",
    h1: "What this actually costs.",
    intro:
      "The most common question, answered properly. No range that fits nobody, no price list that ignores what your project needs to do. Here is what drives the number, what is included, and what carries on costing money after launch.",
    relatedServices: ["ai-voice-agents", "ai-chatbots", "web-development"],
  },
  process: {
    slug: "process",
    metaTitle: "How a Build Works: Process & Timelines",
    metaDescription:
      "What happens between the first message and a finished build: scoping, timelines, revisions, handover, and who you are actually talking to.",
    h1: "How a project actually runs.",
    intro:
      "What happens between your first message and a finished build. Who you talk to, how scope gets agreed, what a realistic timeline looks like, and what handover means when the work is done.",
    relatedServices: ["web-development", "ai-chatbots", "business-automation"],
  },
  voice: {
    slug: "ai-voice-agents",
    metaTitle: "AI Voice Agent FAQs: Cost, Setup, Calls",
    metaDescription:
      "How AI voice agents handle real calls: what they can answer, how they transfer to a human, what they cost to run, and how long setup takes.",
    h1: "AI voice agents, answered.",
    intro:
      "What a voice agent can and cannot do on a real phone line. How it handles a caller it cannot help, what happens to your existing number, and what the ongoing cost per call actually depends on.",
    relatedServices: ["ai-voice-agents", "ai-chatbots"],
  },
  chatbots: {
    slug: "ai-chatbots",
    metaTitle: "AI Chatbot FAQs: WhatsApp, Web, Training",
    metaDescription:
      "How a custom AI chatbot gets trained on your content, where it can run, what it does with a question it cannot answer, and what it costs.",
    h1: "AI chatbots, answered.",
    intro:
      "What it takes to put a chatbot on your site, WhatsApp, or Instagram that answers from your own content instead of guessing. What it does when it does not know, and who sees the conversations.",
    relatedServices: ["ai-chatbots", "ai-voice-agents"],
  },
  automation: {
    slug: "business-automation",
    metaTitle: "Business Automation FAQs: n8n & Zapier",
    metaDescription:
      "Which parts of a business are worth automating, what connects to what, what happens when a workflow breaks, and who owns it afterward.",
    h1: "Automation, answered.",
    intro:
      "Which manual work is genuinely worth automating and which is not. What can connect to your CRM, calendar, forms and invoicing, what happens when something breaks at 2am, and who owns the workflows after handover.",
    relatedServices: ["business-automation", "ai-chatbots"],
  },
  web: {
    slug: "web-development",
    metaTitle: "Web Development FAQs: Stack, SEO, Speed",
    metaDescription:
      "What gets built, on what stack, how long it takes, who owns the code, and why a hand-built site beats a page builder on speed and SEO.",
    h1: "Web development, answered.",
    intro:
      "What a full-stack build involves, why the stack is chosen rather than defaulted to, and what you own at the end of it. Including the honest version of how long a real site takes.",
    relatedServices: ["web-development", "marketing-and-social"],
  },
  marketing: {
    slug: "marketing-and-social",
    metaTitle: "Social Media & Content FAQs",
    metaDescription:
      "How daily social management works, who writes and designs the content, what reporting you get, and what results are realistic to expect.",
    h1: "Brand, content and social, answered.",
    intro:
      "What day to day social management actually covers, who makes the content, and what the reporting looks like. Including what is realistic to expect in the first few months.",
    relatedServices: ["marketing-and-social", "web-development"],
  },
  team: {
    slug: "working-together",
    metaTitle: "Working With Us: Team, Trust, Ownership",
    metaDescription:
      "Who is on the team, who you actually deal with, what happens if someone leaves mid-project, and what you own when the work is finished.",
    h1: "Who you are working with.",
    intro:
      "Patchbay is one accountable team, not an account manager passing work to strangers. Here is who does what, who you speak to day to day, and what happens to your project if something changes on our side.",
    relatedServices: ["web-development", "marketing-and-social", "ai-chatbots"],
  },
  technical: {
    slug: "technical-and-security",
    metaTitle: "Technical FAQs: Data, Security, Hosting",
    metaDescription:
      "Where your data lives, who can see it, how hosting and backups work, and what happens to an AI agent's conversation history.",
    h1: "Data, security and the technical detail.",
    intro:
      "Where your data actually sits, who has access to it, and what happens to the conversations an AI agent has with your customers. Plus hosting, backups, and what breaks if a provider goes down.",
    relatedServices: ["web-development", "business-automation"],
  },
  remote: {
    slug: "hiring-remotely",
    metaTitle: "Hiring a Remote Team in Pakistan: FAQs",
    metaDescription:
      "Working with a Pakistan-based team from the UK, US, or Gulf: time zones, contracts, payment, communication, and how the work gets checked.",
    h1: "Hiring a team based in Pakistan.",
    intro:
      "The practical questions that come up when the team you are hiring is in a different country. Time zone overlap, how contracts and payment work, and what accountability looks like when nobody is in the same room.",
    relatedServices: ["web-development", "marketing-and-social"],
  },
  local: {
    slug: "islamabad",
    metaTitle: "AI & Web Services in Islamabad: FAQs",
    metaDescription:
      "Working with an Islamabad-based team: meeting in person, local businesses served, payment in PKR, and support for Urdu speaking customers.",
    h1: "Working with us in Islamabad.",
    intro:
      "For businesses in Islamabad and Rawalpindi. Whether we meet in person, what local work looks like, how payment works in PKR, and what happens when your customers speak Urdu.",
    relatedServices: [
      "web-development",
      "ai-voice-agents",
      "marketing-and-social",
    ],
  },
};

export type FaqCategoryPage = FaqCategory & FaqCategoryMeta;

/** Every FAQ category joined with its page metadata, in the same order as
 *  the content file. Throws at module load rather than silently dropping a
 *  category, so adding one to all-faqs.ts without a slug here fails the
 *  build instead of quietly shipping a page that does not exist and a hub
 *  card that links to a 404. */
export const faqCategoryPages: FaqCategoryPage[] = FAQ_CATEGORIES.map((cat) => {
  const meta = FAQ_CATEGORY_META[cat.id];
  if (!meta) {
    throw new Error(
      `FAQ category "${cat.id}" has no page metadata in faq-categories.ts. ` +
        `Add an entry to FAQ_CATEGORY_META or the hub will link to a 404.`,
    );
  }
  return { ...cat, ...meta };
});

export function getFaqCategory(slug: string) {
  return faqCategoryPages.find((c) => c.slug === slug);
}
