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
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
