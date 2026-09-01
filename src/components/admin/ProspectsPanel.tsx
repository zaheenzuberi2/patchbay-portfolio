"use client";

import { useCallback, useEffect, useState } from "react";
import type { ProspectRow } from "@/lib/db";

// Self-contained: fetches its own data rather than being handed initial rows
// through the page. The prospect list is admin-only and can run to hundreds of
// rows, so there is no reason to ship it in the server payload for someone who
// may never open this tab.

const STATUS_ORDER = [
  "qualified",
  "contacted",
  "replied",
  "new",
  "rejected",
  "unsubscribed",
] as const;

const STATUS_STYLES: Record<string, string> = {
  qualified: "text-online border-online/40",
  contacted: "text-signal border-signal/40",
  replied: "text-online border-online/60",
  new: "text-paper-dim border-line-strong",
  rejected: "text-paper-dim border-line-strong opacity-60",
  unsubscribed: "text-paper-dim border-line-strong opacity-60",
};

type Summary = {
  imported: number;
  qualified: number;
  rejected: number;
  invalidEmail: number;
  suppressed: number;
  duplicate: number;
};

export function ProspectsPanel() {
  const [prospects, setProspects] = useState<ProspectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [paste, setPaste] = useState("");
  const [importing, setImporting] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("all");

  // Used by the event handlers after a mutation.
  const refresh = useCallback(async () => {
    const res = await fetch("/api/prospects");
    if (res.ok) {
      const data = await res.json();
      setProspects(data.prospects);
    }
    setLoading(false);
  }, []);

  // The initial load fetches inline rather than calling refresh(), for two
  // reasons: it keeps setState out of the effect body (which is what the
  // react-hooks/set-state-in-effect rule is guarding against), and it lets
  // this one guard against resolving after unmount, which refresh() cannot
  // do since the handlers that call it have no unmount signal.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/prospects");
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setProspects(data.prospects);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function runImport() {
    setError("");
    setSummary(null);
    if (!paste.trim()) {
      setError("Paste some rows first.");
      return;
    }

    setImporting(true);
    const res = await fetch("/api/prospects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paste }),
    });
    setImporting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Import failed.");
      return;
    }

    const data = await res.json();
    setSummary(data.summary);
    setPaste("");
    refresh();
  }

  async function setStatus(id: number, status: string) {
    await fetch(`/api/prospects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes: "" }),
    });
    refresh();
  }

  async function remove(id: number) {
    if (!confirm("Delete this prospect? An unsubscribe stays suppressed.")) return;
    await fetch(`/api/prospects/${id}`, { method: "DELETE" });
    refresh();
  }

  const visible =
    filter === "all" ? prospects : prospects.filter((p) => p.status === filter);

  const counts = STATUS_ORDER.map((s) => ({
    status: s,
    n: prospects.filter((p) => p.status === s).length,
  }));

  return (
    <div>
      {/* Import */}
      <div className="rounded-2xl border border-line-strong bg-ink-2/60 p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-paper-dim">
          Import prospects
        </p>
        <p className="mt-2 text-sm text-paper-dim">
          One per line: company, email, website, country. Comma or tab
          separated, so a spreadsheet column copy pastes straight in. Each row
          gets its email verified and its site checked, then routes to the
          voice or web pitch. Max 200 at a time.
        </p>

        <textarea
          value={paste}
          onChange={(e) => setPaste(e.target.value)}
          rows={5}
          spellCheck={false}
          placeholder={"Acme Dental, hello@acmedental.com, acmedental.com, US\nRiverside Law, info@riversidelaw.co.uk, riversidelaw.co.uk, UK"}
          className="mt-4 w-full rounded-lg border border-line-strong bg-ink px-3 py-2 font-mono text-xs text-paper outline-none focus:border-signal"
        />

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={runImport}
            disabled={importing}
            className="flex min-h-11 items-center rounded-full bg-signal px-5 py-2.5 font-mono text-xs uppercase tracking-[0.1em] text-ink transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            {importing ? "Verifying..." : "Import & qualify"}
          </button>
          {importing && (
            <span className="font-mono text-xs text-paper-dim">
              Checking MX records and loading each site, this takes a moment.
            </span>
          )}
        </div>

        {error && <p className="mt-3 font-mono text-xs text-signal">{error}</p>}

        {summary && (
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-line pt-4 font-mono text-xs text-paper-dim">
            <span className="text-paper">{summary.imported} imported</span>
            <span className="text-online">{summary.qualified} qualified</span>
            <span>{summary.rejected} no signal</span>
            <span>{summary.invalidEmail} bad email</span>
            <span>{summary.duplicate} duplicate</span>
            <span>{summary.suppressed} suppressed</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`flex min-h-11 items-center rounded-full border px-4 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors ${
            filter === "all"
              ? "border-signal text-signal"
              : "border-line-strong text-paper-dim hover:text-paper"
          }`}
        >
          All ({prospects.length})
        </button>
        {counts.map(({ status, n }) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`flex min-h-11 items-center rounded-full border px-4 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors ${
              filter === status
                ? "border-signal text-signal"
                : "border-line-strong text-paper-dim hover:text-paper"
            }`}
          >
            {status} ({n})
          </button>
        ))}
      </div>

      {/* List */}
      <div className="mt-6 divide-y divide-line border-t border-line">
        {loading && (
          <p className="py-6 font-mono text-xs text-paper-dim">Loading...</p>
        )}

        {!loading && visible.length === 0 && (
          <p className="py-6 text-sm text-paper-dim">
            {prospects.length === 0
              ? "No prospects yet. Paste some rows above."
              : "Nothing with that status."}
          </p>
        )}

        {visible.map((p) => (
          <div key={p.id} className="py-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-paper">
                    {p.company}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] ${
                      STATUS_STYLES[p.status] ?? STATUS_STYLES.new
                    }`}
                  >
                    {p.status}
                  </span>
                  {p.pitch && (
                    <span className="rounded-full border border-line-strong px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-paper-dim">
                      {p.pitch === "voice" ? "voice agent" : "website"}
                    </span>
                  )}
                  {p.country && (
                    <span className="font-mono text-[10px] text-paper-dim">
                      {p.country}
                    </span>
                  )}
                </div>

                <p className="mt-1 break-all font-mono text-xs text-paper-dim">
                  {p.email}
                  {p.website ? ` · ${p.website}` : ""}
                </p>

                {p.signal && (
                  <p className="mt-2 max-w-2xl border-l border-signal/40 pl-3 text-sm leading-relaxed text-paper-dim">
                    {p.signal}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <select
                  value={p.status}
                  onChange={(e) => setStatus(p.id, e.target.value)}
                  className="min-h-11 rounded-lg border border-line-strong bg-ink px-2 font-mono text-[11px] text-paper outline-none focus:border-signal"
                >
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => remove(p.id)}
                  className="flex min-h-11 items-center px-2 font-mono text-[11px] uppercase tracking-[0.08em] text-paper-dim transition-colors hover:text-signal"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
