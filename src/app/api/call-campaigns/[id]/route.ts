import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

function clean(value: unknown, maxLen: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authed = await getSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = clean(body.name, 120);
  const niche = clean(body.niche, 80);
  if (!name) {
    return NextResponse.json({ error: "Campaign name is required" }, { status: 400 });
  }

  const sql = await getDb();
  await sql`
    UPDATE call_campaigns SET name = ${name}, niche = ${niche}
    WHERE id = ${Number(id)}
  `;

  return NextResponse.json({ ok: true });
}

// Cascades to every lead in the campaign (ON DELETE CASCADE on call_leads) —
// deleting a whole campaign is meant to clear it out, not leave orphaned rows
// with no campaign to belong to.
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
  await sql`DELETE FROM call_campaigns WHERE id = ${Number(id)}`;

  return NextResponse.json({ ok: true });
}
