// Each shipped project gets its own indexable page, same reasoning as
// services.ts: a single "Projects" list competes for nothing in particular,
// while a real case study per project can rank for its own name and for the
// problem it solves, and gives an AI answer engine actual paragraphs to cite
// instead of a one-line blurb. Copy here is claim-free like services.ts: no
// invented client counts, revenue, or results. Where a number is used (31
// languages, 5.0 rating, 3-day trial) it is a real, currently-live fact,
// checked against the product itself, not estimated.

export type CaseStudy = {
  slug: string;
  sessionId: string;
  name: string;
  kind: "Own product" | "Client";
  status: "LIVE" | "ONGOING";
  h1: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  liveUrl: string;
  liveLabel: string;
  intro: string;
  problem: string;
  approach: { title: string; body: string }[];
  outcome: string[];
  stack: string[];
  goodFor: string;
  /** Service slugs this build is real proof for, same convention as
   *  faq-categories.ts's relatedServices: a visitor who just read how a
   *  case study was built is one click from the service page that sells it,
   *  and the link tells a crawler what the case study is evidence of. */
  relatedServices: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "tryvoicely",
    sessionId: "0001",
    name: "Voicely",
    kind: "Own product",
    status: "LIVE",
    h1: "A free text-to-speech tool built for languages the big TTS vendors treat as an afterthought",
    metaTitle: "Voicely Case Study | Free AI Text to Speech for Urdu & Hindi",
    metaDescription:
      "How Voicely (tryvoicely.com) became a free AI text-to-speech tool for Urdu, Hindi, and English creators, built end to end by Zaheen Zuberi on Google Cloud's Chirp3-HD neural voices.",
    keywords: [
      "Voicely case study",
      "Urdu text to speech tool",
      "Hindi AI voice generator",
      "AI product built in Pakistan",
      "Zaheen Zuberi projects",
      "Chirp3-HD text to speech",
      "free TTS for creators",
    ],
    liveUrl: "https://tryvoicely.com",
    liveLabel: "tryvoicely.com",
    intro:
      "Most text-to-speech tools treat Urdu and Hindi as an English feature bolted on afterward: wrong script, flattened intonation, or missing entirely. Voicely was built the other way around, with South Asian languages as the actual target, not a checkbox.",
    problem:
      "South Asian creators publishing daily voiceovers, reels, and narration had two bad options: pay for an enterprise TTS API with no Urdu Nastaliq or Hindi Devanagari support worth using, or record everything themselves. Nothing free and fast existed that handled Urdu and Hindi properly, so most creators either skipped voiceover entirely or shipped audio that sounded obviously foreign to the language.",
    approach: [
      {
        title: "Built on Chirp3-HD, not a generic API wrapper",
        body: "Voicely runs on Google Cloud's Chirp3-HD neural voices through Vertex AI, chosen specifically because it renders Urdu in proper Nastaliq shaping and Hindi in Devanagari correctly, rather than transliterating into a Latin-script approximation the way older TTS engines do.",
      },
      {
        title: "No account, no friction",
        body: "A creator on a deadline will not sign up for a tool mid-edit. Voicely skips accounts entirely: paste text, pick a voice, generate, download the MP3. The whole loop stays under the time it takes to open a new browser tab.",
      },
      {
        title: "Designed for the actual workflow",
        body: "Every generation also produces a permanent share link, so a creator can send a clip to an editor or client without exporting a file first, and the MP3 output drops straight into CapCut, Premiere, or DaVinci Resolve with no conversion step.",
      },
      {
        title: "Free by default, credits only where they help",
        body: "The core tool stays free because gatekeeping South Asian language support behind a paywall would just recreate the problem it was built to solve. Optional credits exist only to help cover the underlying Google Cloud cost, not to unlock language support.",
      },
    ],
    outcome: [
      "31 languages live, with Urdu (Nastaliq) and Hindi (Devanagari & Hinglish) as the founding focus rather than an add-on",
      "Full text-to-speech loop, script to downloadable MP3, with no account required",
      "Shareable permanent audio links for sending clips to editors and clients",
      "Real, unedited user reviews visible on the live site from creators who have actually used it",
      "Running in production at tryvoicely.com under Voicely Studio, Islamabad",
    ],
    stack: ["Next.js", "Google Cloud Vertex AI", "Chirp3-HD", "TypeScript"],
    goodFor:
      "Creators, editors, and small studios who need a fast Urdu, Hindi, or English voiceover without recording it themselves or paying for an enterprise TTS seat.",
    relatedServices: ["web-development"],
  },
  {
    slug: "pakengine",
    sessionId: "0006",
    name: "PakEngine Rent Ledger",
    kind: "Own product",
    status: "LIVE",
    h1: "Rent-a-car software that replaces the paper register, built to run with no server at all",
    metaTitle: "PakEngine Case Study | Rent-a-Car Software for Pakistan",
    metaDescription:
      "How PakEngine Rent Ledger (pakengine.com) replaced the paper register for Pakistani rent-a-car showrooms with an offline-first PWA, built end to end by Zaheen Zuberi.",
    keywords: [
      "PakEngine case study",
      "rent a car software Pakistan",
      "car rental showroom software",
      "offline first PWA case study",
      "Zaheen Zuberi projects",
      "rental fleet management app",
    ],
    liveUrl: "https://pakengine.com",
    liveLabel: "pakengine.com",
    intro:
      "Most rent-a-car showrooms in Pakistan still run on a physical register: a notebook for who has which car, a phone photo for pre-existing damage, and a memory for who owes what. PakEngine replaces that notebook with a dashboard that works from any phone at the gate.",
    problem:
      "A paper register has no search, no backup, and no proof. When a car comes back scratched, it is the showroom's word against the renter's, because nothing recorded the vehicle's condition at hand-over. Cloud-based fleet software exists, but it assumes reliable internet at the counter and a subscription cost that does not fit a single-location showroom's margins.",
    approach: [
      {
        title: "Offline-first by design, not as a fallback",
        body: "PakEngine keeps the entire fleet list, rental history, and cash log in the browser's own local storage. After the first load it needs no connection at all, which matters at a gate in a part of the city where signal is not guaranteed.",
      },
      {
        title: "A damage record that actually holds up",
        body: "A nine-panel vehicle diagram lets the operator tap every existing scratch or dent before handing over the keys, one thumb, a few seconds. The same diagram reappears at return for a direct side-by-side comparison, so a dispute has an actual record behind it instead of two conflicting memories.",
      },
      {
        title: "The paperwork writes itself",
        body: "A dispatch slip with the vehicle, plate, rate, dates, and agreed damage notes goes to the renter over WhatsApp in under ten seconds. Return generates a matching receipt with the overtime and total already calculated, so the counter staff never do the arithmetic by hand.",
      },
      {
        title: "A licensing model that matches a client-only app",
        body: "Because there is no server to gate access, activation keys are signed per-showroom with ECDSA and verified offline in the browser on every app open, so a bypassed key is caught and wiped the next time the app runs, without needing a license server to check in with.",
      },
    ],
    outcome: [
      "Full offline-first PWA, installable on Android, iPhone, and desktop, with no cloud database",
      "Nine-panel damage map locked to each rental and re-shown at return for a side-by-side compare",
      "WhatsApp dispatch slips and return receipts generated automatically, with overtime calculated for the counter",
      "One-file backup and restore, so a showroom can move a whole fleet history between a phone and a counter PC",
      "Live at pakengine.com with a 3-day free trial, then Rs 4,000/month or Rs 40,000/year by bank transfer",
    ],
    stack: ["JavaScript", "Tailwind", "Service Worker / PWA", "Web Crypto"],
    goodFor:
      "Single-location and small multi-location rent-a-car showrooms in Pakistan replacing a paper register or a spreadsheet, without needing reliable internet at the counter.",
    relatedServices: ["software-development", "web-development", "business-automation"],
  },
  {
    slug: "ad-real-estate",
    sessionId: "0005",
    name: "AD Real Estate",
    kind: "Client",
    status: "LIVE",
    h1: "A DHA Islamabad property advisory's rebuild, from a static prototype to a real CMS-backed site",
    metaTitle: "AD Real Estate Case Study | Real Estate Website Rebuild, Islamabad",
    metaDescription:
      "How AD Real Estate (adrealestate.pk), a DHA Islamabad property advisory, went from a non-functional HTML prototype to a full Next.js and Sanity CMS website, built end to end by Zaheen Zuberi.",
    keywords: [
      "AD Real Estate case study",
      "real estate website Islamabad",
      "DHA Islamabad property website",
      "Next.js real estate website build",
      "Zaheen Zuberi client work",
      "Sanity CMS real estate site",
    ],
    liveUrl: "https://adrealestate.pk",
    liveLabel: "adrealestate.pk",
    intro:
      "AD Real Estate & Builders, a registered DHA consultancy in Islamabad, came in with a visually polished prototype that could not actually do anything: no working contact form, no CMS, no SEO. The rebuild kept the look the client had already approved and replaced everything underneath it.",
    problem:
      "The prototype was a single HTML file with browser-transpiled JSX loaded from a CDN, a contact form that flipped a local variable and sent nothing anywhere, a scripted fake live chat, and no meta tags or structured data at all. It looked like a real estate site and functioned like a slideshow: nothing submitted reached the agency, and nothing on the page was indexable by Google.",
    approach: [
      {
        title: "Kept the approved design, replaced the engineering",
        body: "The visual direction the client had already signed off on stayed untouched. What changed was everything underneath it: a real Next.js application in place of CDN-transpiled JSX, and real server-side handling in place of client-only state.",
      },
      {
        title: "Sanity CMS from day one",
        body: "Rather than a static content file, listings live in Sanity, with the Studio doubling as the client's own admin panel so new plots and villas go up without a developer touching code. Leads land in that same admin surface, not only an inbox that can get missed.",
      },
      {
        title: "No fields the client had not actually confirmed",
        body: "Several listing fields (final price, exact plot size on unconfirmed units) stayed marked as unverified in the codebase until the client supplied them, rather than filling gaps with plausible-looking placeholder numbers on a live commercial site.",
      },
      {
        title: "Caught in production, not just in dev",
        body: "Two real bugs only surfaced against an actual Vercel production build: a Sanity Studio SSR crash from trying to server-render a client-only SPA, and a hand-rolled in-memory cache that would have quietly served stale listings for the life of the server process, breaking the entire point of a CMS. Both were fixed before launch.",
      },
    ],
    outcome: [
      "Full migration off a non-functional static prototype onto Next.js with Sanity CMS",
      "A working contact form and lead pipeline that actually reaches the agency, replacing one that sent nowhere",
      "Listings editable by the client's own team through Sanity Studio, no developer required for a new plot or villa",
      "Real SEO foundation: meta tags, structured data, and an indexable site where none existed before",
      "Live at adrealestate.pk, covering DHA Phase 5 & 6 and Bahria Town listings for the Islamabad market",
    ],
    stack: ["Next.js", "Sanity CMS", "TypeScript", "Vercel"],
    goodFor:
      "A property agency or advisory that needs listings, leads, and content to work as a real system instead of a static brochure page.",
    relatedServices: ["web-development", "software-development"],
  },
  {
    slug: "lex-justitia",
    sessionId: "0002",
    name: "Lex Justitia",
    kind: "Client",
    status: "LIVE",
    h1: "An Islamabad law practice's website, built multilingual and bookable from day one",
    metaTitle: "Lex Justitia: Law Firm Website, Islamabad",
    metaDescription:
      "Full-stack website for Lex Justitia, an Islamabad law practice: multilingual intake and secure consultation booking, built end to end by Zaheen Zuberi.",
    keywords: [
      "Lex Justitia case study",
      "law firm website developer Islamabad",
      "legal website development Pakistan",
      "law firm web design Pakistan",
      "multilingual law firm website",
      "Zaheen Zuberi client work",
      "consultation booking website",
    ],
    liveUrl: "https://lexjustitia.pk",
    liveLabel: "lexjustitia.pk",
    intro:
      "A law practice's website is often the first contact a prospective client has with the firm, sometimes before they have decided whether to call at all. For an Islamabad practice covering eight areas of law, that first page had to work in more than one language and let someone book a consultation without picking up the phone.",
    problem:
      "Legal sites commonly ship as a single-language brochure: a services list, a phone number, and a contact form that emails a partner who may not see it for days. That loses two kinds of client: the one who is more comfortable reading in Urdu or Roman Urdu than English, and the one who would book a consultation right now if the option existed, but calls a competitor instead of waiting on a callback.",
    approach: [
      {
        title: "Eight practice areas, not one shared services page",
        body: "Each of the firm's practice areas gets its own page, so a search or a click lands on the exact area someone needs rather than a paragraph shared across all eight.",
      },
      {
        title: "Multilingual intake by design",
        body: "Intake runs in Urdu, Roman Urdu, and English, matching how clients in Islamabad actually write, instead of assuming English is the only option and losing the people who would rather explain their case in their own language.",
      },
      {
        title: "Consultation booking, not just a contact form",
        body: "A prospective client books a consultation directly and securely, so the firm gets a scheduled meeting on the calendar instead of an email waiting to be read.",
      },
      {
        title: "Full-stack, frontend to backend",
        body: "Built end to end rather than assembled from a template and a form plugin, so the booking flow, intake handling, and page structure are one coherent system instead of three tools stitched together.",
      },
    ],
    outcome: [
      "Eight dedicated practice-area pages instead of one shared services list",
      "Intake available in Urdu, Roman Urdu, and English",
      "Secure online consultation booking, no phone call required to get on the calendar",
      "Full-stack build: frontend, backend, and booking flow, one system",
      "Live at lexjustitia.pk",
    ],
    stack: ["Next.js", "Full-Stack", "Legal"],
    goodFor:
      "Law firms and legal practices that need real client intake and booking, not just a page listing what they do.",
    relatedServices: ["web-development"],
  },
  {
    slug: "ab-juris",
    sessionId: "0003",
    name: "AB Juris",
    kind: "Client",
    status: "LIVE",
    h1: "A full-service Islamabad law firm's site, with real case-record stats and consultation scheduling",
    metaTitle: "AB Juris: Law Firm Website, Islamabad",
    metaDescription:
      "Full-stack website for AB Juris, an Islamabad law firm: eight practice areas, case-record stats, and consultation scheduling, built by Zaheen Zuberi.",
    keywords: [
      "AB Juris case study",
      "law firm website developer Islamabad",
      "legal website development Pakistan",
      "law firm web design Pakistan",
      "full-service law firm website",
      "Zaheen Zuberi client work",
      "consultation scheduling website",
    ],
    liveUrl: "https://abjuris.pk",
    liveLabel: "abjuris.pk",
    intro:
      "AB Juris is a full-service Islamabad law firm covering eight practice areas. The site had to carry that breadth clearly, back it with real numbers instead of vague claims of experience, and let a prospective client schedule a consultation without a phone call.",
    problem:
      "A firm covering eight practice areas has an organisation problem before it has a design problem: cram everything onto one page and nothing stands out, or split it out properly and give visitors and search engines eight specific, findable answers instead of one crowded one. Most firm sites also assert experience in prose rather than showing it, which reads as marketing copy rather than evidence.",
    approach: [
      {
        title: "Eight practice areas, structured properly",
        body: "Each area of law gets its own page rather than a shared paragraph, so both a visitor and a search engine can land on the specific area they actually need.",
      },
      {
        title: "Case-record stats instead of prose claims",
        body: "Real case-record figures are shown directly rather than described in adjectives, giving a prospective client something concrete to judge the firm by.",
      },
      {
        title: "Consultation scheduling built in",
        body: "A prospective client schedules a consultation directly through the site, so the firm captures the appointment instead of losing the moment someone decided to reach out.",
      },
      {
        title: "Full-stack, end to end",
        body: "Built the whole way down rather than templated, so the scheduling flow and the practice-area structure are one system, not plugins stitched together.",
      },
    ],
    outcome: [
      "Eight dedicated practice-area pages, structured for both visitors and search",
      "Real case-record stats shown directly rather than claimed in prose",
      "Consultation scheduling built into the site itself",
      "Full-stack build: frontend to backend, one system",
      "Live at abjuris.pk",
    ],
    stack: ["Full-Stack", "Web Design", "Legal"],
    goodFor:
      "Law firms and legal practices that need to show real breadth and real numbers, not just a page claiming both.",
    relatedServices: ["web-development"],
  },
  {
    slug: "mezmenu",
    sessionId: "0007",
    name: "MezMenu",
    kind: "Own product",
    status: "LIVE",
    h1: "QR menus that let an owner change a price from their phone instead of reprinting a menu",
    metaTitle: "MezMenu Case Study | QR Menu Software for Restaurants",
    metaDescription:
      "How MezMenu became QR-menu software for Pakistani restaurants, letting an owner edit prices from their phone while diners order straight to WhatsApp, built end to end by Zaheen Zuberi.",
    keywords: [
      "MezMenu case study",
      "QR menu software Pakistan",
      "restaurant menu app Pakistan",
      "WhatsApp ordering system",
      "Zaheen Zuberi projects",
      "QR code menu Pakistan",
    ],
    liveUrl: "https://mezmenu.vercel.app",
    liveLabel: "mezmenu.vercel.app",
    intro:
      "A printed menu is a fixed document in a business that changes daily: a dish sells out by 8pm, a price moves, a Ramadan deal needs to go up for a month and come back down. MezMenu replaces the printed sheet with one editor an owner runs from their own phone.",
    problem:
      "Reprinting a menu for every price change or seasonal deal costs money and takes days, so most restaurants just leave it stale instead. There is also no way to tell a diner mid-service that an item just sold out, short of a server walking to every table, and taking the order itself still means a server writing it down or a diner calling a number that may not be answered.",
    approach: [
      {
        title: "One editor, live everywhere at once",
        body: "The owner edits categories, items, prices, and a deal banner from a phone dashboard, and every table's QR code reflects the change immediately. No reprint, no waiting for a new sheet to come back from the printer.",
      },
      {
        title: "WhatsApp is the order button, not a plugin bolted on",
        body: "A diner's order goes straight to the restaurant's own WhatsApp number. No new app for the diner to install, and no POS integration required before a restaurant can start taking orders this way.",
      },
      {
        title: "A sold-out toggle that actually stops orders",
        body: "Marking an item sold out removes it from ordering in real time across every table's code at once, instead of a server needing to catch and explain it at the table.",
      },
      {
        title: "Per-table QR codes, not one generic code",
        body: "Each table gets its own code encoding the table number, so an order arriving on WhatsApp already says which table it came from, printable as a full sheet in one pass.",
      },
    ],
    outcome: [
      "Full menu editor: categories, items, price, sold-out, popular, and reorder, published from any phone",
      "Diner-facing menu with a cart and one-tap WhatsApp order handoff, no diner app required",
      "Per-table QR codes generated and printable as a full sheet",
      "A deal banner and sold-out toggle that update instantly across every table's code",
      "Live at mezmenu.vercel.app, PKR 3,999/month for text-menu ordering with per-table QR codes",
    ],
    stack: ["Next.js 16", "Supabase", "Postgres", "Tailwind v4"],
    goodFor:
      "Cafes, dhabas, and restaurants replacing a printed menu with something the owner can update themselves, without a developer or a reprint.",
    relatedServices: ["software-development", "web-development"],
  },
  {
    slug: "ours",
    sessionId: "0008",
    name: "Ours",
    kind: "Own product",
    status: "LIVE",
    h1: "A love-story website a couple builds themselves, gated by the database, not just the UI",
    metaTitle: "Ours Case Study | Website Builder for Couples",
    metaDescription:
      "How Ours became a website builder for couples: a shareable love-story timeline or wedding site, plus free relationship games, built end to end by Zaheen Zuberi.",
    keywords: [
      "Ours case study",
      "website for couples",
      "wedding website builder Pakistan",
      "relationship timeline website",
      "digital anniversary gift",
      "Zaheen Zuberi projects",
      "couple website generator",
    ],
    liveUrl: "https://couples-site-psi.vercel.app",
    liveLabel: "Ours",
    intro:
      "A couple's story usually lives scattered across a camera roll and old chat threads, with no single place to actually give it as something. Ours turns it into a permanent page a couple builds themselves and can gift as a link, not a PDF or a slideshow.",
    problem:
      "Generic website builders assume either a business audience or a full wedding-planning workload (guest lists, RSVPs, vendors) that most couples do not need for what is really a two-person gift. Nothing free and simple existed for just the story and the photos, sized to be built in minutes rather than an afternoon.",
    approach: [
      {
        title: "Two modes from one template engine",
        body: "Wedding mode adds an invitation, an event schedule, and RSVPs. Keepsake mode is just the love story and photographs, with no guest management at all. Same engine underneath, built for two different reasons someone opens the site.",
      },
      {
        title: "A paywall enforced by the database, not the UI",
        body: "A couple builds their entire site for free and can share a private preview link with anyone. The public address only resolves once the site is marked paid and published, and that check lives in Postgres row-level security, not application code, so guessing the address is not enough to see a page that has not been paid for.",
      },
      {
        title: "Free games with no signup, as the way in",
        body: "A bucket list, a \"how well do you know us\" quiz, and a \"who's more likely\" game are each free, need no account, and generate a shareable link from just a title, giving people a reason to try Ours before deciding to build a full site.",
      },
      {
        title: "Manual payment today, wired for a real gateway without a rebuild",
        body: "Payment is currently confirmed by hand after a bank, JazzCash, or Easypaisa transfer, flipped in an admin panel. A real payment gateway only needs to call that same server-side action from its webhook when it's added, not a different system.",
      },
    ],
    outcome: [
      "Two site modes, wedding and keepsake, from one template engine",
      "A public/private split enforced in the database itself: free preview link, paid public address",
      "Free bucket list, quiz, and couple-game tools with no signup required",
      "RSVP handling for wedding mode, where a guest can submit a reply but not read anyone else's",
      "Live at couples-site-psi.vercel.app: 15 signups in its first two days live, with 5 couples' websites published",
    ],
    stack: ["Next.js 16", "Supabase", "PostgreSQL", "Row-Level Security"],
    goodFor:
      "Couples who want a permanent, shareable page for their story, a full wedding site or a private keepsake gift, without hiring a designer or running guest management they don't need.",
    relatedServices: ["software-development", "web-development"],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
