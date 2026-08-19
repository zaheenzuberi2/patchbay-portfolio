import type { NextConfig } from "next";

// Discloses the framework in every response for no benefit; trivial
// reconnaissance hardening.
const POWERED_BY_HEADER = false;

// script-src and style-src both need 'unsafe-inline': Next injects inline
// hydration/RSC-streaming scripts on every page, and 8 components use inline
// `style={{...}}` (CategoryMarquee's animated width, Reveal's transforms,
// ScrollProgress's live width, the OG image templates run server-side and
// are exempt). A nonce-based CSP would drop 'unsafe-inline' from script-src,
// but that means generating and threading a per-request nonce through every
// page and every inline script, real middleware work with real risk of
// silently breaking hydration if done wrong. 'unsafe-inline' is a real
// tradeoff, not a mistake: still meaningfully narrows a raw XSS payload's
// options (no fetching from or framing an attacker's own origin) even
// though it does not stop inline script injection outright.
//
// frame-ancestors 'none' does the same job as X-Frame-Options: DENY (CSP
// supersedes it in every browser that supports both), so both are set:
// frame-ancestors for browsers that respect CSP, X-Frame-Options as a
// backstop for the few that only ever understood the older header.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: POWERED_BY_HEADER,

  // PGlite ships a WASM binary and is only loaded when DATABASE_URL is unset
  // (local development). Bundling it would break the WASM asset resolution and
  // bloat the server build for a path production never takes.
  serverExternalPackages: ["@electric-sql/pglite"],

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Camera, geolocation and payment are never used anywhere on the
          // site. Microphone is deliberately left off this list: VoiceDemo.tsx
          // uses SpeechRecognition for real, and restricting it here would
          // silently break that feature with no error a visitor could
          // diagnose.
          {
            key: "Permissions-Policy",
            value: "camera=(), geolocation=(), payment=()",
          },
          { key: "Content-Security-Policy", value: CSP },
        ],
      },
    ];
  },

  // www and the apex both resolve to this project, so without this they serve
  // two identical copies of every page under two different URLs. The canonical
  // tag already points at the apex, but a redirect is the stronger signal and
  // it also stops visitors sitting on a www URL the whole site never links to.
  // `permanent: true` is a 308 rather than a 301 on purpose: Next uses 308 to
  // preserve the request method, and search engines treat the two the same.
  redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.zaheenzuberi.com" }],
        destination: "https://zaheenzuberi.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
