import { NextRequest, NextResponse } from "next/server";
import { getDb, listCallLeads } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { cleanCallbackDate, isCallStatus } from "@/lib/call-crm";

function clean(value: unknown, maxLen: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

export async function GET() {
  const authed = await getSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ leads: await listCallLeads() });
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
  const company = clean(body.company, 200);
  const phone = clean(body.phone, 40);

  if (!campaignId || !company || !phone) {
    return NextResponse.json(
      { error: "campaign_id, company and phone are required" },
      { status: 400 },
    );
  }

  const contactName = clean(body.contact_name, 120);
  const email = clean(body.email, 254).toLowerCase();
  const niche = clean(body.niche, 80);
  const notes = clean(body.notes, 2000);
  const status = isCallStatus(body.status) ? body.status : "not_called";
  const callbackAt = cleanCallbackDate(body.callback_at);

  const sql = await getDb();
  const inserted = (await sql`
    INSERT INTO call_leads
      (campaign_id, company, contact_name, phone, email, niche, notes, status, callback_at)
    VALUES
      (${campaignId}, ${company}, ${contactName}, ${phone}, ${email},
       ${niche}, ${notes}, ${status}, ${callbackAt})
    RETURNING id
  `) as { id: number }[];

  return NextResponse.json({ ok: true, id: inserted[0]?.id });
}
