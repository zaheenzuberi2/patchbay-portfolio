import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig, whatsappUrl } from "@/lib/site-config";
import { getService } from "@/lib/services";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatWidget } from "@/components/ChatWidget";
import { VoiceWidget } from "@/components/VoiceWidget";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq, FaqSchema } from "@/components/Faq";
import { Reveal } from "@/components/Reveal";

// A standalone comparison-intent landing page. The marketing-and-social
// service page already answers "do you handle both marketing and the
// technical side", but that is one FAQ among several there, not a page
// built around the comparison query itself. This page owns that query and
// its own, different FAQs, so nothing here repeats an answer that already
// exists on /services/marketing-and-social or /services/business-automation
// (same no-answer-at-two-URLs rule as the FAQ hub/spoke split).
const title = "AI Agency vs Traditional Marketing Agency";
const description =
  "What actually changes when the marketing team also builds the AI and dev work, instead of subcontracting it: one accountable team versus an account manager coordinating separate vendors.";
const url = `${siteConfig.url}/ai-agency-vs-traditional-marketing-agency`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "AI agency vs traditional marketing agency",
    "AI marketing agency vs traditional agency",
    "integrated marketing and automation agency",
    "one team agency vs traditional agency Pakistan",
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
    q: "What is the actual structural difference, not just the pitch?",
    a: "A traditional agency is an account manager coordinating separate specialists, sometimes at separate companies: a design studio, a copywriter, a subcontracted developer. An integrated team like Patchbay has those specialists working from one brief with no handoff between companies, which is a structural difference, not a marketing claim.",
  },
  {
    q: "Does 'AI agency' mean the content is written by AI with no human involved?",
    a: "No. AI speeds up a first pass, a bot's draft answers, a piece of copy, an automation's logic, but a specialist who owns that discipline checks it before it goes live: the SEO specialist checks anything touching rankings, the designer checks anything visual, a developer checks the code that ships. Nothing goes live on AI output alone.",
  },
  {
    q: "Is a smaller integrated team riskier than a larger traditional agency?",
    a: "The real risk in a traditional agency is usually the opposite: a subcontractor chain where nobody is fully accountable for the whole outcome. A smaller team where one person leads the project end to end and specialists own their piece directly tends to have fewer places for a task to quietly fall through.",
  },
  {
    q: "Can I start with just automation or just marketing, not both?",
    a: "Yes. Nothing here is bundled by default. A business that only needs a chatbot or only needs social management gets exactly that, priced for that, with the option to add the other side later if it makes sense.",
  },
  {
    q: "How do costs actually compare to hiring a traditional agency?",
    a: "A traditional agency's fee usually includes the cost of coordinating multiple vendors on top of the work itself. An integrated team removes that coordination layer, so the same scope of work often costs less, though the honest answer depends on the specific project, not a fixed percentage claim.",
  },
  {
    q: "What happens if I already have a marketing agency and just need the technical side?",
    a: "That is a normal starting point. A lot of work here begins as the technical half of a campaign someone else is already marketing: the chatbot, the automation, the site. There is no requirement to move the whole account over to start.",
  },
  {
    q: "Is a large enterprise campaign with a dozen channels a better fit for a traditional agency?",
    a: "Often, yes. A campaign genuinely running across TV, print, and a dozen ad platforms at once needs the scale a large traditional agency carries. The case for an integrated team is strongest for a campaign built around a landing page, a bot or voice agent, and the automation and marketing tied to it, not for that scale of operation.",
  },
];

export default function AiAgencyVsTraditionalPage() {
  const marketing = getService("marketing-and-social");
  const automation = getService("business-automation");

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#page`,
    url,
    name: title,
    description,
    about: { "@id": `${siteConfig.url}/#business` },
  };

  const related = [marketing, automation].filter((s) => s !== undefined);

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
                { name: "Services", href: "/services" },
                {
                  name: "AI Agency vs Traditional Agency",
                  href: "/ai-agency-vs-traditional-marketing-agency",
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
                An AI-and-marketing team vs a traditional agency: what
                actually changes.
              </h1>
              <p className="mt-7 text-lg leading-relaxed text-paper-dim">
                Not a pitch against agencies in general, a plain description
                of the structural difference: one accountable team building
                the marketing and the AI or dev work behind it, instead of an
                account manager relaying between separate vendors.
              </p>
              <p className="mt-6 max-w-2xl text-paper-dim">
                An AI agency, in the sense used here, is a team that builds
                and runs the AI, automation, and development work behind a
                campaign in-house, the same specialists who plan the
                marketing. A traditional marketing agency plans the campaign
                and subcontracts that technical work out to separate vendors
                it does not directly manage.
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
                Where does the coordination layer usually hide?
              </h2>
              <p className="mt-4 max-w-2xl text-paper-dim">
                A campaign that needs a landing page, a chatbot to qualify the
                traffic, and automation to route the leads is, at a
                traditional agency, three separate vendors handing work back
                and forth, each billing for their own piece and for the
                meetings needed to stay in sync. The same campaign here is one
                team building all three from the same brief.
              </p>
              <p className="mt-4 max-w-2xl text-paper-dim">
                In practice that chain looks like this: the agency scopes the
                campaign, a design subcontractor builds the landing page, a
                separate automation vendor wires up the lead routing, and the
                agency account manager relays notes between the two whenever
                something needs to change. Each handoff is a place a detail
                gets lost, a timeline slips, or a fix waits for the next
                scheduled call instead of happening the same day. None of
                that is anyone&apos;s fault specifically, it is what happens
                structurally when the people building the pieces do not talk
                to each other directly.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                Where does that coordination overhead actually go?
              </h2>
              <p className="mt-4 max-w-2xl text-paper-dim">
                Not into a separate line item, that is the point: no
                traditional agency bills a client for &quot;coordination.&quot;
                It shows up as slower turnaround on changes, as scope that
                quietly shrinks to fit what each vendor already had planned,
                and as a fee that has to cover every vendor&apos;s own margin
                stacked on top of each other, not just the work.
              </p>
              <p className="mt-4 max-w-2xl text-paper-dim">
                The honest comparison is not price against price on a
                spreadsheet, most agencies will not publish a number for
                exactly that reason. It is turnaround against turnaround: how
                long does a genuinely small change, swap one CTA, fix a typo
                in the bot&apos;s script, take to actually ship. At a
                traditional agency that is whichever vendor owns that piece,
                on their queue. Here it is whoever is already looking at the
                code, the same day.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                What actually changes, dimension by dimension?
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: "Briefing",
                  a: "One brief, read by everyone building the campaign.",
                  b: "One brief per vendor, translated and re-translated at each handoff.",
                },
                {
                  label: "A mid-project change",
                  a: "Said once, applied by whoever owns that piece, same day.",
                  b: "Relayed through an account manager to whichever vendor owns that piece, on their schedule.",
                },
                {
                  label: "Accountability for the outcome",
                  a: "One team owns the campaign end to end.",
                  b: "Each vendor owns their piece; the outcome as a whole often belongs to no one specifically.",
                },
                {
                  label: "Where the fee goes",
                  a: "Toward the work itself.",
                  b: "Partly toward the work, partly toward coordinating the vendors doing it.",
                },
              ].map((row, i) => (
                <Reveal key={row.label} delay={i * 50}>
                  <div className="h-full rounded-2xl border border-line-strong bg-ink-2/60 p-6">
                    <span className="font-mono text-xs uppercase tracking-[0.1em] text-signal">
                      {row.label}
                    </span>
                    <p className="mt-3 text-sm leading-relaxed text-paper">
                      <span className="text-paper-dim">Integrated team: </span>
                      {row.a}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-paper-dim">
                      <span className="text-paper-dim">Traditional agency: </span>
                      {row.b}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                What does this look like on a real build, not a hypothetical?
              </h2>
              <p className="mt-4 max-w-2xl text-paper-dim">
                AD Real Estate &amp; Builders needed more than a brochure
                site: a lead-generation site for DHA and Bahria Town
                listings, with enquiries that actually reach someone instead
                of sitting in a contact-form inbox nobody checks. A
                traditional split would have had a design agency build the
                site, a separate developer wire up the CMS, and a third
                vendor handle the enquiry routing, each on their own
                timeline.
              </p>
              <p className="mt-4 max-w-2xl text-paper-dim">
                Here it was one build: a Next.js site on Sanity CMS, with an
                enquiry pipeline that saves every lead straight to the CMS
                and emails a notification the moment it arrives, plus the
                monthly SEO work that keeps the listings findable. No handoff
                between the person who built the form and the person who
                built the database it writes to, because it was the same
                person. That is the practical difference this page is
                describing, not an abstract claim.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                When is a traditional agency still the better fit?
              </h2>
              <p className="mt-4 max-w-2xl text-paper-dim">
                This is not a claim that integrated is always right. A large
                enterprise campaign that genuinely needs a dozen specialists
                across TV, print, and a dozen ad platforms simultaneously
                needs the scale a big traditional agency has and a small team
                does not. A brand with strict internal compliance requiring a
                specific accredited vendor for legal or financial reasons
                needs that vendor, not the cheapest or fastest option. The
                honest case for an integrated team is narrower: businesses
                whose campaign spans a landing page, a bot or voice agent,
                some automation, and the marketing around it, where the
                coordination overhead of hiring three separate vendors is
                real money and real time, not a large enterprise running ten
                channels at once.
              </p>
            </Reveal>
          </div>
        </section>

        <Faq items={faqs} heading="AI agency vs traditional agency: questions" />

        {related.length > 0 && (
          <section className="border-b border-line py-14 sm:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <Reveal>
                <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                  The channels this compares against.
                </h2>
              </Reveal>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {related.map((s, i) => (
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
        )}

        <section id="contact" className="py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="relative rounded-2xl border border-line-strong bg-ink-2/60 px-6 py-16 text-center sm:px-16">
                <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                  Describe the campaign, not the vendor list.
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-paper-dim">
                  Tell me what needs to happen and I will tell you honestly
                  what it takes to build it as one system.
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
      <VoiceWidget />
    </div>
  );
}
