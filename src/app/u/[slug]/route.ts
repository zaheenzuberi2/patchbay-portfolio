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

function page(body: string) {
  return (
    `<!doctype html><html><head><meta charset="utf-8"><title>Patchbay</title></head>` +
    `<body style="font:16px/1.5 system-ui,sans-serif;max-width:480px;margin:80px auto;color:#111;padding:0 20px">` +
    body +
    `</body></html>`
  );
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const email = parseUnsubscribeSlug(slug);

  if (!email) {
    return new NextResponse(page(`<p>This link isn't valid.</p>`), {
      status: 400,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  const sql = await getDb();
  await sql`
    INSERT INTO suppressions (email, reason)
    VALUES (${email}, 'unsubscribed')
    ON CONFLICT (email) DO NOTHING
  `;
  await sql`UPDATE prospects SET status = 'unsubscribed' WHERE email = ${email}`;

  return new NextResponse(
    page(`<p>Done — you won't get emails like this from ${email} again.</p>`),
    { headers: { "content-type": "text/html; charset=utf-8" } },
  );
}
