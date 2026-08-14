import { Reveal } from "./Reveal";
import { SectionGlow } from "./SectionGlow";
import { SECTION_ACCENTS } from "@/lib/section-theme";
import { TEAM_ROLES } from "@/lib/team";

export function Team() {
  return (
    <section
      id="team"
      className="relative scroll-mt-28 overflow-hidden border-b border-line py-28"
    >
      <SectionGlow color={SECTION_ACCENTS.team} />
      <div className="mx-auto max-w-6xl px-6">
        <Reveal variant="blur">
          <h2 className="max-w-2xl text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
            One accountable team, not a subcontractor chain.
          </h2>
          <p className="mt-4 max-w-xl text-paper-dim">
            Every channel on this board is run by someone who owns that
            specific discipline, working from the same brief instead of a
            handoff between separate companies.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM_ROLES.map((member, i) => (
            <Reveal key={member.key} delay={i * 60} variant="scale">
              <div className="flex h-full flex-col justify-between rounded-2xl border border-line-strong bg-ink-2/60 p-6 transition-colors hover:border-signal/50">
                <div>
                  <span className="font-mono text-xs text-signal">
                    OP.{String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-xl font-medium tracking-[-0.01em] text-paper">
                    {member.title}
                  </h3>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-paper-dim">
                    {member.role}
                  </p>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-paper-dim">
                  {member.focus}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
