import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/services";
import { getCaseStudy } from "@/lib/case-studies";
import { siteConfig, whatsappUrl } from "@/lib/site-config";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatWidget } from "@/components/ChatWidget";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq, FaqSchema } from "@/components/Faq";
import { Reveal } from "@/components/Reveal";

// Replaces the old /locations/lahore and /locations/karachi pages, which
// were near-identical apart from a city-name swap (flagged as a doorway-page
// pattern by the technical, content, and local SEO audits on 2026-09-27).
// Originally rebuilt as an overseas-Pakistani-only page, then broadened: the
// real audience is two overlapping groups, overseas Pakistanis building or
// managing something back home, and businesses anywhere else (US, UK,
// Germany, Austria, etc.) hiring the team directly for their own local
// project. Lahore, Karachi, and Islamabad are still named directly since
// real client work spans all three, without needing a separate URL per city.
const title = "AI Automation & Web Development for International Clients";
const description =
  "Working remotely with clients outside Pakistan, both overseas Pakistanis building or managing something back home and businesses in the US, UK, Germany, Austria, and elsewhere hiring the team directly for their own project. Calls, a shared project board, and a live preview link, run the same way regardless of time zone.";
const url = `${siteConfig.url}/international-clients`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "hire remote developer Pakistan",
    "outsource web development to Pakistan",
    "Pakistan based AI automation agency for international clients",
    "web developer for overseas Pakistanis",
    "hire Pakistani developer from abroad",
    "remote software developer Pakistan USA UK",
  ],
  alternates: { canonical: url },
  openGraph: {
    type: "article",
    url,
    siteName: siteConfig.name,
    title,
    description,
    locale: siteConfig.locale,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const faqs = [
  {
    q: "I'm not in Pakistan. Can this whole project run without me visiting?",
    a: "Yes. Everything runs over calls, a shared project board, and a live preview or demo link, the same process used for every client, in Pakistan or not. Nothing about the process assumes you're in the same city, let alone the same country.",
  },
  {
    q: "Do you only work with overseas Pakistanis, or with any business outside Pakistan?",
    a: "Any business outside Pakistan. Overseas Pakistanis building or managing something back home, in Lahore, Karachi, Islamabad, or elsewhere, are a real part of the client base, but so is a business in the US, UK, Germany, Austria, or anywhere else hiring the team directly for its own local project, with nothing back in Pakistan involved at all.",
  },
  {
    q: "What's the actual benefit of hiring a Pakistan-based team from the US, UK, or Europe?",
    a: "Being based in Islamabad mainly means rates are lower than an equivalent agency in the US, UK, or Europe for the same full-stack, AI, and automation work, not that the work itself is limited or lower quality. Tryvoicely, a product used by creators internationally, was built end to end by the same team.",
  },
  {
    q: "How do time zones actually work across a project like this?",
    a: "Calls get scheduled around whatever overlap exists, whether that's a small window against US Pacific time or a much easier one against UK or European hours. Async updates on the shared project board cover the rest, so a project doesn't stall just because nobody's awake at the same time.",
  },
  {
    q: "How does payment work from outside Pakistan?",
    a: "Standard bank transfer is the default for international clients, the same as any remote vendor. Specific arrangements are worked out before work starts, as part of agreeing the quote.",
  },
  {
    q: "For overseas Pakistanis specifically: can someone else in Pakistan be the point of contact day to day, while I handle the decisions from abroad?",
    a: "Yes. It's common for the person paying and approving the direction to be abroad while someone local, family, a partner, staff, handles day-to-day check-ins. Both can be looped into the same project board and updates; nothing requires one person to be in both places at once.",
  },
  {
    q: "Can a business in New York, or elsewhere in the US, hire you for AI automation or web development?",
    a: "Yes. There's no office in New York or anywhere else in the US, the team is based in Islamabad and works with US clients entirely remotely: calls scheduled around US time zones, a shared project board, and a live preview link instead of an in-person meeting.",
  },
  {
    q: "Do you work with companies in London?",
    a: "Yes, remotely. A company in London gets the same process as any other client, discovery call, quote, build, handover, run over calls and a shared project board rather than assuming a shared time zone or a physical visit.",
  },
  {
    q: "Can a business in Berlin or elsewhere in Germany hire a Pakistan-based team for this kind of work?",
    a: "Yes. The base is Islamabad, not Berlin or anywhere else in Germany, and the work is scoped, built, and handed over the same way regardless: no in-person requirement, a live preview link to track progress, and calls scheduled to overlap with Central European time.",
  },
  {
    q: "Do you take on clients in Vienna or elsewhere in Austria?",
    a: "Yes. There's no physical presence in Vienna, the team works with Austrian clients the same remote way as everywhere else: a discovery call, a fixed quote once the scope is clear, and a shared project board for the build itself.",
  },
  {
    q: "Can a business in Toronto hire you directly, the same way an overseas Pakistani managing something back home would?",
    a: "Yes. Both are handled the same way: a Toronto business hiring the team for its own project and an overseas Pakistani in Toronto managing a property or business back in Pakistan go through the same process, calls, a shared project board, and a live preview link, just for different end goals.",
  },
  {
    q: "Do you work with clients in Dubai?",
    a: "Yes. Dubai is one of several cities the team already works with remotely, alongside clients elsewhere in the Gulf, Europe, and North America; there's no office there, and the process (call, quote, build, handover) doesn't change based on which city the client is in.",
  },
  {
    q: "Is a business in Los Angeles too far behind Islamabad time-wise for this to work?",
    a: "No. Pakistan runs well ahead of US Pacific time, so calls with a Los Angeles client land in the Islamabad evening rather than the middle of the night on either side, and the shared project board covers everything in between so a project doesn't stall waiting for the next overlap.",
  },
  {
    q: "Can you build an AI voice agent or chatbot for a company based in San Francisco?",
    a: "Yes. A San Francisco company gets the same voice agent or chatbot build as any other client, scoped to its own script and content, not a template. The distance shows up in how calls get scheduled, not in what gets built or how it's tested before handover.",
  },
  {
    q: "Do you take on web development or automation projects for businesses in Seattle?",
    a: "Yes, entirely remotely. A Seattle business goes through the same discovery call and fixed quote as anyone else once the scope is clear, and progress is tracked through a live preview link rather than a status meeting.",
  },
  {
    q: "Is there a local team in Chicago, or is everything handled from Pakistan?",
    a: "Everything is handled from Islamabad. There's no Chicago office or local rep, the point of contact for a Chicago client is the same person scoping and building the project, not someone relaying it to a team elsewhere.",
  },
  {
    q: "Can a startup in Austin hire you for custom software instead of a page builder site?",
    a: "Yes. Custom software and full-stack builds are exactly what an Austin startup that's outgrown a page builder or no-code tool typically needs, and the process is the same as any other client: scope the actual workflow first, then quote and build against it.",
  },
  {
    q: "Do you work with businesses in Houston or elsewhere in Texas?",
    a: "Yes. A business in Houston, Dallas, or elsewhere in Texas is handled the same as any US client: a discovery call to scope what's actually needed, a fixed quote, and a build tracked through a shared project board rather than in-person check-ins.",
  },
  {
    q: "Is it realistic to hire a Pakistan-based developer if my company is in Dallas?",
    a: "Yes. The rate advantage of an Islamabad-based team holds regardless of which US city the company is in, Dallas included, and the actual build, whether it's a website, an automation, or custom software, doesn't change based on where the client sits.",
  },
  {
    q: "Can a company in Washington DC hire you for a project with strict data-handling requirements?",
    a: "Yes, and this is worth raising during the discovery call specifically. Data handling and hosting are covered on the technical FAQ page, and any requirement a Washington DC client has around where data sits or who can access it gets confirmed before the quote, not assumed.",
  },
  {
    q: "Do you build websites for businesses in Boston?",
    a: "Yes. A Boston business gets a full-stack site built end to end, not assembled from a page builder, the same standard applied to every web development client regardless of city, with a live preview link to review progress as it's built.",
  },
  {
    q: "Can a business in Miami hire a remote team for AI automation instead of a local agency?",
    a: "Yes. A Miami business loses nothing by hiring remotely for automation work specifically, since the deliverable is workflows and integrations, not something that needs an in-person presence, and the same discovery-call-then-quote process applies.",
  },
  {
    q: "Do you work with companies in Atlanta?",
    a: "Yes. An Atlanta company is scoped and quoted the same way as any other client, and the handover at the end includes the code, automations, and accounts, documented and running on the client's own subscriptions, not tied to the team continuing to manage it.",
  },
  {
    q: "Is there a difference in process for a client in Philadelphia versus one in Pakistan?",
    a: "No. A Philadelphia client goes through the identical process, discovery call, quote, build, handover, that every client goes through; the only real difference is that meetings happen on a call instead of in person.",
  },
  {
    q: "Can a business in Denver hire you even without much overlap in working hours?",
    a: "Yes. Denver sits far enough from Islamabad that overlap is limited, so calls get scheduled around whatever window exists and async updates on the shared project board carry the rest of the communication, rather than the project depending on real-time availability.",
  },
  {
    q: "Do you take on clients in Phoenix or the wider Southwest US?",
    a: "Yes. A client in Phoenix or elsewhere in the Southwest US is treated like any other remote client: the quote is fixed once the scope is agreed, and the build itself doesn't depend on time zone at all, only the scheduling of calls does.",
  },
  {
    q: "Can a company in Manchester hire you directly instead of going through a UK agency?",
    a: "Yes. A Manchester company deals with the same person scoping and building the project throughout, not an account manager passing it to a subcontracted developer, which is the actual reason to go direct rather than through a UK agency reselling the same kind of remote work.",
  },
  {
    q: "Do you work with businesses in Birmingham?",
    a: "Yes. A Birmingham business gets a fixed quote once the scope is clear and a live preview link to track the build, the same as every other client; UK hours overlap comfortably with the Islamabad working day, so scheduling calls is straightforward.",
  },
  {
    q: "Can a startup in Edinburgh hire a Pakistan-based team for a web or software build?",
    a: "Yes. An Edinburgh startup goes through the same discovery call and scoped quote as any other client, and full-stack development, the actual build, not a page builder, is exactly what a growing product usually needs once a template stops being enough.",
  },
  {
    q: "Do you take on projects for businesses in Glasgow?",
    a: "Yes. A Glasgow business is handled the same as any UK client: a discovery call to understand the actual workflow, a fixed quote, and a build tracked through a shared project board instead of in-person meetings.",
  },
  {
    q: "Can a company in Liverpool hire you for AI chatbots or voice agents?",
    a: "Yes. A Liverpool company gets a chatbot or voice agent trained on its own content and scripts, not a generic template, and the build and testing happen the same way regardless of which UK city the company is based in.",
  },
  {
    q: "Do you work with businesses in Leeds?",
    a: "Yes. A Leeds business follows the same process as any other client, scope the real problem, quote it, build it, hand it over, run entirely over calls and a shared project board.",
  },
  {
    q: "Can a business in Bristol hire a remote developer instead of a local one?",
    a: "Yes. There's no meaningful downside for a Bristol business hiring remotely for this kind of work: the discovery call, quote, and build all happen the same way, and the code and accounts are handed over fully documented at the end regardless of location.",
  },
  {
    q: "Do you take on clients in Sheffield or Newcastle?",
    a: "Yes. Clients in Sheffield, Newcastle, or other UK cities outside London go through the identical process to a London client, calls, a shared project board, a live preview link, with nothing about the process assuming a particular city.",
  },
  {
    q: "Can a university spinout or small business in Oxford or Cambridge hire you?",
    a: "Yes. A spinout or small business in Oxford or Cambridge is scoped and quoted like any other client, and custom software or a full-stack site are common starting points for a project that's outgrown a template or a page builder.",
  },
  {
    q: "Do you build AI voice and calling agents for businesses in New York, Houston, Manchester, or Glasgow?",
    a: "Yes. Whether the business is in New York, Houston, Manchester, or Glasgow, the voice agent is trained on that business's own script and call flow, not a generic template, so it answers on the first ring, qualifies the caller, and books what it should straight into the calendar, the same as it would for any client.",
  },
  {
    q: "Can you build a chatbot for a company in Los Angeles, Miami, Birmingham, or Liverpool?",
    a: "Yes. A chatbot for a company in Los Angeles, Miami, Birmingham, or Liverpool is trained on that company's actual content and knows when to hand off to a person, rather than deflecting every question to a contact page, and it's built and tested the same way regardless of which of those cities the company is in.",
  },
  {
    q: "Do you handle automation and workflow projects for businesses in Chicago, Austin, Edinburgh, or Bristol?",
    a: "Yes. Automation work for a business in Chicago, Austin, Edinburgh, or Bristol usually starts with the same question asked of any client: where is information currently moving between tools by hand, a lead landing in a CRM, a booking syncing to a calendar, and the fix is wiring that connection so it stops needing a person in the middle.",
  },
  {
    q: "Do you build full-stack websites for companies in Seattle, Boston, London, or Leeds?",
    a: "Yes. A company in Seattle, Boston, London, or Leeds gets a site built the whole way down, not assembled from a page builder, so it can actually take a booking, sync to a CRM, or handle real traffic, the same standard applied to every web development client regardless of city.",
  },
  {
    q: "Can you run brand, content, and social for a business in San Francisco, Atlanta, Sheffield, or Newcastle?",
    a: "Yes. Brand, content, and social work for a business in San Francisco, Atlanta, Sheffield, or Newcastle runs as one accountable team rather than being split across a separate agency, a freelance designer, and a media buyer, and the same process applies no matter which of those cities the business is based in.",
  },
  {
    q: "Do you build custom software or internal tools for businesses in Dallas, Philadelphia, Oxford, or Cambridge?",
    a: "Yes. Custom software for a business in Dallas, Philadelphia, Oxford, or Cambridge is scoped to how that business actually works rather than a template it has to bend around, whether that's a panel that manages leads, a tool that tracks inventory, or a system replacing a spreadsheet three people are editing at once.",
  },
  {
    q: "Can you build a custom Discord, Telegram, or Slack bot for a business in Denver, Phoenix, Washington DC, or Toronto?",
    a: "Yes. A custom bot for a business in Denver, Phoenix, Washington DC, or Toronto gets scoped to the actual job it needs to do, moderation and role automation, an alert fired the moment something changes, a form auto-filled with repeated information, rather than bent to fit a generic support-widget template.",
  },
  {
    q: "Do you work with tech startups in San Jose or elsewhere in Silicon Valley?",
    a: "Yes. A San Jose or wider Silicon Valley startup is scoped and quoted the same as any other client, and custom software or automation work tends to matter most here specifically, replacing a stack of disconnected tools with one system built around how the team actually operates.",
  },
  {
    q: "Can a business in Portland hire you for a website or AI project?",
    a: "Yes. A Portland business goes through the same discovery call and fixed quote as any other client, and the build, whether it's a website, a voice agent, or automation, is tracked through a live preview link rather than status meetings.",
  },
  {
    q: "Do you take on clients in San Antonio or Charlotte?",
    a: "Yes. Clients in San Antonio, Charlotte, or other growing US metro areas get the same process as anywhere else: the actual workflow gets scoped first, then quoted, then built, with nothing assumed about how the market in that city works.",
  },
  {
    q: "Can a business in Nashville hire a remote team for automation or a website rebuild?",
    a: "Yes. A Nashville business rebuilding a site or automating a manual process is handled the same way as any other client, scope what's actually slow or breaking first, then quote and build against that, not a generic package.",
  },
  {
    q: "Do you work with companies in Minneapolis or Detroit?",
    a: "Yes. A company in Minneapolis, Detroit, or elsewhere in the Midwest gets the same discovery-call-then-quote process as any client, and the handover at the end includes the code and accounts, documented and running on the company's own subscriptions.",
  },
  {
    q: "Can a business in Las Vegas or Orlando hire you for a customer-facing AI voice agent?",
    a: "Yes. A voice agent for a business in Las Vegas or Orlando, both cities where a missed call is a missed booking, is trained on that business's own script and qualifying questions, the same build process used for any client regardless of industry or city.",
  },
  {
    q: "Do you take on projects for businesses in Raleigh or Pittsburgh?",
    a: "Yes. A business in Raleigh, Pittsburgh, or a similar mid-size US city gets exactly the same process as a client in a larger metro: a discovery call, a fixed quote once the scope is clear, and a build tracked through a shared project board.",
  },
  {
    q: "Can a business in Salt Lake City hire a Pakistan-based team instead of a local agency?",
    a: "Yes. There's no real downside to hiring remotely for a Salt Lake City business: the discovery call, quote, and build all happen the same way as a local agency would run them, and the rate advantage of an Islamabad-based team holds regardless of which US city is asking.",
  },
  {
    q: "Do you work with businesses in Cardiff or Belfast?",
    a: "Yes. A business in Cardiff, Belfast, or elsewhere in the UK outside England gets the identical process to a London or Manchester client, a discovery call, a fixed quote, and a build tracked through a live preview link.",
  },
  {
    q: "Can a company in Nottingham or Southampton hire you for web development or automation?",
    a: "Yes. A Nottingham or Southampton company is scoped and quoted the same way as any UK client, and the actual build, a full-stack site or a workflow automation, doesn't depend on which of those cities the company is based in.",
  },
  {
    q: "Do you take on clients in Brighton or Coventry?",
    a: "Yes. Clients in Brighton, Coventry, or other UK cities outside the usual short list get exactly the same process as a London client: discovery call, fixed quote, build tracked through a shared project board, nothing assumed about the city.",
  },
  {
    q: "Can a business in Reading or Aberdeen hire a remote developer for this kind of work?",
    a: "Yes. A Reading or Aberdeen business hiring remotely gets the same fixed-quote process as any other UK client, and UK hours overlap comfortably with the Islamabad working day, so scheduling calls isn't the obstacle it might be with a US client further away.",
  },
  {
    q: "Do you build AI voice or calling agents for businesses in San Antonio, Nashville, Cardiff, or Nottingham?",
    a: "Yes. A voice agent for a business in San Antonio, Nashville, Cardiff, or Nottingham is trained on that business's own qualifying questions and call flow, so it answers on the first ring and books what it should straight into the calendar, the same build used for any client.",
  },
  {
    q: "Can you build a chatbot for a company in Portland, Minneapolis, Belfast, or Brighton?",
    a: "Yes. A chatbot for a company in Portland, Minneapolis, Belfast, or Brighton is trained on that company's own content and knows when to escalate to a person, built and tested the same way whichever of those cities the company happens to be in.",
  },
  {
    q: "Do you handle automation projects for businesses in Detroit, Charlotte, Southampton, or Coventry?",
    a: "Yes. Automation work for a business in Detroit, Charlotte, Southampton, or Coventry starts the same way every automation project does: find where a person is manually carrying data between tools, then wire that connection so it stops needing them.",
  },
  {
    q: "Do you build full-stack websites for companies in San Jose, Raleigh, Reading, or Aberdeen?",
    a: "Yes. A company in San Jose, Raleigh, Reading, or Aberdeen gets a site built the whole way down rather than assembled from a page builder, so it can actually take a booking, sync to a CRM, or hold up under real traffic.",
  },
  {
    q: "Can you run brand, content, and social for a business in Las Vegas, Orlando, Cardiff, or Belfast?",
    a: "Yes. Brand, content, and social work for a business in Las Vegas, Orlando, Cardiff, or Belfast runs as one accountable team rather than split across a separate design agency, freelance copywriter, and media buyer, the same setup regardless of city.",
  },
  {
    q: "Do you build custom software for businesses in Pittsburgh, Salt Lake City, Nottingham, or Brighton?",
    a: "Yes. Custom software for a business in Pittsburgh, Salt Lake City, Nottingham, or Brighton is scoped to how that specific business actually operates, whether that's a lead-management panel, an inventory tool, or a system replacing a shared spreadsheet.",
  },
];

export default function InternationalClientsPage() {
  const webDev = services.find((s) => s.slug === "web-development");
  const voiceAgents = services.find((s) => s.slug === "ai-voice-agents");
  const adRealEstate = getCaseStudy("ad-real-estate");
  const constructionVoiceAgent = getCaseStudy("construction-lead-calling");
  const tryvoicely = getCaseStudy("tryvoicely");

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#page`,
    url,
    name: title,
    description,
    about: { "@id": `${siteConfig.url}/#business` },
  };

  const proofStudies = [tryvoicely, constructionVoiceAgent, adRealEstate].filter(
    (s): s is NonNullable<typeof s> => Boolean(s),
  );

  return (
    <div className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <FaqSchema items={faqs} />

      <Nav />

      <main className="flex flex-1 flex-col">
        <section className="relative overflow-hidden border-b border-line pt-20 sm:pt-36">
          <div className="grid-veil pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-6 pb-14 sm:pb-20">
            <Breadcrumbs
              trail={[
                { name: "Home", href: "/" },
                {
                  name: "International Clients",
                  href: "/international-clients",
                },
              ]}
            />

            <div className="mt-8 max-w-3xl">
              <Link
                href="/about"
                className="font-mono text-xs uppercase tracking-[0.1em] text-paper-dim transition-colors hover:text-signal"
              >
                By Zaheen Zuberi
              </Link>
              <h1 className="mt-4 text-balance text-4xl font-medium leading-[1.08] tracking-[-0.03em] sm:text-5xl">
                Based in Islamabad, working with clients wherever they
                actually are.
              </h1>
              <p className="mt-7 text-lg leading-relaxed text-paper-dim">
                A business in the US, UK, Germany, or Austria hiring the
                team directly, or an overseas Pakistani managing a
                property, business, or family errand back home in Lahore,
                Karachi, or Islamabad, run the same way: calls, a shared
                project board, and a live preview link, not a plane
                ticket.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="#contact"
                  className="flex min-h-11 items-center rounded-full bg-signal px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-ink transition-transform hover:scale-[1.03]"
                >
                  Get a quote
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-11 items-center rounded-full border border-line-strong px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-paper transition-colors hover:border-signal/60 hover:text-signal"
                >
                  Ask on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                Two kinds of client, the same process.
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <Reveal delay={0}>
                <div className="h-full rounded-2xl border border-line-strong bg-ink-2/60 p-6">
                  <p className="font-mono text-xs uppercase tracking-[0.15em] text-signal">
                    Hiring directly
                  </p>
                  <h3 className="mt-3 text-lg font-medium tracking-[-0.01em] text-paper">
                    A business outside Pakistan
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-paper-dim">
                    A company in the US, UK, Germany, Austria, or anywhere
                    else hiring the team for its own project: a website,
                    an AI voice agent or chatbot, automation, or custom
                    software, with nothing back in Pakistan involved.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={50}>
                <div className="h-full rounded-2xl border border-line-strong bg-ink-2/60 p-6">
                  <p className="font-mono text-xs uppercase tracking-[0.15em] text-signal">
                    Building back home
                  </p>
                  <h3 className="mt-3 text-lg font-medium tracking-[-0.01em] text-paper">
                    An overseas Pakistani
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-paper-dim">
                    Managing a property, business, or family errand in
                    Lahore, Karachi, or Islamabad from abroad, often with
                    a family member or staff handling day-to-day check-ins
                    locally while you handle direction remotely.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {proofStudies.length > 0 && (
          <section className="border-b border-line py-14 sm:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-signal">
                  Built by Patchbay
                </p>
                <h2 className="mt-4 text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                  Real work already on record.
                </h2>
              </Reveal>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {proofStudies.map((s, i) => (
                  <Reveal key={s.slug} delay={i * 50}>
                    <Link
                      href={`/work/${s.slug}`}
                      className="group flex h-full flex-col rounded-2xl border border-line-strong bg-ink-2/60 p-6 transition-colors hover:border-signal/50"
                    >
                      <span className="font-mono text-xs text-signal">
                        {s.kind === "Own product" ? "Own product" : "Client, live"}
                      </span>
                      <span className="mt-2 text-lg font-medium tracking-[-0.01em] text-paper transition-colors group-hover:text-signal">
                        {s.name}
                      </span>
                      <span className="mt-3 text-sm leading-relaxed text-paper-dim">
                        {s.goodFor}
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                Every channel, one team.
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s, i) => (
                <Reveal key={s.slug} delay={i * 50}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="group flex items-baseline justify-between gap-6 rounded-2xl border border-line-strong bg-ink-2/60 p-5 transition-colors hover:border-signal/50"
                  >
                    <span>
                      <span className="font-mono text-xs text-signal">
                        CH.{s.channel}
                      </span>
                      <span className="mt-2 block text-lg font-medium tracking-[-0.01em] text-paper transition-colors group-hover:text-signal">
                        {s.name}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="font-mono text-paper-dim transition-transform group-hover:translate-x-1 group-hover:text-signal"
                    >
                      &rarr;
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <Faq items={faqs} heading="Working with us from outside Pakistan: questions" />

        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="rounded-2xl border border-line-strong bg-ink-2/60 p-6 sm:p-8">
                <p className="text-base leading-relaxed text-paper-dim">
                  For the practical details, time zones, contracts, how
                  payment and communication actually work when nobody is in
                  the same room, see the{" "}
                  <Link
                    href="/faq/hiring-remotely"
                    className="text-signal underline decoration-signal/30 underline-offset-4 transition-colors hover:decoration-signal"
                  >
                    hiring a remote Pakistan-based team FAQ
                  </Link>
                  . {webDev && (
                    <>
                      Or start with the{" "}
                      <Link
                        href={`/services/${webDev.slug}`}
                        className="text-signal underline decoration-signal/30 underline-offset-4 transition-colors hover:decoration-signal"
                      >
                        {webDev.name}
                      </Link>{" "}
                      or{" "}
                    </>
                  )}
                  {voiceAgents && (
                    <Link
                      href={`/services/${voiceAgents.slug}`}
                      className="text-signal underline decoration-signal/30 underline-offset-4 transition-colors hover:decoration-signal"
                    >
                      {voiceAgents.name}
                    </Link>
                  )}{" "}
                  service pages for pricing and process.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="contact" className="py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="relative rounded-2xl border border-line-strong bg-ink-2/60 px-6 py-16 text-center sm:px-16">
                <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                  Tell me what it needs to do.
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-paper-dim">
                  Describe the job and you get a specific quote and a real
                  timeline, not a brochure.
                </p>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="mt-8 inline-flex min-h-11 items-center break-all font-mono text-lg text-signal underline decoration-signal/30 underline-offset-8 transition-colors hover:decoration-signal sm:text-xl"
                >
                  {siteConfig.contactEmail}
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
      <ChatWidget />
    </div>
  );
}
