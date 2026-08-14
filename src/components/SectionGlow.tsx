// A soft ambient wash anchored to the same corner in every section, only the
// color changes. Reads as one continuous light source shifting hue as you
// scroll, rather than a repeated decorative shape. Pure CSS: no JS, no
// scroll-tracking, so it is exactly as cheap on a phone as on desktop and
// can never lag or flicker the way a scroll-synced layer could.
export function SectionGlow({ color }: { color: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -top-24 right-[-6rem] -z-10 h-[26rem] w-[26rem] rounded-full blur-3xl sm:h-[34rem] sm:w-[34rem]"
      style={{
        background: `radial-gradient(circle, ${color}2e 0%, ${color}14 45%, transparent 72%)`,
      }}
    />
  );
}
