import { NextResponse } from "next/server";
import { listVisits } from "@/lib/db";
import { getSession } from "@/lib/auth";

// Read-only and admin-gated, same as GET /api/leads. There is no POST here:
// rows are written exclusively from proxy.ts via logVisit, never from a
// client-reachable endpoint.
export async function GET() {
  const authed = await getSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ visits: await listVisits() });
}
