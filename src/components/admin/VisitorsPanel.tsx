"use client";

import { useEffect, useState } from "react";
import type { VisitRow } from "@/lib/db";

// Self-contained like ProspectsPanel and CallCrmPanel: fetches its own data
// rather than being handed initial rows through the page, since this list
// can run to hundreds of rows and is admin-only.
//
// This is raw request metadata (IP, Vercel's own edge geolocation, referrer,
// user agent), one row per page view, written from proxy.ts. It is not a
// visitor-identity system: an IP resolves to a location or ISP at best,
// never a person, and a phone or office network can put several real people
// behind one address. Treat every row as a low-confidence clue, not a
// lookup.

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function VisitorsPanel() {
  const [visits, setVisits] = useState<VisitRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/visits");
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setVisits(data.visits);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="py-6 font-mono text-xs text-paper-dim">Loading...</p>;
  }

  if (visits.length === 0) {
    return (
      <p className="py-6 text-sm text-paper-dim">
        No visits logged yet. They&apos;ll show up here as people browse the
        site.
      </p>
    );
  }

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.08em] text-paper-dim">
        Last {visits.length} page views
      </p>

      <div className="mt-6 divide-y divide-line border-y border-line font-mono text-xs">
        {visits.map((v) => (
          <div
            key={v.id}
            className="grid gap-x-4 gap-y-1 py-3 sm:grid-cols-[7rem_1fr_10rem_9rem]"
          >
            <span className="text-paper-dim">
              {dateFormatter.format(new Date(v.created_at))}
            </span>
            <span className="truncate text-paper" title={v.path}>
              {v.path}
            </span>
            <span className="text-paper-dim">
              {[v.city, v.region, v.country].filter(Boolean).join(", ") ||
                "Unknown location"}
            </span>
            <span className="truncate text-paper-dim" title={v.ip ?? ""}>
              {v.ip ?? "no IP"}
            </span>
            {v.referrer && (
              <span
                className="truncate text-paper-dim/70 sm:col-start-2 sm:col-span-3"
                title={v.referrer}
              >
                via {v.referrer}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
