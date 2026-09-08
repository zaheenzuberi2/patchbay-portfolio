import { NextRequest, NextResponse } from "next/server";
import { getDb, listCallCampaigns } from "@/lib/db";
import { getSession } from "@/lib/auth";

// Admin-only, same reasoning as /api/prospects: this is a list of real
// businesses being dialed, not public marketing data.

function clean(value: unknown, maxLen: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

export async function GET() {
  const authed = await getSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ campaigns: await listCallCampaigns() });
}

export async function POST(request: NextRequest) {
  const authed = await getSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = clean(body.name, 120);
  const niche = clean(body.niche, 80);
  const market = body.market === "pk" ? "pk" : "overseas";

  if (!name) {
    return NextResponse.json({ error: "Campaign name is required" }, { status: 400 });
  }

  const sql = await getDb();
  const inserted = (await sql`
    INSERT INTO call_campaigns (name, niche, market)
    VALUES (${name}, ${niche}, ${market})
    RETURNING id
  `) as { id: number }[];

  return NextResponse.json({ ok: true, id: inserted[0]?.id });
}
