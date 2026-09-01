import { NextRequest, NextResponse } from "next/server";
import { getDb, listProspects } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { verifyEmail } from "@/lib/email-verify";
import { qualify } from "@/lib/qualify";

// Every route here is admin-only, including GET. Unlike /api/reviews and
// /api/projects, none of this is public marketing data: it is a list of
// people who never asked to be contacted, so it must never be readable
// without a session.

function clean(value: unknown, maxLen: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

export async function GET() {
  const authed = await getSession();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ prospects: await listProspects() });
}

type ImportRow = { company: string; email: string; website: string; country: string };

// Accepts either a JSON array of rows or a raw pasted block. The paste format
// is one prospect per line, comma or tab separated:
//     Acme Dental, hello@acmedental.com, acmedental.com, US
// Tab separation matters: it is what a spreadsheet or Google Sheets column
// selection produces on copy, which is how a scrape actually arrives.
function parsePaste(text: string): ImportRow[] {
  const rows: ImportRow[] = [];

  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    // Skip a header row rather than importing "email" as an address.
    if (/^company\b/i.test(t) || /^name\s*[,\t]/i.test(t)) continue;

    const parts = t.split(/\t|,(?![^(]*\))/).map((p) => p.trim());
    const email = parts.find((p) => p.includes("@")) ?? "";
    if (!email) continue;

    const website =
      parts.find((p) => p !== email && /\.[a-z]{2,}/i.test(p) && !p.includes("@")) ??
      "";
    const company = parts[0] && parts[0] !== email ? parts[0] : email.split("@")[1];
    const country = parts.length > 3 ? parts[parts.length - 1] : "";

    rows.push({
      company: company.slice(0, 200),
      email: email.slice(0, 254),
      website: website.slice(0, 300),
      country: country.length <= 3 ? country.toUpperCase() : "",
    });
  }

  return rows;
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

  const rows: ImportRow[] = Array.isArray(body.rows)
    ? body.rows.map((r: Record<string, unknown>) => ({
        company: clean(r.company, 200),
        email: clean(r.email, 254).toLowerCase(),
        website: clean(r.website, 300),
        country: clean(r.country, 3).toUpperCase(),
      }))
    : parsePaste(clean(body.paste, 100_000));

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "No rows with an email address found" },
      { status: 400 },
    );
  }
  // Bounded so one paste cannot spend minutes holding a serverless function
  // open doing hundreds of DNS lookups and site fetches.
  if (rows.length > 200) {
    return NextResponse.json(
      { error: `Too many rows (${rows.length}). Import 200 or fewer at a time.` },
      { status: 400 },
    );
  }

  const sql = await getDb();

  // Anyone who has opted out must never re-enter the list, even via a fresh
  // scrape that has no idea they unsubscribed. This is the check that makes
  // an opt-out actually permanent.
  const suppressed = new Set(
    (
      (await sql`SELECT email FROM suppressions`) as { email: string }[]
    ).map((r) => r.email),
  );

  const summary = {
    imported: 0,
    qualified: 0,
    rejected: 0,
    invalidEmail: 0,
    suppressed: 0,
    duplicate: 0,
  };

  for (const row of rows) {
    if (!row.email) continue;

    if (suppressed.has(row.email)) {
      summary.suppressed++;
      continue;
    }

    const check = await verifyEmail(row.email);

    let pitch = "";
    let signal = "";
    let status = "new";

    if (check.status === "invalid") {
      status = "rejected";
      signal = check.reason;
      summary.invalidEmail++;
    } else {
      const q = await qualify(row.website);
      pitch = q.pitch;
      signal = q.signal;
      status = q.status;
      if (q.status === "qualified") summary.qualified++;
      else summary.rejected++;
    }

    const inserted = (await sql`
      INSERT INTO prospects
        (company, email, website, country, pitch, signal, email_status, status, last_checked_at)
      VALUES
        (${row.company}, ${check.email}, ${row.website}, ${row.country},
         ${pitch}, ${signal}, ${check.status}, ${status}, now())
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `) as { id: number }[];

    if (inserted.length > 0) summary.imported++;
    else summary.duplicate++;
  }

  return NextResponse.json({ ok: true, summary });
}
