import Image from "next/image";
import { Reveal } from "./Reveal";
import { SectionGlow } from "./SectionGlow";
import { SECTION_ACCENTS } from "@/lib/section-theme";
import { siteConfig } from "@/lib/site-config";

const PATH = ["Brief", "Build", "Automate", "Ship"];

const siteHost = siteConfig.url.replace(/^https?:\/\//, "");

export function About() {
  return (
    <section
      id="about"
      className="relative scroll-mt-28 overflow-hidden border-b border-line py-16 sm:py-28"
    >
      <SectionGlow color={SECTION_ACCENTS.about} />
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <Reveal variant="left">
            <div className="floaty-slow overflow-hidden rounded-2xl border border-line-strong bg-ink-2">
              <div className="relative aspect-[4/5]">
                <Image
                  src="/zaheen-about.jpg"
                  alt="Zaheen Zuberi, founder of Patchbay, AI automation and full-stack web developer in Islamabad"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink to-transparent px-5 pb-5 pt-10">
                  <p className="font-mono text-xs sm:text-[10px] uppercase tracking-[0.22em] text-signal">
                    {siteConfig.name}
                  </p>
                  <p className="mt-2 font-display text-xl font-medium tracking-[-0.01em] text-paper">
                    {siteConfig.ownerName}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs sm:text-[11px] text-paper-dim">
                    <span>Founder</span>
                    <span className="text-line-strong">/</span>
                    <span>{siteConfig.location}</span>
                  </div>
                  <p className="mt-3 border-t border-line-strong pt-3 font-mono text-xs sm:text-[11px] tracking-[0.06em] text-signal">
                    {siteHost}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal variant="right">
              <h2 className="text-balance text-3xl font-medium leading-tight tracking-[-0.02em] sm:text-4xl">
                I like the part where a workflow finally stops needing a
                human.
              </h2>
              <div className="mt-8 space-y-4 text-paper-dim">
                <p>
                  I&apos;m 19, based in Islamabad, and I run Patchbay. It
                  covers everything a marketing agency does (brand, content,
                  social) plus the AI and dev work most agencies quietly
                  outsource: voice agents, chatbots, automation, and the
                  full-stack websites and systems underneath.
                </p>
                <p>
                  My father runs an IT company, and growing up around that
                  taught me how to think in systems before I ever wrote a
                  line of code. Before any of this, I played competitive
                  cricket up to the national level at U16. It was a
                  different kind of training, but the same discipline: show
                  up, execute the process, and let the scoreboard take care
                  of itself.
                </p>
                <p>
                  I taught myself to build and shipped real, working
                  products from there. A live tool used by creators
                  (Tryvoicely), a client&apos;s entire web and social
                  presence (Umer Wazir), and now Patchbay itself.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="mt-10 rounded-2xl border border-line-strong bg-ink-2/60 p-6">
                <p className="mb-6 font-mono text-xs sm:text-[11px] uppercase tracking-[0.1em] text-paper-dim">
                  How a project runs
                </p>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                  {PATH.map((step, i) => (
                    <div key={step}>
                      <span className="font-mono text-xs text-signal">
                        0{i + 1}
                      </span>
                      <p className="mt-2 font-medium text-paper">{step}</p>
                      <p className="mt-1 text-xs leading-relaxed text-paper-dim">
                        {step === "Brief" &&
                          "Scope the real workflow, not just the feature request."}
                        {step === "Build" &&
                          "Ship the agent, bot, or app as a working system, fast."}
                        {step === "Automate" &&
                          "Wire it into the tools that already run the business."}
                        {step === "Ship" &&
                          "Live, monitored, and handed off. Not a demo."}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
