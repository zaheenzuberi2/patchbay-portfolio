import { NextRequest, NextResponse } from "next/server";
import { getDb, getMailboxWarmupStart, isSuppressed, type ProspectRow } from "@/lib/db";
import { getSession } from "@/lib/auth";
import {
  sendOutreachEmail,
  outreachSendingConfigured,
  getConfiguredMailboxes,
  type MailboxConfig,
} from "@/lib/outreach-mail";
import { buildOutreachEmail } from "@/lib/outreach-templates";
import { siteConfig } from "@/lib/site-config";

// Runs as a Vercel Cron job (see vercel.json) once a day — Hobby plan caps
// cron at one run/day, so total daily volume is the sum of every mailbox's
// cap for that day, sent as one batch. A small batch with a random pause
// between sends, not a burst, is still the point: a mailbox that sends N
// emails a day spaced minutes apart looks like a person; the same N sent in
// one second looks like a script, which is exactly the signal that gets a
// sender rate-limited or spam-boxed. maxDuration is raised well past the
// platform's 10s default because the deliberate pauses below, times a full
// batch across every mailbox, run long — 300 is the ceiling Vercel allows on
// Hobby (Fluid compute).
export const maxDuration = 280;

const MIN_DELAY_MS = 3000;
const MAX_DELAY_MS = 8000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 5/day the first week, 10/day the second, then the mailbox's own steady
// cap from week three on. Skipped entirely for a pre-warmed mailbox (e.g.
// tryvoicely.com), which already has real sending history and goes straight
// to its steady cap.
async function mailboxDailyCap(box: MailboxConfig): Promise<number> {
  if (box.preWarmed) return box.steadyCap;
  const warmupStart = await getMailboxWarmupStart(box.id);
  const daysIn = Math.floor((Date.now() - warmupStart.getTime()) / 86_400_000);
  if (daysIn < 7) return Math.min(5, box.steadyCap);
  if (daysIn < 14) return Math.min(10, box.steadyCap);
  return box.steadyCap;
}

// Round-robins mailboxes into a flat list of slots — one pass through every
// mailbox before any mailbox gets a second slot — so consecutive sends in
// the batch don't all come from the same inbox back to back.
function buildSlotOrder(caps: { mailbox: MailboxConfig; cap: number }[]): MailboxConfig[] {
  const remaining = caps.map((c) => c.cap);
  const slots: MailboxConfig[] = [];
  let progressed = true;
  while (progressed) {
    progressed = false;
    for (let i = 0; i < caps.length; i++) {
      if (remaining[i] > 0) {
        slots.push(caps[i].mailbox);
        remaining[i]--;
        progressed = true;
      }
    }
  }
  return slots;
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
          "No outreach mailbox configured yet — set OUTREACH_GMAIL_USER/OUTREACH_GMAIL_APP_PASSWORD and/or OUTREACH_ZOHO_USER_N/OUTREACH_ZOHO_PASSWORD_N",
      },
      { status: 503 },
    );
  }

  // Computed per-invocation, not at module load: a cron-triggered function
  // can stay warm across days, and each mailbox's ramp must reflect "today",
  // not whatever day the container first started.
  const mailboxes = getConfiguredMailboxes();
  const caps = await Promise.all(
    mailboxes.map(async (mailbox) => ({ mailbox, cap: await mailboxDailyCap(mailbox) })),
  );
  const slotOrder = buildSlotOrder(caps);
  const batchSize = slotOrder.length;

  const sql = await getDb();
  const candidates = (await sql`
    SELECT * FROM prospects
    WHERE status = 'qualified' AND email_status = 'valid'
    ORDER BY created_at ASC
    LIMIT ${batchSize}
  `) as ProspectRow[];

  const results: {
    id: number;
    email: string;
    mailbox: string;
    sent: boolean;
    reason?: string;
  }[] = [];

  for (let i = 0; i < candidates.length; i++) {
    const prospect = candidates[i];
    const mailbox = slotOrder[i];

    // Re-checked at send time, not just at import: someone can unsubscribe
    // between a prospect being qualified and a batch actually going out.
    if (await isSuppressed(prospect.email)) {
      await sql`UPDATE prospects SET status = 'unsubscribed' WHERE id = ${prospect.id}`;
      results.push({
        id: prospect.id,
        email: prospect.email,
        mailbox: mailbox.id,
        sent: false,
        reason: "suppressed",
      });
      continue;
    }

    let built: { subject: string; text: string; unsubscribeUrl: string };
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
      mailbox,
      to: prospect.email,
      subject: built.subject,
      text: built.text,
      unsubscribeUrl: built.unsubscribeUrl,
    });

    if (outcome.ok) {
      await sql`UPDATE prospects SET status = 'contacted' WHERE id = ${prospect.id}`;
      results.push({ id: prospect.id, email: prospect.email, mailbox: mailbox.id, sent: true });
    } else {
      results.push({
        id: prospect.id,
        email: prospect.email,
        mailbox: mailbox.id,
        sent: false,
        reason: outcome.error,
      });
    }

    await sleep(MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS));
  }

  return NextResponse.json({
    ok: true,
    sent: results.filter((r) => r.sent).length,
    mailboxCaps: caps.map((c) => ({ id: c.mailbox.id, cap: c.cap })),
    results,
  });
}
