import nodemailer, { type Transporter } from "nodemailer";

// Cold-outreach sending, through a dedicated Gmail-hosted mailbox
// (zaheen@tryvoicely.com) rather than any zaheenzuberi.com identity or a new
// disposable account. Deliberate: that mailbox already sends and receives
// real mail today, so it carries its own history, and its domain's own
// SPF/DKIM/DMARC are already correctly set up for Google Workspace sending.
// This file only authenticates to Google's own SMTP servers with an app
// password — it never touches DNS on either domain, and never should.
//
// Why nodemailer, breaking the "raw fetch, no SDK" rule the rest of this
// project follows (see notify.ts): SMTP is not HTTP. There is no REST
// endpoint to POST a message to — sending one means speaking the actual SMTP
// wire protocol over a socket, with TLS negotiation, AUTH LOGIN, and MIME
// encoding done exactly right. That is a real protocol implementation, not a
// fetch call to a different URL, and nodemailer is the standard for it: pure
// JS, no native bindings, and it only ever talks to the SMTP host it's given.

let cachedTransport: Transporter | null = null;

function getTransport(): Transporter | null {
  const user = process.env.OUTREACH_GMAIL_USER;
  const pass = process.env.OUTREACH_GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;

  if (!cachedTransport) {
    cachedTransport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });
  }
  return cachedTransport;
}

// Same "no key = feature waits, not an error" rule as notify.ts's
// RESEND_API_KEY check.
export function outreachSendingConfigured() {
  return !!(process.env.OUTREACH_GMAIL_USER && process.env.OUTREACH_GMAIL_APP_PASSWORD);
}

export async function sendOutreachEmail(opts: {
  to: string;
  subject: string;
  text: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const transport = getTransport();
  if (!transport) return { ok: false, error: "outreach sending is not configured" };

  const user = process.env.OUTREACH_GMAIL_USER as string;

  try {
    await transport.sendMail({
      from: `"Zaheen Zuberi" <${user}>`,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
