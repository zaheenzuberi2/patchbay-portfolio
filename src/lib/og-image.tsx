import { ImageResponse } from "next/og";

// One template behind every opengraph-image route so the share cards stay a
// single design instead of three copies that drift apart. Colours are the
// brand tokens from globals.css, repeated as literals because Satori resolves
// no CSS variables and no Tailwind.
//
// Satori is not a browser: every element holding more than one child needs an
// explicit `display: flex`, and unsupported properties are silently dropped
// rather than erroring. Keep this markup boring.

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const INK = "#0a0a0b";
const PAPER = "#f3efe7";
const PAPER_DIM = "#a3a19b";
const SIGNAL = "#ff5a1f";

// Same waveform motif as the logo mark and the SignalBars component.
const BARS = [18, 34, 14, 44, 26, 38, 20, 30];

export function renderOgImage({
  marker,
  title,
  subtitle,
}: {
  marker: string;
  title: string;
  subtitle: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          padding: "80px",
          color: PAPER,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
            {BARS.map((h, i) => (
              <div
                key={i}
                style={{
                  width: 14,
                  height: h,
                  background: SIGNAL,
                  borderRadius: 4,
                }}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: SIGNAL,
              letterSpacing: 3,
            }}
          >
            {marker}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              // Long service names would overflow at the homepage's 96px, so
              // the size steps down once the title gets past a headline
              // length. Satori has no text-wrap balancing to lean on.
              fontSize: title.length > 46 ? 62 : 82,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.05,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: PAPER_DIM,
              marginTop: 22,
              maxWidth: 940,
              lineHeight: 1.35,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 2,
          }}
        >
          <div style={{ display: "flex", color: PAPER }}>ZAHEENZUBERI.COM</div>
          <div style={{ display: "flex", color: SIGNAL }}>
            ISLAMABAD, PAKISTAN
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}

/** Trims a meta description to something that fits the card without a
 *  mid-word cut. Service descriptions run past 200 characters. */
export function ogSubtitle(text: string, max = 130) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}...`;
}
