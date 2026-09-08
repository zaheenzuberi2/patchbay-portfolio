"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CallCampaignRow, CallLeadRow } from "@/lib/db";

// Self-contained like ProspectsPanel: fetches its own data rather than being
// handed initial rows through /admin, since this list is admin-only and no
// reason to ship it to someone who never opens this tab.

const STATUS_ORDER = [
  "not_called",
  "interested",
  "follow_up",
  "no_answer",
  "voicemail",
  "not_interested",
  "closed",
] as const;

const STATUS_LABELS: Record<string, string> = {
  not_called: "Not called",
  no_answer: "No answer",
  voicemail: "Voicemail",
  not_interested: "Not interested",
  interested: "Interested",
  follow_up: "Follow-up",
  closed: "Closed",
};

const STATUS_STYLES: Record<string, string> = {
  not_called: "text-paper-dim border-line-strong",
  no_answer: "text-paper-dim border-line-strong opacity-70",
  voicemail: "text-paper-dim border-line-strong opacity-70",
  not_interested: "text-paper-dim border-line-strong opacity-60",
  interested: "text-online border-online/40",
  follow_up: "text-signal border-signal/40",
  closed: "text-paper-dim border-line-strong opacity-60",
};

const MARKETS = [
  { id: "pk" as const, label: "Pakistan" },
  { id: "overseas" as const, label: "Overseas" },
];

function todayStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")}`;
}

function formatDate(iso: string) {
  // callback_at is a DATE ("YYYY-MM-DD"); parsing that directly with `new
  // Date()` treats it as UTC midnight, which can print as the previous day
  // in a timezone behind UTC. Split it instead of parsing as a datetime.
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

type View = { kind: "campaigns" } | { kind: "campaign"; id: number } | { kind: "followups" };

export function CallCrmPanel() {
  const [campaigns, setCampaigns] = useState<CallCampaignRow[]>([]);
  const [leads, setLeads] = useState<CallLeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [market, setMarket] = useState<"pk" | "overseas">("pk");
  const [view, setView] = useState<View>({ kind: "campaigns" });
  const [newCampaignName, setNewCampaignName] = useState("");
  const [newCampaignNiche, setNewCampaignNiche] = useState("");
  const [creatingCampaign, setCreatingCampaign] = useState(false);

  const refresh = useCallback(async () => {
    const [campaignsRes, leadsRes] = await Promise.all([
      fetch("/api/call-campaigns"),
      fetch("/api/call-leads"),
    ]);
    if (campaignsRes.ok) setCampaigns((await campaignsRes.json()).campaigns);
    if (leadsRes.ok) setLeads((await leadsRes.json()).leads);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [campaignsRes, leadsRes] = await Promise.all([
          fetch("/api/call-campaigns"),
          fetch("/api/call-leads"),
        ]);
        if (cancelled) return;
        if (campaignsRes.ok) {
          const data = await campaignsRes.json();
          if (!cancelled) setCampaigns(data.campaigns);
        }
        if (leadsRes.ok) {
          const data = await leadsRes.json();
          if (!cancelled) setLeads(data.leads);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function createCampaign() {
    if (!newCampaignName.trim()) return;
    setCreatingCampaign(true);
    const res = await fetch("/api/call-campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCampaignName, niche: newCampaignNiche, market }),
    });
    setCreatingCampaign(false);
    if (res.ok) {
      setNewCampaignName("");
      setNewCampaignNiche("");
      const data = await res.json();
      refresh();
      if (data.id) setView({ kind: "campaign", id: data.id });
    }
  }

  async function deleteCampaign(id: number) {
    if (!confirm("Delete this campaign and every lead in it? This can't be undone.")) return;
    await fetch(`/api/call-campaigns/${id}`, { method: "DELETE" });
    setView({ kind: "campaigns" });
    refresh();
  }

  const today = todayStr();
  const dueLeads = useMemo(
    () =>
      leads
        .filter((l) => l.callback_at && l.callback_at <= today && l.status !== "closed")
        .sort((a, b) => (a.callback_at ?? "").localeCompare(b.callback_at ?? "")),
    [leads, today],
  );

  const marketCampaigns = campaigns.filter((c) => c.market === market);
  const activeCampaign =
    view.kind === "campaign" ? campaigns.find((c) => c.id === view.id) ?? null : null;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {MARKETS.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setMarket(m.id);
              setView({ kind: "campaigns" });
            }}
            className={`flex min-h-11 items-center rounded-full border px-4 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors ${
              view.kind !== "followups" && market === m.id
                ? "border-signal text-signal"
                : "border-line-strong text-paper-dim hover:text-paper"
            }`}
          >
            {m.label} ({campaigns.filter((c) => c.market === m.id).length})
          </button>
        ))}
        <button
          onClick={() => setView({ kind: "followups" })}
          className={`flex min-h-11 items-center rounded-full border px-4 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors ${
            view.kind === "followups"
              ? "border-signal text-signal"
              : "border-line-strong text-paper-dim hover:text-paper"
          }`}
        >
          Follow-ups ({dueLeads.length})
        </button>
      </div>

      {loading && <p className="mt-6 font-mono text-xs text-paper-dim">Loading...</p>}

      {!loading && view.kind === "followups" && (
        <FollowUpsView leads={dueLeads} campaigns={campaigns} today={today} onChanged={refresh} />
      )}

      {!loading && view.kind === "campaigns" && (
        <div className="mt-8">
          <div className="rounded-2xl border border-line-strong bg-ink-2/60 p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-paper-dim">
              New {MARKETS.find((m) => m.id === market)?.label} campaign
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <input
                value={newCampaignName}
                onChange={(e) => setNewCampaignName(e.target.value)}
                placeholder="e.g. Austin Plumbers — Sep 2026"
                className="min-h-11 min-w-[240px] flex-1 rounded-lg border border-line-strong bg-ink px-3 font-mono text-xs text-paper outline-none focus:border-signal"
              />
              <input
                value={newCampaignNiche}
                onChange={(e) => setNewCampaignNiche(e.target.value)}
                placeholder="niche (optional)"
                className="min-h-11 w-48 rounded-lg border border-line-strong bg-ink px-3 font-mono text-xs text-paper outline-none focus:border-signal"
              />
              <button
                onClick={createCampaign}
                disabled={creatingCampaign || !newCampaignName.trim()}
                className="flex min-h-11 items-center rounded-full bg-signal px-5 py-2.5 font-mono text-xs uppercase tracking-[0.1em] text-ink transition-transform hover:scale-[1.02] disabled:opacity-50"
              >
                {creatingCampaign ? "Creating..." : "+ Create"}
              </button>
            </div>
          </div>

          <div className="mt-6 divide-y divide-line border-t border-line">
            {marketCampaigns.length === 0 && (
              <p className="py-6 text-sm text-paper-dim">
                No campaigns yet for {MARKETS.find((m) => m.id === market)?.label}. Create one
                above.
              </p>
            )}
            {marketCampaigns.map((c) => {
              const campaignLeads = leads.filter((l) => l.campaign_id === c.id);
              const openCount = campaignLeads.filter(
                (l) => l.status !== "closed" && l.status !== "not_interested",
              ).length;
              return (
                <button
                  key={c.id}
                  onClick={() => setView({ kind: "campaign", id: c.id })}
                  className="flex w-full items-center justify-between gap-3 py-5 text-left"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-paper">{c.name}</span>
                      {c.niche && (
                        <span className="rounded-full border border-line-strong px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-paper-dim">
                          {c.niche}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-mono text-xs text-paper-dim">
                      {campaignLeads.length} lead{campaignLeads.length === 1 ? "" : "s"}
                      {campaignLeads.length > 0 ? ` · ${openCount} open` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-paper-dim">→</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!loading && view.kind === "campaign" && activeCampaign && (
        <CampaignDetail
          campaign={activeCampaign}
          leads={leads.filter((l) => l.campaign_id === activeCampaign.id)}
          onBack={() => setView({ kind: "campaigns" })}
          onDeleteCampaign={() => deleteCampaign(activeCampaign.id)}
          onChanged={refresh}
        />
      )}
    </div>
  );
}

function StatusSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (status: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`min-h-11 rounded-lg border bg-ink px-2 font-mono text-[11px] outline-none focus:border-signal ${
        STATUS_STYLES[value] ?? STATUS_STYLES.not_called
      }`}
    >
      {STATUS_ORDER.map((s) => (
        <option key={s} value={s} className="text-paper">
          {STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}

function FollowUpsView({
  leads,
  campaigns,
  today,
  onChanged,
}: {
  leads: CallLeadRow[];
  campaigns: CallCampaignRow[];
  today: string;
  onChanged: () => void;
}) {
  async function setStatus(id: number, status: string) {
    await fetch(`/api/call-leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    onChanged();
  }

  async function clearCallback(id: number) {
    await fetch(`/api/call-leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callback_at: "" }),
    });
    onChanged();
  }

  return (
    <div className="mt-8">
      <p className="text-sm text-paper-dim">
        Every lead with a callback date today or earlier, across every campaign, oldest first —
        this is the list to work down before starting fresh calls.
      </p>
      <div className="mt-6 divide-y divide-line border-t border-line">
        {leads.length === 0 && (
          <p className="py-6 text-sm text-paper-dim">Nothing due. You&apos;re caught up.</p>
        )}
        {leads.map((l) => {
          const campaign = campaigns.find((c) => c.id === l.campaign_id);
          const overdue = (l.callback_at ?? "") < today;
          return (
            <div key={l.id} className="py-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-paper">{l.company}</span>
                    <span
                      className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] ${
                        overdue ? "border-signal text-signal" : "border-line-strong text-paper-dim"
                      }`}
                    >
                      {overdue ? "overdue" : "today"} · {formatDate(l.callback_at ?? today)}
                    </span>
                    {campaign && (
                      <span className="font-mono text-[10px] text-paper-dim">
                        {campaign.name}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-mono text-xs text-paper-dim">
                    {l.contact_name ? `${l.contact_name} · ` : ""}
                    {l.phone}
                    {l.email ? ` · ${l.email}` : ""}
                  </p>
                  {l.notes && (
                    <p className="mt-2 max-w-2xl border-l border-signal/40 pl-3 text-sm leading-relaxed text-paper-dim">
                      {l.notes}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <StatusSelect value={l.status} onChange={(s) => setStatus(l.id, s)} />
                  <button
                    onClick={() => clearCallback(l.id)}
                    className="flex min-h-11 items-center px-2 font-mono text-[11px] uppercase tracking-[0.08em] text-paper-dim transition-colors hover:text-paper"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CampaignDetail({
  campaign,
  leads,
  onBack,
  onDeleteCampaign,
  onChanged,
}: {
  campaign: CallCampaignRow;
  leads: CallLeadRow[];
  onBack: () => void;
  onDeleteCampaign: () => void;
  onChanged: () => void;
}) {
  const [paste, setPaste] = useState("");
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState("");
  const [importErr, setImportErr] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [addValues, setAddValues] = useState({
    company: "",
    contact_name: "",
    phone: "",
    email: "",
    niche: campaign.niche,
    notes: "",
  });
  const [addSaving, setAddSaving] = useState(false);

  async function runImport() {
    setImportErr("");
    setImportMsg("");
    if (!paste.trim()) {
      setImportErr("Paste some rows first.");
      return;
    }
    setImporting(true);
    const res = await fetch("/api/call-leads/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaign_id: campaign.id, paste }),
    });
    setImporting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setImportErr(data.error || "Import failed.");
      return;
    }
    const data = await res.json();
    setImportMsg(`${data.imported} lead${data.imported === 1 ? "" : "s"} imported.`);
    setPaste("");
    onChanged();
  }

  async function addLead() {
    if (!addValues.company.trim() || !addValues.phone.trim()) return;
    setAddSaving(true);
    const res = await fetch("/api/call-leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaign_id: campaign.id, ...addValues }),
    });
    setAddSaving(false);
    if (res.ok) {
      setAddValues({
        company: "",
        contact_name: "",
        phone: "",
        email: "",
        niche: campaign.niche,
        notes: "",
      });
      setShowAddForm(false);
      onChanged();
    }
  }

  async function setStatus(id: number, status: string) {
    await fetch(`/api/call-leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    onChanged();
  }

  async function setNotes(id: number, notes: string) {
    await fetch(`/api/call-leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    onChanged();
  }

  async function setCallback(id: number, callback_at: string) {
    await fetch(`/api/call-leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callback_at }),
    });
    onChanged();
  }

  async function removeLead(id: number) {
    if (!confirm("Delete this lead?")) return;
    await fetch(`/api/call-leads/${id}`, { method: "DELETE" });
    onChanged();
  }

  const visible = statusFilter === "all" ? leads : leads.filter((l) => l.status === statusFilter);
  const counts = STATUS_ORDER.map((s) => ({ status: s, n: leads.filter((l) => l.status === s).length }));

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex min-h-11 items-center font-mono text-xs uppercase tracking-[0.08em] text-paper-dim hover:text-paper"
        >
          ← All campaigns
        </button>
        <button
          onClick={onDeleteCampaign}
          className="flex min-h-11 items-center rounded-full border border-line-strong px-3 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-paper-dim hover:text-signal"
        >
          Delete campaign
        </button>
      </div>

      <h3 className="mt-4 text-lg font-medium text-paper">{campaign.name}</h3>
      {campaign.niche && (
        <p className="mt-1 font-mono text-xs text-paper-dim">{campaign.niche}</p>
      )}

      <div className="mt-6 rounded-2xl border border-line-strong bg-ink-2/60 p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-paper-dim">
          Import leads
        </p>
        <p className="mt-2 text-sm text-paper-dim">
          One per line: company, contact name, phone, email, niche, notes. Comma or tab
          separated, so a spreadsheet column copy pastes straight in. Only company and phone are
          required. Max 500 at a time.
        </p>
        <textarea
          value={paste}
          onChange={(e) => setPaste(e.target.value)}
          rows={4}
          spellCheck={false}
          placeholder={"Acme Plumbing, Dave, +1 512 555 0100, dave@acmeplumbing.com, plumbing\nCedar Salon, , +1 512 555 0199, , salon, called before, asked to call back next week"}
          className="mt-4 w-full rounded-lg border border-line-strong bg-ink px-3 py-2 font-mono text-xs text-paper outline-none focus:border-signal"
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={runImport}
            disabled={importing}
            className="flex min-h-11 items-center rounded-full bg-signal px-5 py-2.5 font-mono text-xs uppercase tracking-[0.1em] text-ink transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            {importing ? "Importing..." : "Import"}
          </button>
          <button
            onClick={() => setShowAddForm((v) => !v)}
            className="flex min-h-11 items-center rounded-full border border-line-strong px-5 py-2.5 font-mono text-xs uppercase tracking-[0.1em] text-paper-dim hover:text-paper"
          >
            {showAddForm ? "Cancel" : "+ Add one lead"}
          </button>
        </div>
        {importErr && <p className="mt-3 font-mono text-xs text-signal">{importErr}</p>}
        {importMsg && <p className="mt-3 font-mono text-xs text-online">{importMsg}</p>}

        {showAddForm && (
          <div className="mt-5 grid grid-cols-1 gap-3 border-t border-line pt-5 sm:grid-cols-2">
            <input
              value={addValues.company}
              onChange={(e) => setAddValues((v) => ({ ...v, company: e.target.value }))}
              placeholder="Company *"
              className="min-h-11 rounded-lg border border-line-strong bg-ink px-3 font-mono text-xs text-paper outline-none focus:border-signal"
            />
            <input
              value={addValues.contact_name}
              onChange={(e) => setAddValues((v) => ({ ...v, contact_name: e.target.value }))}
              placeholder="Contact name"
              className="min-h-11 rounded-lg border border-line-strong bg-ink px-3 font-mono text-xs text-paper outline-none focus:border-signal"
            />
            <input
              value={addValues.phone}
              onChange={(e) => setAddValues((v) => ({ ...v, phone: e.target.value }))}
              placeholder="Phone *"
              className="min-h-11 rounded-lg border border-line-strong bg-ink px-3 font-mono text-xs text-paper outline-none focus:border-signal"
            />
            <input
              value={addValues.email}
              onChange={(e) => setAddValues((v) => ({ ...v, email: e.target.value }))}
              placeholder="Email"
              className="min-h-11 rounded-lg border border-line-strong bg-ink px-3 font-mono text-xs text-paper outline-none focus:border-signal"
            />
            <input
              value={addValues.niche}
              onChange={(e) => setAddValues((v) => ({ ...v, niche: e.target.value }))}
              placeholder="Niche"
              className="min-h-11 rounded-lg border border-line-strong bg-ink px-3 font-mono text-xs text-paper outline-none focus:border-signal"
            />
            <input
              value={addValues.notes}
              onChange={(e) => setAddValues((v) => ({ ...v, notes: e.target.value }))}
              placeholder="Notes"
              className="min-h-11 rounded-lg border border-line-strong bg-ink px-3 font-mono text-xs text-paper outline-none focus:border-signal"
            />
            <button
              onClick={addLead}
              disabled={addSaving || !addValues.company.trim() || !addValues.phone.trim()}
              className="flex min-h-11 items-center justify-center rounded-full bg-signal px-5 py-2.5 font-mono text-xs uppercase tracking-[0.1em] text-ink transition-transform hover:scale-[1.02] disabled:opacity-50 sm:col-span-2"
            >
              {addSaving ? "Adding..." : "Add lead"}
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`flex min-h-11 items-center rounded-full border px-4 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors ${
            statusFilter === "all"
              ? "border-signal text-signal"
              : "border-line-strong text-paper-dim hover:text-paper"
          }`}
        >
          All ({leads.length})
        </button>
        {counts.map(({ status, n }) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`flex min-h-11 items-center rounded-full border px-4 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors ${
              statusFilter === status
                ? "border-signal text-signal"
                : "border-line-strong text-paper-dim hover:text-paper"
            }`}
          >
            {STATUS_LABELS[status]} ({n})
          </button>
        ))}
      </div>

      <div className="mt-6 divide-y divide-line border-t border-line">
        {visible.length === 0 && (
          <p className="py-6 text-sm text-paper-dim">
            {leads.length === 0 ? "No leads yet. Import some above." : "Nothing with that status."}
          </p>
        )}
        {visible.map((l) => (
          <LeadRow
            key={l.id}
            lead={l}
            onStatus={(s) => setStatus(l.id, s)}
            onNotes={(n) => setNotes(l.id, n)}
            onCallback={(d) => setCallback(l.id, d)}
            onDelete={() => removeLead(l.id)}
          />
        ))}
      </div>
    </div>
  );
}

function LeadRow({
  lead,
  onStatus,
  onNotes,
  onCallback,
  onDelete,
}: {
  lead: CallLeadRow;
  onStatus: (status: string) => void;
  onNotes: (notes: string) => void;
  onCallback: (date: string) => void;
  onDelete: () => void;
}) {
  const [notes, setNotes] = useState(lead.notes);

  return (
    <div className="py-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-paper">{lead.company}</span>
            {lead.niche && (
              <span className="rounded-full border border-line-strong px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-paper-dim">
                {lead.niche}
              </span>
            )}
          </div>
          <p className="mt-1 font-mono text-xs text-paper-dim">
            {lead.contact_name ? `${lead.contact_name} · ` : ""}
            {lead.phone}
            {lead.email ? ` · ${lead.email}` : ""}
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => {
              if (notes !== lead.notes) onNotes(notes);
            }}
            placeholder="Notes from the call..."
            rows={1}
            className="mt-2 w-full max-w-2xl resize-y rounded-lg border border-line-strong bg-ink px-2 py-1.5 text-sm text-paper outline-none focus:border-signal"
          />
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <div className="flex flex-col items-start gap-1">
            <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-paper-dim">
              Callback
            </label>
            <input
              type="date"
              value={lead.callback_at ?? ""}
              onChange={(e) => onCallback(e.target.value)}
              className="min-h-11 rounded-lg border border-line-strong bg-ink px-2 font-mono text-[11px] text-paper outline-none focus:border-signal"
            />
          </div>
          <StatusSelect value={lead.status} onChange={onStatus} />
          <button
            onClick={onDelete}
            className="flex min-h-11 items-center px-2 font-mono text-[11px] uppercase tracking-[0.08em] text-paper-dim transition-colors hover:text-signal"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
