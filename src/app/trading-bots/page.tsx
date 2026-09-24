import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig, whatsappUrl } from "@/lib/site-config";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatWidget } from "@/components/ChatWidget";
import { VoiceWidget } from "@/components/VoiceWidget";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq, FaqSchema } from "@/components/Faq";
import { Reveal } from "@/components/Reveal";
import { SignalBars } from "@/components/SignalBars";
import { AiStrategyLab } from "@/components/trading-bots/AiStrategyLab";
import { SystemDashboard } from "@/components/trading-bots/SystemDashboard";

// New service vertical, launched with no client track record yet, which the
// FAQs say directly rather than implying otherwise. Separate from that:
// Zaheen has personally traded crypto and Quotex, and built a Binance
// trading bot for his own account (confirmed directly by him, not inferred
// or embellished), and is open to walking through it as a live demo. No
// fixed prices are quoted on this page at all, deliberately: every build is
// scoped to the market, platform, and strategy first. The only numbers here
// are configurable settings (the drawdown limit) or placeholders clearly
// labeled as such (the dashboard preview). Nothing here claims a win rate,
// an uptime figure, or a client count that doesn't exist, matching the
// claim-free rule the rest of services.ts follows.
const title = "Custom Trading Bot Development";
const description =
  "Bespoke algorithmic trading systems for forex, crypto, stocks, and futures: MT4/MT5, Binance, Bybit, and Interactive Brokers, with non-custodial API security and a hard drawdown circuit breaker. Built end to end by Zaheen Zuberi.";
const url = `${siteConfig.url}/trading-bots`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "custom trading automation Pakistan",
    "algorithmic signal bots",
    "bespoke trading software",
    "whitelabel trading bot",
    "MT4 EA developer Pakistan",
    "MT5 expert advisor developer",
    "trading bot developer Islamabad",
    "crypto trading bot development",
    "TradingView strategy automation",
    "algo trading systems Pakistan",
    "crypto trading bot developer",
    "forex trading bot developer",
    "Binance trading bot developer",
    "Bybit trading bot developer",
    "Quotex trading bot",
    "binary options bot",
    "trading signal bot",
    "forex signal bot Telegram",
    "crypto signal bot Discord",
    "trade copier bot",
    "copy trading bot developer",
    "signal bot developer Pakistan",
    "Interactive Brokers bot developer",
    "IBKR API bot developer",
    "stock trading bot developer",
    "futures trading bot developer",
    "Binance crypto bot developer",
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

const painMatrix = [
  {
    trap: "Execution lag",
    manual:
      "You see the setup, then spend seconds clicking through the order ticket while the price moves against you.",
    automated:
      "An order fires the instant your rule triggers. No tab-switching, no fat-fingering a lot size at 2am.",
  },
  {
    trap: "Overtrading and greed",
    manual:
      "A good morning turns into revenge trades by evening, and the day's profit gets given back on one impulsive entry.",
    automated:
      "A hard daily drawdown limit locks the system out once it's hit. It doesn't get greedy, because it doesn't feel anything.",
  },
  {
    trap: "Management burnout",
    manual:
      "Trading your own account is one job. Manually managing five more for friends and family, on five separate logins, is another.",
    automated:
      "One signal, mirrored across every linked account in milliseconds. Managing five accounts stops meaning five times the work.",
  },
];

const systems = [
  {
    name: "Execution Bot",
    tag: "Trades",
    body: "Connects to your broker or exchange's own API and places the trade itself, the instant your rule triggers. This is the system behind every MT4/MT5 EA and crypto exchange bot built here.",
  },
  {
    name: "Signal Bot",
    tag: "Alerts",
    body: "Runs the exact same strategy logic but stops one step short: instead of placing a trade, it posts the call, entry, stop, target, straight to a Telegram or Discord group, for traders who want to pull the trigger themselves.",
  },
];

const arsenal = [
  {
    title: "Bespoke strategy automation",
    body: "Your rules, whether they live in a TradingView Pine script, an MQL indicator, or just in your head, coded into an execution node that trades them exactly as specified. Not a generic template bot.",
  },
  {
    title: "Anti-overtrading circuit breaker",
    body: "A daily drawdown limit you set. Once it's hit, the system soft-locks itself for the day. The one rule every discretionary trader breaks under pressure, enforced in code instead of willpower.",
  },
  {
    title: "Multi-account copier terminal",
    body: "One signal, replicated across every linked broker or exchange account, in the order and sizing you define. Works the same whether those are your own accounts or accounts your followers connect themselves, each on their own API keys.",
  },
  {
    title: "Signal delivery to Telegram or Discord",
    body: "The Signal Bot posts directly into the group chat you already run, formatted and timestamped, so a following gets the call the moment it fires instead of a screenshot relayed by hand.",
  },
  {
    title: "Non-custodial API security",
    body: "Connected through your broker or exchange's own API keys, scoped to trading only. Withdrawal permissions are never requested and never needed. Your funds stay in your account, under your control, the whole time.",
  },
];

const faqs = [
  {
    q: "Do I need to already have a trading strategy?",
    a: "No, though it helps. If you already trade a rule set, whether on TradingView, MT4/MT5, or just in a notebook, that gets coded and automated as-is. If you don't have one yet, that's what the strategy lab process is for: candidates are generated and proven on a demo account before anything is proposed for your real capital.",
  },
  {
    q: "Do you ever hold or have access to my funds?",
    a: "No. Every connection is non-custodial: a broker or exchange API key scoped to trading only, with withdrawal permissions never requested. Your money stays in your own account at your own broker or exchange the entire time, not in a pooled account or a wallet Patchbay controls.",
  },
  {
    q: "Which platforms and brokers do you build for?",
    a: "MT4 and MT5 Expert Advisors for forex and CFD brokers, exchange-API bots for crypto venues like Binance and Bybit, and Interactive Brokers' own API for stocks and futures. TradingView-based strategies can be bridged into any of them through webhooks. Tell me your specific broker or exchange and I'll confirm the fit before quoting anything.",
  },
  {
    q: "Do you build trading bots for stocks or futures?",
    a: "Yes, through Interactive Brokers' own API, which covers both alongside forex. The build works the same way as an MT4/MT5 or crypto bot: your rules coded as-is, non-custodial API access only, and the same drawdown circuit breaker.",
  },
  {
    q: "Do you build crypto trading bots?",
    a: "Yes. A crypto bot connects through your exchange's own API, Binance and Bybit are the two built most often, scoped to trading only with withdrawal permissions never requested. Your strategy runs against your own account, on your own capital, the entire time.",
  },
  {
    q: "Do you build forex trading bots?",
    a: "Yes, as an MT4 or MT5 Expert Advisor connected to your own forex or CFD broker. Whatever your rule set is, entries, exits, position sizing, gets coded and automated as-is, with the same drawdown circuit breaker as every other build here.",
  },
  {
    q: "Can you build a trading bot for Quotex or another binary options platform?",
    a: "No, and it's worth explaining why rather than leaving it at that. Quotex and most binary options platforms don't expose an official trading API the way MT4/MT5 or a crypto exchange does, so a bot for one of them almost always means browser automation working around a platform that was never built to be automated, which is the same territory the custom-bot service explicitly won't operate in. If the underlying strategy is sound, it's usually better rebuilt and automated properly on a forex or crypto venue that supports real API access.",
  },
  {
    q: "Can I set my own risk and drawdown limits?",
    a: "Yes, and you should. The circuit breaker's daily drawdown limit, position sizing, and any other risk rule are configured to what you're comfortable with before the system ever goes live, not a fixed default.",
  },
  {
    q: "Do you have a live track record yet?",
    a: "Not for this service line's clients yet, honestly, there's no public client track record or results to point to right now. What does exist is personal experience: I've traded crypto and Quotex myself, and built a Binance trading bot for my own account. And regardless of track record, every strategy built for a client, yours or one built here, still runs on a demo account under live market conditions before it's trusted with real capital.",
  },
  {
    q: "Can I see a demo of a bot you've actually built?",
    a: "Yes. I've built a Binance trading bot for my own account and I'm open to walking through it directly, the real logic and the real interface, not a recorded sales reel. Get in touch and we'll set up a time.",
  },
  {
    q: "Is this investment advice?",
    a: "No. This is software development: building and automating the execution of a trading strategy, whether it's yours or one built with you. Nobody here is recommending what to trade or promising a return. The decisions about strategy and risk stay yours.",
  },
  {
    q: "What's the difference between the Signal Bot and the Execution Bot?",
    a: "The Signal Bot calls the trade, entry, stop, target, out to a Telegram or Discord group without placing it. The Execution Bot runs the same underlying strategy but places the trade itself through a broker or exchange API. Same logic, different last step: one alerts, one acts.",
  },
  {
    q: "Can a bot post trading signals straight into my Telegram or Discord group?",
    a: "Yes. That's exactly what the Signal Bot is built to do: the moment your strategy's rules trigger, it posts the call directly into the group chat you already run, formatted the same way every time, instead of you or a moderator typing it out by hand.",
  },
  {
    q: "Can I let other people trade from my strategy without giving them my account?",
    a: "Yes, that's the copy-execution model. A follower connects their own broker or exchange account using their own API keys, scoped to trading only, and your signal mirrors into their account automatically. You never see their funds or their login, they never see your account either.",
  },
  {
    q: "Do my followers need to trust me with their money to copy my trades?",
    a: "No, and that's the point of doing it through separate API keys instead of a shared account. Each follower's connection is non-custodial and scoped to trading only, so their funds stay in their own account under their own control the entire time, same rule that applies to your own account.",
  },
  {
    q: "How does the whitelabel program work?",
    a: "It's a one-time setup fee for your own licensed instance of the engine, both the Signal Bot and the Execution Bot, which you then issue as license keys to your own followers or clients under your own brand, at whatever price you set for them. You run the relationship with your audience; the underlying infrastructure is what's licensed.",
  },
  {
    q: "Is there a trading bot developer based in Islamabad I can talk to directly?",
    a: "Yes. Patchbay is based in Islamabad, and trading system builds are handled by the same team you would be talking to about the project, not outsourced to a separate shop.",
  },
  {
    q: "Is there a trading bot developer in Pakistan who works with clients outside Islamabad?",
    a: "Yes. The base is Islamabad, but the process is remote-friendly end to end: a strategy call, demo-account testing you can watch yourself, and a shared project board, instead of in-person meetings. Clients across Pakistan, and internationally, are handled the same way.",
  },
  {
    q: "Is there a single developer building trading bots in Islamabad, not an agency?",
    a: "Yes. Zaheen Zuberi is the one point of contact for a trading bot build, from the strategy lab through the finished system, not an account manager relaying your requirements to someone else. A small team backs him where needed, but the person scoping and building the system is the one you talk to.",
  },
];

export default function TradingBotsPage() {
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#page`,
    url,
    name: title,
    description,
    about: { "@id": `${siteConfig.url}/#business` },
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: "Custom Trading Bot Development",
    serviceType: "Algorithmic trading system development",
    description,
    url,
    provider: { "@id": `${siteConfig.url}/#business` },
    areaServed: [
      { "@type": "City", name: "Islamabad" },
      { "@type": "Country", name: "Pakistan" },
      { "@type": "Place", name: "Worldwide" },
    ],
    audience: {
      "@type": "BusinessAudience",
      audienceType:
        "Traders and trading businesses with an existing strategy, and group owners running a signal or copy-trading following.",
    },
  };

  return (
    <div className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <FaqSchema items={faqs} />

      <Nav />

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-line pt-20 sm:pt-36">
          <div className="grid-veil pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-6xl px-6 pb-14 sm:pb-20">
            <Breadcrumbs
              trail={[
                { name: "Home", href: "/" },
                { name: "Trading Bots", href: "/trading-bots" },
              ]}
            />

            <div className="mt-8 grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
              <div className="max-w-3xl">
                <p className="font-mono text-xs tracking-[0.15em] text-signal">
                  ALGORITHMIC TRADING SYSTEMS
                </p>
                <h1 className="mt-4 text-balance text-4xl font-medium leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
                  Stop fighting latency. Automate your edge.
                </h1>
                <p className="mt-7 text-lg leading-relaxed text-paper-dim">
                  A strategy you only execute when you&apos;re awake, calm,
                  and paying attention isn&apos;t really a system, it&apos;s a
                  habit that breaks under pressure. This turns your rules
                  into code that
                  runs the same way at 3pm and 3am: no emotion, no hesitation,
                  and your funds never leave your own account.
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <Link
                    href="/#contact"
                    className="flex min-h-11 items-center rounded-full bg-signal px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-ink transition-transform hover:scale-[1.03]"
                  >
                    Request a system audit
                  </Link>
                  <a
                    href="#arsenal"
                    className="flex min-h-11 items-center rounded-full border border-line-strong px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-paper transition-colors hover:border-signal/60 hover:text-signal"
                  >
                    See how it&apos;s built
                  </a>
                </div>
              </div>

              <div className="floaty rounded-2xl border border-line-strong bg-ink-2/60 p-5">
                <div className="flex items-center justify-between font-mono text-xs sm:text-[11px] uppercase tracking-[0.1em] text-paper-dim">
                  <span>Channel</span>
                  <span className="flex items-center gap-1.5 text-online">
                    <span className="status-dot h-1.5 w-1.5 rounded-full bg-online" />
                    Open
                  </span>
                </div>
                <SignalBars count={14} className="mt-4 h-16" />
                <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                  {[
                    "MT4",
                    "MT5",
                    "Binance API",
                    "Bybit API",
                    "Interactive Brokers",
                    "Webhooks",
                  ].map(
                    (s) => (
                      <span
                        key={s}
                        className="rounded-full border border-line-strong px-2.5 py-0.5 font-mono text-xs sm:text-[10px] uppercase tracking-[0.08em] text-paper-dim"
                      >
                        {s}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Capability pitch */}
        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                Whatever you trade, however you already trade it.
              </h2>
              <p className="mt-4 max-w-2xl text-paper-dim">
                Forex, Binance crypto, stocks, futures: if the market has an
                API, a bot can be built for it. And this isn&apos;t a
                generic template bent to fit your account, it&apos;s your
                own edge, coded to run itself.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              <div className="rounded-2xl border border-line-strong bg-ink-2/60 p-6">
                <span className="font-mono text-xs uppercase tracking-[0.1em] text-signal">
                  Any market
                </span>
                <p className="mt-3 text-sm leading-relaxed text-paper-dim">
                  Forex, crypto, stocks, and futures are all built here, on
                  MT4/MT5, Binance, Bybit, Interactive Brokers, or another
                  broker or exchange with its own API.
                </p>
              </div>
              <div className="rounded-2xl border border-line-strong bg-ink-2/60 p-6">
                <span className="font-mono text-xs uppercase tracking-[0.1em] text-signal">
                  Your strategy, not a template
                </span>
                <p className="mt-3 text-sm leading-relaxed text-paper-dim">
                  Already trading a rule set, on TradingView, MT4/MT5, or
                  just in your head? It gets coded and automated exactly as
                  you run it. No strategy yet is fine too, that&apos;s what
                  the strategy lab is for.
                </p>
              </div>
              <div className="rounded-2xl border border-line-strong bg-ink-2/60 p-6">
                <span className="font-mono text-xs uppercase tracking-[0.1em] text-signal">
                  Built to actually ship
                </span>
                <p className="mt-3 text-sm leading-relaxed text-paper-dim">
                  Execution, signals, or both, proven on a demo account
                  before it ever touches real capital, and handed off
                  documented rather than left as a black box only I can
                  maintain.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pain matrix */}
        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                The three traps that eat a trader&apos;s edge.
              </h2>
              <p className="mt-4 max-w-2xl text-paper-dim">
                None of these are a strategy problem. They&apos;re an execution
                problem, and execution is exactly what a properly built
                system removes from your hands.
              </p>
            </Reveal>

            <div className="mt-12 divide-y divide-line border-y border-line">
              {painMatrix.map((row, i) => (
                <Reveal key={row.trap} delay={i * 60}>
                  <div className="grid gap-4 py-7 sm:grid-cols-[220px_1fr_1fr] sm:items-start sm:gap-8">
                    <h3 className="text-lg font-medium tracking-[-0.01em] text-paper">
                      {row.trap}
                    </h3>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-paper-dim">
                        Manual
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-paper-dim">
                        {row.manual}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-signal">
                        Automated
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-paper">
                        {row.automated}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Two systems */}
        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                Two systems, one strategy.
              </h2>
              <p className="mt-4 max-w-2xl text-paper-dim">
                Same rules, same signal, two different jobs. Which one you
                need depends on whether you want the trade placed for you or
                just called out to act on.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {systems.map((s, i) => (
                <Reveal key={s.name} delay={i * 80}>
                  <div className="h-full rounded-2xl border border-line-strong bg-ink-2/60 p-6 sm:p-8">
                    <span className="font-mono text-xs uppercase tracking-[0.1em] text-signal">
                      {s.tag}
                    </span>
                    <h3 className="mt-3 text-2xl font-medium tracking-[-0.01em] text-paper">
                      {s.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-paper-dim">
                      {s.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Core arsenal */}
        <section id="arsenal" className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                What actually gets built.
              </h2>
              <p className="mt-4 max-w-xl text-paper-dim">
                The core system every build starts from, before it&apos;s tailored
                to your specific strategy and accounts.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {arsenal.map((item, i) => (
                <Reveal key={item.title} delay={i * 60}>
                  <div className="h-full rounded-2xl border border-line-strong bg-ink-2/60 p-6">
                    <span className="font-mono text-xs text-signal">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 text-lg font-medium tracking-[-0.01em] text-paper">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-paper-dim">
                      {item.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* AI strategy lab */}
        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                The strategy lab.
              </h2>
              <p className="mt-4 max-w-2xl text-paper-dim">
                For traders who want a strategy built and proven, not just
                automated. A candidate rule set only reaches your account
                after it survives testing on a demo account first, step
                through the process below.
              </p>
            </Reveal>
            <div className="mt-10">
              <Reveal variant="scale">
                <AiStrategyLab />
              </Reveal>
            </div>
          </div>
        </section>

        {/* Backtesting and risk, documented */}
        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                Backtesting and risk management, documented.
              </h2>
              <p className="mt-4 max-w-2xl text-paper-dim">
                Not a claim to take on faith, the actual process every
                strategy goes through before it touches your account.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              <Reveal>
                <div className="h-full rounded-2xl border border-line-strong bg-ink-2/60 p-6">
                  <h3 className="text-lg font-medium tracking-[-0.01em] text-paper">
                    Backtesting
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-paper-dim">
                    Every candidate strategy, yours or one built in the
                    strategy lab, is tested against historical price data
                    across more than one market condition first, not just a
                    stretch that happens to flatter it. It then runs again on
                    a demo account against live market data before it&apos;s
                    ever proposed for real capital. What you get out of that
                    is a plain result, win rate, drawdown, and how it behaved
                    outside its best case, not a verbal assurance that it
                    works.
                  </p>
                </div>
              </Reveal>
              <Reveal delay={60}>
                <div className="h-full rounded-2xl border border-line-strong bg-ink-2/60 p-6">
                  <h3 className="text-lg font-medium tracking-[-0.01em] text-paper">
                    Risk management
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-paper-dim">
                    Position sizing and a daily drawdown limit are set before
                    the system ever goes live, at numbers you choose, not a
                    fixed default. Once that drawdown limit is hit, the
                    system soft-locks itself for the rest of the day. It is
                    the one rule every discretionary trader breaks under
                    pressure, enforced here in code instead of willpower.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Personal credibility */}
        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <Reveal>
                <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                  Built by someone who has actually traded.
                </h2>
                <p className="mt-5 max-w-xl text-paper-dim">
                  This service line is new, but trading isn&apos;t new to me.
                  I&apos;ve traded crypto and Quotex myself, and built a
                  Binance trading bot for my own account. If you want to see
                  real logic and a real interface before committing to
                  anything, I&apos;m open to walking through it with you
                  directly, not a polished sales reel.
                </p>
              </Reveal>
              <Reveal delay={80}>
                <a
                  href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent("Trading bot demo")}`}
                  className="flex min-h-11 w-fit items-center rounded-full border border-line-strong px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-paper transition-colors hover:border-signal/60 hover:text-signal"
                >
                  Ask to see the demo
                </a>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Whitelabel */}
        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-signal">
                  For gurus and group owners
                </p>
                <h2 className="mt-4 text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                  License the engine. Sell access under your own brand.
                </h2>
                <p className="mt-5 max-w-xl text-paper-dim">
                  If you run a trading community, a signal channel, or a
                  following that already trusts your calls, that following is
                  worth more than a screenshot dropped in the group chat by
                  hand. A licensed instance of the engine gets you license
                  keys you issue and revoke yourself, sold to your audience
                  however you price it.
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex gap-4 border-l border-line-strong pl-4">
                    <span className="font-mono text-xs text-signal">01</span>
                    <span className="text-sm leading-relaxed text-paper-dim">
                      A licensed instance of the engine, configured to your
                      signals.
                    </span>
                  </li>
                  <li className="flex gap-4 border-l border-line-strong pl-4">
                    <span className="font-mono text-xs text-signal">02</span>
                    <span className="text-sm leading-relaxed text-paper-dim">
                      Signal-only key: the Signal Bot posts every call
                      straight into your Telegram or Discord group the moment
                      it fires. No broker access needed from your followers
                      at all, just the group they&apos;re already in.
                    </span>
                  </li>
                  <li className="flex gap-4 border-l border-line-strong pl-4">
                    <span className="font-mono text-xs text-signal">03</span>
                    <span className="text-sm leading-relaxed text-paper-dim">
                      Copy-execution key: a follower who wants more than an
                      alert connects their own broker or exchange account on
                      their own API keys, and the Execution Bot mirrors your
                      trades into their account automatically. You never see
                      or touch their funds, same non-custodial rule as
                      everywhere else on this page.
                    </span>
                  </li>
                  <li className="flex gap-4 border-l border-line-strong pl-4">
                    <span className="font-mono text-xs text-signal">04</span>
                    <span className="text-sm leading-relaxed text-paper-dim">
                      You issue both kinds of key to your own followers or
                      clients under your own brand, and set what each one
                      costs.
                    </span>
                  </li>
                </ul>
                <div className="mt-9">
                  <a
                    href={`mailto:${siteConfig.contactEmail}?subject=Whitelabel%20engine`}
                    className="flex min-h-11 w-fit items-center rounded-full bg-signal px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-ink transition-transform hover:scale-[1.03]"
                  >
                    Ask about whitelabel access
                  </a>
                </div>
              </Reveal>

              <Reveal variant="scale" delay={80}>
                <div className="rounded-2xl border border-line-strong bg-ink-2/60 p-6 sm:p-8">
                  <p className="font-mono text-xs uppercase tracking-[0.1em] text-paper-dim">
                    Tell us the shape of it
                  </p>
                  <div className="mt-6 space-y-6">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.1em] text-signal">
                        Market
                      </p>
                      <p className="mt-2 text-lg leading-relaxed text-paper">
                        Forex, Binance crypto, stocks, or futures.
                      </p>
                    </div>
                    <div className="border-t border-line pt-6">
                      <p className="font-mono text-xs uppercase tracking-[0.1em] text-signal">
                        Platform
                      </p>
                      <p className="mt-2 text-lg leading-relaxed text-paper">
                        MT4/MT5, Binance, Bybit, Interactive Brokers, or
                        another broker or exchange with its own API.
                      </p>
                    </div>
                    <div className="border-t border-line pt-6">
                      <p className="font-mono text-xs uppercase tracking-[0.1em] text-signal">
                        Strategy
                      </p>
                      <p className="mt-2 text-lg leading-relaxed text-paper">
                        Already have one, or need one developed through the
                        strategy lab.
                      </p>
                    </div>
                  </div>
                  <p className="mt-6 border-t border-line pt-6 text-sm leading-relaxed text-paper-dim">
                    Tell me those three things and you get a specific quote
                    and a real timeline, not a fixed price list that fits
                    nobody.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Dashboard preview */}
        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                What you&apos;ll be looking at once it&apos;s live.
              </h2>
              <p className="mt-4 max-w-xl text-paper-dim">
                Every build ships with a monitoring panel wired to your own
                account. Shown empty here, because this page is not going to
                pretend a live result exists before it does.
              </p>
            </Reveal>
            <div className="mt-10">
              <SystemDashboard />
            </div>
          </div>
        </section>

        <Faq items={faqs} heading="Trading bot development: questions" />

        {/* CTA */}
        <section className="py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="relative rounded-2xl border border-line-strong bg-ink-2/60 px-6 py-16 text-center sm:px-16">
                <span className="absolute right-6 top-6 flex items-center gap-2 rounded-full border border-online/30 px-2.5 py-1 font-mono text-xs sm:text-[10px] uppercase tracking-[0.1em] text-online">
                  <span className="status-dot h-1.5 w-1.5 rounded-full bg-online" />
                  Channel open
                </span>
                <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                  Tell me what you&apos;re already trading.
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-paper-dim">
                  Describe your strategy, your broker or exchange, and how
                  many accounts you&apos;re running, and you get a specific quote
                  and a real timeline, not a brochure.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <a
                    href={`mailto:${siteConfig.contactEmail}`}
                    className="inline-flex min-h-11 items-center break-all font-mono text-lg text-signal underline decoration-signal/30 underline-offset-8 transition-colors hover:decoration-signal sm:text-xl"
                  >
                    {siteConfig.contactEmail}
                  </a>
                </div>
                <div className="mt-6">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-11 w-fit mx-auto items-center rounded-full border border-line-strong px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-paper transition-colors hover:border-signal/60 hover:text-signal"
                  >
                    Ask on WhatsApp
                  </a>
                </div>
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
