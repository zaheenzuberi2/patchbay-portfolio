import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { cleanCallbackDate, isCallStatus } from "@/lib/call-crm";

function clean(value: unknown, maxLen: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

// Partial update: only fields present in the body are touched, one small
// UPDATE per field rather than building a dynamic SET list — the tagged-
// template client in db.ts has no ergonomic way to do variable-length SETs,
// and the admin UI only ever changes one or two fields per action (a status
// dropdown, a blurred notes field, a date picker), so this stays simple
// without needing a raw-query escape hatch.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authed = await getSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const leadId = Number(id);
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const sql = await getDb();
  let touched = false;

  if (body.status !== undefined) {
    if (!isCallStatus(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    await sql`UPDATE call_leads SET status = ${body.status} WHERE id = ${leadId}`;
    touched = true;
  }
  if (body.notes !== undefined) {
    await sql`UPDATE call_leads SET notes = ${clean(body.notes, 2000)} WHERE id = ${leadId}`;
    touched = true;
  }
  if (body.contact_name !== undefined) {
    await sql`UPDATE call_leads SET contact_name = ${clean(body.contact_name, 120)} WHERE id = ${leadId}`;
    touched = true;
  }
  if (body.phone !== undefined) {
    const phone = clean(body.phone, 40);
    if (!phone) {
      return NextResponse.json({ error: "Phone cannot be blank" }, { status: 400 });
    }
    await sql`UPDATE call_leads SET phone = ${phone} WHERE id = ${leadId}`;
    touched = true;
  }
  if (body.email !== undefined) {
    await sql`UPDATE call_leads SET email = ${clean(body.email, 254).toLowerCase()} WHERE id = ${leadId}`;
    touched = true;
  }
  if (body.niche !== undefined) {
    await sql`UPDATE call_leads SET niche = ${clean(body.niche, 80)} WHERE id = ${leadId}`;
    touched = true;
  }
  if (body.company !== undefined) {
    const company = clean(body.company, 200);
    if (!company) {
      return NextResponse.json({ error: "Company cannot be blank" }, { status: 400 });
    }
    await sql`UPDATE call_leads SET company = ${company} WHERE id = ${leadId}`;
    touched = true;
  }
  // Reassigning a lead to a different campaign — e.g. moving a batch that
  // landed in the wrong campaign, or merging two. Checked against
  // call_campaigns rather than trusted blindly: campaign_id is a foreign
  // key, so a bad id would otherwise fail the UPDATE with a raw constraint
  // error instead of a clean 400.
  if (body.campaign_id !== undefined) {
    const campaignId = Number(body.campaign_id);
    const exists = (await sql`
      SELECT id FROM call_campaigns WHERE id = ${campaignId}
    `) as { id: number }[];
    if (!campaignId || exists.length === 0) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 400 });
    }
    await sql`UPDATE call_leads SET campaign_id = ${campaignId} WHERE id = ${leadId}`;
    touched = true;
  }
  // callback_at is nullable by design (clearing a follow-up date once it's
  // been handled is a normal action), so "" is accepted and stored as NULL
  // rather than rejected the way a blank phone/company is.
  if (body.callback_at !== undefined) {
    await sql`UPDATE call_leads SET callback_at = ${cleanCallbackDate(body.callback_at)} WHERE id = ${leadId}`;
    touched = true;
  }
  if (body.assigned_to !== undefined) {
    await sql`UPDATE call_leads SET assigned_to = ${clean(body.assigned_to, 80)} WHERE id = ${leadId}`;
    touched = true;
  }

  if (!touched) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  await sql`UPDATE call_leads SET updated_at = now() WHERE id = ${leadId}`;

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authed = await getSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const sql = await getDb();
  await sql`DELETE FROM call_leads WHERE id = ${Number(id)}`;

  return NextResponse.json({ ok: true });
}
