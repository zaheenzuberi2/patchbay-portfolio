import type { ServiceFaq } from "./services";

// Written against the queries buyers actually type before they buy: cost,
// timeline, trust, and "who's actually behind this". Answers are
// deliberately specific and claim-free. No invented prices or results.
export const homeFaqs: ServiceFaq[] = [
  {
    q: "How much does an AI chatbot or voice agent cost?",
    a: "It depends entirely on what kind of project it is, because every business needs something different. A bot answering a fixed set of questions is a fraction of the cost of one trained on your full document set and wired into a CRM. The goal here is growing your business, not selling you a package, so the first conversation is about whether we are the right fit for what you actually need. From there you get a real quote for your specific project rather than a range that fits nobody.",
  },
  {
    q: "How much does a website cost?",
    a: "It depends on whether the site displays information or runs a process. A marketing site for a small firm and a booking platform with user accounts and dashboards are different projects. Once I know what the site has to do, the quote is fixed, so the number does not move on you mid-project.",
  },
  {
    q: "How long does a project take?",
    a: "A focused chatbot or voice agent is usually days. A marketing website is weeks. Anything with accounts, payments, or deep integrations takes longer. I would rather give you a real date after understanding the scope than a fast answer I have to walk back later.",
  },
  {
    q: "Is it really one team handling both the marketing and the development?",
    a: "Yes, and that is the actual advantage over a traditional agency. Instead of an account manager, a separate design agency, and a subcontracted developer who never talk to each other, Patchbay runs it as one team: I lead the project end to end, and the specialist who owns each part, design, copy, SEO, or the build, works from the same brief instead of a handoff. Nothing gets lost between three companies billing you separately.",
  },
  {
    q: "Do you work with clients outside Pakistan?",
    a: "Yes. The work is remote by nature and I already run a product used by creators internationally. Being based in Islamabad mainly means my rates are lower than an equivalent agency in the US or UK, not that the work is limited to Pakistan.",
  },
  {
    q: "Do I own what you build?",
    a: "Yes. Code, automations, and accounts are yours, documented at handover, running on your own subscriptions. If you stop working with me, everything keeps running and another developer can pick it up.",
  },
  {
    q: "What do you need from me to start?",
    a: "A description of the problem, not a spec. Most people come with a task that eats their week rather than a technical requirement, which is the right place to start. From there I scope it, quote it, and tell you honestly if automation is the wrong tool for it.",
  },
  {
    q: "Does AI write and run everything, or does a real person handle it?",
    a: "The team builds it first. AI is used to speed up that first pass, drafting a bot's answers, a piece of copy, or an automation's logic, and to catch the obvious mistakes before a human even looks at it. From there it goes to whoever actually owns that part: the SEO specialist checks anything that touches rankings, the designer checks anything visual, a developer checks the code that ships. Nothing goes live on AI output alone.",
  },
  {
    q: "What happens to my data when it goes through an AI model?",
    a: "It stays yours. Anything processed through AI goes through the provider's standard API, not a public chat product, and is not used to train their models. Access on our side is limited to the people actually working on your project, and nothing is shared beyond what a task needs.",
  },
];
