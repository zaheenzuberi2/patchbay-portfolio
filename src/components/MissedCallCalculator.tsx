"use client";

import { useState } from "react";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function Field({
  label,
  hint,
  value,
  onChange,
  suffix,
  max,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (n: number) => void;
  suffix?: string;
  max?: number;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm text-paper">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          max={max}
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => {
            const n = parseFloat(e.target.value);
            onChange(Number.isFinite(n) ? Math.max(0, max ? Math.min(max, n) : n) : 0);
          }}
          className="min-h-11 w-full rounded-xl border border-line-strong bg-ink-2/60 px-4 text-paper focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal"
        />
        {suffix && <span className="text-sm text-paper-dim">{suffix}</span>}
      </span>
      <span className="text-xs text-paper-dim">{hint}</span>
    </label>
  );
}

// Every number here is typed in by the visitor. The page ships no industry
// averages on purpose: an invented "the average business misses 27% of calls"
// stat would be exactly the kind of unsourced claim the rest of the site
// avoids, and the visitor knows their own phone log better than we do.
export function MissedCallCalculator() {
  const [calls, setCalls] = useState(200);
  const [missedPct, setMissedPct] = useState(20);
  const [bookPct, setBookPct] = useState(30);
  const [jobValue, setJobValue] = useState(400);

  const missed = (calls * missedPct) / 100;
  const lostJobs = (missed * bookPct) / 100;
  const monthly = lostJobs * jobValue;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="grid gap-5 rounded-2xl border border-line-strong bg-ink-2/60 p-6 sm:p-8">
        <Field
          label="Inbound calls per month"
          hint="Count from your phone bill or call log."
          value={calls}
          onChange={setCalls}
        />
        <Field
          label="Share of calls that go unanswered"
          hint="Voicemail, busy, after hours, nobody picked up."
          value={missedPct}
          onChange={setMissedPct}
          suffix="%"
          max={100}
        />
        <Field
          label="Share of callers who would have booked"
          hint="Of the calls you do answer, how many turn into a booking."
          value={bookPct}
          onChange={setBookPct}
          suffix="%"
          max={100}
        />
        <Field
          label="Average value of one booking"
          hint="Revenue per job, visit, or new client, in US dollars."
          value={jobValue}
          onChange={setJobValue}
          suffix="USD"
        />
      </div>

      <div
        className="flex flex-col justify-center rounded-2xl border border-signal/40 bg-ink-2/60 p-6 sm:p-8"
        aria-live="polite"
      >
        <p className="font-mono text-xs uppercase tracking-[0.1em] text-paper-dim">
          Estimated revenue missed per month
        </p>
        <p className="mt-3 text-5xl font-medium tracking-[-0.03em] text-signal tabular-nums">
          {fmt(monthly)}
        </p>
        <p className="mt-2 text-sm text-paper-dim tabular-nums">
          {fmt(monthly * 12)} per year
        </p>
        <dl className="mt-6 grid gap-2 text-sm text-paper-dim tabular-nums">
          <div className="flex justify-between gap-4">
            <dt>Unanswered calls per month</dt>
            <dd className="text-paper">{Math.round(missed)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Bookings those calls would have produced</dt>
            <dd className="text-paper">{lostJobs.toFixed(1)}</dd>
          </div>
        </dl>
        <p className="mt-6 text-xs leading-relaxed text-paper-dim">
          This is arithmetic on the numbers you entered: calls, times the
          unanswered share, times your booking rate, times booking value. It
          is not a prediction. Not every missed caller would have booked, and
          an AI receptionist will not catch every one of them, so treat the
          result as an upper bound.
        </p>
      </div>
    </div>
  );
}
