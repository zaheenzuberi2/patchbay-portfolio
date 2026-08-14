import { NextRequest, NextResponse } from "next/server";
import { getDb, listLeads } from "@/lib/db";
import { getSession } from "@/lib/auth";

const MAX_LEN = 500;

function clean(value: unknown, maxLen = MAX_LEN) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

// This endpoint is public by necessity (the chat widget posts to it with no
// auth) which makes it the one obvious thing to script against once the site
// is indexed. Two cheap defences, neither of which costs a service or an
// account:
//
// 1. A per-IP rate limit held in memory. Honest about the limits: serverless
//    instances do not share memory, so a determined attacker hitting many
//    cold instances gets more than SUBMISSION_LIMIT through. It stops casual
//    form-spam bots and accidental double-submits, which is the realistic
//    threat here, and costs nothing. A shared store (Redis/Upstash) is the
//    real fix if actual abuse ever shows up.
// 2. A honeypot field. Bots fill every input they find; the real widget never
//    sends this one, so anything arriving with it populated is automated.
//    Returns a normal-looking success so the bot does not learn it was caught.
const SUBMISSION_LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

const rateLimitStore = globalThis as typeof globalThis & {
  __patchbayLeadHits?: Map<string, number[]>;
};

function isRateLimited(ip: string) {
  if (!rateLimitStore.__patchbayLeadHits) {
    rateLimitStore.__patchbayLeadHits = new Map();
  }
  const hits = rateLimitStore.__patchbayLeadHits;
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= SUBMISSION_LIMIT) {
    hits.set(ip, recent);
    return true;
  }

  recent.push(now);
  hits.set(ip, recent);

  // Bound the map so a long-lived instance being sprayed from many addresses
  // cannot grow it without limit.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Honeypot: real submissions never carry this field.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Try again shortly." },
      { status: 429 },
    );
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
