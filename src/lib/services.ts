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
    h1: "An AI receptionist that answers, qualifies, and books 24/7",
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
      "AI voice agents for businesses",
      "AI voice agent developer Pakistan",
    ],
    intro:
      "Most businesses lose work simply because nobody picked up. An AI receptionist answers on the first ring, 24/7, weekends and public holidays included. It speaks naturally, qualifies the caller against your own script, books what it should straight into your calendar, and follows up automatically on anything left open, then hands you a written summary of the ones that matter.",
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
        q: "Are AI voice agents only worth it for large companies?",
        a: "No. AI voice agents for businesses scale down as cleanly as they scale up: a single-location clinic or salon gets the same never-miss-a-call coverage as a larger team, just with a smaller call volume and a smaller monthly cost to match.",
      },
      {
        q: "Who is the best AI calling agent developer in Islamabad?",
        a: "Rather than claim a title nobody can independently verify, the honest test is the build itself: a real voice demo you can hear on this page, the actual escalation logic and CRM wiring explained rather than left vague, and a team based in Islamabad you can meet in person. Judge it on that, not on a claim.",
      },
      {
        q: "Is there a voice agent developer based in Islamabad I can talk to directly?",
        a: "Yes. Patchbay is based in Islamabad, and voice agent development is handled by the same team you would be talking to about the project, not handed off to an outsourced developer elsewhere.",
      },
      {
        q: "Is there an AI voice agent developer in Pakistan who works outside Islamabad?",
        a: "Yes. The base is Islamabad, but voice agent builds are remote-friendly end to end: a call-flow discovery call, a real voice demo you can hear before committing, and a shared project board instead of in-person meetings. Clients across Pakistan, and internationally, are handled the same way.",
      },
      {
        q: "Is there a single developer building AI voice agents in Islamabad, not an agency?",
        a: "Yes. Zaheen Zuberi is the one point of contact for a voice agent build, from the first call flow question through the demo you hear on this page, not an account manager passing your project to someone else. A small team backs him on design and copy, but the person scoping and building the agent is the one you talk to.",
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
      "Custom AI chatbots for websites, WhatsApp, and Instagram, trained on your content, qualifying leads around the clock. See how it works.",
    keywords: [
      "AI chatbot development",
      "WhatsApp chatbot development",
      "website chatbot for business",
      "custom chatbot developer",
      "customer support automation",
      "RAG chatbot",
      "chatbot developer Pakistan",
      "AI chatbot for small business",
      "AI chatbot developer Islamabad",
      "chatbot vs live chat software",
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
      {
        q: "Is a chatbot better than live chat software?",
        a: "Live chat software still needs a person on the other end during working hours, or a queue when nobody is. A trained chatbot answers instantly at any hour from your actual content, and only hands off to a person for the questions that genuinely need one, so the live chat window stops being a second inbox to staff.",
      },
      {
        q: "Do I still need a chatbot if I already have a support team?",
        a: "Usually yes, for the repeat questions rather than to replace the team. Most support inboxes are the same twenty questions asked on a loop. A chatbot clears those instantly so your team spends its time on the conversations that actually need a person's judgment.",
      },
      {
        q: "Is there a chatbot developer based in Islamabad I can talk to directly?",
        a: "Yes. Patchbay is based in Islamabad, and chatbot development is handled by the same team you would be talking to about the project, not handed off to an outsourced developer elsewhere.",
      },
      {
        q: "Is there a chatbot developer in Pakistan who works with clients outside Islamabad?",
        a: "Yes. The base is Islamabad, but chatbot builds are remote-friendly end to end: calls, a shared project board, and a working demo link instead of in-person meetings. Clients across Pakistan, and internationally, are handled the same way.",
      },
      {
        q: "Is there a single developer building AI chatbots in Islamabad I can hire directly?",
        a: "Yes. Zaheen Zuberi is the one point of contact for a chatbot build, from scoping the knowledge base through deployment, not an account manager relaying your requirements to someone else. A small team backs him on design and copy, but the person building the bot is the one you talk to.",
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
      "business automation agency Islamabad",
      "n8n vs Zapier",
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
      {
        q: "Is automation cheaper than hiring a virtual assistant?",
        a: "A virtual assistant is an ongoing salary for tasks that still depend on them showing up. An automation is a one-time build cost plus a small running cost from the tools it connects, and it does not call in sick, get slower on a repetitive task, or need re-training when it changes. It is not a fit for judgment calls, only for the mechanical, repeatable part of the work.",
      },
      {
        q: "Should I use n8n or Zapier for my business?",
        a: "Zapier is faster to stand up for common apps and their ready-made integrations. n8n costs less to run at real volume and handles custom logic Zapier is not built for. Which one fits depends on what you are connecting and how much volume runs through it, not a blanket answer either way.",
      },
      {
        q: "Is there a business automation agency based in Islamabad I can talk to directly?",
        a: "Yes. Patchbay is based in Islamabad, and automation builds are handled by the same team you would be talking to about the project, not handed off to an outsourced developer elsewhere.",
      },
      {
        q: "Is there a business automation agency in Pakistan that works outside Islamabad too?",
        a: "Yes. The base is Islamabad, but automation work is remote-friendly end to end: an audit call, a shared project board, and documented workflows instead of in-person meetings. Clients across Pakistan, and internationally, are set up the same way.",
      },
      {
        q: "Is there a single automation developer in Islamabad I can hire directly, instead of going through an agency?",
        a: "Yes. Zaheen Zuberi is the one point of contact for an automation build, from the workflow audit through the finished integration, not an account manager relaying it to someone else. A small team backs him where needed, but the person scoping and building the automation is the one you talk to.",
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
      "web developer in Lahore",
      "web developer in Karachi",
      "software developer for businesses",
      "remote web developer Pakistan",
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
        q: "Do you work with businesses in Lahore or Karachi, not just Islamabad?",
        a: "Yes. The base is Islamabad, but the work itself is remote-friendly end to end: calls, a shared project board, and a live preview link instead of in-person meetings. Clients in Lahore and Karachi are handled the same way as clients abroad, as a software developer for businesses anywhere in Pakistan, not just the city the team happens to sit in.",
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
      "social media agency Islamabad",
      "AI marketing agency vs traditional agency",
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
      {
        q: "Is this cheaper than hiring an in-house social media manager?",
        a: "An in-house hire is a full salary regardless of how much content a given month actually needs. A retainer scales with the work agreed, and it comes with the design, copy, and technical build skills an in-house hire usually does not have on their own, without adding separate headcount for each.",
      },
      {
        q: "How is this actually different from a traditional marketing agency?",
        a: "A traditional agency is an account manager coordinating a design studio, a copywriter, and a developer who often do not talk to each other directly, and you pay for that coordination layer. Patchbay is one accountable team doing all of it, so a campaign that needs a landing page, a chatbot, and content gets built as one system instead of three vendors handing work back and forth.",
      },
      {
        q: "Is there a social media agency based in Islamabad I can talk to directly?",
        a: "Yes. Patchbay is based in Islamabad, and brand, content, and social work is handled by the same team you would be talking to about the project, not subcontracted to a separate studio.",
      },
      {
        q: "Is there a social media agency for small businesses in Pakistan, not just Islamabad?",
        a: "Yes. The base is Islamabad, but the work is remote-friendly end to end: content planned and approved over a shared board, reporting delivered on a schedule, no in-person meetings required. Small businesses across Pakistan, and internationally, are run the same way.",
      },
      {
        q: "Is there a single social media manager in Islamabad I can hire directly, not an agency?",
        a: "Yes. Zaheen Zuberi is the one point of contact for brand, content, and social work, not an account manager coordinating a separate design studio and copywriter on your behalf. A small team backs him on design and copy, but the person planning and running the account is the one you talk to.",
      },
    ],
  },
  {
    slug: "software-development",
    channel: "06",
    name: "Custom Software & SaaS Development",
    h1: "A software development company in Islamabad that builds what runs behind the scenes",
    metaTitle: "Custom Software Development | Islamabad",
    metaDescription:
      "Custom business software, internal tools, and SaaS products built end to end by Zaheen Zuberi. Not a templated app guessing at your workflow. Get a quote today.",
    keywords: [
      "software development company Islamabad",
      "software development company Pakistan",
      "custom software development",
      "custom software development Pakistan",
      "software house Islamabad",
      "software house Pakistan",
      "SaaS development company",
      "custom SaaS development",
      "business software development",
      "custom business software",
      "internal tools developer",
      "application development company Pakistan",
      "software developer for businesses",
      "custom software development company Islamabad",
    ],
    intro:
      "A website is what visitors see. Software is what your business actually runs on: the system that tracks the fleet, the panel that manages the leads, the tool that replaces the spreadsheet three people are editing at once. I build that layer from the database up, scoped to how your business actually works instead of a template it has to bend around.",
    outcomes: [
      "A system built around how your business actually works, not a generic template",
      "Real, searchable data with a backup, instead of a spreadsheet held together by habit",
      "An admin panel your own team can run day to day without calling a developer for every change",
      "Works even where the internet doesn't, when the job calls for it",
      "Code and data you own outright, no vendor lock-in",
    ],
    includes: [
      {
        title: "Systems design",
        body: "The data model and workflow mapped out before anything is built, so the software fits the job instead of forcing the job to fit an off-the-shelf tool.",
      },
      {
        title: "Backend and database",
        body: "A real schema behind it: search, backup, and history, not a form that emails someone and forgets everything else.",
      },
      {
        title: "Admin tools and dashboards",
        body: "The internal panel that runs the business day to day, built for the people who will actually use it every shift.",
      },
      {
        title: "Offline and licensing, where it fits",
        body: "For businesses that can't rely on the internet at the counter, software that keeps working locally and syncs or licenses itself without needing a server to stay online.",
      },
      {
        title: "Handover",
        body: "Deployed, documented, and explained, so your team can run and extend it without staying dependent on me.",
      },
    ],
    stack: ["Next.js", "TypeScript", "PostgreSQL", "PWA"],
    roles: ["lead", "dev"],
    goodFor:
      "Businesses that need a real system behind the scenes, not just a website in front of one: rental fleets, service businesses, and teams still running on spreadsheets or a paper register.",
    faqs: [
      {
        q: "How much does custom software cost?",
        a: "It depends entirely on scope: what the system has to track, how many people use it, and whether it needs to work offline or integrate with other tools. A single-purpose internal tool and a full multi-user platform are different projects with different numbers. Tell me what it needs to do and you get a fixed quote, not a range that fits nobody.",
      },
      {
        q: "How is this different from just building me a website?",
        a: "A website is public-facing: pages, content, forms. Software is the system behind it, or standalone entirely: the database, the logic, the admin panel your team actually works in. Some projects need both, wired together; some need only one. If you're not sure which one you need, describe the problem and I'll tell you honestly.",
      },
      {
        q: "Can it work without a reliable internet connection?",
        a: "Where the job calls for it, yes. PakEngine Rent Ledger, a rent-a-car management product I built and run myself, is offline-first by design: the whole fleet list, rental history, and damage records live in the browser and keep working with no connection at all, which matters at a counter where signal isn't guaranteed.",
      },
      {
        q: "Do I own the software?",
        a: "Yes. It runs on your infrastructure or a service you control, fully documented. If you stop working with me, it keeps running and your own developer can pick it up from the documentation.",
      },
      {
        q: "I already have a website. Can you add software to it instead of rebuilding it?",
        a: "Often, yes. If the front end is worth keeping, the admin panel, database, or internal tool can be built to sit behind or alongside it rather than as a full rebuild. I'll look at what's there before recommending either path.",
      },
      {
        q: "Is there a software development company based in Islamabad I can talk to directly?",
        a: "Yes. Patchbay is based in Islamabad, and custom software builds are handled by the same team you would be talking to about the project, not outsourced to a separate development shop.",
      },
      {
        q: "Is there a software house in Pakistan that works with clients outside Islamabad?",
        a: "Yes. The base is Islamabad, but custom software builds are remote-friendly end to end: a systems-design call, a shared project board, and a staging link to test against instead of in-person meetings. Clients across Pakistan, and internationally, are handled the same way.",
      },
      {
        q: "Is there a single software developer in Islamabad I can hire directly, not a software house?",
        a: "Yes. Zaheen Zuberi is the one point of contact for a custom software build, from the systems design through handover, not an account manager passing your project between departments. A small team backs him where needed, but the person scoping and building the system is the one you talk to.",
      },
    ],
  },
  {
    slug: "custom-bots",
    channel: "07",
    name: "Custom Bot Development",
    h1: "A bot built for the actual job, not squeezed into the wrong template",
    metaTitle: "Custom Bot Development | Discord, Telegram, Auto-Fill",
    metaDescription:
      "Custom bots for Discord, Telegram, Slack, and the web: moderation, alerts, scraping, auto-fill and form automation, built end to end by Zaheen Zuberi. Not a locked-down template.",
    keywords: [
      "custom bot developer",
      "custom bot developer Islamabad",
      "custom bot development Pakistan",
      "Discord bot developer",
      "Telegram bot developer",
      "Slack bot developer",
      "community bot developer",
      "web scraping bot developer",
      "notification bot developer",
      "bot developer for hire",
      "hire a bot developer",
      "X bot developer",
      "Twitter bot developer",
      "automation bot developer Islamabad",
      "auto form filler bot",
      "form filler bot developer",
      "form autofill automation",
      "auto fill bot",
      "auto apply bot developer",
      "browser automation bot developer",
      "RPA developer Pakistan",
      "robotic process automation Pakistan",
      "data entry automation bot",
      "Puppeteer developer",
      "Selenium bot developer",
    ],
    intro:
      "Trading bots and customer-support chatbots are two specific jobs, and most bot requests are neither. A Discord server that needs proper moderation and role automation, a Telegram channel that needs an alert fired the moment something changes, a script that watches a page and pings you the second it updates, a form you fill out with the same information every time: if it runs on a schedule, reacts to an event, or fills in the repetitive parts so you do not have to, it gets built scoped to that actual job, not bent to fit a customer-support widget it was never meant to be.",
    outcomes: [
      "A bot doing exactly the job it was scoped for, not a generic template bent to fit",
      "Runs on its own schedule or trigger, no manual babysitting",
      "Repetitive forms filled from your own data instead of typed by hand each time",
      "Clear logs and alerts when it fails, not a silent drop",
      "Deployed on infrastructure you control, not tied to a Patchbay-owned host",
      "Documented well enough that another developer could pick it up",
    ],
    includes: [
      {
        title: "Platform integration",
        body: "Wired into whichever platform the job actually lives on: Discord, Telegram, Slack, X, or a plain web target with no official API at all.",
      },
      {
        title: "Trigger and scheduling logic",
        body: "Event-driven where something needs an instant reaction, cron-based where it needs to run on a timer. Built around what actually needs to fire, not a fixed polling loop by default.",
      },
      {
        title: "Moderation and role automation",
        body: "For community bots specifically: rules enforced automatically, roles assigned and revoked on their own, spam and rule-breaking handled before a moderator has to step in.",
      },
      {
        title: "Auto-fill and form automation",
        body: "A bot that completes a repetitive form from a data source you control, a spreadsheet, a database, or your own saved answers, instead of you retyping the same fields by hand every time.",
      },
      {
        title: "Data handling",
        body: "Scraping, parsing, and storing state where the bot needs to remember or compare something over time, not just react to a single event.",
      },
      {
        title: "Deployment and monitoring",
        body: "Hosted, logged, and alerting on failure, so a broken bot is a notification, not something you discover a week later when it has gone quiet.",
      },
    ],
    stack: [
      "Discord.js",
      "Telegram Bot API",
      "Node",
      "Puppeteer",
      "Webhooks",
      "Cron",
    ],
    roles: ["lead", "dev"],
    goodFor:
      "Community owners who need real moderation instead of a generic template, and anyone who needs something watched, scraped, or reported on automatically.",
    faqs: [
      {
        q: "What kinds of bots do you build?",
        a: "Whatever the job actually is: Discord moderation and role bots, Telegram alert and utility bots, Slack workflow bots, X (Twitter) bots, scrapers that watch a page and report back, and scheduled bots that run a task on their own. If it is not a trading bot or a customer-facing support chatbot, both of which are their own dedicated service, it is probably this.",
      },
      {
        q: "Do you build bots for X, formerly Twitter?",
        a: "Yes, where it's actually workable. X's own API now runs on a paid tier with real rate limits, which changes the cost and reliability math compared to Discord or Telegram, both of which are free to build on. Tell me what the bot needs to post or react to and I will tell you honestly whether X's current API terms make it worth building, before you pay for something the platform itself will throttle.",
      },
      {
        q: "Is this the same as RPA (robotic process automation)?",
        a: "Overlapping, not identical. RPA is the enterprise term for the same underlying idea: software that does a repetitive digital task instead of a person clicking through it by hand, whether that's filling a form, moving data between two systems, or scraping and re-entering records. A custom bot built here is that same category of work without the packaged-RPA-platform licensing cost, built with Puppeteer or a direct API integration instead of a commercial RPA tool.",
      },
      {
        q: "Can I hire you for just one bot, not an ongoing contract?",
        a: "Yes. Most bots here are a single fixed-price build, not a retainer. Ongoing involvement only comes up if you want ongoing hosting or monitoring included, and that's optional, not the default.",
      },
      {
        q: "How is this different from the AI chatbots you build?",
        a: "AI chatbots are trained on a business's own content to answer customer questions on a website, WhatsApp, or Instagram. This is everything else that gets called a bot: moderation, alerts, scraping, and scheduled automation, usually with no conversational AI involved at all. Tell me the job and I will tell you honestly which one it actually is.",
      },
      {
        q: "Is this the same as the trading bots you build?",
        a: "No, trading bots are their own dedicated service with non-custodial broker and exchange API handling and a drawdown circuit breaker. If the bot touches real money or a live trading account, that page is the right one to read instead.",
      },
      {
        q: "How much does a custom bot cost?",
        a: "It depends on what it has to watch, react to, and remember. A single-trigger notification bot is a fraction of the cost of a moderation bot handling roles, spam detection, and logging across a large server. Tell me the job and you get a fixed quote, not a range that fits nobody.",
      },
      {
        q: "Do you host it, or do I?",
        a: "Either. It can be deployed on infrastructure you already control, or hosted as part of the build. Either way it is documented and not locked to me: if you stop working with me, another developer can pick it up.",
      },
      {
        q: "Can you build an auto-filler bot that fills out forms for me?",
        a: "Yes, for the legitimate version of that request: a form you or your business fills out repeatedly gets completed automatically from a data source you control, a spreadsheet, a database, or your own saved answers. What this will not do is mass-create accounts, get around a CAPTCHA or identity check, or submit something on a platform's terms it was built to stop bots from doing. Tell me the actual form and the actual data source and I will tell you honestly whether it is a fit.",
      },
      {
        q: "Is there a custom bot developer based in Islamabad I can talk to directly?",
        a: "Yes. Patchbay is based in Islamabad, and bot builds are handled by the same team you would be talking to about the project, not outsourced to a separate shop.",
      },
      {
        q: "Is there a custom bot developer in Pakistan who works with clients outside Islamabad?",
        a: "Yes. The base is Islamabad, but bot builds are remote-friendly end to end: a scoping call, a shared project board, and logs you can check yourself once it's deployed, instead of in-person meetings. Clients across Pakistan, and internationally, are handled the same way.",
      },
      {
        q: "Is there a single developer building custom bots in Islamabad, not an agency?",
        a: "Yes. Zaheen Zuberi is the one point of contact for a bot build, from scoping the trigger logic through deployment, not an account manager relaying it to someone else. A small team backs him where needed, but the person building the bot is the one you talk to.",
      },
    ],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
