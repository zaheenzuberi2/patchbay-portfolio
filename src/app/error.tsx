"use client";

import { useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

// Runtime error boundary. not-found.tsx covers a missing route; this covers
// a page that threw while rendering. Without it Next falls back to its own
// generic error screen, which is unbranded and tells a prospective client
// nothing except that something broke.
//
// Deliberately does not render Nav or Footer: if the failure came from a
// shared layout component, rendering those again risks throwing inside the
// error boundary itself.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[error boundary]", error);
  }, [error]);

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-signal">
        Signal lost
      </p>
      <h1 className="mt-4 text-balance text-4xl font-medium leading-[1.08] tracking-[-0.03em] sm:text-5xl">
        Something broke on our end.
      </h1>
      <p className="mx-auto mt-5 max-w-md text-paper-dim">
        Not your fault. Try again, and if it keeps happening, tell{" "}
        {siteConfig.ownerName.split(" ")[0]} directly and it gets fixed.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={reset}
          className="flex min-h-11 items-center rounded-full bg-signal px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-ink transition-transform hover:scale-[1.03]"
        >
          Try again
        </button>
        <Link
          href="/"
          className="flex min-h-11 items-center rounded-full border border-line-strong px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-paper transition-colors hover:border-signal/60 hover:text-signal"
        >
          Back to the board
        </Link>
      </div>

      <a
        href={`mailto:${siteConfig.contactEmail}`}
        className="mt-8 inline-flex min-h-11 items-center break-all font-mono text-sm text-paper-dim underline decoration-line-strong underline-offset-4 transition-colors hover:text-signal hover:decoration-signal"
      >
        {siteConfig.contactEmail}
      </a>

      {/* Vercel attaches a digest to server errors. Showing it means a
          reported problem can be found in the logs instead of guessed at. */}
      {error.digest && (
        <p className="mt-6 font-mono text-xs sm:text-[11px] uppercase tracking-[0.1em] text-paper-dim">
          Reference: {error.digest}
        </p>
      )}
    </main>
  );
}
