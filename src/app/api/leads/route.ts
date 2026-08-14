import { NextRequest, NextResponse } from "next/server";
import { getDb, listLeads } from "@/lib/db";
import { getSession } from "@/lib/auth";

const MAX_LEN = 500;

function clean(value: unknown, maxLen = MAX_LEN) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = clean(body.name, 120);
  const contact = clean(body.contact, 200);
  const interest = clean(body.interest, 120);
  const budget = clean(body.budget, 60);
  const message = clean(body.message, 1000);

  if (!name || !contact) {
    return NextResponse.json(
      { error: "Name and contact are required" },
      { status: 400 },
    );
  }

  const sql = await getDb();
  await sql`
    INSERT INTO leads (name, contact, interest, budget, message, source, status)
    VALUES (${name}, ${contact}, ${interest || null}, ${budget || null},
            ${message || null}, 'chat', 'new')
  `;

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const authed = await getSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ leads: await listLeads() });
}
