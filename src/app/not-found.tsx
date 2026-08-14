import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SignalBars } from "@/components/SignalBars";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Channel not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden border-b border-line px-6 py-32 text-center">
        <div className="grid-veil pointer-events-none absolute inset-0" />
        <div className="relative">
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-signal">
            Signal 404
          </p>
          <h1 className="mt-4 text-balance text-4xl font-medium leading-[1.08] tracking-[-0.03em] sm:text-5xl">
            This channel doesn&apos;t exist.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-paper-dim">
            The page you&apos;re looking for was moved, renamed, or never
            existed. Everything real is still on the board.
          </p>

          <SignalBars count={14} className="mx-auto mt-8 h-10 opacity-40" />

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="flex min-h-11 items-center rounded-full bg-signal px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-ink transition-transform hover:scale-[1.03]"
            >
              Back to the board
            </Link>
            <Link
              href="/services"
              className="flex min-h-11 items-center rounded-full border border-line-strong px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-paper transition-colors hover:border-signal/60 hover:text-signal"
            >
              See the channels
            </Link>
          </div>

          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="mt-8 inline-flex min-h-11 items-center break-all font-mono text-sm text-paper-dim underline decoration-line-strong underline-offset-4 transition-colors hover:text-signal hover:decoration-signal"
          >
            Or tell {siteConfig.ownerName.split(" ")[0]} what you were looking
            for: {siteConfig.contactEmail}
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
