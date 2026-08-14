import { NextRequest, NextResponse } from "next/server";
import { getDb, listProjects } from "@/lib/db";
import { getSession } from "@/lib/auth";

function clean(value: unknown, maxLen: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

export async function GET() {
  return NextResponse.json({ projects: await listProjects() });
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

  const name = clean(body.name, 120);
  const client = clean(body.client, 120);
  const description = clean(body.description, 800);
  const href = clean(body.href, 300);
  const status = clean(body.status, 40) || "LIVE";
  const kind = body.kind === "open_slot" ? "open_slot" : "project";
  const tags: string[] = Array.isArray(body.tags)
    ? body.tags
        .filter((t: unknown) => typeof t === "string")
        .map((t: string) => t.trim().slice(0, 40))
        .slice(0, 8)
    : [];

  if (!name || !description) {
    return NextResponse.json(
      { error: "Name and description are required" },
      { status: 400 },
    );
  }

  const sql = await getDb();

  const meta = (await sql`
    SELECT
      COALESCE(MAX(sort_order), 0)::int AS max_order,
      COALESCE(MAX(session_id::int), 0)::int AS max_session
    FROM projects
  `) as { max_order: number; max_session: number }[];

  const sessionId = String((meta[0]?.max_session ?? 0) + 1).padStart(4, "0");
  const sortOrder = (meta[0]?.max_order ?? 0) + 1;

  const inserted = (await sql`
    INSERT INTO projects
      (session_id, name, client, description, tags, status, href, kind, sort_order)
    VALUES
      (${sessionId}, ${name}, ${client}, ${description}, ${JSON.stringify(tags)},
       ${status}, ${href || null}, ${kind}, ${sortOrder})
    RETURNING id
  `) as { id: number }[];

  return NextResponse.json({ ok: true, id: inserted[0]?.id });
}
