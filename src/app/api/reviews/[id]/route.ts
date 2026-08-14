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

  const client_name = clean(body.client_name, 120);
  const client_role = clean(body.client_role, 120);
  const service_slug = clean(body.service_slug, 60);
  const quote = clean(body.quote, 800);
  const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));

  if (!client_name || !quote) {
    return NextResponse.json(
      { error: "Client name and quote are required" },
      { status: 400 },
    );
  }

  const sql = await getDb();
  await sql`
    UPDATE reviews SET
      client_name = ${client_name},
      client_role = ${client_role},
      service_slug = ${service_slug},
      rating = ${rating},
      quote = ${quote}
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
  await sql`DELETE FROM reviews WHERE id = ${Number(id)}`;

  return NextResponse.json({ ok: true });
}
