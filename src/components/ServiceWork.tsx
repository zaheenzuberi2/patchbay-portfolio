import { listProjects, type ProjectRow } from "@/lib/db";
import { Reveal } from "./Reveal";

// Every service page sat with zero proof: someone landing on
// /services/web-development straight from Google, not the homepage, never
// saw Lex Justitia, AB Juris, or Tryvoicely. Same real project rows Work.tsx
// already renders on the homepage, filtered to real clients only (never the
// two open-capacity slots, which read as proof but are not).
//
// Same DB-failure contract as Work.tsx: a query failure logs loudly and
// drops just this section rather than 500ing the page a visitor arrived at
// from a specific ranking search.
export async function ServiceWork() {
  let rows: ProjectRow[] = [];
  try {
    rows = await listProjects();
  } catch (err) {
    console.error("[ServiceWork] could not load projects, hiding section:", err);
    return null;
  }

  const projects = rows.filter((r) => r.kind !== "open_slot" && r.href);
  if (projects.length === 0) return null;

  return (
    <section className="border-b border-line py-14 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
            Not a pitch. Live sites.
          </h2>
          <p className="mt-4 max-w-xl text-paper-dim">
            Every link below is a real, running client site, not a mockup.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 60}>
              {/* No target="_blank" — see Work.tsx for why: it opens a
                  fresh tab with empty history, so mobile's back gesture has
                  nothing to return to and only the tab switcher works. */}
              <a
                href={p.href ?? undefined}
                rel="noreferrer"
                className="group flex h-full flex-col justify-between rounded-2xl border border-line-strong bg-ink-2/60 p-6 transition-colors hover:border-signal/50"
              >
                <div>
                  <span className="font-mono text-xs text-signal">
                    {p.session_id}
                  </span>
                  <h3 className="mt-3 text-lg font-medium tracking-[-0.01em] text-paper transition-colors group-hover:text-signal">
                    {p.name}
                  </h3>
                  <p className="mt-1 font-mono text-xs uppercase tracking-[0.08em] text-paper-dim">
                    {p.client}
                  </p>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-paper-dim">
                  {p.description}
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
