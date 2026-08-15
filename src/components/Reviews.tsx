import { Reveal } from "./Reveal";
import { SectionGlow } from "./SectionGlow";
import { SECTION_ACCENTS } from "@/lib/section-theme";
import { listReviews, type ReviewRow } from "@/lib/db";
import { getService } from "@/lib/services";

// Same resilience contract as Work.tsx: a database blip must not take down
// the marketing page, so a query failure just drops this section. An empty
// table also renders nothing rather than a fabricated placeholder review,
// since the table starts empty on purpose and only fills with real client
// reviews added through the admin panel.
export async function Reviews() {
  let rows: ReviewRow[] = [];
  try {
    rows = await listReviews();
  } catch (err) {
    console.error("[Reviews] could not load reviews, hiding section:", err);
    return null;
  }

  if (rows.length === 0) return null;

  return (
    <section
      id="reviews"
      className="relative scroll-mt-28 overflow-hidden border-b border-line py-16 sm:py-28"
    >
      <SectionGlow color={SECTION_ACCENTS.reviews} />
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <h2 className="max-w-2xl text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
            What it&apos;s like on the other end of the line.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((review, i) => {
            const service = review.service_slug
              ? getService(review.service_slug)
              : undefined;
            return (
              <Reveal key={review.id} delay={i * 60} variant="scale">
                <div className="flex h-full flex-col justify-between rounded-2xl border border-line-strong bg-ink-2/60 p-6">
                  <div>
                    <div
                      className="flex gap-1"
                      aria-label={`${review.rating} out of 5`}
                    >
                      {Array.from({ length: 5 }).map((_, dot) => (
                        <span
                          key={dot}
                          aria-hidden="true"
                          className={`h-1.5 w-4 rounded-full ${
                            dot < review.rating ? "bg-signal" : "bg-line-strong"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-paper">
                      &ldquo;{review.quote}&rdquo;
                    </p>
                  </div>
                  <div className="mt-6 border-t border-line pt-4">
                    <p className="text-sm font-medium text-paper">
                      {review.client_name}
                    </p>
                    <p className="mt-0.5 font-mono text-xs sm:text-[11px] uppercase tracking-[0.08em] text-paper-dim">
                      {review.client_role}
                      {service ? ` · ${service.name}` : ""}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
