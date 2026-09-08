import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { parseCallLeadsPaste } from "@/lib/call-crm";

function clean(value: unknown, maxLen: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
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

  const campaignId = Number(body.campaign_id);
  if (!campaignId) {
    return NextResponse.json({ error: "campaign_id is required" }, { status: 400 });
  }

  const rows = parseCallLeadsPaste(clean(body.paste, 200_000));
  // One assignee for the whole pasted batch, not per row — this is meant to
  // match "here's my portion" / "here's Wajih's portion" imports, not a
  // spreadsheet that already has a per-row owner column.
  const assignedTo = clean(body.assigned_to, 80);

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "No rows with a company and phone number found" },
      { status: 400 },
    );
  }
  // Bounded for the same reason /api/prospects caps at 200: this is your own
  // data, provided by you, so there's no qualification pass to make a large
  // batch slow — the cap is just a sane upper bound on one paste.
  if (rows.length > 500) {
    return NextResponse.json(
      { error: `Too many rows (${rows.length}). Import 500 or fewer at a time.` },
      { status: 400 },
    );
  }

  const sql = await getDb();
  const campaign = (await sql`
    SELECT id FROM call_campaigns WHERE id = ${campaignId}
  `) as { id: number }[];
  if (campaign.length === 0) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  for (const row of rows) {
    await sql`
      INSERT INTO call_leads (campaign_id, company, contact_name, phone, email, niche, notes, assigned_to)
      VALUES (${campaignId}, ${row.company}, ${row.contact_name}, ${row.phone},
              ${row.email}, ${row.niche}, ${row.notes}, ${assignedTo})
    `;
  }

  return NextResponse.json({ ok: true, imported: rows.length });
}
