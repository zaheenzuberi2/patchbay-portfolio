import type { ProspectRow } from "./db";
import { makeUnsubscribeSlug } from "./unsubscribe";

// The opening line of every email is the prospect's own qualify.ts `signal`,
// used verbatim — not a template variable dressed up, the actual sentence a
// human would write after actually looking at their site. That specificity
// is the entire reason this campaign is allowed to exist at low volume
// without reading as spam; see qualify.ts for why a prospect with no signal
// is never mailed at all.
//
// Deliberately plain text, no HTML, no tracking pixel, no rewritten links:
// see HANDOFF.md on why tracking is actively counterproductive for cold
// outreach specifically (mismatched display/destination links are a spam
// signal, and it's what makes an email read as machine-sent in the first
// place).

function footerLines(email: string, baseUrl: string): string[] {
  const address = process.env.OUTREACH_POSTAL_ADDRESS;
  if (!address) {
    // Fail closed, not open. US CAN-SPAM requires a real physical postal
    // address in every commercial email; sending without one is not a
    // formatting gap, it's a compliance gap, so this refuses outright rather
    // than quietly shipping a footer with a hole in it.
    throw new Error(
      "OUTREACH_POSTAL_ADDRESS is not set — refusing to build an outreach " +
        "email without the CAN-SPAM-required physical address.",
    );
  }

  const unsubUrl = `${baseUrl}/u/${makeUnsubscribeSlug(email)}`;

  // Reads as a normal sign-off, not a bolted-on legal disclaimer: the
  // address sits in the signature line itself (plenty of solo consultants
  // list one there), and the opt-out is one soft sentence, not a
  // "Don't want emails like this from me again?" notice.
  return [
    "",
    "Zaheen",
    `Patchbay · https://zaheenzuberi.com · ${address}`,
    "",
    `Not interested? ${unsubUrl} — one click, no hard feelings.`,
  ];
}

export function buildOutreachEmail(prospect: ProspectRow, baseUrl: string) {
  const isVoice = prospect.pitch === "voice";

  const pitchLines = isVoice
    ? [
        `I build AI phone agents that pick up when a business can't get to ` +
          `the phone, and book the appointment right there — so nothing ` +
          `depends on someone being free to answer. Might be worth a look ` +
          `for ${prospect.company} given how much comes in by phone.`,
        "",
        "Happy to send a short recording of one handling a real call, if useful. No obligation either way.",
      ]
    : [
        `I build and rebuild small business websites. Flagging this in case ` +
          `it's useful even if you never work with me — if it's not a ` +
          `priority right now, no worries at all.`,
        "",
        "If you did want it fixed, I can usually turn a rebuild like this around in a couple of weeks. Happy to send a couple of examples.",
      ];

  const lines = [
    "Hi,",
    "",
    prospect.signal,
    "",
    ...pitchLines,
    ...footerLines(prospect.email, baseUrl),
  ];

  return {
    subject: isVoice
      ? `Missed calls at ${prospect.company}`
      : `Quick note on ${prospect.company}'s website`,
    text: lines.join("\n"),
  };
}
