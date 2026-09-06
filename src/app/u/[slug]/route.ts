import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { parseUnsubscribeSlug } from "@/lib/unsubscribe";

// Deliberately public and unauthenticated: this is the link a real recipient
// clicks straight from their own inbox, with no session and no reason to
// ever have one. The signed slug (see unsubscribe.ts) is what stops it being
// used to suppress an arbitrary address instead of the one that was actually
// emailed. Required by CAN-SPAM: recipients must have a working way to opt
// out, honored automatically, not by waiting for someone to notice a reply
// in the admin panel.
//
// Lives at /u/<slug> rather than /api/unsubscribe?...: a real person clicks
// this from their inbox, so it gets a short path and a plain HTML reply
// either way, not a JSON error a browser would show as a raw blob.
//
// GET only ever shows a confirmation page — it never writes to the database.
// The write happens on POST, from a real form submit. This used to unsub on
// GET directly, and it silently cost real prospects: corporate mail-security
// scanners (Microsoft Safe Links, Proofpoint, etc.) pre-fetch every URL in an
// inbound email to check it for malware before the recipient ever opens it,
// which fired this exact link and unsubscribed people who never saw the
// email, let alone chose to opt out. A scanner fetches, it doesn't submit
// forms, so splitting the read (GET) from the write (POST) is the fix.

function page(body: string) {
  return (
    `<!doctype html><html><head><meta charset="utf-8"><title>Patchbay</title></head>` +
    `<body style="font:16px/1.5 system-ui,sans-serif;max-width:480px;margin:80px auto;color:#111;padding:0 20px">` +
    body +
    `</body></html>`
  );
}

function html(body: string, status = 200) {
  return new NextResponse(page(body), {
    status,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const email = parseUnsubscribeSlug(slug);

  if (!email) {
    return html(`<p>This link isn't valid.</p>`, 400);
  }

  return html(
    `<p>Stop emails from Patchbay to ${email}?</p>` +
      `<form method="post"><button type="submit" style="font:inherit;padding:10px 18px;` +
      `border:1px solid #111;background:#111;color:#fff;border-radius:6px;cursor:pointer">` +
      `Yes, unsubscribe me</button></form>`,
  );
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const email = parseUnsubscribeSlug(slug);

  if (!email) {
    return html(`<p>This link isn't valid.</p>`, 400);
  }

  const sql = await getDb();
  await sql`
    INSERT INTO suppressions (email, reason)
    VALUES (${email}, 'unsubscribed')
    ON CONFLICT (email) DO NOTHING
  `;
  await sql`UPDATE prospects SET status = 'unsubscribed' WHERE email = ${email}`;

  return html(`<p>Done — you won't get emails like this from ${email} again.</p>`);
}
