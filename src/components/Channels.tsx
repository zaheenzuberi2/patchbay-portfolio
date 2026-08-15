import Link from "next/link";
import { Reveal } from "./Reveal";
import { FlipCard } from "./FlipCard";
import { SignalBars } from "./SignalBars";
import { SectionGlow } from "./SectionGlow";
import { SECTION_ACCENTS } from "@/lib/section-theme";

// `slug` links each card to its own service page. Those internal links are
// how the service pages get discovered and how ranking authority flows to
// them, so keep every card pointed at a real page.
const CHANNELS = [
  {
    id: "01",
    name: "Voice & Calling Agents",
    desc: "Phone-native AI that answers, qualifies, books, and follows up. Sounds like a person, works like a system.",
    stack: ["Twilio", "Vapi", "Whisper", "TTS"],
    slug: "ai-voice-agents",
  },
  {
    id: "02",
    name: "Chatbots & Conversational AI",
    desc: "Support and sales bots on web, WhatsApp, and Instagram that actually resolve things instead of deflecting.",
    stack: ["GPT-4", "RAG", "LangChain", "WhatsApp API"],
    slug: "ai-chatbots",
  },
  {
    id: "03",
    name: "Automation & Workflows",
    desc: "The plumbing between your tools: leads, CRMs, calendars, invoices, wired so nothing needs a human copy-paste.",
    stack: ["n8n", "Zapier", "Make", "Webhooks"],
    slug: "business-automation",
  },
  {
    id: "04",
    name: "Full-Stack Websites & Builds",
    desc: "Product-grade websites, web apps, and internal tools, from schema to shipped UI, built to hold up under real usage.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Node"],
    slug: "web-development",
  },
  {
    id: "05",
    name: "Brand, Content & Social",
    desc: "Everything a marketing agency hands a client: identity, copy, and the day-to-day social management that keeps a brand alive.",
    stack: ["Content", "Social Mgmt", "Design", "Copy"],
    slug: "marketing-and-social",
  },
  {
    id: "06",
    name: "Growth & Paid Systems",
    desc: "Campaign ops, attribution, and reporting wired into your stack instead of living in a spreadsheet.",
    stack: ["Analytics", "Ads", "Dashboards", "CRM Ops"],
    slug: "marketing-and-social",
  },
];

export function Channels() {
  return (
    <section
      id="channels"
      className="relative scroll-mt-28 overflow-hidden border-b border-line py-16 sm:py-28"
    >
      <SectionGlow color={SECTION_ACCENTS.channels} />
      <div className="mx-auto max-w-6xl px-6">
        <Reveal variant="blur">
          {/* The old "Tap or hover to flip" hint lived here as `hidden
              sm:block`, so it reached desktop (which can discover the flip by
              hovering) and was hidden from phones (which cannot). Every card
              now carries its own badge, which is both correct on mobile and
              closer to the thing it describes. */}
          <div>
            <h2 className="max-w-2xl text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
              Six channels, one board.
            </h2>
            <p className="mt-4 max-w-xl text-paper-dim">
              Everything routes back to the same mixing board. Flip a channel
              to see what runs through it, then open it for the full detail.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 sm:mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CHANNELS.map((ch, i) => (
            <Reveal key={ch.id} delay={i * 60} variant="scale">
              <FlipCard
                className="h-72 sm:h-64"
                front={
                  <div className="flex h-full flex-col justify-between rounded-2xl border border-line-strong bg-ink-2/60 p-6 transition-colors group-hover:border-signal/50">
                    <div>
                      <span className="font-mono text-xs text-signal">
                        CH.{ch.id}
                      </span>
                      <h3 className="mt-3 text-xl font-medium tracking-[-0.01em] text-paper sm:text-2xl">
                        {ch.name}
                      </h3>
                    </div>
                    <SignalBars count={9} className="h-10 opacity-70" />
                  </div>
                }
                back={
                  <div className="flex h-full flex-col justify-between rounded-2xl border border-signal/40 bg-ink-3 p-6">
                    <div>
                      <span className="font-mono text-xs text-signal">
                        CH.{ch.id}
                      </span>
                      <p className="mt-3 text-sm leading-relaxed text-paper">
                        {ch.desc}
                      </p>
                    </div>
                    <div>
                      <div className="flex flex-wrap gap-2">
                        {ch.stack.map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-line-strong px-2.5 py-0.5 font-mono text-xs sm:text-[10px] uppercase tracking-[0.08em] text-paper-dim"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                      {/* No onClick here. Channels is a server component and
                          cannot pass handlers to a client component. The card's
                          flip toggle still fires underneath, which is harmless
                          because the click navigates away regardless. */}
                      <Link
                        href={`/services/${ch.slug}`}
                        className="mt-4 flex min-h-12 items-center gap-1.5 font-mono text-xs sm:text-[11px] uppercase tracking-[0.1em] text-signal underline decoration-signal/30 underline-offset-4 transition-colors hover:decoration-signal"
                      >
                        See the detail
                        <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                }
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
