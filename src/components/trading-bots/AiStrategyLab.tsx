"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

// Three phases a candidate strategy moves through before it ever touches a
// client's live account. This describes the actual process, not a running
// system: nothing here claims a specific win rate or a track record that
// does not exist yet. The toggle is a way to let a visitor step through the
// pipeline themselves, not a live status feed.
const PHASES = [
  {
    key: "discovery",
    label: "Discovery",
    eyebrow: "Phase 01",
    title: "Generating candidates, not picking a favorite early.",
    body: "Indicator and rule combinations are generated and screened continuously, rather than committing to one hand-picked idea. Most candidates are discarded here, before they ever see a chart running live.",
    points: [
      "Runs against historical and live market data",
      "Screens for basic viability before anything advances",
      "No candidate reaches a real account at this stage",
    ],
  },
  {
    key: "incubation",
    label: "Incubation",
    eyebrow: "Phase 02",
    title: "Proven on a demo account before it's trusted with real capital.",
    body: "A candidate that survives discovery runs on a paper or demo account, under the same conditions it would face live: real prices, real spreads, real timing. Nothing graduates on a backtest alone.",
    points: [
      "Demo-account execution, not a backtest number",
      "Tracked against the same drawback limits a live account would use",
      "Only a strategy that holds up here is eligible for deployment",
    ],
  },
  {
    key: "deployment",
    label: "Deployment",
    eyebrow: "Phase 03",
    title: "Swap out a decaying strategy without rebuilding the system.",
    body: "When a live strategy starts underperforming, the fix is usually not more manual tweaking. A validated replacement from incubation can be swapped in, with the circuit breaker and account wiring already in place.",
    points: [
      "Old strategy retired, new one promoted, same account wiring",
      "No downtime on the execution pipeline itself",
      "You approve every promotion; nothing swaps itself in silently",
    ],
  },
] as const;

export function AiStrategyLab() {
  const [active, setActive] = useState<(typeof PHASES)[number]["key"]>(
    "discovery",
  );
  const reduced = useReducedMotion();
  const phase = PHASES.find((p) => p.key === active)!;

  return (
    <div className="rounded-2xl border border-line-strong bg-ink-2/60 p-5 sm:p-8">
      <div className="flex flex-wrap gap-2">
        {PHASES.map((p) => {
          const isActive = p.key === active;
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => setActive(p.key)}
              aria-pressed={isActive}
              className={`relative flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] transition-colors ${
                isActive
                  ? "border-signal/60 text-signal"
                  : "border-line-strong text-paper-dim hover:border-signal/30 hover:text-paper"
              }`}
            >
              {isActive && (
                <span className="status-dot h-1.5 w-1.5 rounded-full bg-signal" />
              )}
              {p.label}
            </button>
          );
        })}
      </div>

      <div className="relative mt-8 min-h-[280px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase.key}
            initial={reduced ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-signal">
              {phase.eyebrow}
            </p>
            <h3 className="mt-3 text-balance text-2xl font-medium tracking-[-0.01em] text-paper sm:text-3xl">
              {phase.title}
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-paper-dim sm:text-base">
              {phase.body}
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {phase.points.map((point) => (
                <li
                  key={point}
                  className="rounded-xl border border-line px-4 py-3 text-xs leading-relaxed text-paper-dim"
                >
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center gap-3 border-t border-line pt-6">
        <span
          aria-hidden="true"
          className={`h-2 w-2 rounded-full ${active === "deployment" ? "bg-signal" : "bg-paper-dim/40"}`}
        />
        <p className="text-xs leading-relaxed text-paper-dim">
          {active === "deployment"
            ? "This is the promotion step: a validated strategy moving into the account wiring you already have. You approve it before it goes live."
            : "Step through the phases above. A candidate strategy only reaches deployment after it survives the one before it."}
        </p>
      </div>
    </div>
  );
}
