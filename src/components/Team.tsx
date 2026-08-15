import { Reveal } from "./Reveal";
import { SectionGlow } from "./SectionGlow";
import { SECTION_ACCENTS } from "@/lib/section-theme";
import { TEAM_ROLES } from "@/lib/team";

export function Team() {
  return (
    <section
      id="team"
      className="relative scroll-mt-28 overflow-hidden border-b border-line py-16 sm:py-28"
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

        {/* Two columns on a phone rather than one. Seven full-width cards ran
            2.6 screens; paired and tightened they fit in well under half that.
            Nothing is hidden at any width: mobile is the primary audience
            here, so shrinking the type is the right trade and dropping the
            detail would not be. */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-5 lg:grid-cols-3">
          {TEAM_ROLES.map((member, i) => (
            <Reveal key={member.key} delay={i * 60} variant="scale">
              <div className="flex h-full flex-col justify-between rounded-2xl border border-line-strong bg-ink-2/60 p-3 transition-colors hover:border-signal/50 sm:p-6">
                <div>
                  <span className="font-mono text-xs text-signal">
                    OP.{String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-sm font-medium tracking-[-0.01em] text-paper sm:mt-3 sm:text-xl">
                    {member.title}
                  </h3>
                  <p className="mt-1 font-mono text-xs uppercase tracking-[0.1em] text-paper-dim sm:text-[11px]">
                    {member.role}
                  </p>
                </div>
                <p className="mt-2 text-xs leading-snug text-paper-dim sm:mt-4 sm:text-sm sm:leading-relaxed">
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
