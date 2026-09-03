import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe";

// Deliberately public and unauthenticated: this is the link a real recipient
// clicks straight from their own inbox, with no session and no reason to
// ever have one. The signed token (see unsubscribe.ts) is what stops it
// being used to suppress an arbitrary address instead of the one that was
// actually emailed. Required by CAN-SPAM: recipients must have a working way
// to opt out, honored automatically, not by waiting for someone to notice a
// reply in the admin panel.

export async function GET(request: NextRequest) {
  const email = (request.nextUrl.searchParams.get("email") || "").toLowerCase().trim();
  const token = request.nextUrl.searchParams.get("token") || "";

  if (!email || !verifyUnsubscribeToken(email, token)) {
    return NextResponse.json({ error: "Invalid or expired unsubscribe link" }, { status: 400 });
  }

  const sql = await getDb();
  await sql`
    INSERT INTO suppressions (email, reason)
    VALUES (${email}, 'unsubscribed')
    ON CONFLICT (email) DO NOTHING
  `;
  await sql`UPDATE prospects SET status = 'unsubscribed' WHERE email = ${email}`;

  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8"><title>Unsubscribed</title></head>` +
      `<body style="font:16px/1.5 system-ui,sans-serif;max-width:480px;margin:80px auto;color:#111;padding:0 20px">` +
      `<p>Done — you won't get emails like this from ${email} again.</p></body></html>`,
    { headers: { "content-type": "text/html; charset=utf-8" } },
  );
}
