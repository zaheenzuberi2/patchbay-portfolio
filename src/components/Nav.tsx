"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { ScrollProgress } from "./ScrollProgress";

// Root-relative hrefs, not bare "#hash". Bare anchors do nothing on
// /services/* pages; these navigate home and then jump to the section.
const LINKS = [
  { href: "/services", label: "Services" },
  { href: "/#work", label: "Projects" },
  { href: "/#about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

// Hash links (/#work, /#about, /#contact) point at sections of the
// homepage, not separate routes, so they never register as "the current
// page" here — pathname alone can't tell which section is scrolled into
// view without a scroll-spy, and that's a bigger feature than what was
// asked for (knowing which *page* you're on). Only real routes light up:
// Services for itself and every /services/[slug], FAQ for /faq.
function isActive(pathname: string, href: string) {
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-line bg-ink/80 backdrop-blur-md">
      <ScrollProgress />
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="flex min-h-11 items-center gap-2.5"
        >
          <Image
            src="/logo-mark.png"
            alt={`${siteConfig.name} logo`}
            width={24}
            height={24}
            className="h-6 w-6 rounded-full"
            priority
          />
          <span className="font-mono text-sm tracking-tight text-paper">
            {siteConfig.name.toUpperCase()}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`font-mono text-xs uppercase tracking-[0.12em] transition-colors ${
                  active ? "text-signal" : "text-paper-dim hover:text-paper"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#contact"
            onClick={() => setMenuOpen(false)}
            className="flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 font-mono text-xs sm:text-[11px] uppercase tracking-[0.1em] text-paper-dim transition-colors hover:border-online/50 hover:text-paper"
          >
            <span className="status-dot h-1.5 w-1.5 rounded-full bg-online" />
            <span className="hidden sm:inline">Available for work</span>
            <span className="sm:hidden">Available</span>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 shrink-0 items-center justify-center text-paper md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {menuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Replaces the old always-visible horizontal-scroll link row. That
          row showed every link with no way to tell which page you were on;
          this is a real dropdown with active-state highlighting, closed by
          default so the header stays compact.

          Transitions max-height, not the grid-template-rows trick Faq.tsx
          uses. That trick relies on a 0fr/1fr row resolving to the content's
          intrinsic height, and it does not: header is `position: fixed`
          with no explicit height, so the browser is simultaneously trying
          to auto-size the fixed ancestor around its content *and* resolve
          an indeterminate 1fr track inside it, a circular dependency the
          grid algorithm gives up on and renders as zero. Confirmed by
          setting the inline style directly via the DOM, bypassing React
          entirely — still computed to 0px, so this is a genuine layout
          edge case tied to the fixed-position ancestor, not a React or
          hydration issue. Faq.tsx never hits it because nothing in its
          ancestry is fixed-positioned. max-height has no such dependency:
          96 (24rem) is comfortably larger than five links ever need. */}
      <div className="md:hidden">
        <div
          className={`overflow-hidden border-t border-line transition-[max-height] duration-300 ease-out ${
            menuOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <nav className="flex flex-col px-4 py-2">
            {LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-11 items-center font-mono text-xs uppercase tracking-[0.12em] transition-colors ${
                    active ? "text-signal" : "text-paper-dim hover:text-paper"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
