"use client";

import { useState } from "react";
import Link from "next/link";

// The mobile half of the Channels section. A flip card cannot be made short:
// its box has to fit the taller of its two faces, so six of them stacked in a
// single column ran 2.7 screens on a phone. Collapsed rows show the same six
// channels in roughly a quarter of that, and tapping is the obvious gesture
// here rather than something a badge has to explain.
//
// This is a client component purely so the open/closed state can live
// somewhere. Channels.tsx stays a server component and passes plain data,
// never a handler, which is the mistake that crashed the homepage render once
// before (HANDOFF section 13).

export type Channel = {
  id: string;
  name: string;
  desc: string;
  stack: string[];
  slug: string;
};

export function ChannelAccordion({ channels }: { channels: Channel[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="divide-y divide-line border-y border-line">
      {channels.map((ch) => {
        const open = openId === ch.id;
        return (
          <div key={ch.id}>
            <button
              type="button"
              onClick={() => setOpenId(open ? null : ch.id)}
              aria-expanded={open}
              aria-controls={`channel-panel-${ch.id}`}
              className="flex min-h-14 w-full items-center gap-3 py-4 text-left"
            >
              <span className="shrink-0 font-mono text-xs text-signal">
                CH.{ch.id}
              </span>
              <span className="flex-1 text-base font-medium tracking-[-0.01em] text-paper">
                {ch.name}
              </span>
              <span
                aria-hidden="true"
                className={`shrink-0 font-mono text-signal transition-transform duration-200 ${
                  open ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>

            {/* Rendered only when open. Unlike Faq.tsx, nothing here feeds
                structured data, so there is no schema reason to keep the
                closed copy in the DOM, and leaving it out keeps the collapsed
                page genuinely short. */}
            {open && (
              <div id={`channel-panel-${ch.id}`} className="pb-5">
                <p className="text-sm leading-relaxed text-paper-dim">
                  {ch.desc}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ch.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-line-strong px-2.5 py-0.5 font-mono text-xs uppercase tracking-[0.08em] text-paper-dim"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/services/${ch.slug}`}
                  className="mt-3 flex min-h-11 items-center gap-1.5 font-mono text-xs uppercase tracking-[0.1em] text-signal underline decoration-signal/30 underline-offset-4"
                >
                  See the detail
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
