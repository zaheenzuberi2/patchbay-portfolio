"use client";

import { requestVoiceOpen } from "@/lib/dock";

// Opens the floating voice assistant. It is a button, not a link: there is no
// page to go to, and it must work with the panel code not yet downloaded (the
// launcher fetches it on demand).
export function VoiceDemoButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={requestVoiceOpen}
      className={`flex min-h-11 items-center gap-2 rounded-full border border-signal px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-signal outline-none transition-colors hover:bg-signal hover:text-ink focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
      </svg>
      Try the voice demo
    </button>
  );
}
