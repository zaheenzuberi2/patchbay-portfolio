import Image from "next/image";
import { SignalBars } from "./SignalBars";
import { HeroCtas } from "./HeroCtas";
import { SectionGlow } from "./SectionGlow";
import { SECTION_ACCENTS } from "@/lib/section-theme";

const CHANNELS = [
  "VOICE AGENTS",
  "CALLING AGENTS",
  "CHATBOTS",
  "AUTOMATION",
  "BRAND & SOCIAL",
  "FULL-STACK",
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden border-b border-line pt-20 pb-16 sm:pt-24 sm:pb-14"
    >
      <SectionGlow color={SECTION_ACCENTS.top} />

      {/* Scrim between the 3D field and the copy. The field is legible as
          texture but competes with body text at this density, so it gets
          pushed down where the headline and paragraph actually sit. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/70 via-transparent to-ink/80" />

      <div className="grid-veil pointer-events-none absolute inset-0" />

      {/* py-6 / gap-8 on phones. At py-16 and gap-12 the hero ran 1.5 screens
          before a visitor reached a single service, and that vertical air is
          desktop styling being applied to a viewport that cannot spare it.
          Both step back up at sm, so desktop is untouched. */}
      <div className="relative mx-auto grid w-full max-w-6xl gap-8 px-6 py-6 sm:gap-12 sm:py-16 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
        <div>
          {/* text-4xl on the smallest screens, not text-5xl: at 375px the
              headline ran six lines and pushed both CTAs below the fold,
              which is the one thing the hero cannot afford to do on a
              phone. Steps back up immediately at sm. */}
          <h1 className="text-balance text-4xl font-medium leading-[1.06] tracking-[-0.03em] xs:text-5xl sm:text-6xl lg:text-7xl">
            Hey, I&apos;m Zaheen. I run{" "}
            <span className="text-signal">Patchbay</span>, the whole agency
            in one signal chain.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-paper-dim sm:mt-8 sm:text-lg">
            19, based in Islamabad. Every service a marketing agency runs:
            brand, content, social. Plus the AI and dev work most agencies
            still outsource: voice agents that pick up the phone, chatbots
            that qualify the lead, automation, and the full-stack websites
            and builds behind all of it.
          </p>

          <HeroCtas />
        </div>

        {/* The portrait carries the console chrome rather than replacing it:
            status row on top, signal meter and the process line at the base.
            The photo already has a baked bottom gradient, so the lower text
            sits on the image without needing its own solid plate.

            NOTE: a full-bleed background version of this photo was tried and
            reverted. In this specific shot the phone is held up right beside
            the face, so no crop window isolates one from the other at hero
            width; every attempt showed mostly phone/hand. Revisit full-bleed
            only with a plain, face-forward photo that has nothing held up. */}
        {/* Capped and centred on phones. Full-bleed it was 327px wide and so
            409px tall at 4:5, a third of the whole hero for one portrait.
            Capping the width rather than changing the aspect ratio keeps the
            face framed exactly as it is and leaves the overlay chrome room to
            sit without colliding. Uncapped from lg where the grid takes over. */}
        <div className="floaty mx-auto w-full max-w-[260px] overflow-hidden rounded-2xl border border-line-strong bg-ink-2 sm:max-w-[300px] lg:max-w-none">
          <div className="relative aspect-[4/5]">
            <Image
              src="/zaheen.jpg"
              alt="Zaheen Zuberi, founder of Patchbay, AI automation and full-stack web developer in Islamabad"
              fill
              sizes="(max-width: 1024px) 100vw, 420px"
              className="object-cover"
              priority
            />

            <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-ink/85 to-transparent px-5 pb-10 pt-4 font-mono text-xs sm:text-[11px] uppercase tracking-[0.1em]">
              <span className="text-paper">Signal</span>
              <span className="flex items-center gap-1.5 text-online">
                <span className="status-dot h-1.5 w-1.5 rounded-full bg-online" />
                Live
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 px-5 pb-5 pt-12">
              <SignalBars count={14} className="h-10" />
              <p className="mt-3 font-mono text-xs sm:text-[11px] leading-relaxed text-paper-dim">
                Inbound call → intent detected → CRM updated → follow-up
                queued. ~40ms.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* One scrolling row, never wrapping. Wrapping made this several lines
          tall on phones, and since it is pinned to the bottom of the hero the
          taller stack ran underneath the photo caption. The section's own
          bottom padding reserves the space it occupies. */}
      <div className="absolute inset-x-0 bottom-0 border-t border-line bg-ink-2/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl gap-x-8 overflow-x-auto px-6 py-3 font-mono text-xs sm:text-[11px] tracking-[0.15em] text-paper-dim">
          {CHANNELS.map((c, i) => (
            <span key={c} className="flex items-center gap-2 whitespace-nowrap">
              <span className="text-signal">
                CH.{String(i + 1).padStart(2, "0")}
              </span>
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
