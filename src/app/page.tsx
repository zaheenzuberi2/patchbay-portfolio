import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Channels } from "@/components/Channels";
import { Stack } from "@/components/Stack";
import { Work } from "@/components/Work";
import { Reviews } from "@/components/Reviews";
import { About } from "@/components/About";
import { Team } from "@/components/Team";
import { Milestones } from "@/components/Milestones";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatWidget } from "@/components/ChatWidget";
import { VoiceWidget } from "@/components/VoiceWidget";
import Link from "next/link";
import { Faq, FaqSchema } from "@/components/Faq";
import { homeFaqs } from "@/lib/home-faqs";
import { totalFaqCount } from "@/lib/all-faqs";

// Projects are admin-editable at runtime, so the homepage must render fresh
// on every request rather than being baked into a static page at build time.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <FaqSchema items={homeFaqs} />
      <Nav />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Channels />
        <Stack />
        <Work />
        <Reviews />
        <About />
        <Team />
        <Milestones />
        <Faq items={homeFaqs} heading="Questions people ask before hiring." />
        <div className="border-b border-line py-8 text-center">
          <Link
            href="/faq"
            className="inline-flex min-h-11 items-center px-4 font-mono text-xs uppercase tracking-[0.1em] text-signal underline decoration-signal/30 underline-offset-4 transition-colors hover:decoration-signal"
          >
            See all {totalFaqCount}+ questions &rarr;
          </Link>
        </div>
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      <ChatWidget />
      <VoiceWidget />
    </div>
  );
}
