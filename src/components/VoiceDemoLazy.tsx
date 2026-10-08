"use client";

import dynamic from "next/dynamic";

// VoiceDemo is a large client component (Web Speech API, AudioContext,
// getUserMedia, prosody/voice-selection logic) that only ever renders on
// the ai-voice-agents service page, and only about a third of the way
// down it. A static import still ships and hydrates its full bundle on
// every load of that page regardless of whether a visitor scrolls to it,
// which is a real cost on exactly the page this site is trying to rank
// for "AI voice agent"/"AI receptionist" searches, since Core Web Vitals
// are a ranking signal. ssr: false is safe since every API this component
// touches is browser-only and throws on the server otherwise.
//
// This has to live in its own client component: next/dynamic's ssr:false
// option is rejected inside a Server Component (the page it's used from),
// so the dynamic() call itself needs a "use client" boundary around it.
//
// The loading skeleton matches VoiceDemo's own root wrapper classes so
// there's no layout shift once the real component swaps in.
export const VoiceDemoLazy = dynamic(
  () => import("./VoiceDemo").then((m) => m.VoiceDemo),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[22rem] animate-pulse rounded-2xl border border-line-strong bg-ink-2 p-6" />
    ),
  },
);
