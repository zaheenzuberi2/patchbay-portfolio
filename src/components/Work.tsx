import { Reveal } from "./Reveal";
import { SectionGlow } from "./SectionGlow";
import { SECTION_ACCENTS } from "@/lib/section-theme";
import { listProjects, type ProjectRow } from "@/lib/db";
import { caseStudies } from "@/lib/case-studies";
import Link from "next/link";

export async function Work() {
  // A database blip must not take down the whole marketing page. If the query
  // fails, log it loudly on the server and drop just this section so the hero,
  // services, FAQ, and contact still render and still convert.
  let rows: ProjectRow[] = [];
  try {
    rows = await listProjects();
  } catch (err) {
    console.error("[Work] could not load projects, hiding section:", err);
    return null;
  }

  const projects = rows.filter((r) => r.kind !== "open_slot");
  const openSlots = rows.filter((r) => r.kind === "open_slot");

  return (
    <section
      id="work"
      className="relative scroll-mt-28 overflow-hidden border-b border-line py-16 sm:py-28"
    >
      <SectionGlow color={SECTION_ACCENTS.work} />
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
              Projects.
            </h2>
          </div>
        </Reveal>

        <div className="mt-8 sm:mt-12 divide-y divide-line border-y border-line font-mono">
          {projects.map((p, i) => {
            const tags: string[] = JSON.parse(p.tags);
            const Row = (
              <div className="group grid gap-x-6 gap-y-2 py-5 sm:py-6 sm:grid-cols-[6rem_1fr_auto] sm:items-baseline">
                <span className="text-xs text-paper-dim">
                  SESSION
                  <br />
                  <span className="text-sm text-signal">{p.session_id}</span>
                </span>

                <div>
                  <div className="flex flex-wrap items-baseline gap-3">
                    <h3 className="font-display text-xl font-medium tracking-[-0.01em] text-paper transition-colors group-hover:text-signal">
                      {p.name}
                    </h3>
                    <span className="text-xs sm:text-[11px] uppercase tracking-[0.08em] text-paper-dim">
                      {p.client}
                    </span>
                  </div>
                  <p className="mt-2 max-w-xl font-display text-sm leading-relaxed text-paper-dim">
                    {p.description}
                  </p>
                  {tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-line-strong px-2.5 py-0.5 text-xs sm:text-[10px] uppercase tracking-[0.08em] text-paper-dim"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <span className="justify-self-start rounded-full border border-online/40 px-2.5 py-1 text-xs sm:text-[10px] uppercase tracking-[0.1em] text-online sm:justify-self-end">
                  {p.status}
                </span>
              </div>
            );

            // Rows link out to the live site, so the on-site case study gets
            // its own link beside the row (an <a> cannot nest in an <a>).
            // Matched by name because the DB session ids and the case-study
            // ids are numbered independently.
            const pn = p.name.toLowerCase();
            const study = caseStudies.find((c) => {
              const cn = c.name.toLowerCase();
              return pn.includes(cn) || cn.includes(pn);
            });
            return (
              <Reveal key={p.id} delay={i * 60}>
                {p.href ? (
                  // No target="_blank": that opens a brand-new tab with its
                  // own empty history, so on mobile the back gesture has
                  // nothing to go back to and only the tab switcher, not the
                  // back button, returns you to this page. Same-tab
                  // navigation makes the native back gesture work the way a
                  // visitor actually expects. rel="noreferrer" stays, it's
                  // still meaningful without target.
                  <a href={p.href} rel="noreferrer" className="block">
                    {Row}
                  </a>
                ) : (
                  Row
                )}
                {study && (
                  <Link
                    href={`/work/${study.slug}`}
                    className="-mt-2 mb-5 inline-block text-xs uppercase tracking-[0.08em] text-signal underline decoration-signal/30 underline-offset-4 transition-colors hover:decoration-signal sm:ml-[7.5rem]"
                  >
                    Read the case study
                  </Link>
                )}
              </Reveal>
            );
          })}

          {openSlots.map((slot, i) => (
            <Reveal key={slot.id} delay={(projects.length + i) * 60}>
              <a
                href="#contact"
                className="group grid gap-x-6 gap-y-2 py-5 sm:py-6 opacity-60 transition-opacity hover:opacity-100 sm:grid-cols-[6rem_1fr_auto] sm:items-baseline"
              >
                <span className="text-xs text-paper-dim">
                  SESSION
                  <br />
                  <span className="text-sm text-paper-dim">
                    {slot.session_id}
                  </span>
                </span>
                <div>
                  <h3 className="text-xl font-medium tracking-[-0.01em] text-paper-dim transition-colors group-hover:text-signal">
                    {slot.name}
                  </h3>
                  <p className="mt-2 max-w-xl font-display text-sm leading-relaxed text-paper-dim">
                    {slot.description}
                  </p>
                </div>
                <span className="justify-self-start rounded-full border border-line-strong px-2.5 py-1 text-xs sm:text-[10px] uppercase tracking-[0.1em] text-paper-dim sm:justify-self-end">
                  Open
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
