import { NextRequest, NextResponse } from "next/server";
import { getDb, listCallTeamMembers } from "@/lib/db";
import { getSession } from "@/lib/auth";

function clean(value: unknown, maxLen: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

export async function GET() {
  const authed = await getSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ members: await listCallTeamMembers() });
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

  const name = clean(body.name, 80);
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const sql = await getDb();
  const inserted = (await sql`
    INSERT INTO call_team_members (name)
    VALUES (${name})
    ON CONFLICT (name) DO NOTHING
    RETURNING id
  `) as { id: number }[];

  if (inserted.length === 0) {
    return NextResponse.json({ error: "That name is already on the team" }, { status: 409 });
  }

  return NextResponse.json({ ok: true, id: inserted[0].id });
}
