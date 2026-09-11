import nodemailer, { type Transporter } from "nodemailer";

// Cold-outreach sending, through dedicated mailboxes rather than any
// zaheenzuberi.com root identity. Two families:
//
//   - tryvoicely.com (Google Workspace) — the original mailbox, already
//     sending real mail with its own history and correctly configured
//     SPF/DKIM/DMARC. Treated as pre-warmed: no ramp, straight to its
//     steady cap.
//   - go.zaheenzuberi.com mailboxes on Zoho Mail's free plan — a subdomain,
//     never the bare zaheenzuberi.com identity, so a spam flag or
//     suspension on outreach volume can't touch the real info@ mailbox,
//     the admin panel, or anything else living on the root domain. Each one
//     ramps up individually from its own first send (see
//     getMailboxWarmupStart in db.ts) since they start cold.
//
// A mailbox only exists in the rotation once its env vars are set — same
// "no key = feature waits" rule as the rest of this file. Adding a 6th Zoho
// mailbox later means setting OUTREACH_ZOHO_USER_6 / _PASSWORD_6 in Vercel,
// nothing else.
//
// Why nodemailer, breaking the "raw fetch, no SDK" rule the rest of this
// project follows (see notify.ts): SMTP is not HTTP. There is no REST
// endpoint to POST a message to — sending one means speaking the actual SMTP
// wire protocol over a socket, with TLS negotiation, AUTH LOGIN, and MIME
// encoding done exactly right. That is a real protocol implementation, not a
// fetch call to a different URL, and nodemailer is the standard for it: pure
// JS, no native bindings, and it only ever talks to the SMTP host it's given.

export type MailboxConfig = {
  id: string;
  label: string;
  host: string;
  port: number;
  user: string;
  pass: string;
  // Daily send count once fully warmed up.
  steadyCap: number;
  // Skips the ramp entirely — for a mailbox that already has real sending
  // history before it joined this rotation.
  preWarmed: boolean;
};

const ZOHO_MAILBOX_SLOTS = 5;

export function getConfiguredMailboxes(): MailboxConfig[] {
  const boxes: MailboxConfig[] = [];

  const gmailUser = process.env.OUTREACH_GMAIL_USER;
  const gmailPass = process.env.OUTREACH_GMAIL_APP_PASSWORD;
  if (gmailUser && gmailPass) {
    boxes.push({
      id: "tryvoicely",
      label: gmailUser,
      host: "smtp.gmail.com",
      port: 465,
      user: gmailUser,
      pass: gmailPass,
      steadyCap: 25,
      preWarmed: true,
    });
  }

  for (let i = 1; i <= ZOHO_MAILBOX_SLOTS; i++) {
    const user = process.env[`OUTREACH_ZOHO_USER_${i}`];
    const pass = process.env[`OUTREACH_ZOHO_PASSWORD_${i}`];
    if (user && pass) {
      boxes.push({
        id: `zoho${i}`,
        label: user,
        host: "smtp.zoho.com",
        port: 465,
        user,
        pass,
        steadyCap: 20,
        preWarmed: false,
      });
    }
  }

  return boxes;
}

// Same "no key = feature waits, not an error" rule as notify.ts's
// RESEND_API_KEY check.
export function outreachSendingConfigured() {
  return getConfiguredMailboxes().length > 0;
}

const cachedTransports = new Map<string, Transporter>();

function getTransport(box: MailboxConfig): Transporter {
  let transport = cachedTransports.get(box.id);
  if (!transport) {
    transport = nodemailer.createTransport({
      host: box.host,
      port: box.port,
      secure: box.port === 465,
      auth: { user: box.user, pass: box.pass },
    });
    cachedTransports.set(box.id, transport);
  }
  return transport;
}

export async function sendOutreachEmail(opts: {
  mailbox: MailboxConfig;
  to: string;
  subject: string;
  text: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const transport = getTransport(opts.mailbox);

  try {
    await transport.sendMail({
      from: `"Zaheen Zuberi" <${opts.mailbox.user}>`,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
