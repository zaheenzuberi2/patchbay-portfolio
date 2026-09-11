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
  "bounced",
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

  // Marking someone unsubscribed or bounced has to write the suppression
  // list too, not just flip a status. The suppression row is what survives
  // this prospect being deleted and re-imported by a later scrape — the
  // realistic way someone gets contacted again after opting out, or after a
  // hard bounce (address doesn't exist, so re-sending is pure waste and
  // sender-reputation risk regardless of which future campaign scrapes them
  // back up).
  if (status === "unsubscribed" || status === "bounced") {
    const rows = (await sql`
      SELECT email FROM prospects WHERE id = ${Number(id)}
    `) as { email: string }[];
    if (rows[0]) {
      await sql`
        INSERT INTO suppressions (email, reason)
        VALUES (${rows[0].email}, ${status})
        ON CONFLICT (email) DO NOTHING
      `;
    }
  }

  // email_status is separate from status: it's the deliverability verdict
  // (see email-verify.ts) rather than the outreach-pipeline stage. A hard
  // bounce is proof the mailbox doesn't exist — evidence the MX-only check
  // can't see in advance — so it's worth recording even though it isn't
  // load-bearing for send eligibility once status is already "bounced".
  const emailStatus = clean(body.email_status, 20);
  if (emailStatus && emailStatus !== "valid" && emailStatus !== "invalid" && emailStatus !== "unverified") {
    return NextResponse.json({ error: "Unknown email_status" }, { status: 400 });
  }

  await sql`
    UPDATE prospects SET
      status = COALESCE(NULLIF(${status}, ''), status),
      email_status = COALESCE(NULLIF(${emailStatus}, ''), email_status),
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
