import type { ServiceFaq } from "./services";

// The full FAQ library for /faq, separate from the shorter, curated set on
// the homepage (home-faqs.ts) and each service page's own five-ish
// questions (services.ts). Same rules apply everywhere on this site: no
// invented prices, client counts, or results, no em dashes, team-framed
// (Patchbay is one accountable team led by Zaheen, not a solo operator).
// Organized by category so a 200+ question page stays navigable instead of
// becoming a wall of text.

export type FaqCategory = {
  id: string;
  label: string;
  faqs: ServiceFaq[];
};

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "pricing",
    label: "Pricing & budgets",
    faqs: [
      {
        q: "How much does an AI chatbot or voice agent actually cost?",
        a: "There is a one-time build cost and a small ongoing usage cost from the AI and telephony providers. The build depends on scope: a bot answering a fixed set of questions costs a fraction of one trained on a full document set and wired into a CRM. Tell me what it needs to do and you get a specific number, not a range that fits nobody.",
      },
      {
        q: "How much does a website cost?",
        a: "It depends on whether the site displays information or runs a process. A marketing site for a small firm and a booking platform with accounts and dashboards are different projects with different budgets. Once I know what the site has to do, the quote is fixed.",
      },
      {
        q: "Do you charge hourly or by project?",
        a: "By project for builds, so the number does not creep as hours add up. Ongoing work like social management or a monthly maintenance retainer is priced monthly instead, since it is recurring by nature.",
      },
      {
        q: "Is there a minimum budget to work with you?",
        a: "There is no fixed floor written anywhere. What matters is whether the scope makes sense as a build. A very small task might be better solved with an off-the-shelf tool, and I will tell you that honestly instead of quoting it anyway.",
      },
      {
        q: "Why do prices vary so much between agencies for what sounds like the same thing?",
        a: "Because 'a chatbot' or 'a website' are not single products. What data it uses, what systems it connects to, how much design and copy go into it, and who maintains it afterward all change the real cost. A quote you cannot explain the reasoning behind is a quote worth questioning.",
      },
      {
        q: "Do you require full payment upfront?",
        a: "Payment structure is agreed per project, typically split across milestones rather than paid entirely upfront or entirely on completion. We will settle the specifics before work starts, in writing.",
      },
      {
        q: "What is included in the quoted price, and what costs extra later?",
        a: "The quote covers the scope we agree on before work starts. Anything outside that scope, like a feature added mid-project, is a separate conversation and a separate number, not a surprise on the final invoice.",
      },
      {
        q: "Are there ongoing costs after the project is delivered?",
        a: "For AI-driven projects, yes: a usage cost from the AI or telephony provider that scales with how much the tool is actually used. For a standard website, the only ongoing cost is hosting, which is usually a few dollars a month and billed directly to you, not marked up by me.",
      },
      {
        q: "Do you mark up the AI provider or telephony costs?",
        a: "No. Those accounts run under your own billing wherever practical, so you see the real provider cost, not a hidden markup layered on top.",
      },
      {
        q: "Can I get a fixed price instead of an estimate that might change?",
        a: "Yes, that is the default. Once scope is agreed, the build price is fixed. If you want to add scope later, that gets its own fixed price rather than reopening the original number.",
      },
      {
        q: "What happens if the project takes longer than expected?",
        a: "If the delay is caused by scope creep, we discuss it and price the addition separately. If it is caused by me, the quoted price stands. You should never pay more because a timeline slipped on my end.",
      },
      {
        q: "Is social media management billed separately from the website or automation work?",
        a: "Yes. Social management is a distinct monthly retainer since it is ongoing work, separate from one-time builds like a website or an automation, even if you buy both from the same team.",
      },
      {
        q: "Do you offer discounts for startups or nonprofits?",
        a: "There is no blanket discount policy, but budget constraints are a normal part of scoping a project. Say what you are working with and I will tell you honestly what fits inside it.",
      },
      {
        q: "How do I compare your pricing to hiring a full-time employee?",
        a: "A project-based build is a one-time or capped monthly cost tied to a specific outcome. A full-time hire is an ongoing salary regardless of workload. Most businesses starting out need the outcome, not the headcount, which is the case project work usually makes for itself.",
      },
      {
        q: "What is the cheapest way to get started working together?",
        a: "A single, well-scoped piece of work, like one focused automation or a single-purpose chatbot, rather than a full platform on day one. It proves the value before you commit to anything larger.",
      },
      {
        q: "Do prices differ for local Pakistani clients versus international clients?",
        a: "No, pricing is not split by client location. Being based in Islamabad means the rate itself is lower than an equivalent agency in the US or UK, and that advantage applies to every client, local or international.",
      },
      {
        q: "Will the price change if my project scope grows partway through?",
        a: "The original quote covers the original scope. If the project grows, that growth is quoted and agreed separately before it is built, so you always know the number before it changes.",
      },
      {
        q: "Do you charge for the initial consultation or quote?",
        a: "No. Describing the problem and getting a scoped, honest quote back costs nothing.",
      },
      {
        q: "What payment methods do you accept?",
        a: "Standard bank transfer is the default for both local and international clients. Specific arrangements can be discussed if you need something else.",
      },
      {
        q: "Is there a retainer option for ongoing support after launch?",
        a: "Yes, for clients who want continued changes, monitoring, or content updates after launch rather than a one-off handover. It is optional, not bundled by default.",
      },
      {
        q: "How do you price something that has never been built before?",
        a: "The same way as anything else: by breaking it into the pieces that are known (the platform, the integrations, the data it needs) and pricing those, then flagging the genuinely unknown parts honestly instead of pretending they are not there.",
      },
      {
        q: "What is a reasonable budget range to start the conversation with?",
        a: "There is no single number that fits every project, which is exactly why the first conversation is about what you need built, not a price list. Come with the problem, not a budget you think I want to hear.",
      },
    ],
  },
  {
    id: "process",
    label: "Getting started & process",
    faqs: [
      {
        q: "What do you need from me to get a quote?",
        a: "A description of the problem, not a technical spec. Most people arrive with a task eating their week rather than a requirements document, and that is the right starting point. From there I scope it, quote it, and tell you honestly if automation is the wrong tool for it.",
      },
      {
        q: "How does a typical project start?",
        a: "A conversation about what you need, usually over WhatsApp, call, or email. From there I scope the work, give you a fixed quote and timeline, and we agree on it in writing before anything gets built.",
      },
      {
        q: "How long does a project take from start to finish?",
        a: "A focused chatbot or voice agent is usually days. A marketing website is weeks. Anything with accounts, payments, or deep integrations takes longer. You get a real date after I understand the scope, not a placeholder answer on the first call.",
      },
      {
        q: "Will I get updates during the build, or only at the end?",
        a: "Regular updates during the build, not a single reveal at the end. You should never be wondering what is happening to your project for two weeks straight.",
      },
      {
        q: "Do you provide a written contract or agreement?",
        a: "Yes. Scope, price, and timeline are agreed in writing before work starts, so both sides know exactly what was promised.",
      },
      {
        q: "What tools do you use to communicate during a project?",
        a: "Usually WhatsApp for quick back and forth and email for anything that needs a written record, like the agreed scope or a delivered summary. If your team already runs on Slack or another tool, that can work too.",
      },
      {
        q: "Can I see progress before the project is finished?",
        a: "Yes. Depending on the project, that might be a staging link you can click through, screenshots at each milestone, or a working demo before final polish. You are not waiting blind until launch day.",
      },
      {
        q: "What happens after the project is delivered?",
        a: "A proper handover: documentation of what was built, credentials and account access where relevant, and an explanation of how to run or update it. If you want ongoing support after that, it is available as a separate retainer.",
      },
      {
        q: "Do I need to know anything technical to work with you?",
        a: "No. You explain the problem in plain language and I translate it into the technical decisions. If a technical choice affects cost or timeline in a way you should know about, I explain that too, without jargon.",
      },
      {
        q: "How do you handle revisions or changes during the build?",
        a: "Reasonable revisions within the agreed scope are part of the process, not an extra charge. Changes that expand the scope beyond what was agreed get scoped and quoted separately.",
      },
      {
        q: "What if I am not happy with the result?",
        a: "We work through it. Most dissatisfaction comes from a mismatch between expectation and what was scoped, which is exactly why scope is agreed in writing upfront and checked against during the build, not guessed at the end.",
      },
      {
        q: "Can you work with a tight deadline?",
        a: "Sometimes, depending on scope and what else is in progress. Tell me the deadline upfront and I will tell you honestly whether it is realistic or what would need to be cut to hit it.",
      },
      {
        q: "How involved do I need to be during the project?",
        a: "As involved as the project needs, which varies. A chatbot needs your source content and answers to specific questions. A brand or social project needs more of your voice and direction. I will tell you upfront what input is needed and when.",
      },
      {
        q: "Do you sign an NDA if I need one?",
        a: "Yes, if the project requires it, especially for anything involving proprietary data, unreleased products, or sensitive business logic.",
      },
      {
        q: "Can you start immediately, or is there a waitlist?",
        a: "It depends on current workload at the time you reach out. Ask directly and you get an honest answer about start date, not a vague promise.",
      },
      {
        q: "How do you scope a project I am not sure how to describe yet?",
        a: "That is normal, and it is exactly what the first conversation is for. Describe the outcome you want and the constraints you know about, and I will help shape that into an actual scope you can evaluate.",
      },
      {
        q: "What happens if my needs change halfway through the project?",
        a: "We talk about it as soon as it comes up rather than pretending the original scope still fits. Depending on how big the change is, it either adjusts the current build or becomes a follow-up phase.",
      },
      {
        q: "Do you work on retainer, or only project by project?",
        a: "Both, depending on the type of work. One-time builds like a website or an automation are project-based. Ongoing work like social management or continued support after launch is a monthly retainer.",
      },
      {
        q: "Can I bring my own design or brand guidelines?",
        a: "Yes. If you already have a brand identity, the build works within it. If you do not, brand and identity work is part of what the team does, not something you need to arrive with.",
      },
      {
        q: "What is the very first step if I want to work with you?",
        a: "Reach out through the contact form, email, or WhatsApp and describe what you need. That starts the scoping conversation, which costs nothing and comes with no obligation to proceed.",
      },
      {
        q: "How do you decide what to build first if I have several problems to solve?",
        a: "By impact and dependency. We look at what is costing the most time or money right now, and whether any of the problems depend on another being solved first, then sequence from there instead of guessing.",
      },
      {
        q: "Will you tell me if my idea is not worth building?",
        a: "Yes. Part of the job is being honest when automation, an AI tool, or a full rebuild is the wrong answer to your actual problem. Billing you for something that will not help you is not how this works.",
      },
    ],
  },
  {
    id: "voice",
    label: "AI voice agents",
    faqs: [
      {
        q: "What exactly is an AI voice agent?",
        a: "Software that answers phone calls, understands what the caller wants using speech recognition and language models, responds in a natural voice, and takes action like booking an appointment or logging a message, without a human on the line.",
      },
      {
        q: "Will callers know they are talking to an AI?",
        a: "Modern voice models sound close to human, and many callers do not notice on their own. I recommend disclosing it anyway, both because it is the right thing to do and because callers respond better once they know they can ask for a person.",
      },
      {
        q: "Can the voice agent handle Urdu as well as English?",
        a: "Yes. Language handling is part of the setup, including callers who switch between Urdu and English mid-sentence, which is normal in Pakistan and something generic international tools handle badly.",
      },
      {
        q: "What happens if the agent cannot answer a caller's question?",
        a: "It follows agreed escalation rules: transfer to a person, take a message and promise a callback, or flag the call as urgent. It should never guess at an answer it does not have.",
      },
      {
        q: "Can the voice agent book appointments directly into my calendar?",
        a: "Yes, that is one of the most common uses. The agent checks availability and writes the booking straight into your real calendar, no manual entry needed afterward.",
      },
      {
        q: "How does the voice agent handle multiple callers at once?",
        a: "Unlike a single receptionist, it can take concurrent calls without one caller waiting on hold for another to finish, since each call runs as its own session.",
      },
      {
        q: "What happens after hours or on holidays?",
        a: "The agent keeps answering. That is one of its main advantages over a human receptionist: it does not clock out, so a call at 2am gets the same response as one at 2pm.",
      },
      {
        q: "Can it transfer a call to a real person mid-conversation?",
        a: "Yes, based on rules we set together, like a caller explicitly asking for a person or the topic falling outside what the agent should handle alone.",
      },
      {
        q: "Does it record calls?",
        a: "Recording and transcription are typically part of the setup so you have a written summary and audio record of each call, which is also how the agent gets reviewed and corrected after launch.",
      },
      {
        q: "What kind of businesses actually benefit from a voice agent?",
        a: "Anywhere a missed call is a lost customer: clinics, law firms, salons, real estate offices, and other service businesses where the phone is a primary channel for new business.",
      },
      {
        q: "Can the agent handle billing or take payment information over the phone?",
        a: "It can be built to route to a secure payment flow, but taking raw card details directly through an AI voice conversation is not something I recommend, for the same reason you would not read a card number to a stranger. Payment collection should go through a proper, PCI-compliant channel.",
      },
      {
        q: "How natural does the voice actually sound?",
        a: "Modern neural text-to-speech is close to a real human voice, with natural pacing and intonation, not the robotic tone people associate with older automated phone systems.",
      },
      {
        q: "Can I choose what the voice sounds like?",
        a: "Yes, voice selection and tuning are part of the setup so the agent sounds consistent with your business rather than generic.",
      },
      {
        q: "What happens if the phone line goes down or the AI service has an outage?",
        a: "This is a real limitation worth being honest about: the agent depends on the telephony and AI providers staying up. A fallback routing rule, like forwarding to a mobile number during an outage, can be built in so a failure does not mean every call goes unanswered.",
      },
      {
        q: "Can the agent qualify a caller before I speak to them?",
        a: "Yes. It can ask the same qualifying questions you would ask yourself and only escalate the calls that actually match what you are looking for.",
      },
      {
        q: "Does the agent integrate with my existing phone number?",
        a: "In most cases the agent can be connected to your existing number through call forwarding or a provider-level setup, rather than forcing you onto a new number.",
      },
      {
        q: "How does the agent get trained on my specific business?",
        a: "Through a call flow built around what your callers actually ask and what a good outcome looks like for your business, not a generic script reused across clients.",
      },
      {
        q: "Can it handle a high volume of calls, like during a marketing campaign?",
        a: "Yes, that is one of its structural advantages: it scales with call volume without needing more staff on the phones during a spike.",
      },
      {
        q: "What is the difference between an AI voice agent and a regular IVR menu?",
        a: "An IVR makes the caller navigate a menu of pre-recorded options. A voice agent understands natural spoken language, so the caller just talks and the agent figures out what they need, closer to a real conversation than a phone tree.",
      },
      {
        q: "How do I know the voice agent is actually working well after launch?",
        a: "Call logs and recordings are reviewed after go-live so the agent gets corrected on calls it handled badly, and you can hear directly how it performs on real calls rather than relying on assumptions.",
      },
    ],
  },
  {
    id: "chatbots",
    label: "AI chatbots",
    faqs: [
      {
        q: "What makes a good chatbot different from a bad one?",
        a: "A bad bot deflects every question to a contact page. A good one is trained on your actual content, gives the actual answer, and knows when to stop and hand off to a human instead of guessing.",
      },
      {
        q: "Will the chatbot make things up?",
        a: "That is the main risk with a badly built bot. The fix is grounding it in your real content and adding guardrails so that when it does not know something, it says so and offers a human instead of guessing. That behavior is part of the build, not an extra.",
      },
      {
        q: "Can the chatbot work on WhatsApp?",
        a: "Yes, through the WhatsApp Business API. For most businesses in Pakistan, WhatsApp is where customers actually message, so it is often the first channel worth deploying rather than the website.",
      },
      {
        q: "Do I need to maintain the chatbot myself after launch?",
        a: "No, unless you want to. When your content changes, the knowledge base needs updating, and that can either sit with me or be handed over with instructions so your team can do it themselves.",
      },
      {
        q: "How does the chatbot know what to say about my business?",
        a: "It is loaded with your actual documents, FAQs, policies, and pricing, so it answers from your material rather than a generic template or an invented answer.",
      },
      {
        q: "Can the chatbot capture leads, not just answer questions?",
        a: "Yes, that is a core feature. Name, contact details, and intent are captured mid-conversation and pushed to your CRM or inbox, so a conversation turns into a real lead, not a dead end.",
      },
      {
        q: "What happens when a customer asks something the bot cannot handle?",
        a: "It hands off to a human with the full conversation attached, so the customer never has to repeat themselves from the start.",
      },
      {
        q: "Can it work on Instagram DMs as well as the website?",
        a: "Yes, chatbots can be deployed across your website, WhatsApp, and Instagram DMs, wherever your customers already are, rather than forcing them to a single channel.",
      },
      {
        q: "How does the bot handle sensitive topics it should not discuss?",
        a: "Guardrails limit what the bot will engage with, so it does not wander into topics, like legal or medical specifics, that it has no business answering on your behalf.",
      },
      {
        q: "Can the chatbot speak Urdu or mixed Urdu-English?",
        a: "Yes, language handling including code-switching between Urdu and English is part of what makes a bot actually usable for customers in Pakistan, rather than one built only for a single-language market.",
      },
      {
        q: "What is RAG, and why does it matter for a chatbot?",
        a: "Retrieval-augmented generation, meaning the bot looks up relevant information from your actual documents before answering, instead of relying purely on what the underlying AI model already knows. It is the main technique behind a bot that answers accurately instead of guessing.",
      },
      {
        q: "How long does it take for the chatbot to learn my business?",
        a: "The knowledge setup, where your documents and FAQs are loaded in, happens during the build, not gradually over time. It answers correctly from day one rather than needing weeks of live conversations to improve.",
      },
      {
        q: "Can the chatbot handle order status or account lookups?",
        a: "If it is connected to the relevant system, such as an order management tool or CRM, yes. That kind of integration is scoped and quoted based on what systems you already use.",
      },
      {
        q: "Does the chatbot replace my customer support team?",
        a: "It handles the repeat, predictable questions so your team spends less time answering the same twenty questions every week and more time on the ones that actually need a person.",
      },
      {
        q: "Can I review conversations the chatbot has had?",
        a: "Yes, conversation logs are typically part of the setup so you can see what customers are asking and how the bot is responding.",
      },
      {
        q: "What if my product or pricing changes after the chatbot launches?",
        a: "The knowledge base gets updated to match. That update can be handled by me or handed over to your team, depending on what you prefer going forward.",
      },
      {
        q: "Is a chatbot worth it for a small business, or only larger ones?",
        a: "It depends on volume, not size. If the same handful of questions come in repeatedly, even a small business benefits. If questions are rare and varied, a chatbot is less useful and I will say so.",
      },
      {
        q: "Can the chatbot qualify sales leads before they reach a salesperson?",
        a: "Yes, it can ask qualifying questions and only escalate the leads that actually match your criteria, saving your sales team from chasing conversations that were never going anywhere.",
      },
      {
        q: "Does the chatbot need my website to be rebuilt to work?",
        a: "No. A chatbot is typically embedded into your existing website with a small script, without needing a rebuild of the site itself.",
      },
      {
        q: "How do you prevent the chatbot from being used to spam or abuse the business?",
        a: "Rate limiting and guardrails on what the bot will engage with are part of a properly built deployment, reducing the surface for abuse compared to an unrestricted, ungoverned bot.",
      },
    ],
  },
  {
    id: "automation",
    label: "Automation & workflows",
    faqs: [
      {
        q: "What actually counts as business automation?",
        a: "Any process where information currently moves between tools by a person copying and pasting, and could instead move on its own: a lead landing in a CRM, a booking syncing to a calendar, an invoice generating on schedule.",
      },
      {
        q: "Which tools can you connect with automation?",
        a: "Anything with an API, plus the hundreds of apps that n8n, Zapier, and Make already support out of the box. If a tool has no API at all, I will tell you that upfront rather than building something fragile around it.",
      },
      {
        q: "What does automation actually save me?",
        a: "The honest measure is hours per week on a specific task, not a percentage from a case study. In the audit we count the task before automating it, so you can judge the result against a real number.",
      },
      {
        q: "What happens if an automation breaks?",
        a: "Automations fail when an upstream tool changes something. Builds include error alerts so you find out from a notification rather than from a customer, and documentation covers common fixes.",
      },
      {
        q: "Do I own the automations you build for me?",
        a: "Yes. They run in your accounts, on your subscriptions, documented. If you stop working with me, they keep running.",
      },
      {
        q: "What is the difference between n8n, Zapier, and Make?",
        a: "All three connect apps together, but they differ in flexibility, pricing model, and how much custom logic they support. The right one depends on your specific workflow, not a fixed preference, and that gets decided during scoping.",
      },
      {
        q: "Can automation replace a full-time admin role?",
        a: "It can remove the repetitive, mechanical parts of that role, like data entry and re-typing information between systems, freeing the person for judgment-based work instead of replacing them outright.",
      },
      {
        q: "How do you find out where automation would actually help my business?",
        a: "A workflow audit before anything gets built. We look at where time actually leaks, which is usually not where people expect, before automating anything.",
      },
      {
        q: "Can automation route leads to the right salesperson automatically?",
        a: "Yes, based on rules like territory, product interest, or deal size, so leads reach the right person immediately instead of sitting in a shared inbox.",
      },
      {
        q: "What if two of my tools genuinely have no way to connect?",
        a: "Sometimes a custom API bridge can be built even without an out-of-the-box integration. Sometimes the honest answer is that one of the tools needs to be replaced. I will tell you which situation you are in.",
      },
      {
        q: "Can automations send follow-up messages on their own?",
        a: "Yes, scheduled or trigger-based follow-ups are one of the most common automations, so a lead or customer gets a timely message without someone remembering to send it manually.",
      },
      {
        q: "How do you handle errors so a failed automation does not silently drop data?",
        a: "Retry logic and alerts are built into the workflow, so a failure surfaces as a notification to a real person instead of quietly disappearing.",
      },
      {
        q: "Can automation generate reports or invoices on a schedule?",
        a: "Yes, recurring reports and invoicing are common automation targets, pulling data from your existing tools on a schedule instead of someone assembling them by hand each period.",
      },
      {
        q: "Is my data safe when it passes through an automation platform?",
        a: "Data moves between the tools you already use and trust, through the automation platform's standard, secured connections. Nothing is stored outside your existing accounts unless we specifically build a reason for it to be.",
      },
      {
        q: "How long does it take to build a typical automation?",
        a: "A single, well-defined workflow is usually a matter of days. A larger system connecting many tools with custom logic takes longer, and you get a real timeline once the audit is done.",
      },
      {
        q: "Can automation help with recurring social media or marketing tasks?",
        a: "Yes, things like publishing scheduled content, syncing campaign data into a reporting dashboard, or triggering a follow-up after a form submission are all workflow automation, even though they sit inside the marketing function.",
      },
      {
        q: "What happens if my business processes change after the automation is built?",
        a: "Automations can be updated as your process changes. That update work is scoped and quoted like any other change, and documentation makes it easier for anyone, including a future developer, to adjust it.",
      },
      {
        q: "Do you provide documentation for the automations you build?",
        a: "Yes, a written map of what runs, when, and what to do if something breaks. You are not locked into needing me specifically to maintain it.",
      },
      {
        q: "Is automation only useful for large companies with complex operations?",
        a: "No. Small teams doing the same manual task repeatedly, like re-typing form submissions into a spreadsheet, often see the most immediate relief from automation, since there is no dedicated staff absorbing the cost of the manual work.",
      },
      {
        q: "Can you automate parts of my hiring or onboarding process?",
        a: "Yes, things like routing applications, scheduling interviews, or sending onboarding checklists can be automated if the tools involved support it, and this gets scoped the same as any other workflow.",
      },
    ],
  },
  {
    id: "web",
    label: "Web development",
    faqs: [
      {
        q: "What is the difference between a page-builder site and a fully custom one?",
        a: "A page builder assembles pre-made templates and looks fine until it needs to do something specific, like a real booking flow or a CRM sync. A custom build is written the whole way down, so it can do exactly what your business needs, not just what the template supports.",
      },
      {
        q: "Do you build the frontend and backend, or just one side?",
        a: "Both. Full-stack means the part you see and the database, logic, and integrations running underneath are all built and owned together, not split across different vendors.",
      },
      {
        q: "Will my website be fast on mobile, not just on a laptop?",
        a: "Yes, that is treated as a requirement, not an afterthought, since most visitors browse on a phone, often on mobile data. Performance is built in during development, not patched in afterward.",
      },
      {
        q: "Is SEO included in a website build, or is that separate?",
        a: "Technical SEO, metadata, structured data, sitemap, and clean page structure, is built in from the start, since that is the only cheap time to do it. Deeper, ongoing SEO strategy can be a separate, continued engagement.",
      },
      {
        q: "Can I update the content on my site myself after launch?",
        a: "Yes, that is part of the build for most projects: content you can update without calling a developer every time something needs to change.",
      },
      {
        q: "Do I own the code, or is it locked to a platform?",
        a: "You own it outright. No page-builder subscription lock-in, no platform holding your site hostage if you want to move it later.",
      },
      {
        q: "Can you rebuild my existing website instead of starting from scratch?",
        a: "Sometimes. If the current site is on a platform worth keeping, I will improve it. If it is actively fighting you, I will say that and explain what rebuilding would cost instead of quietly billing hours against a losing position.",
      },
      {
        q: "What technology do you build with?",
        a: "Next.js, TypeScript, React, and PostgreSQL for anything needing a real database. These are current, actively maintained, and chosen for reliability and speed, not novelty.",
      },
      {
        q: "Will my website work if I get a sudden spike in visitors?",
        a: "A properly built site is designed to hold up under real traffic, not just look fine in a quiet demo. That is one of the practical differences between a custom build and a fragile page-builder site.",
      },
      {
        q: "Can the website include a booking or scheduling system?",
        a: "Yes, booking flows, accounts, and dashboards are exactly the kind of functionality full-stack development covers, wired to a real backend and database rather than a bolted-on plugin.",
      },
      {
        q: "How do you handle hosting and domains?",
        a: "Hosting is set up under your own account wherever practical, so you are never locked out of your own infrastructure. Domain registration is your call, and I can guide you through it.",
      },
      {
        q: "Will the site be accessible to people using screen readers or keyboard navigation?",
        a: "Accessibility basics, like semantic structure and keyboard-usable interactive elements, are part of a properly built site, not an afterthought bolted on for compliance.",
      },
      {
        q: "Can you build a web app, not just a marketing site?",
        a: "Yes. Accounts, dashboards, internal tools, and other application-style builds are within scope, using the same full-stack approach as a marketing site, just with more backend logic.",
      },
      {
        q: "Do you provide the images and copy, or do I need to supply them?",
        a: "Copy and, where needed, design work are part of what the team can provide. If you already have brand assets or written copy, we work with what you have instead of redoing it.",
      },
      {
        q: "How do you make sure the site actually ranks on Google?",
        a: "The technical foundation, structure, speed, metadata, and structured data, is fully in my control and built properly. Ranking also depends on domain age, backlinks, and competition, which no developer can promise. Anyone guaranteeing a number one ranking is selling something.",
      },
      {
        q: "What happens if something breaks after launch?",
        a: "Depends on the arrangement. A handover includes documentation so any developer can fix issues. If you want ongoing support directly from me, that is available as a separate retainer.",
      },
      {
        q: "Can the site integrate with my CRM or email marketing tool?",
        a: "Yes, forms and other data points can be wired to send information straight to your CRM, email platform, or wherever it actually needs to land, instead of sitting unread in a website inbox.",
      },
      {
        q: "How many pages does a typical website include?",
        a: "It depends entirely on the business. A focused service page site might be five to ten pages; a content-heavy site or a platform with dashboards is a different scale. This gets scoped, not assumed.",
      },
      {
        q: "Will my site look good on all screen sizes, not just common ones?",
        a: "Yes, responsive layout across phone, tablet, and desktop sizes is a standard part of the build, not an optional extra.",
      },
      {
        q: "Can I see a demo of the site before it fully launches?",
        a: "Yes, depending on the project you typically get a staging link or working preview before final launch, so you are not seeing the finished site for the first time on go-live day.",
      },
    ],
  },
  {
    id: "marketing",
    label: "Brand, content & social",
    faqs: [
      {
        q: "What is included in brand and identity work?",
        a: "The visual and verbal basics: how your business looks, how it sounds in writing, and staying consistent across every channel instead of drifting between styles.",
      },
      {
        q: "Do you handle both posting content and the strategy behind it?",
        a: "Yes. Content is planned and produced with a reason behind it, then actually published on a schedule you can rely on, rather than posts appearing at random with no plan connecting them.",
      },
      {
        q: "Will someone actually manage replies and comments, or just schedule posts?",
        a: "Day-to-day management includes replies and comments, not just scheduling posts into a void and hoping someone checks in later.",
      },
      {
        q: "How is social media management priced?",
        a: "Usually a monthly retainer, since it is ongoing work. The exact number comes after we talk about which channels and how much output you actually need run.",
      },
      {
        q: "Can I start with just one social channel instead of all of them?",
        a: "Yes, and it is usually the better move. Doing one channel properly beats spreading thin across four platforms with no real depth on any of them.",
      },
      {
        q: "Do you write the captions and copy yourselves?",
        a: "Yes, copy is part of the marketing service, written to sound like your business rather than a generic template reused across clients.",
      },
      {
        q: "What does 'reporting tied to revenue, not vanity metrics' actually mean?",
        a: "Instead of just reporting likes and follower counts, campaigns are tracked against what actually matters to the business, like leads generated or attributable revenue, wired into your stack rather than assembled by hand from screenshots each month.",
      },
      {
        q: "Do you design graphics and visuals for social posts?",
        a: "Yes, visual design for social content is part of the content and posting service, kept consistent with your broader brand identity.",
      },
      {
        q: "Can you manage paid ad campaigns as well as organic posting?",
        a: "Campaign operations, attribution, and reporting for paid work is part of the broader growth and marketing service, wired into your stack rather than living in a disconnected spreadsheet.",
      },
      {
        q: "How often will content actually get posted?",
        a: "A schedule is agreed as part of the retainer, so posting happens consistently rather than in bursts followed by long silences, which is one of the most common failures of self-managed social accounts.",
      },
      {
        q: "Do you handle multiple social platforms under one retainer?",
        a: "Yes, depending on scope. The specific platforms and output level are agreed upfront so the retainer matches what you actually need managed.",
      },
      {
        q: "Can marketing work be combined with a chatbot or automation build?",
        a: "Yes, and that is a core part of the pitch: a campaign that needs a landing page, a chatbot to qualify traffic, and automation to route leads is one team building all three, instead of an agency subcontracting two of them out to other companies.",
      },
      {
        q: "Do you handle video content, or only static posts?",
        a: "Content production covers what the channel and strategy call for, which can include video depending on scope. This is discussed and scoped as part of the content plan.",
      },
      {
        q: "How do you measure whether social media management is working?",
        a: "Against real business outcomes, like leads or attributable revenue, reported in a dashboard tied to your actual stack rather than just presenting engagement numbers with no connection to results.",
      },
      {
        q: "Can I review content before it gets posted?",
        a: "Yes, an approval step before publishing is standard, so content goes out with your sign-off rather than surprising you after it is already live.",
      },
      {
        q: "What if I already have a brand identity but need help with content?",
        a: "That is fine. Existing brand guidelines are used as the foundation for content and posting rather than being redone from scratch.",
      },
      {
        q: "Do you offer a one-time brand identity project without ongoing social management?",
        a: "Yes, brand and identity work can be scoped as a standalone project separate from an ongoing social retainer.",
      },
      {
        q: "How is this different from hiring a traditional marketing agency?",
        a: "A traditional agency splits your work across an account manager, a separate design agency, and often a subcontracted developer, then charges for the coordination between them. This is the same range of work done by one accountable team, which means fewer handoffs and a shorter line between a decision and it going live.",
      },
      {
        q: "Can you help with a product or service launch specifically?",
        a: "Yes, launch campaigns pulling together brand, content, a landing page, and any needed automation are exactly the kind of work that benefits from one team handling the whole thing rather than several vendors.",
      },
      {
        q: "What happens if I want to pause the social retainer for a while?",
        a: "Retainers can be paused or adjusted; the specifics depend on the agreement in place. Tell me what changed and we work out a fair arrangement rather than locking you into something that no longer fits.",
      },
    ],
  },
  {
    id: "team",
    label: "Team, trust & ownership",
    faqs: [
      {
        q: "Is it really one team handling both the marketing and the development?",
        a: "Yes, and that is the actual advantage over a traditional agency. Instead of an account manager, a separate design agency, and a subcontracted developer who never talk to each other, Patchbay runs it as one team: I lead the project end to end, and the specialist who owns each part, design, copy, SEO, or the build, works from the same brief instead of a handoff.",
      },
      {
        q: "Who is actually behind Patchbay?",
        a: "Zaheen Zuberi leads it, based in Islamabad. He founded and runs Patchbay with specialists on design, copy, SEO, and development working under him on the parts of a project that need their specific skill.",
      },
      {
        q: "Does AI write and run everything, or does a real person handle it?",
        a: "The team builds it first. AI speeds up the first pass, drafting a bot's answers, a piece of copy, or an automation's logic, and catches obvious mistakes before a human looks at it. From there it goes to whoever owns that part: the SEO specialist checks anything touching rankings, the designer checks anything visual, a developer checks the code that ships. Nothing goes live on AI output alone.",
      },
      {
        q: "Do I own what you build for me?",
        a: "Yes. Code, automations, and accounts are yours, documented at handover, running on your own subscriptions. If you stop working with me, everything keeps running and another developer can pick it up.",
      },
      {
        q: "What happens to my data when it goes through an AI model?",
        a: "It stays yours. Anything processed through AI goes through the provider's standard API, not a public chat product, and is not used to train their models. Access on our side is limited to the people actually working on your project.",
      },
      {
        q: "Do you work with clients outside Pakistan?",
        a: "Yes. The work is remote by nature, and Patchbay already runs a product used by creators internationally. Being based in Islamabad mainly means the rates are lower than an equivalent agency in the US or UK, not that the work is limited to Pakistan.",
      },
      {
        q: "How experienced is the team?",
        a: "Zaheen is self-taught and has been building and shipping real products, including his own live TTS product, alongside client work in law, automation, and web development. The specialists working alongside him each own their specific discipline rather than spreading thin across everything.",
      },
      {
        q: "Why should I trust a smaller team over a large established agency?",
        a: "A large agency often means more layers between you and the person actually doing the work. A small, accountable team means the person who scoped your project is the person who can answer for it at every stage, with specialists brought in for exactly the skills a project needs.",
      },
      {
        q: "Can I speak directly to the person working on my project?",
        a: "Yes. Zaheen leads every project end to end, so you are not routed through an account manager layer to reach the person who actually understands your build.",
      },
      {
        q: "What happens if a specialist on the team is unavailable?",
        a: "The team is structured around roles, not a single irreplaceable person for each discipline, so a project is not simply stuck if one person is temporarily unavailable.",
      },
      {
        q: "Do you subcontract work out to other agencies?",
        a: "No, that is the specific thing this model is built to avoid. Work stays inside the team of specialists working directly under Zaheen, rather than farmed out to a separate company you never interact with.",
      },
      {
        q: "How do you handle confidentiality for client projects?",
        a: "Access to your project and data is limited to the people actually working on it, and an NDA can be signed if your project requires one.",
      },
      {
        q: "What makes this different from hiring a freelancer?",
        a: "A single freelancer is one person covering every discipline, however far outside their real strength. Patchbay brings in a specialist for each part of the work, design, copy, SEO, development, under one accountable lead, so you get depth in each area instead of one generalist stretched thin.",
      },
      {
        q: "Is Patchbay a registered business?",
        a: "Patchbay is the name of the practice Zaheen runs. Specific registration and business details can be discussed directly if that matters for your procurement process.",
      },
      {
        q: "How do you handle disagreements about scope or quality mid-project?",
        a: "Directly, and early. Because scope is written down upfront, most disagreements are resolved by checking the work against what was actually agreed, rather than an argument about memory or intent.",
      },
      {
        q: "Can you provide references or examples of past work?",
        a: "Yes, real projects like Lex Justitia, AB Juris, and Tryvoicely are shown on the site, and further references can be discussed directly for larger engagements.",
      },
      {
        q: "What happens to my project if you get busy with other clients?",
        a: "Timelines are quoted honestly based on real capacity at the time, not optimistic guesses. If a timeline cannot be met, you hear that upfront rather than after a missed deadline.",
      },
      {
        q: "Do you use subcontracted freelancers you don't personally manage?",
        a: "No. The people working on your project are the team, directly overseen by Zaheen, not an anonymous freelancer pulled in from outside with no accountability back to the lead.",
      },
      {
        q: "How do you keep quality consistent across design, copy, SEO, and development?",
        a: "Everyone works from the same brief and the same client conversation, rather than a handoff chain where context gets lost between separate vendors. Zaheen leading every project end to end is what keeps that consistent.",
      },
      {
        q: "Is this a solo operation with 'team' as a marketing word?",
        a: "No. There are real specialists on design, SEO, copy, and development who own their respective parts of a project. Zaheen leads and is hands-on throughout, but he does not do every discipline alone.",
      },
    ],
  },
  {
    id: "technical",
    label: "Technical, data & security",
    faqs: [
      {
        q: "Where is my data actually stored?",
        a: "In your own accounts wherever practical: your own database instance, your own AI provider account, your own hosting. The goal is that you control your own data, not that it lives locked inside a system only I can access.",
      },
      {
        q: "What happens to my data if I stop working with Patchbay?",
        a: "Since accounts and infrastructure run under your own ownership wherever practical, your data stays exactly where it was. Nothing is deleted or held hostage because the working relationship ends.",
      },
      {
        q: "Is my customer data used to train any AI models?",
        a: "No. AI processing goes through providers' standard business APIs, not consumer chat products, and standard API usage is not used by those providers to train their models.",
      },
      {
        q: "Do you follow any specific security standards?",
        a: "Standard secure development practices are followed: parameterized queries to prevent injection, authenticated and session-protected admin access, and secrets kept out of source code. Specific compliance certifications can be discussed if your industry requires them.",
      },
      {
        q: "What database technology do you use?",
        a: "PostgreSQL, a mature, widely used relational database, rather than something exotic or unproven. For projects needing a backend, this is the default.",
      },
      {
        q: "Is the code you write proprietary, or can other developers work on it later?",
        a: "It is written in standard, current technologies like Next.js, TypeScript, and React, documented at handover, so any competent developer can pick it up later. Nothing is deliberately obfuscated to create lock-in.",
      },
      {
        q: "How do you handle backups?",
        a: "For projects with real infrastructure, backup strategy is discussed as part of the technical scope, especially for anything holding data that would be costly to lose.",
      },
      {
        q: "What happens if there is a security vulnerability found after launch?",
        a: "It gets addressed directly and promptly. If you are on an ongoing support arrangement, this is covered under that. If not, it is treated as urgent, priority work regardless.",
      },
      {
        q: "Do you use encryption for sensitive data?",
        a: "Sensitive data, like passwords and session tokens, is never stored in plain text. Encryption and hashing are applied appropriately based on what the data actually is and how it is used.",
      },
      {
        q: "Can you integrate with tools my company already uses for compliance or audit logging?",
        a: "If the tool has an API, integration is generally possible and gets scoped like any other technical requirement.",
      },
      {
        q: "What happens if the AI provider changes its pricing or shuts down?",
        a: "This is a real dependency worth being upfront about. Because the underlying architecture is not deeply locked to one specific provider's proprietary format, switching providers is usually possible, though it does involve real engineering work, not a one-click swap.",
      },
      {
        q: "Do you test the code before it ships?",
        a: "Yes, projects go through verification, functional checks, and manual testing appropriate to the scope before being considered done, not just a visual glance before handover.",
      },
      {
        q: "How do you handle admin access and login security?",
        a: "Session-based authentication with signed tokens is standard, and for higher-security needs, additional measures can be discussed and built in.",
      },
      {
        q: "Will my website be fast, or does adding AI features slow it down?",
        a: "AI features like a chatbot typically run as a separate, asynchronous process from the core site, so they do not block or slow down normal page loading.",
      },
      {
        q: "Can you migrate my existing data into a new system?",
        a: "Yes, data migration from an existing platform or spreadsheet into a new system is a common part of a rebuild or automation project, and gets scoped based on how clean the existing data actually is.",
      },
      {
        q: "How do you prevent bugs from reaching production?",
        a: "A combination of type-checked code, linting, and manual verification before anything ships, rather than pushing straight from a local machine to a live site with no checks.",
      },
      {
        q: "Is the hosting reliable enough for a business-critical site?",
        a: "Modern managed hosting platforms used for these builds are designed for production traffic and include automatic scaling and uptime handling well beyond what a self-managed server typically offers.",
      },
      {
        q: "Can you set up monitoring so I know if something goes down?",
        a: "Yes, monitoring and alerting can be set up so a failure surfaces as a notification rather than being discovered when a customer complains.",
      },
      {
        q: "What programming languages and frameworks do you actually work in?",
        a: "TypeScript and JavaScript across the stack, with Next.js and React on the frontend and Node on the backend, plus the relevant automation platforms like n8n for workflow-specific work.",
      },
      {
        q: "Do you provide API access if I want to build something on top of what you delivered?",
        a: "If your project includes a backend with an API, yes, and it can be documented so your own developers, current or future, can build against it.",
      },
    ],
  },
  {
    id: "remote",
    label: "Remote work & working from Pakistan",
    faqs: [
      {
        q: "Can you work with clients in the US, UK, or Europe given the time difference?",
        a: "Yes. Async communication through email and WhatsApp covers most of the work, and calls are scheduled to overlap with your working hours where needed.",
      },
      {
        q: "Is communication a problem working with a team based in Pakistan?",
        a: "No. English is the working language for international clients, and communication happens through the same tools, email, WhatsApp, and calls, that any remote team uses.",
      },
      {
        q: "Why are your rates lower than agencies in the US or UK?",
        a: "Cost of living and operating costs in Islamabad are genuinely lower than in those markets, which shows up directly in the rate without requiring a drop in quality.",
      },
      {
        q: "How do international clients pay for projects?",
        a: "International bank transfer is typically used, and specific arrangements are worked out as part of agreeing the contract.",
      },
      {
        q: "Do you have experience with clients outside Pakistan already?",
        a: "Yes, Tryvoicely, an own product built and run by this team, is used by creators internationally, which is direct experience serving an international audience, not just local clients.",
      },
      {
        q: "Will the work be delivered in a timezone-appropriate way?",
        a: "Deadlines and check-ins are scheduled around what actually works for your timezone, not defaulted to Pakistan Standard Time regardless of where you are.",
      },
      {
        q: "Is it harder to build trust with a remote team you have never met in person?",
        a: "It requires more intentional communication, which is exactly why scope is written down, updates are regular, and everything, from pricing to deliverables, is explicit rather than assumed.",
      },
      {
        q: "Do you handle contracts and invoicing the way international clients expect?",
        a: "Yes, a written agreement and standard invoicing are used regardless of where the client is based, so international clients get the same documentation they would expect from a local vendor.",
      },
      {
        q: "Can you work with a client's existing US or UK-based team?",
        a: "Yes, this team can plug into an existing setup, working alongside your internal team or other vendors on a specific piece of the work rather than requiring you to hand over everything.",
      },
      {
        q: "Is there a language barrier working with a Pakistan-based team?",
        a: "No. Business communication happens in fluent English, and the site and all client-facing material are written in English by the same team doing the work.",
      },
      {
        q: "How do you handle client meetings across a large time difference?",
        a: "Meetings are scheduled at times that work for both sides, usually meaning some flexibility from Islamabad hours rather than expecting the client to always adjust.",
      },
      {
        q: "Are there any legal complications hiring a team based in Pakistan?",
        a: "For most service-based work, a standard contract and invoice cover it the same way as hiring any remote vendor. Specific legal or procurement questions can be discussed directly.",
      },
      {
        q: "Do you understand US or UK market context, or only the Pakistani market?",
        a: "Client work spans different markets already, and market-specific context, competitors, audience expectations, is gathered directly from you as part of scoping rather than assumed from one region's playbook.",
      },
      {
        q: "Can you work on a US-based domain and hosting setup?",
        a: "Yes, hosting and domain choices are based on what fits the project, not restricted to any particular country's providers.",
      },
      {
        q: "What is the biggest advantage of working with a Pakistan-based team over a local agency?",
        a: "Meaningfully lower cost for comparable quality, since operating costs in Islamabad are lower than in the US, UK, or most of Europe, without cutting corners on the actual work.",
      },
      {
        q: "How do you make sure nothing gets lost in translation on a remote project?",
        a: "Everything material, scope, pricing, timelines, decisions, is written down rather than left as a verbal understanding, so there is a shared record both sides can check against.",
      },
    ],
  },
];

export const allFaqsFlat: ServiceFaq[] = FAQ_CATEGORIES.flatMap((c) => c.faqs);

export const totalFaqCount = allFaqsFlat.length;
