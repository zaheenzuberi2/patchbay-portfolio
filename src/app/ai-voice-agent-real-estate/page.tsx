import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig, whatsappUrl } from "@/lib/site-config";
import { getService } from "@/lib/services";
import { getCaseStudy } from "@/lib/case-studies";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatWidget } from "@/components/ChatWidget";
import { VoiceWidget } from "@/components/VoiceWidget";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Faq, FaqSchema } from "@/components/Faq";
import { Reveal } from "@/components/Reveal";
// Code-split and client-only; see VoiceDemoLazy.tsx for why.
import { VoiceDemoLazy as VoiceDemo } from "@/components/VoiceDemoLazy";

// A vertical-specific landing page for real estate buyers searching for a
// voice agent, sitting alongside /services/ai-voice-agents rather than
// duplicating it: the service page's FAQs are general, these are specific
// to property inquiries (budget qualification, listing lookups, portal
// leads). Real estate is already named in that service's own "goodFor"
// field, so this page is a narrower entry point into the same real work,
// not a new claim. AD Real Estate (case-studies.ts) is referenced honestly
// as a real, live real estate client for the web and lead-pipeline side.
// It does not use a voice agent, and this page does not claim it does.
const title = "AI Voice Agents for Real Estate Agencies";
const description =
  "An AI voice agent that answers property inquiries around the clock, qualifies callers by budget and area, and books viewings straight into your calendar. Real estate is where a missed call is a lost lead.";
const url = `${siteConfig.url}/ai-voice-agent-real-estate`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "AI voice agent real estate",
    "AI receptionist real estate agency",
    "real estate call answering service",
    "property inquiry AI voice agent",
    "AI voice agent real estate Pakistan",
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
    q: "Can it qualify a caller by budget and area before I speak to them?",
    a: "Yes. The agent can ask the same qualifying questions a good agent would ask on the phone, budget range, preferred area, timeline, and only escalate the calls that actually match what you have available.",
  },
  {
    q: "Can it answer basic questions about a specific listing?",
    a: "Yes, if it is set up with your current listing information. It can confirm price, size, and location details on a call rather than telling every caller to check the website.",
  },
  {
    q: "Does it work alongside leads coming from property portals like Zameen or Graana?",
    a: "The agent handles inbound phone calls, which is a different channel from portal-generated leads, but it can be wired into the same CRM so a phone inquiry and a portal inquiry land in one place instead of two.",
  },
  {
    q: "Can it handle Urdu-speaking callers asking about a property?",
    a: "Yes. Language handling, including callers who switch between Urdu and English mid-sentence, is part of the setup, which matters for a market where that is the normal way people speak on the phone.",
  },
  {
    q: "Do you have real estate clients already?",
    a: "AD Real Estate & Builders, a DHA Islamabad property advisory, is a real, live client, currently for the web and lead-pipeline side of the business, not yet a voice agent. Real estate is named directly as a fit for this service because a missed call is a lost lead in this business specifically, not because of a case study that does not exist yet.",
  },
];

export default function AiVoiceAgentRealEstatePage() {
  const voiceService = getService("ai-voice-agents");
  const adRealEstate = getCaseStudy("ad-real-estate");

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#page`,
    url,
    name: title,
    description,
    about: { "@id": `${siteConfig.url}/#business` },
  };

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
                  name: "AI Voice Agents for Real Estate",
                  href: "/ai-voice-agent-real-estate",
                },
              ]}
            />

            <div className="mt-8 max-w-3xl">
              <h1 className="text-balance text-4xl font-medium leading-[1.08] tracking-[-0.03em] sm:text-5xl">
                An AI voice agent that never sends a property inquiry to
                voicemail.
              </h1>
              <p className="mt-7 text-lg leading-relaxed text-paper-dim">
                A real estate agency lives on the phone. A caller who hits
                voicemail asking about a plot in DHA usually just calls the
                next agency instead of waiting for a callback. An AI
                receptionist answers live, at any hour, and qualifies the
                caller before the call reaches you.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/#contact"
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
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <Reveal>
                  <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                    Hear it for yourself.
                  </h2>
                  <p className="mt-4 max-w-xl text-paper-dim">
                    A real, working sample of the agent&apos;s voice, not a
                    mockup. Runs in your browser, not a live phone system.
                  </p>
                </Reveal>
              </div>
              <div className="max-w-md lg:mx-auto lg:w-full">
                <Reveal variant="scale">
                  <VoiceDemo />
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <Faq
          items={faqs}
          heading="AI voice agents for real estate: questions"
        />

        <section className="border-b border-line py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="text-balance text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
                Real estate work already on record.
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {adRealEstate && (
                <Reveal delay={0}>
                  <Link
                    href={`/work/${adRealEstate.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-line-strong bg-ink-2/60 p-6 transition-colors hover:border-signal/50"
                  >
                    <span className="font-mono text-xs text-signal">
                      Client, live
                    </span>
                    <span className="mt-2 text-lg font-medium tracking-[-0.01em] text-paper transition-colors group-hover:text-signal">
                      {adRealEstate.name}
                    </span>
                    <span className="mt-3 text-sm leading-relaxed text-paper-dim">
                      Web and lead-pipeline build for a DHA Islamabad property
                      advisory.
                    </span>
                  </Link>
                </Reveal>
              )}
              {voiceService && (
                <Reveal delay={50}>
                  <Link
                    href={`/services/${voiceService.slug}`}
                    className="group flex items-baseline justify-between gap-6 rounded-2xl border border-line-strong bg-ink-2/60 p-6 transition-colors hover:border-signal/50"
                  >
                    <span>
                      <span className="font-mono text-xs text-signal">
                        CH.{voiceService.channel}
                      </span>
                      <span className="mt-2 block text-lg font-medium tracking-[-0.01em] text-paper transition-colors group-hover:text-signal">
                        {voiceService.name}
                      </span>
                      <span className="mt-3 block text-sm leading-relaxed text-paper-dim">
                        The full service page: pricing, process, and the demo
                        above.
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
              )}
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="relative rounded-2xl border border-line-strong bg-ink-2/60 px-6 py-16 text-center sm:px-16">
                <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                  Tell me how your calls actually come in.
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-paper-dim">
                  Describe what a caller usually wants and you get a specific
                  quote and a real timeline, not a brochure.
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
