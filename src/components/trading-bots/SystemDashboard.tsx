"use client";

import { motion, useReducedMotion } from "motion/react";

// A preview of the monitoring panel a client's own account gets wired into,
// not a real feed. Every value is deliberately a placeholder rather than a
// number invented to look like a track record: this service line has no
// live account to report on yet, and making one up would be exactly the
// fabricated proof this codebase's copy rules exist to prevent.
const METRICS = [
  {
    label: "System uptime",
    value: "Live once connected",
    hint: "Tracked from the moment your execution node goes live",
  },
  {
    label: "Webhook / order latency",
    value: "Live once connected",
    hint: "Time from signal fired to order sent to your broker",
  },
  {
    label: "Account balance curve",
    value: "Live once connected",
    hint: "Pulled from your account, not simulated",
  },
  {
    label: "Circuit breaker",
    value: "Configurable",
    hint: "Your daily drawdown limit, set by you before go-live",
  },
];

export function SystemDashboard() {
  const reduced = useReducedMotion();

  return (
    <div className="rounded-2xl border border-line-strong bg-ink-2/60 p-5 sm:p-8">
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.1em] text-paper-dim">
        <span>Example client dashboard</span>
        <span className="flex items-center gap-1.5">
          <span className="status-dot h-1.5 w-1.5 rounded-full bg-paper-dim/50" />
          Sample layout
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.label}
            initial={reduced ? undefined : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
            className="rounded-xl border border-line p-4"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-paper-dim">
              {m.label}
            </p>
            <p className="mt-2 text-lg font-medium tracking-[-0.01em] text-paper">
              {m.value}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-paper-dim">
              {m.hint}
            </p>
          </motion.div>
        ))}
      </div>

      <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-paper-dim">
        This is the panel layout every build ships with, shown empty because
        this service line has no live account to report on yet. Your version
        fills in with your own account&apos;s real numbers from day one.
      </p>
    </div>
  );
}
