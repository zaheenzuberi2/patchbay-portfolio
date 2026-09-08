import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

// Removing a team member only takes them out of the dropdown — it does not
// touch call_leads.assigned_to (plain text, no foreign key), so leads
// already assigned to them keep showing that name rather than silently
// losing whose portion they were in.
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
  await sql`DELETE FROM call_team_members WHERE id = ${Number(id)}`;

  return NextResponse.json({ ok: true });
}
