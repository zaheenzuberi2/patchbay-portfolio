import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb, listSuppressions } from "@/lib/db";

// Admin-only read view of the suppression list — who has unsubscribed and
// why. Mirrors /api/prospects: same auth gate, same reasoning (this is a
// list of people who opted out, not public marketing data).
export async function GET() {
  const authed = await getSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ suppressions: await listSuppressions() });
}

// Suppression is meant to be permanent — deleting a prospect and re-scraping
// them later must not re-enter them into a live campaign, which is the whole
// reason this table outlives the prospects row. This DELETE exists for the
// one legitimate exception: a false positive, not a real opt-out. It existed
// once already — a security scanner pre-fetching the old GET-triggers-unsub
// link (see src/app/u/[slug]/route.ts) silently suppressed 3 real prospects
// who never opened the email, let alone chose to leave. Use this only to
// correct a confirmed false positive, never to let someone back in who
// actually clicked unsubscribe.
export async function DELETE(request: NextRequest) {
  const authed = await getSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = request.nextUrl.searchParams.get("email")?.toLowerCase().trim();
  if (!email) {
    return NextResponse.json({ error: "email query param required" }, { status: 400 });
  }

  const sql = await getDb();
  await sql`DELETE FROM suppressions WHERE email = ${email}`;

  return NextResponse.json({ ok: true });
}
