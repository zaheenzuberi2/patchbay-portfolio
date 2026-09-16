import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";
import { logVisit } from "@/lib/db";

// Logs every real page view, not just chat-widget lead submissions. Runs on
// the Node.js runtime (the default since Next 16), so it can call the same
// Postgres helper the rest of the app uses instead of needing a separate
// edge-safe client. event.waitUntil defers the write until after the
// response is already sent, same reasoning as api/leads/route.ts's after():
// a visitor never waits on a database write for a page to load, and a slow
// or failed write cannot turn into a slow or broken page.
export function proxy(request: NextRequest, event: NextFetchEvent) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null;

  // Vercel's edge network sets these on every request in production, free,
  // with no external geolocation API or key needed. Both are null in local
  // dev and on any non-Vercel host, which is fine: the column is nullable.
  const country = request.headers.get("x-vercel-ip-country");
  const region = request.headers.get("x-vercel-ip-country-region");
  const city = request.headers.get("x-vercel-ip-city");

  event.waitUntil(
    logVisit({
      path: request.nextUrl.pathname,
      ip,
      country,
      region,
      city,
      referrer: request.headers.get("referer"),
      userAgent: request.headers.get("user-agent"),
    }),
  );

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Real page navigations only. Excludes API routes (leads/prospects
    // already log their own IP where relevant, and this would otherwise
    // double-count and flood the table with polling/admin-panel fetches),
    // static assets, image optimization, and the generated metadata files.
    "/((?!api|_next/static|_next/image|favicon.ico|icon.png|robots.txt|sitemap.xml|opengraph-image).*)",
  ],
};
