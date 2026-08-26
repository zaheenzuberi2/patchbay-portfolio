import { Reveal } from "./Reveal";
import { listReviews } from "@/lib/db";
import type { Service } from "@/lib/services";

// Same resilience contract as Reviews.tsx: a database blip must not take
// down a service page, and an empty result renders nothing rather than a
// fabricated placeholder review. Filtered client-side (in this server
// component) rather than via a dedicated query since the review table is
// small and this keeps one code path for both the homepage and per-service
// sections instead of two slightly different queries to keep in sync.
export async function ServiceReviews({ service }: { service: Service }) {
  let rows;
  try {
    rows = (await listReviews()).filter(
      (r) => r.service_slug === service.slug,
    );
  } catch (err) {
    console.error("[ServiceReviews] could not load reviews, hiding section:", err);
    return null;
  }

  if (rows.length === 0) return null;

  return (
    <section className="border-b border-line py-14 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
            From clients who used this channel.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((review, i) => (
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
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
