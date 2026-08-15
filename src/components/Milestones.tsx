import { Reveal } from "./Reveal";
import { FlipCard } from "./FlipCard";
import { SectionGlow } from "./SectionGlow";
import { SECTION_ACCENTS } from "@/lib/section-theme";

const MILESTONES = [
  {
    tag: "CRICKET",
    front: "National U16",
    back: "Played competitive cricket to the national level at U16. The same discipline shows up in how I run projects now: show up, execute the process, repeat.",
  },
  {
    tag: "ORIGIN",
    front: "Family business",
    back: "My father runs an IT company. Growing up around it is where I learned to think in systems before I ever wrote a line of code.",
  },
  {
    tag: "CRAFT",
    front: "Self-taught, 19",
    back: "No bootcamp, no degree, just shipped products. Full-stack website development and AI systems learned by building things people actually use.",
  },
  {
    tag: "PRACTICE",
    front: "Founded Patchbay",
    back: "Built to be the one team that replaces an entire agency. Marketing and AI automation, run end to end by specialists on one accountable team, led by me.",
  },
];

export function Milestones() {
  return (
    <section
      id="milestones"
      className="relative scroll-mt-28 overflow-hidden border-b border-line py-16 sm:py-28"
    >
      <SectionGlow color={SECTION_ACCENTS.milestones} />
      <div className="mx-auto max-w-6xl px-6">
        <Reveal variant="blur">
          <h2 className="max-w-2xl text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
            The record behind the work.
          </h2>
        </Reveal>

        <div className="mt-10 sm:mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MILESTONES.map((m, i) => (
            <Reveal key={m.tag} delay={i * 60} variant="scale">
              <FlipCard
                className="h-60 sm:h-52"
                front={
                  <div className="flex h-full flex-col justify-between rounded-2xl border border-line-strong bg-ink-2/60 p-6 transition-colors group-hover:border-signal/50">
                    <span className="font-mono text-xs sm:text-[10px] uppercase tracking-[0.15em] text-signal">
                      {m.tag}
                    </span>
                    <p className="text-xl font-medium leading-tight tracking-[-0.01em] text-paper">
                      {m.front}
                    </p>
                  </div>
                }
                back={
                  <div className="flex h-full flex-col justify-center rounded-2xl border border-signal/40 bg-ink-3 p-6">
                    <p className="text-sm leading-relaxed text-paper">
                      {m.back}
                    </p>
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
