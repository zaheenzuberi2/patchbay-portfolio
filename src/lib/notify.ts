import { siteConfig } from "./site-config";

// Lead notifications.
//
// The problem this solves: a lead submitted at 2am previously sat unseen in
// the database until someone happened to open /admin. The whole point of the
// chat widget is catching people while they are interested, and a reply the
// next afternoon has lost most of that.
//
// Design rules, in order of importance:
//
// 1. A notification failure must NEVER cost a lead. The row is already
//    committed before this runs, this is called from after() so it happens
//    once the response is sent, and every path here swallows its own errors.
//    A dead mail provider degrades to "no email", never to "lost lead".
// 2. No API key must not be an error. Until RESEND_API_KEY exists this
//    no-ops quietly, exactly like the DATABASE_URL and SESSION_SECRET
//    fallbacks elsewhere: the site works, the feature simply waits. The
//    moment the key is set, notifications start with no code change.
// 3. Raw fetch rather than the Resend SDK. One HTTP POST does not justify a
//    dependency, and this keeps the provider swappable.

export type LeadNotification = {
  name: string;
  contact: string;
  interest?: string | null;
  budget?: string | null;
  message?: string | null;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Lead fields are attacker-controlled: anyone can type anything into the chat
// widget. Escaping before interpolation keeps a submitted <script> or broken
// markup from mangling the notification email.
function row(label: string, value: string) {
  return `<tr>
    <td style="padding:6px 14px 6px 0;color:#8a8a8a;font:12px/1.5 -apple-system,Segoe UI,sans-serif;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
    <td style="padding:6px 0;color:#111;font:14px/1.5 -apple-system,Segoe UI,sans-serif">${escapeHtml(value)}</td>
  </tr>`;
}

export async function sendLeadNotification(lead: LeadNotification) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // Not configured yet. Not an error.

  const to = process.env.LEAD_NOTIFY_TO || siteConfig.contactEmail;
  // Resend only allows a custom From once a domain is verified. Their shared
  // onboarding sender works immediately on a fresh account, so default to it
  // and let a verified domain override later.
  const from = process.env.LEAD_NOTIFY_FROM || "Patchbay <onboarding@resend.dev>";

  const rows = [
    row("Name", lead.name),
    row("Contact", lead.contact),
    lead.interest ? row("Bottleneck", lead.interest) : "",
    lead.budget ? row("Budget", lead.budget) : "",
    lead.message ? row("Message", lead.message) : "",
  ].join("");

  const adminUrl = `${siteConfig.url}/admin`;

  const html = `<div style="background:#f6f6f6;padding:24px">
    <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;padding:24px">
      <p style="margin:0 0 4px;color:#ff5a1f;font:600 11px/1.4 -apple-system,Segoe UI,sans-serif;letter-spacing:.12em;text-transform:uppercase">New lead</p>
      <h1 style="margin:0 0 18px;color:#111;font:600 20px/1.3 -apple-system,Segoe UI,sans-serif">${escapeHtml(lead.name)} wants to talk</h1>
      <table style="border-collapse:collapse;width:100%">${rows}</table>
      <a href="${adminUrl}" style="display:inline-block;margin-top:22px;background:#ff5a1f;color:#fff;text-decoration:none;border-radius:999px;padding:11px 20px;font:600 12px/1 -apple-system,Segoe UI,sans-serif;letter-spacing:.08em;text-transform:uppercase">Open admin panel</a>
      <p style="margin:18px 0 0;color:#8a8a8a;font:12px/1.5 -apple-system,Segoe UI,sans-serif">Reply fast. Most people are comparing you against someone else right now.</p>
    </div>
  </div>`;

  const text = [
    `New lead: ${lead.name}`,
    `Contact: ${lead.contact}`,
    lead.interest ? `Bottleneck: ${lead.interest}` : "",
    lead.budget ? `Budget: ${lead.budget}` : "",
    lead.message ? `Message: ${lead.message}` : "",
    "",
    `Admin: ${adminUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    // Bounded so a hanging provider cannot keep the serverless invocation
    // alive indefinitely.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `New lead: ${lead.name}${lead.budget ? ` (${lead.budget})` : ""}`,
        html,
        text,
        // So hitting reply in the inbox goes to the prospect, not to Resend.
        reply_to: lead.contact.includes("@") ? lead.contact : undefined,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.error(
        "[notify] Resend rejected the lead notification:",
        res.status,
        await res.text().catch(() => ""),
      );
    }
  } catch (err) {
    console.error("[notify] could not send lead notification:", err);
  }
}
