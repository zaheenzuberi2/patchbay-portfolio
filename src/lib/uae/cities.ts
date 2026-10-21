import type { UaeCity } from "./types";

// Two city pages, written separately on purpose. The earlier /locations/lahore
// and /locations/karachi pages were a city-name swap and were removed as
// doorway pages (HANDOFF section 38 and the 2026-09-27 audits). Everything
// below differs between the cities: the regulators, the sectors, the call
// patterns, and the FAQs. Rules for editing:
//   - no invented UAE clients, prices, or results; we work from Islamabad and
//     say so, with no claim of a Dubai or Abu Dhabi office
//   - regulator names are stated plainly and always paired with "confirm
//     with your own adviser", because this is a build team, not legal counsel
//   - no Arabic claim until the voice has been tested in Arabic
//   - outbound calling stays consented-only
// Add a third city only with the same depth, not by copying one of these.

export const uaeCities: UaeCity[] = [
  {
    slug: "dubai",
    name: "Dubai",
    metaTitle: "AI Voice Agents & Web Development for Dubai",
    metaDescription:
      "AI receptionists, calling agents, websites, and trading bots for Dubai businesses, built remotely from Islamabad, one hour off UAE time. Real estate, clinics, hospitality, and more.",
    h1: "AI voice agents, websites, and trading bots for Dubai businesses",
    intro:
      "Dubai businesses run on the phone and on WhatsApp: a property enquiry at 11pm, a clinic booking over lunch, a rental car asked about on the way to the airport. We build AI receptionists and calling agents that answer those calls, collect the details, and book the appointment, plus the websites and automation behind them. The team works from Islamabad, one hour ahead of UAE time, with no Dubai office.",
    market:
      "Dubai has a very dense mix of brokerages, clinics, hospitality, and service firms competing for the same enquiries, and most of them get those enquiries by phone or WhatsApp rather than through a form. A caller who reaches voicemail usually rings the next listing. That is the gap a voice agent closes, and it is why the sectors below look the way they do.",
    sectors: [
      {
        name: "Real estate brokerages",
        calls:
          "Buy, rent, and off-plan enquiries from many nationalities at all hours, often about a specific listing. The agent asks the budget, bedrooms, area, and timeline, then books a viewing for the right agent. Brokers and agents in Dubai work under RERA, so the agent collects details and schedules and never states returns or promises.",
        href: "/ai-voice-agent-real-estate",
      },
      {
        name: "Clinics and aesthetics",
        calls:
          "New patient bookings, insurance questions, and follow-up reminders. Clinics in Dubai sit under the Dubai Health Authority, so the agent only collects details and schedules, with no medical advice.",
        nicheSlug: "medical-clinics",
      },
      {
        name: "Med spas and salons",
        calls:
          "Treatment and slot enquiries, price-list questions, and rebooking. Most of these customers also message on WhatsApp, so a WhatsApp assistant and the voice agent share the same booking calendar.",
        nicheSlug: "med-spas",
      },
      {
        name: "Restaurants",
        calls:
          "Table bookings for groups, private dining requests, and opening-hours questions at peak times when staff cannot pick up.",
        nicheSlug: "restaurants",
      },
      {
        name: "Car dealers and rental",
        calls:
          "Availability and test-drive requests, and rental quotes by date and duration. Tourists call across time zones, so after-hours answering matters here.",
        nicheSlug: "car-dealerships",
      },
      {
        name: "Property management",
        calls:
          "Tenant maintenance calls, viewing requests for vacant units, and rent reminders, logged as tickets for the manager.",
        nicheSlug: "property-management",
      },
    ],
    services: [
      {
        name: "AI receptionists and calling agents",
        href: "/services/ai-voice-agents",
        body: "Inbound answering and consented outbound follow-up for Dubai numbers. UAE rules limit internet calling, so the agent connects to your line through a licensed telecom provider. We confirm the exact route with you while scoping, before anything is built.",
      },
      {
        name: "Websites that capture enquiries",
        href: "/services/web-development",
        body: "Fast Next.js sites with technical SEO built in, a click-to-WhatsApp path, and lead forms that reach your CRM or inbox. English first, with Arabic scoped as its own piece of work.",
      },
      {
        name: "WhatsApp chatbots",
        href: "/services/ai-chatbots",
        body: "Dubai customers message on WhatsApp by default. A chatbot trained on your own listings or services answers first, then hands the conversation to a person when it needs one.",
      },
      {
        name: "Trading bots",
        href: "/trading-bots",
        body: "Custom bots for MT4 and MT5 or a crypto exchange, run through your own broker or exchange account with a hard daily loss limit. Dubai regulates virtual assets through VARA, so we build the software only and you confirm whether your activity needs a licence.",
      },
    ],
    rules: [
      {
        title: "Calling rules",
        body: "UAE telecom rules restrict unsolicited telemarketing. We build outbound calling only for people who asked to be contacted, the same approach we use for US clients. Confirm the current rules with your own adviser before launch.",
      },
      {
        title: "Personal data",
        body: "The UAE has a federal personal data protection law, Federal Decree-Law 45 of 2021. Call recordings and transcripts are personal data, so the greeting wording and retention period are decided with you, ideally with your legal adviser.",
      },
      {
        title: "Telephony",
        body: "Voice agents on UAE numbers need a licensed carrier route. This is a normal part of scoping, and we state the route in the quote.",
      },
    ],
    faqs: [
      {
        q: "Do you have an office in Dubai?",
        a: "No. The team is in Islamabad, one hour ahead of UAE time, and works with Dubai clients over calls, WhatsApp, and a shared project board. There is no time-zone problem, and the live agent answers around the clock regardless.",
      },
      {
        q: "Can an AI receptionist work for a Dubai real estate brokerage?",
        a: "Yes. It answers enquiries on any hour, asks budget, area, bedrooms, and timeline, and books a viewing with the right agent. It collects and schedules only. It does not quote returns or give investment advice, since brokers are regulated.",
      },
      {
        q: "Will it understand Arabic?",
        a: "Our agents are built English-first. Arabic is scoped as its own piece of work and only promised after the voice has been tested with you, because speech quality varies a lot by language and dialect.",
      },
      {
        q: "Can it connect to a UAE phone number?",
        a: "Usually yes, through a licensed telecom provider. UAE rules limit internet-based calling, so the route is confirmed while scoping and written into the quote, before any build starts.",
      },
      {
        q: "Can you build a trading bot for a Dubai-based trader?",
        a: "Yes, for MT4 and MT5 or a crypto exchange API, running against your own account and never holding your funds. The bot is software, not advice, and it has a daily drawdown circuit breaker. Whether your activity needs a licence, for example from VARA for virtual assets, is something to confirm with your adviser.",
      },
      {
        q: "How is payment handled?",
        a: "Bank transfer is the default for clients outside Pakistan, agreed before work starts as part of the written quote.",
      },
    ],
  },
  {
    slug: "abu-dhabi",
    name: "Abu Dhabi",
    metaTitle: "AI Voice Agents & Web Development for Abu Dhabi",
    metaDescription:
      "AI receptionists, calling agents, websites, and automation for Abu Dhabi businesses, built remotely from Islamabad. Healthcare, finance, real estate, and professional services.",
    h1: "AI voice agents, websites, and automation for Abu Dhabi businesses",
    intro:
      "Abu Dhabi businesses tend to be more regulated and process-driven: hospitals and clinics with strict intake, finance and advisory firms in ADGM, real estate under ADREC, and professional services with long client relationships. We build AI receptionists, calling agents, websites, and back-office automation designed around those rules. The team works from Islamabad, one hour ahead of UAE time, with no Abu Dhabi office.",
    market:
      "Compared with the tourism and retail rhythm of Dubai, many Abu Dhabi enquiries come from residents and corporate buyers who want a clear, correct answer rather than a quick sell. That favours agents that follow a strict script, collect the right details, and hand off to a person on anything sensitive, which is how we build them.",
    sectors: [
      {
        name: "Healthcare",
        calls:
          "Appointment booking, referral intake, and reminders. Healthcare in Abu Dhabi is overseen by the Department of Health, so the agent only collects details and schedules, with no medical advice and no claim of regulatory approval.",
        nicheSlug: "medical-clinics",
      },
      {
        name: "Finance and advisory",
        calls:
          "Meeting requests and first-contact intake for firms operating in ADGM or onshore. The agent books time with an adviser and never gives financial advice or comments on products.",
        nicheSlug: "accountants",
      },
      {
        name: "Real estate",
        calls:
          "Viewing requests and leasing enquiries. Real estate in Abu Dhabi falls under ADREC, so the agent collects the enquiry and schedules, and leaves pricing and advice to the licensed agent.",
        href: "/ai-voice-agent-real-estate",
      },
      {
        name: "Law and professional services",
        calls:
          "New-matter intake, conflict-check details, and consultation booking, with a clear handoff to a lawyer and no legal advice from the agent.",
        nicheSlug: "law-firms",
      },
      {
        name: "Insurance",
        calls:
          "Quote requests, renewal reminders, and claim-status calls. The agent collects policy details and routes to a licensed person for anything that needs a decision.",
        nicheSlug: "insurance-agencies",
      },
      {
        name: "Facility and home services",
        calls:
          "Maintenance requests, cleaning bookings, and emergency call-outs, logged with the address, the issue, and an urgency level for dispatch.",
        nicheSlug: "cleaning-services",
      },
    ],
    services: [
      {
        name: "AI receptionists and intake agents",
        href: "/services/ai-voice-agents",
        body: "Strict-script intake for regulated sectors, with a written summary of every call and a defined point where a person takes over. Telephony runs through a licensed UAE carrier, confirmed during scoping.",
      },
      {
        name: "Business automation",
        href: "/services/business-automation",
        body: "CRM, calendar, forms, and invoicing connected so data moves without re-entry. Useful for firms with long approval chains and many handoffs between teams.",
      },
      {
        name: "Websites and internal tools",
        href: "/services/web-development",
        body: "Fast, structured sites for firms where credibility matters, plus custom internal software for teams still on spreadsheets. English first, with Arabic scoped as its own piece of work.",
      },
      {
        name: "Custom software",
        href: "/services/software-development",
        body: "Booking, case-tracking, and reporting tools built from the database up, around how your team actually works rather than a generic template.",
      },
    ],
    rules: [
      {
        title: "Regulated fields",
        body: "In healthcare, finance, law, and insurance, the agent collects information and schedules. It does not give advice, and we make no claim of regulatory approval for it.",
      },
      {
        title: "Personal data",
        body: "Federal Decree-Law 45 of 2021 covers personal data in the UAE, and ADGM has its own data protection regulations. Recording and retention wording is decided with you and your adviser.",
      },
      {
        title: "Calling rules",
        body: "Outbound calling is only for people who asked to be contacted. UAE telecom rules restrict unsolicited telemarketing, so confirm the current position with your adviser.",
      },
    ],
    faqs: [
      {
        q: "Do you have an office in Abu Dhabi?",
        a: "No. The team is in Islamabad, one hour ahead of UAE time, and works with clients over calls, WhatsApp, and a shared project board.",
      },
      {
        q: "Can an AI receptionist be used in a clinic or hospital setting?",
        a: "For intake and scheduling, yes: it collects reason for visit, preferred time, and contact details, and books the appointment. It gives no medical advice, and we do not claim it meets any healthcare regulation. Your compliance team decides what is acceptable.",
      },
      {
        q: "Does it work for firms based in ADGM?",
        a: "It can handle first-contact intake and meeting booking for an advisory or finance firm. It never gives financial advice or discusses products. Data handling for ADGM-registered firms is worked out with you and your adviser.",
      },
      {
        q: "Can it integrate with the systems we already use?",
        a: "Usually, through the tool's API or a connector such as n8n: calendars, CRMs, and ticketing systems. We list the systems involved in the quote, and anything without an API is flagged before the build starts.",
      },
      {
        q: "Is Arabic supported?",
        a: "Agents are built English-first. Arabic is scoped as its own piece of work and only promised after the voice has been tested with you, since quality varies by language and dialect.",
      },
      {
        q: "How long does a build take?",
        a: "It depends on the systems involved and how many call types are covered. We give a specific timeline in the written quote after a short scoping call, not a generic range.",
      },
    ],
  },
];

export function getUaeCity(slug: string) {
  return uaeCities.find((c) => c.slug === slug);
}
