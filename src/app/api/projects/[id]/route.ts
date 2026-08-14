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
  await sql`
    UPDATE projects SET
      name = ${name},
      client = ${client},
      description = ${description},
      tags = ${JSON.stringify(tags)},
      status = ${status},
      href = ${href || null},
      kind = ${kind}
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
  await sql`DELETE FROM projects WHERE id = ${Number(id)}`;

  return NextResponse.json({ ok: true });
}
