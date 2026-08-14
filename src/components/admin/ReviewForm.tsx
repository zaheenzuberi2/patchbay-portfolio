"use client";

import { useState } from "react";
import type { ReviewRow } from "@/lib/db";
import { services } from "@/lib/services";

export type ReviewFormValues = {
  client_name: string;
  client_role: string;
  service_slug: string;
  rating: number;
  quote: string;
};

function toFormValues(row?: ReviewRow): ReviewFormValues {
  if (!row) {
    return {
      client_name: "",
      client_role: "",
      service_slug: "",
      rating: 5,
      quote: "",
    };
  }
  return {
    client_name: row.client_name,
    client_role: row.client_role,
    service_slug: row.service_slug,
    rating: row.rating,
    quote: row.quote,
  };
}

export function ReviewForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: ReviewRow;
  onSave: (values: ReviewFormValues) => Promise<boolean>;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<ReviewFormValues>(
    toFormValues(initial),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!values.client_name.trim() || !values.quote.trim()) {
      setError("Client name and quote are required.");
      return;
    }

    setSaving(true);
    const ok = await onSave(values);
    setSaving(false);
    if (!ok) setError("Something went wrong. Try again.");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-line-strong bg-ink-2/60 p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-paper-dim">
            Client name
          </span>
          <input
            value={values.client_name}
            onChange={(e) =>
              setValues({ ...values, client_name: e.target.value })
            }
            className="min-h-11 rounded-lg border border-line-strong bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-paper-dim">
            Role / company
          </span>
          <input
            value={values.client_role}
            onChange={(e) =>
              setValues({ ...values, client_role: e.target.value })
            }
            placeholder="e.g. Owner, Lex Justitia"
            className="min-h-11 rounded-lg border border-line-strong bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
          />
        </label>
      </div>

      <label className="mt-4 flex flex-col gap-1.5">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-paper-dim">
          Quote
        </span>
        <textarea
          value={values.quote}
          onChange={(e) => setValues({ ...values, quote: e.target.value })}
          rows={3}
          className="min-h-11 rounded-lg border border-line-strong bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-paper-dim">
            Rating
          </span>
          <select
            value={values.rating}
            onChange={(e) =>
              setValues({ ...values, rating: Number(e.target.value) })
            }
            className="min-h-11 rounded-lg border border-line-strong bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} / 5
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-paper-dim">
            Which channel (optional)
          </span>
          <select
            value={values.service_slug}
            onChange={(e) =>
              setValues({ ...values, service_slug: e.target.value })
            }
            className="min-h-11 rounded-lg border border-line-strong bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
          >
            <option value="">General</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <p className="mt-4 font-mono text-xs text-signal">{error}</p>}

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="flex min-h-11 items-center rounded-full bg-signal px-5 py-2.5 font-mono text-xs uppercase tracking-[0.1em] text-ink transition-transform hover:scale-[1.02] disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex min-h-11 items-center rounded-full border border-line-strong px-5 py-2.5 font-mono text-xs uppercase tracking-[0.1em] text-paper-dim hover:text-paper"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
