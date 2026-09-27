import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { siteConfig } from "@/lib/site-config";
import { sitemapEntries } from "@/app/sitemap";

// IndexNow (search.indexnow.org) is a single push endpoint that fans out to
// Bing, Yandex, and other participating engines the moment content changes,
// instead of waiting for their own crawl schedule. Google does not consume
// IndexNow, so this is a complement to the sitemap, not a replacement.
//
// The key file at /{INDEXNOW_KEY}.txt is how the engines verify this
// submission actually owns the domain, so its content must be exactly the
// key with no surrounding whitespace (see public/<key>.txt).
const INDEXNOW_KEY = "76e5ff20ad642b9b26b8a34482f04c79";

// Same two ways in as /api/outreach/send: the Vercel Cron secret, or an
// already-logged-in admin session for a manual trigger.
async function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (secret && auth === `Bearer ${secret}`) return true;
  return getSession();
}

export async function GET(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const host = new URL(siteConfig.url).host;
  const urlList = sitemapEntries().map((entry) => entry.url);

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key: INDEXNOW_KEY,
      keyLocation: `${siteConfig.url}/${INDEXNOW_KEY}.txt`,
      urlList,
    }),
  });

  // IndexNow returns 200 or 202 on success, with an empty body either way.
  if (!res.ok) {
    const body = await res.text();
    return NextResponse.json(
      { error: "IndexNow submission failed", status: res.status, body },
      { status: 502 },
    );
  }

  return NextResponse.json({ submitted: urlList.length });
}
