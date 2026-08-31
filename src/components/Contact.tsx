import { Reveal } from "./Reveal";
import { SectionGlow } from "./SectionGlow";
import { SECTION_ACCENTS } from "@/lib/section-theme";
import { siteConfig, whatsappUrl, instagramUrl } from "@/lib/site-config";

export function Contact() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-28 overflow-hidden py-16 sm:py-28"
    >
      <SectionGlow color={SECTION_ACCENTS.contact} />
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="relative rounded-2xl border border-line-strong bg-ink-2/60 px-6 py-16 text-center sm:px-16">
            <span className="absolute right-6 top-6 flex items-center gap-2 rounded-full border border-online/30 px-2.5 py-1 font-mono text-xs sm:text-[10px] uppercase tracking-[0.1em] text-online">
              <span className="status-dot h-1.5 w-1.5 rounded-full bg-online" />
              Channel open
            </span>
            <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-5xl">
              Got a workflow worth automating?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm text-paper-dim">
              Book a free audit and walk away with a plan: exactly where AI
              and automation would save you real time, where they would not,
              and what to fix first.
            </p>

            <a
              href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(
                "Free AI & Marketing Audit",
              )}`}
              className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-signal px-7 py-3.5 font-mono text-xs uppercase tracking-[0.1em] text-ink transition-transform hover:scale-[1.03]"
            >
              Get my free AI &amp; marketing audit
            </a>
            <p className="mt-3 font-mono text-xs sm:text-[11px] uppercase tracking-[0.1em] text-paper-dim">
              No pitch. No pressure. Just a plan.
            </p>

            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="mt-5 flex min-h-11 items-center justify-center break-all font-mono text-lg text-signal underline decoration-signal/30 underline-offset-8 transition-colors hover:decoration-signal sm:text-xl"
            >
              {siteConfig.contactEmail}
            </a>

            <div className="mt-4 flex flex-col items-center gap-1 font-mono text-sm text-paper-dim sm:mt-6 sm:flex-row sm:justify-center sm:gap-6">
              <a
                href={`tel:+${siteConfig.whatsappNumber}`}
                className="flex min-h-11 items-center px-2 transition-colors hover:text-paper"
              >
                {siteConfig.contactPhoneDisplay}
              </a>
              <span className="hidden sm:inline text-line-strong">|</span>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center px-2 transition-colors hover:text-paper"
              >
                WhatsApp
              </a>
              <span className="hidden sm:inline text-line-strong">|</span>
              <span>{siteConfig.location}</span>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-2 font-mono text-xs sm:text-[11px] uppercase tracking-[0.1em] text-paper-dim">
              <span>Follow</span>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center px-2 text-signal transition-colors hover:text-paper"
              >
                {`@${siteConfig.instagramHandle}`}
              </a>
            </div>

            <p className="mx-auto mt-6 max-w-lg border-t border-line-strong pt-6 text-xs leading-relaxed text-paper-dim">
              Your data stays yours. Anything processed through an AI model
              goes through the provider&apos;s standard API, not a public
              chat product, is not used to train their models, and access is
              limited to what the project actually needs.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
