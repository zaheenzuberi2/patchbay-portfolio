import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite ships a WASM binary and is only loaded when DATABASE_URL is unset
  // (local development). Bundling it would break the WASM asset resolution and
  // bloat the server build for a path production never takes.
  serverExternalPackages: ["@electric-sql/pglite"],
};

export default nextConfig;
