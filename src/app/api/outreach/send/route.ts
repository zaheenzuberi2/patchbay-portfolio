import { NextRequest, NextResponse } from "next/server";
import { getDb, isSuppressed, type ProspectRow } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendOutreachEmail, outreachSendingConfigured } from "@/lib/outreach-mail";
import { buildOutreachEmail } from "@/lib/outreach-templates";
import { siteConfig } from "@/lib/site-config";

// Runs as a Vercel Cron job (see vercel.json) once a day — Hobby plan caps
// cron at one run/day, so volume ramps by raising how much a single daily
// run sends, not by running it more often. A small batch with a random pause
// between sends, not a burst, is still the point: a mailbox that sends N
// emails a day spaced minutes apart looks like a person; the same N sent in
// one second looks like a script, which is exactly the signal that gets a
// sender rate-limited or spam-boxed. maxDuration is raised well past the
// platform's 10s default because the deliberate pauses below, times a full
// batch, run long — 300 is the ceiling Vercel allows on Hobby (Fluid compute).
export const maxDuration = 280;

// Flat daily send volume. Was a 10/20/30 ramp; fixed at 20/day now.
function currentBatchSize() {
  return 20;
}

const MIN_DELAY_MS = 3000;
const MAX_DELAY_MS = 8000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Two ways in: Vercel Cron authenticates with the CRON_SECRET it echoes back
// as a bearer token (see vercel.json + the env var), and an already-logged-in
// admin session works too, so a batch can be triggered by hand for testing
// without needing the cron secret on hand.
async function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (secret && auth === `Bearer ${secret}`) return true;
  return getSession();
}

export async function GET(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!outreachSendingConfigured()) {
    return NextResponse.json(
      {
        error:
          "OUTREACH_GMAIL_USER / OUTREACH_GMAIL_APP_PASSWORD not set — sending is not configured yet",
      },
      { status: 503 },
    );
  }

  // Computed per-invocation, not at module load: a cron-triggered function
  // can stay warm across days, and this must reflect "today", not whatever
  // day the container first started.
  const BATCH_SIZE = currentBatchSize();

  const sql = await getDb();
  const candidates = (await sql`
    SELECT * FROM prospects
    WHERE status = 'qualified' AND email_status = 'valid'
    ORDER BY created_at ASC
    LIMIT ${BATCH_SIZE}
  `) as ProspectRow[];

  const results: { id: number; email: string; sent: boolean; reason?: string }[] = [];

  for (const prospect of candidates) {
    // Re-checked at send time, not just at import: someone can unsubscribe
    // between a prospect being qualified and a batch actually going out.
    if (await isSuppressed(prospect.email)) {
      await sql`UPDATE prospects SET status = 'unsubscribed' WHERE id = ${prospect.id}`;
      results.push({ id: prospect.id, email: prospect.email, sent: false, reason: "suppressed" });
      continue;
    }

    let built: { subject: string; text: string };
    try {
      built = buildOutreachEmail(prospect, siteConfig.url);
    } catch (err) {
      // The compliance guard in outreach-templates.ts tripped (no postal
      // address configured). Stop the whole batch rather than send some
      // messages with the required footer and skip it on others.
      return NextResponse.json(
        {
          error: err instanceof Error ? err.message : String(err),
          sentSoFar: results,
        },
        { status: 500 },
      );
    }

    const outcome = await sendOutreachEmail({
      to: prospect.email,
      subject: built.subject,
      text: built.text,
    });

    if (outcome.ok) {
      await sql`UPDATE prospects SET status = 'contacted' WHERE id = ${prospect.id}`;
      results.push({ id: prospect.id, email: prospect.email, sent: true });
    } else {
      results.push({
        id: prospect.id,
        email: prospect.email,
        sent: false,
        reason: outcome.error,
      });
    }

    await sleep(MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS));
  }

  return NextResponse.json({ ok: true, sent: results.filter((r) => r.sent).length, results });
}
