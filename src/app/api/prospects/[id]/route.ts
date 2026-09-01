import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

function clean(value: unknown, maxLen: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

const STATUSES = new Set([
  "new",
  "qualified",
  "rejected",
  "contacted",
  "replied",
  "unsubscribed",
]);

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

  const status = clean(body.status, 20);
  const notes = clean(body.notes, 2000);

  if (status && !STATUSES.has(status)) {
    return NextResponse.json({ error: "Unknown status" }, { status: 400 });
  }

  const sql = await getDb();

  // Marking someone unsubscribed has to write the suppression list too, not
  // just flip a status. The suppression row is what survives this prospect
  // being deleted and re-imported by a later scrape, which is the realistic
  // way someone gets contacted after opting out.
  if (status === "unsubscribed") {
    const rows = (await sql`
      SELECT email FROM prospects WHERE id = ${Number(id)}
    `) as { email: string }[];
    if (rows[0]) {
      await sql`
        INSERT INTO suppressions (email, reason)
        VALUES (${rows[0].email}, 'unsubscribed')
        ON CONFLICT (email) DO NOTHING
      `;
    }
  }

  await sql`
    UPDATE prospects SET
      status = COALESCE(NULLIF(${status}, ''), status),
      notes  = ${notes}
    WHERE id = ${Number(id)}
  `;

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

  // Note: deleting a prospect does NOT remove them from `suppressions`, by
  // design. Opting out is permanent and must outlive the row.
  await sql`DELETE FROM prospects WHERE id = ${Number(id)}`;

  return NextResponse.json({ ok: true });
}
