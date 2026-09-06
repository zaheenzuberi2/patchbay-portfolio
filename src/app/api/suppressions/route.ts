import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { listSuppressions } from "@/lib/db";

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
