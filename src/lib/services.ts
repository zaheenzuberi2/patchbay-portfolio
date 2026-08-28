// Each service gets its own indexable page so it can rank for its own query
// cluster. A single-page site competes for one set of terms; five pages
// compete for five. Copy here is the page content, so keep it specific and
// claim-free (no invented prices, client counts, or results).

export type ServiceFaq = { q: string; a: string };

export type Service = {
  slug: string;
  channel: string;
  name: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  intro: string;
  outcomes: string[];
  includes: { title: string; body: string }[];
  stack: string[];
  goodFor: string;
  faqs: ServiceFaq[];
  roles: import("./team").TeamRoleKey[];
};

export const services: Service[] = [
  {
    slug: "ai-voice-agents",
    channel: "01",
    name: "AI Voice & Calling Agents",
    h1: "AI voice agents that answer the phone and book the work",
    metaTitle: "AI Voice Agent Development | Receptionist",
    metaDescription:
      "AI voice agents that answer calls, qualify callers, and book appointments automatically. Built end to end by Zaheen Zuberi. Get a demo today.",
    keywords: [
      "AI voice agent development",
      "AI receptionist",
      "AI phone answering service",
      "calling agent development",
      "automated appointment booking",
      "Twilio voice agent developer",
      "AI voice agent developer Islamabad",
      "AI receptionist for small business",
      "AI answering service",
      "virtual receptionist",
      "24/7 phone answering AI",
      "inbound call automation",
      "AI call center agent",
      "voicemail alternative for business",
    ],
    intro:
      "Most businesses lose work simply because nobody picked up. A voice agent answers on the first ring, every time, at 2am and on public holidays. It speaks naturally, understands why the person is calling, answers what it can, books what it should, and hands you a written summary of the ones that matter.",
    outcomes: [
      "Every inbound call answered, including after hours and weekends",
      "Callers qualified against your own script before they reach you",
      "Appointments written straight into your calendar",
      "A written summary and recording of each call in your inbox or CRM",
      "Escalation to a human the moment the call needs one",
    ],
    includes: [
      {
        title: "Call flow design",
        body: "We map what your callers actually ask and what a good outcome looks like, then write the agent around that instead of a generic script.",
      },
      {
        title: "Natural voice setup",
        body: "Voice selection and tuning so the agent sounds like your business, including handling for Urdu and English callers.",
      },
      {
        title: "Calendar and CRM wiring",
        body: "Bookings land in the real calendar. Contact details and call summaries land in the real CRM. No copy-paste step.",
      },
      {
        title: "Escalation rules",
        body: "Clear rules for when the agent transfers to a person, takes a message, or flags the call as urgent.",
      },
      {
        title: "Monitoring after launch",
        body: "Call logs reviewed after go-live so the agent gets corrected on the calls it handled badly.",
      },
    ],
    stack: ["Twilio", "Vapi", "Whisper", "Neural TTS", "Webhooks"],
    roles: ["lead", "dev"],
    goodFor:
      "Clinics, law firms, salons, real estate offices, and service businesses where a missed call is a lost customer.",
    faqs: [
      {
        q: "How much does an AI voice agent cost?",
        a: "Cost has two parts: a one-time build and an ongoing per-minute usage charge from the telephony and voice providers. The build depends on how many call types the agent handles and what it connects to, so the honest answer is that a single-purpose booking agent is a fraction of the cost of one handling many workflows. Tell me what the agent needs to do and I will quote the specific number rather than a range that fits nobody.",
      },
      {
        q: "Will callers know they are talking to an AI?",
        a: "Modern voice models sound close to human, and many callers do not notice. I recommend disclosing it anyway, both because it is the right thing to do and because callers respond better once they know they can ask for a person.",
      },
      {
        q: "Can it handle Urdu as well as English?",
        a: "Yes. Language handling is part of the setup, including callers who switch between Urdu and English mid-sentence, which is normal in Pakistan and something generic international tools handle badly.",
      },
      {
        q: "What happens if the agent cannot answer something?",
        a: "It follows the escalation rules we agree on: transfer to a person, take a message and promise a callback, or flag the call as urgent. It should never guess at an answer it does not have.",
      },
      {
        q: "How long does it take to build?",
        a: "A focused agent handling one clear job is a matter of days. Multi-workflow agents with deep CRM integration take longer. The first conversation gives you a real timeline, not a placeholder.",
      },
      {
        q: "What is the difference between an AI voice agent and a regular answering service?",
        a: "A regular answering service routes calls to a human operator following a script, with real per-minute staffing costs and hours the operator can actually work. An AI voice agent answers instantly at any hour, follows a script built around your business specifically, and writes structured data straight into your calendar or CRM instead of a message being relayed manually.",
      },
      {
        q: "Is an AI receptionist better than voicemail?",
        a: "Voicemail asks the caller to leave a message and wait, and a lot of callers who hit voicemail just hang up and call the next business instead. An AI receptionist answers live, so the call gets handled in the moment rather than becoming a callback that may never happen.",
      },
      {
        q: "Can an AI voice agent handle a high call volume, like a busy clinic or salon?",
        a: "Yes, handling volume is one of the real advantages over a human line, since the agent takes multiple calls at once with no hold queue, which a single receptionist physically cannot do during a rush.",
      },
      {
        q: "What is the difference between an AI voice agent and an AI receptionist?",
        a: "In practice both terms describe the same thing, a phone answering AI agent. Some businesses say receptionist because it maps to a role they already know, others say voice agent because it can also handle outbound calling and workflows beyond just answering. The build itself is the same either way.",
      },
      {
        q: "Do AI call center agents replace human agents entirely?",
        a: "Not usually, and that is not the recommendation here either. The agent handles first contact, qualification, and routine bookings, and hands anything needing judgment or an existing relationship to a person, so the escalation rules matter as much as the agent itself.",
      },
      {
        q: "Who is the best AI calling agent developer in Islamabad?",
        a: "Rather than claim a title nobody can independently verify, the honest test is the build itself: a real voice demo you can hear on this page, the actual escalation logic and CRM wiring explained rather than left vague, and a team based in Islamabad you can meet in person. Judge it on that, not on a claim.",
      },
      {
        q: "Is there a voice agent developer based in Islamabad I can talk to directly?",
        a: "Yes. Patchbay is based in Islamabad, and voice agent development is handled by the same team you would be talking to about the project, not handed off to an outsourced developer elsewhere.",
      },
    ],
  },
  {
    slug: "ai-chatbots",
    channel: "02",
    name: "AI Chatbots & Conversational AI",
    h1: "Chatbots that resolve the question instead of deflecting it",
    metaTitle: "AI Chatbot Development | WhatsApp & Web",
    metaDescription:
      "Custom AI chatbots for websites, WhatsApp, and Instagram — trained on your content, qualifying leads around the clock. See how it works.",
    keywords: [
      "AI chatbot development",
      "WhatsApp chatbot development",
      "website chatbot for business",
      "custom chatbot developer",
      "customer support automation",
      "RAG chatbot",
      "chatbot developer Pakistan",
      "AI chatbot for small business",
    ],
    intro:
      "The chatbots people hate are the ones that answer every question with a link to the contact page. A useful bot is trained on your actual content, gives the actual answer, and knows when to stop and fetch a human. That is the difference between deflecting customers and serving them.",
    outcomes: [
      "Repeat questions answered instantly, day or night",
      "Answers grounded in your own documents and pricing, not guesses",
      "Leads qualified and captured before they leave the page",
      "Clean handoff to a human with the conversation attached",
      "Fewer support messages reaching you at all",
    ],
    includes: [
      {
        title: "Knowledge setup",
        body: "Your documents, FAQs, policies, and pricing loaded so the bot answers from your material rather than inventing an answer.",
      },
      {
        title: "Channel deployment",
        body: "Deployed where your customers already are: your website, WhatsApp, or Instagram DMs.",
      },
      {
        title: "Lead capture",
        body: "Name, contact, and intent captured mid-conversation and pushed to your CRM or inbox.",
      },
      {
        title: "Human handoff",
        body: "A clear route to a person, carrying the full conversation so the customer never repeats themselves.",
      },
      {
        title: "Guardrails",
        body: "Limits on what the bot will discuss, so it does not answer questions it has no business answering.",
      },
    ],
    stack: ["GPT-4", "RAG", "LangChain", "WhatsApp API", "Vector search"],
    roles: ["lead", "dev"],
    goodFor:
      "Ecommerce stores, service businesses, and any team answering the same twenty questions every week.",
    faqs: [
      {
        q: "How much does a chatbot cost to build?",
        a: "A simple bot answering a fixed set of questions is materially cheaper than one trained on your full document set and wired into a CRM. There is also a small ongoing cost per conversation from the AI provider. I quote the build once I know which of those you actually need.",
      },
      {
        q: "Will it make things up?",
        a: "That is the main risk with a badly built bot. The fix is grounding it in your real content and adding guardrails so that when it does not know, it says so and offers a human instead of guessing. That behaviour is part of the build, not an extra.",
      },
      {
        q: "Can it work on WhatsApp?",
        a: "Yes, through the WhatsApp Business API. For most businesses in Pakistan, WhatsApp is where customers actually message, so it is often the first channel worth deploying rather than the website.",
      },
      {
        q: "Do I need to maintain it myself?",
        a: "No. When your content changes, the knowledge base needs updating, and that can either sit with me or be handed over with instructions so your team can do it. Your call.",
      },
    ],
  },
  {
    slug: "business-automation",
    channel: "03",
    name: "Automation & Workflows",
    h1: "Automation that removes the copy-paste from your week",
    metaTitle: "Business Process Automation | n8n, Zapier",
    metaDescription:
      "Workflow automation that connects your CRM, calendar, forms, and invoicing so nothing needs manual re-entry. n8n, Zapier, Make, and custom API integrations.",
    keywords: [
      "business process automation",
      "workflow automation services",
      "n8n developer",
      "Zapier automation expert",
      "CRM automation",
      "lead routing automation",
      "business automation agency Pakistan",
      "automation consultant for small business",
    ],
    intro:
      "Most businesses do not have a software problem, they have a plumbing problem. The lead arrives in one place, the calendar lives in another, the invoice lives in a third, and a person spends their week carrying data between them. Automation is just removing that person from the middle.",
    outcomes: [
      "Leads scored, enriched, and routed the moment they arrive",
      "No manual re-entry between your forms, CRM, and calendar",
      "Follow-ups that fire on their own instead of being remembered",
      "Invoices and reports generated on a schedule",
      "A clear log of what ran, so failures surface instead of hiding",
    ],
    includes: [
      {
        title: "Workflow audit",
        body: "We find where time actually leaks, which is usually not where you expect, before automating anything.",
      },
      {
        title: "Integration build",
        body: "Your existing tools connected, whether they have a ready integration or need a custom API bridge.",
      },
      {
        title: "Error handling",
        body: "Retries and alerts so a failed run tells someone instead of silently dropping a lead.",
      },
      {
        title: "Documentation",
        body: "A written map of what runs, when, and what to do if it breaks. You are not locked to me.",
      },
    ],
    stack: ["n8n", "Zapier", "Make", "Webhooks", "REST APIs"],
    roles: ["lead", "dev"],
    goodFor:
      "Agencies, clinics, and sales teams where the same data gets typed into three systems a day.",
    faqs: [
      {
        q: "Which tools can you connect?",
        a: "Anything with an API, plus the hundreds of apps that n8n, Zapier, and Make already support out of the box. If a tool has no API at all, I will tell you that upfront rather than building something fragile around it.",
      },
      {
        q: "What does automation actually save?",
        a: "The honest measure is hours per week on a specific task, not a percentage from a case study. In the audit we count the task before automating it so you can judge the result against a real number.",
      },
      {
        q: "What if it breaks?",
        a: "Automations fail when an upstream tool changes. Builds include error alerts so you find out from a notification rather than from a customer, and the documentation covers common fixes.",
      },
      {
        q: "Do I own the automations?",
        a: "Yes. They run in your accounts, on your subscriptions, documented. If you stop working with me, they keep running.",
      },
    ],
  },
  {
    slug: "web-development",
    channel: "04",
    name: "Full-Stack Website Development",
    // Rewritten to lead with the exact phrase "web developer in Islamabad"
    // in the H1 and at the front of the title tag, both of which still
    // carry real weight for a specific local commercial query. Everything
    // claimed here was already true; this is a phrasing change, not a new
    // claim.
    h1: "A web developer in Islamabad who builds the whole stack",
    metaTitle: "Web Developer in Islamabad | Full-Stack",
    metaDescription:
      "Full-stack websites built end to end by Zaheen Zuberi: Next.js, TypeScript, real SEO, real speed, no page-builder bloat. View recent projects.",
    keywords: [
      "web developer in Islamabad",
      "web developers in Islamabad",
      "full-stack website development",
      "website development Islamabad",
      "web developer Pakistan",
      "Next.js developer for hire",
      "custom web application development",
      "business website design",
      "full-stack developer Islamabad",
      "web developer for small business Pakistan",
    ],
    intro:
      "Based in Islamabad, working with clients across Pakistan and internationally. A website built on a page builder looks fine until it needs to do something: take a booking, sync to a CRM, handle a thousand visitors at once, or rank for anything. I build sites the whole way down, so the thing you can see and the thing running underneath are both yours and both fast.",
    outcomes: [
      "A site that loads fast on a phone on mobile data, not just on your laptop",
      "SEO built in from the start, not bolted on later",
      "Forms and bookings wired to where the data actually needs to go",
      "Content you can update without calling a developer",
      "Code you own outright, no platform lock-in",
    ],
    includes: [
      {
        title: "Design and build",
        body: "Designed and built to fit your business rather than dropped into a template everyone else is using.",
      },
      {
        title: "Backend and database",
        body: "Bookings, accounts, dashboards, and admin tools where the site needs to do more than display pages.",
      },
      {
        title: "Technical SEO",
        body: "Metadata, structured data, sitemap, and clean page structure at build time, which is the only cheap time to do it.",
      },
      {
        title: "Performance",
        body: "Optimised images and fast server rendering, because slow pages lose both visitors and rankings.",
      },
      {
        title: "Handover",
        body: "Deployed, documented, and explained, so your team can run it.",
      },
    ],
    stack: ["Next.js", "TypeScript", "React", "PostgreSQL", "Node"],
    roles: ["lead", "dev", "uiux"],
    goodFor:
      "Law firms, clinics, agencies, and product teams who need the site to do a job, not just exist.",
    faqs: [
      {
        q: "Are you a web developer based in Islamabad?",
        a: "Yes. Based in Islamabad, working in person with local clients and remotely with clients across Pakistan and internationally. Lex Justitia and AB Juris, both real law firm builds, are live sites you can visit, not case studies dressed up for a pitch.",
      },
      {
        q: "How much does a website cost?",
        a: "It depends almost entirely on whether the site displays information or runs a process. A well-built brochure site for a small firm and a booking platform with accounts and dashboards are different projects with different numbers. Tell me what the site has to do and you get a fixed quote.",
      },
      {
        q: "How long does a website take?",
        a: "A focused marketing site is measured in weeks. Anything with accounts, payments, or dashboards takes longer. I would rather give you a real date after understanding the scope than a fast answer I have to walk back.",
      },
      {
        q: "Will it rank on Google?",
        a: "The technical foundation is fully in my control and I build it properly: structure, speed, metadata, and structured data. Ranking also depends on domain age, backlinks, and competition, which no developer can promise. Anyone guaranteeing you a number one ranking is selling something.",
      },
      {
        q: "Can you work with my existing site?",
        a: "Sometimes. If it is on a platform worth keeping, I will improve it. If it is fighting you, I will say that and explain what rebuilding would cost instead of quietly billing hours against a losing position.",
      },
    ],
  },
  {
    slug: "marketing-and-social",
    channel: "05",
    name: "Brand, Content & Social",
    h1: "The marketing an agency would run, without the agency",
    metaTitle: "Social Media Management | Islamabad",
    metaDescription:
      "Brand, content, and daily social media management, plus the reporting most agencies skip. Run end to end by one accountable team. Start today.",
    keywords: [
      "social media management Pakistan",
      "marketing agency Islamabad",
      "content marketing services",
      "brand identity design",
      "social media manager for business",
      "campaign reporting dashboard",
      "social media agency for small business",
      "brand and content agency Pakistan",
    ],
    intro:
      "Agencies split your work across an account manager, a designer, a copywriter, and a media buyer, then charge you for the coordination between them. I do the same work without the layer in between, which means fewer meetings and a shorter line between a decision and it being live.",
    outcomes: [
      "Accounts posted to consistently instead of in bursts",
      "Copy and creative that sound like your business",
      "Campaigns reported against revenue, not vanity metrics",
      "One team accountable, the same specialists on your work every time, not a rotating account team",
    ],
    includes: [
      {
        title: "Brand and identity",
        body: "The visual and verbal basics: how you look, how you sound, and staying consistent across channels.",
      },
      {
        title: "Content and posting",
        body: "Content planned, produced, and actually published on a schedule you can rely on.",
      },
      {
        title: "Day-to-day management",
        body: "The account run properly, including replies and comments, not just scheduled posts into a void.",
      },
      {
        title: "Reporting that means something",
        body: "Dashboards tied to leads and revenue, wired into your stack rather than assembled by hand each month.",
      },
    ],
    stack: ["Content", "Social management", "Design", "Copy", "Analytics"],
    roles: ["lead", "uiux", "copy", "seo", "growth", "data"],
    goodFor:
      "Businesses that need a marketing function but not a marketing department.",
    faqs: [
      {
        q: "Do you handle both the marketing and the technical side?",
        a: "Yes, and that is the main reason to work with Patchbay rather than a traditional agency. When a campaign needs a landing page, a chatbot to qualify the traffic, and automation to route the leads, that is one team building all three instead of an agency subcontracting two of them out to other companies.",
      },
      {
        q: "How is this priced?",
        a: "Social management is usually a monthly retainer, project work is quoted per project. Scope drives it, so the number comes after we talk about what you actually need run.",
      },
      {
        q: "Can I start with just one channel?",
        a: "Yes, and I would usually recommend it. Doing one channel properly beats spreading thin across four.",
      },
    ],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
