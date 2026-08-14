import { NextRequest, NextResponse } from "next/server";
import { getDb, listReviews } from "@/lib/db";
import { getSession } from "@/lib/auth";

function clean(value: unknown, maxLen: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

export async function GET() {
  return NextResponse.json({ reviews: await listReviews() });
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

  const meta = (await sql`
    SELECT COALESCE(MAX(sort_order), 0)::int AS max_order FROM reviews
  `) as { max_order: number }[];
  const sortOrder = (meta[0]?.max_order ?? 0) + 1;

  const inserted = (await sql`
    INSERT INTO reviews
      (client_name, client_role, service_slug, rating, quote, sort_order)
    VALUES
      (${client_name}, ${client_role}, ${service_slug}, ${rating}, ${quote}, ${sortOrder})
    RETURNING id
  `) as { id: number }[];

  return NextResponse.json({ ok: true, id: inserted[0]?.id });
}
