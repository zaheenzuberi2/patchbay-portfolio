import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

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

// These routes are already prerendered at build time (see each
// opengraph-image.tsx), so the pixels never change between deploys. Vercel's
// edge still revalidates a prerendered route on every request by default
// (`max-age=0, must-revalidate`, confirmed on production before this was
// added), which means a crawler or chat client re-fetches the same bytes on
// every share. Explicit headers let the edge and the client actually hold the
// image instead of re-checking it every time.
//
// 3 days requested. `s-maxage` governs Vercel's edge cache; plain `max-age`
// governs what a client (Discord, Slack, a browser) is allowed to cache
// without asking again. `must-revalidate` is dropped on purpose: it forces a
// revalidation the instant the 3 days elapse, which is exactly the opposite
// of "cache it for 3 days".
const THREE_DAYS = 60 * 60 * 24 * 3;
export const OG_CACHE_HEADERS = {
  "Cache-Control": `public, max-age=${THREE_DAYS}, s-maxage=${THREE_DAYS}`,
};

const INK = "#0a0a0b";
const PAPER = "#f3efe7";
const PAPER_DIM = "#a3a19b";
const SIGNAL = "#ff5a1f";

// Every share card carried an abstract waveform motif but never the actual
// logo, so nothing tied the card back to a recognizable mark. Read once at
// module scope, per the Next docs pattern for opengraph-image.md: the file
// doesn't depend on request data, so re-reading it per render would just be
// wasted disk I/O on every prerendered route. Path is relative to the
// project root (process.cwd()), not this file, per the same doc.
const logoData = readFile(
  join(process.cwd(), "public/logo-mark.png"),
  "base64",
);

// Kept alongside the real logo as background texture, not standing in for
// it anymore.
const BARS = [18, 34, 14, 44, 26, 38, 20, 30];

export async function renderOgImage({
  marker,
  title,
  subtitle,
}: {
  marker: string;
  title: string;
  subtitle: string;
}) {
  const logoSrc = `data:image/png;base64,${await logoData}`;

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
        {/* Still exactly 3 top-level children under the outer space-between
            (header block, title block, footer), so that layout is untouched.
            The bars moved inside this block rather than becoming a 4th
            sibling, which would have broken the space-between spacing. */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Logo paired with the wordmark, the same pairing Nav.tsx
                renders for real. This is the one element every card shares
                regardless of what page it's for, so it's the actual brand
                anchor now rather than the abstract bars, which are kept
                below only as background texture. */}
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              {/* next/image renders via browser APIs Satori's server-side
                  renderer doesn't have; a plain <img> with a base64 src is
                  the pattern Next's own opengraph-image docs use for this
                  exact case, so the next/image lint rule doesn't apply. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoSrc}
                width={64}
                height={64}
                alt="Patchbay"
                style={{ borderRadius: 9999 }}
              />
              <div
                style={{
                  display: "flex",
                  fontSize: 30,
                  fontWeight: 600,
                  letterSpacing: 1,
                  color: PAPER,
                }}
              >
                PATCHBAY
              </div>
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

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 14,
              opacity: 0.35,
            }}
          >
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
    { ...OG_SIZE, headers: OG_CACHE_HEADERS },
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
