import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite ships a WASM binary and is only loaded when DATABASE_URL is unset
  // (local development). Bundling it would break the WASM asset resolution and
  // bloat the server build for a path production never takes.
  serverExternalPackages: ["@electric-sql/pglite"],

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
