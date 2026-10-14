import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVoiceNiche, voiceNiches } from "@/lib/voice-niches";
import { getService } from "@/lib/services";
import { getCaseStudy } from "@/lib/case-studies";
import { siteConfig, whatsappUrl } from "@/lib/site-config";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatWidget } from "@/components/ChatWidget";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq, FaqSchema } from "@/components/Faq";
import { LeadForm } from "@/components/LeadForm";
import { Reveal } from "@/components/Reveal";

// One page per industry that lives on the phone, each answering the same
// three searches (AI receptionist, AI voice agent, AI calling agent) for that
// industry. The copy comes from src/lib/voice-niches/*, written per niche:
// the call types, intake questions, handoff rules, systems, and the one
// thing to be careful about are all different, so these are not a
// find-and-replace of a trade name. Do not add a niche without writing those
// fields for real, and do not claim a client in a niche we have not served.

export function generateStaticParams() {
  return voiceNiches.map((n) => ({ niche: n.slug }));
}

export async function generateMetadata(
  props: PageProps<"/ai-receptionist-for/[niche]">,
): Promise<Metadata> {
  const { niche } = await props.params;
  const n = getVoiceNiche(niche);
  if (!n) return {};

  const url = `${siteConfig.url}/ai-receptionist-for/${n.slug}`;
  return {
    title: n.metaTitle,
    description: n.metaDescription,
    keywords: [
      `AI receptionist for ${n.plural.toLowerCase()}`,
      `AI voice agent for ${n.plural.toLowerCase()}`,
      `AI calling agent for ${n.plural.toLowerCase()}`,
      `AI answering service for ${n.plural.toLowerCase()}`,
      `virtual receptionist for a ${n.noun}`,
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: siteConfig.name,
      title: n.metaTitle,
      description: n.metaDescription,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: n.metaTitle,
      description: n.metaDescription,
    },
  };
}

const steps = [
  {
    title: "You describe how calls come in",
    body: "A short call about your real call types, hours, and what a good outcome looks like.",
  },
  {
    title: "We write the agent around your rules",
    body: "Your script, your escalation rules, your wording for anything sensitive. You approve it before it takes a live call.",
  },
  {
    title: "It goes live on your number",
    body: "Calls are answered by the agent and summaries land in your inbox, CRM, or phone.",
  },
  {
    title: "We review the calls and correct it",
    body: "Early call logs are read and the agent is fixed where it handled something badly.",
  },
];

export default async function VoiceNichePage(
  props: PageProps<"/ai-receptionist-for/[niche]">,
) {
  const { niche } = await props.params;
  const n = getVoiceNiche(niche);
  if (!n) notFound();

  const url = `${siteConfig.url}/ai-receptionist-for/${n.slug}`;
  const voiceService = getService("ai-voice-agents");
  const leadCalling = getCaseStudy("construction-lead-calling");
  const related = n.related
    .map((slug) => getVoiceNiche(slug))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#page`,
    url,
    name: n.metaTitle,
    description: n.metaDescription,
    about: { "@id": `${siteConfig.url}/#business` },
  };

  const faqs = n.faqs;

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
                { name: "AI Receptionists", href: "/ai-receptionist-for" },
                { name: n.plural, href: `/ai-receptionist-for/${n.slug}` },
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
                {n.h1}.
              </h1>
              <p className="mt-7 text-lg leading-relaxed text-paper-dim">
                {n.intro}
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

        <section className="border-b border-line py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="max-w-3xl text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                Why the phone matters for {n.plural.toLowerCase()}
              </h2>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-paper-dim">
                {n.why}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="border-b border-line py-14 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
            <Reveal>
              <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                Calls it answers
              </h2>
              <ul className="mt-6 space-y-3 text-paper-dim">
                {n.inbound.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <span aria-hidden="true" className="text-signal">
                      &rarr;
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                Calls it makes
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-paper-dim">
                Outbound calling only goes to people who gave you their number
                and agreed to be contacted. In the US, AI-generated voices are
                treated as artificial under consumer calling rules, so we do
                not build cold-calling.
              </p>
              <ul className="mt-5 space-y-3 text-paper-dim">
                {n.outbound.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <span aria-hidden="true" className="text-signal">
                      &rarr;
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section className="border-b border-line py-14 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
            <Reveal>
              <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                What it collects before anything reaches you
              </h2>
              <ul className="mt-6 space-y-3 text-paper-dim">
                {n.intake.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <span aria-hidden="true" className="text-signal">
                      &bull;
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                When a person takes over
              </h2>
              <ul className="mt-6 space-y-3 text-paper-dim">
                {n.handoff.map((item) => (
                  <li key={item} className="flex gap-3 leading-relaxed">
                    <span aria-hidden="true" className="text-signal">
                      &bull;
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section className="border-b border-line py-14 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2">
            <Reveal>
              <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                Where it plugs in
              </h2>
              <p className="mt-5 leading-relaxed text-paper-dim">{n.tools}</p>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                One thing to know up front
              </h2>
              <p className="mt-5 leading-relaxed text-paper-dim">{n.watch}</p>
            </Reveal>
          </div>
        </section>

        <section className="border-b border-line py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                How a build works
              </h2>
            </Reveal>
            <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <Reveal key={s.title} delay={i * 40}>
                  <li className="h-full rounded-2xl border border-line-strong bg-ink-2/60 p-6">
                    <span className="block text-base font-medium text-paper">
                      {s.title}
                    </span>
                    <span className="mt-3 block text-sm leading-relaxed text-paper-dim">
                      {s.body}
                    </span>
                  </li>
                </Reveal>
              ))}
            </ol>
            <p className="mt-8 max-w-3xl text-sm leading-relaxed text-paper-dim">
              We are a Pakistan-based team and work with US businesses
              remotely, over calls and a shared project board, with no
              time-zone dependency on the live agent, which answers around the
              clock. See{" "}
              <Link
                href="/international-clients"
                className="text-signal underline decoration-signal/30 underline-offset-4 hover:decoration-signal"
              >
                how we work with clients outside Pakistan
              </Link>
              .
            </p>
          </div>
        </section>

        <Faq
          items={faqs}
          heading={`AI voice agents for ${n.plural.toLowerCase()}: questions`}
        />

        <section className="border-b border-line py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                What we have actually built
              </h2>
              <p className="mt-5 max-w-3xl leading-relaxed text-paper-dim">
                A live client voice agent that calls and qualifies its own
                leads and books the appointment on the call, plus the full
                service page for what a build includes.
              </p>
            </Reveal>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {leadCalling && (
                <Reveal>
                  <Link
                    href={`/work/${leadCalling.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-line-strong bg-ink-2/60 p-6 transition-colors hover:border-signal/50"
                  >
                    <span className="font-mono text-xs text-signal">
                      Client, live voice agent
                    </span>
                    <span className="mt-2 text-lg font-medium tracking-[-0.01em] text-paper transition-colors group-hover:text-signal">
                      {leadCalling.name}
                    </span>
                    <span className="mt-3 text-sm leading-relaxed text-paper-dim">
                      Outbound lead calling, qualification, and booking on the
                      call itself.
                    </span>
                  </Link>
                </Reveal>
              )}
              {voiceService && (
                <Reveal delay={50}>
                  <Link
                    href={`/services/${voiceService.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-line-strong bg-ink-2/60 p-6 transition-colors hover:border-signal/50"
                  >
                    <span className="font-mono text-xs text-signal">
                      Service page
                    </span>
                    <span className="mt-2 text-lg font-medium tracking-[-0.01em] text-paper transition-colors group-hover:text-signal">
                      {voiceService.name}
                    </span>
                    <span className="mt-3 text-sm leading-relaxed text-paper-dim">
                      What a build includes, the stack, and the process.
                    </span>
                  </Link>
                </Reveal>
              )}
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="border-b border-line py-14 sm:py-20">
            <div className="mx-auto max-w-6xl px-6">
              <Reveal>
                <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                  Related industries
                </h2>
              </Reveal>
              <div className="mt-6 flex flex-wrap gap-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/ai-receptionist-for/${r.slug}`}
                    className="flex min-h-11 items-center rounded-full border border-line-strong px-5 py-2 text-sm text-paper transition-colors hover:border-signal/60 hover:text-signal"
                  >
                    AI receptionist for {r.plural.toLowerCase()}
                  </Link>
                ))}
                <Link
                  href="/ai-receptionist-for"
                  className="flex min-h-11 items-center rounded-full border border-line-strong px-5 py-2 text-sm text-paper-dim transition-colors hover:border-signal/60 hover:text-signal"
                >
                  All industries
                </Link>
              </div>
            </div>
          </section>
        )}

        <section id="contact" className="py-14 sm:py-24">
          <div className="mx-auto max-w-3xl px-6">
            <Reveal>
              <div className="rounded-2xl border border-line-strong bg-ink-2/60 px-6 py-12 sm:px-12">
                <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                  Tell us how your calls actually come in.
                </h2>
                <p className="mt-4 text-paper-dim">
                  Describe a typical day on your phones and you get a specific
                  quote and a real timeline, not a brochure.
                </p>
                <div className="mt-8">
                  <LeadForm
                    interest={`AI voice agent: ${n.plural}`}
                    source={`form:ai-receptionist-${n.slug}`}
                  />
                </div>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="mt-6 inline-flex min-h-11 items-center break-all font-mono text-sm text-signal underline decoration-signal/30 underline-offset-8 transition-colors hover:decoration-signal"
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
