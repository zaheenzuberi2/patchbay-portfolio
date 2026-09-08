// Shared between every /api/call-leads route so the status set and the CSV
// paste format can't drift between the create, update and import handlers.

export const CALL_STATUSES = [
  "not_called",
  "no_answer",
  "voicemail",
  "not_interested",
  "interested",
  "follow_up",
  "closed",
] as const;

const CALL_STATUS_SET = new Set<string>(CALL_STATUSES);

export function isCallStatus(value: unknown): value is (typeof CALL_STATUSES)[number] {
  return typeof value === "string" && CALL_STATUS_SET.has(value);
}

// "" or a well-formed "YYYY-MM-DD" (what <input type="date"> sends); anything
// else is treated as "no callback set" rather than passed through to
// Postgres, which would otherwise reject the whole write over one bad date.
export function cleanCallbackDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

export type ImportLeadRow = {
  company: string;
  contact_name: string;
  phone: string;
  email: string;
  niche: string;
  notes: string;
};

// One lead per line, comma or tab separated — same convention as
// /api/prospects' paste import, because it's the same source motion: select a
// column range in a spreadsheet, copy, paste:
//     Acme Plumbing, Dave Acme, +1 512 555 0100, dave@acmeplumbing.com, plumbing, called before re: pricing
// Only company and phone are required; a line missing either is dropped
// rather than failing the whole batch.
export function parseCallLeadsPaste(text: string): ImportLeadRow[] {
  const rows: ImportLeadRow[] = [];

  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    if (/^company\b/i.test(t)) continue; // skip a header row

    const parts = t.split(/\t|,/).map((p) => p.trim());
    const company = (parts[0] ?? "").slice(0, 200);
    const contact_name = (parts[1] ?? "").slice(0, 120);
    const phone = (parts[2] ?? "").slice(0, 40);
    const email = (parts[3] ?? "").slice(0, 254).toLowerCase();
    const niche = (parts[4] ?? "").slice(0, 80);
    // Anything past column 5 is notes — a note itself may contain commas, so
    // rejoin rather than take a single split part.
    const notes = parts.slice(5).join(", ").slice(0, 2000);

    if (!company || !phone) continue;

    rows.push({ company, contact_name, phone, email, niche, notes });
  }

  return rows;
}
