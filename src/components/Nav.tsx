import Image from "next/image";
import Link from "next/link";
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

export function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-line bg-ink/80 backdrop-blur-md">
      <ScrollProgress />
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex min-h-11 items-center gap-2.5">
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
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-xs uppercase tracking-[0.12em] text-paper-dim transition-colors hover:text-paper"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/#contact"
          className="flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-paper-dim transition-colors hover:border-online/50 hover:text-paper"
        >
          <span className="status-dot h-1.5 w-1.5 rounded-full bg-online" />
          <span className="hidden sm:inline">Available for work</span>
          <span className="sm:hidden">Available</span>
        </Link>
      </div>

      <nav className="flex items-center gap-6 overflow-x-auto border-t border-line px-6 md:hidden">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex min-h-11 shrink-0 items-center font-mono text-xs uppercase tracking-[0.12em] text-paper-dim transition-colors hover:text-paper"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
