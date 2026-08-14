"use client";

import { useState } from "react";
import type { ProjectRow } from "@/lib/db";

export type ProjectFormValues = {
  name: string;
  client: string;
  description: string;
  tags: string[];
  status: string;
  href: string;
  kind: "project" | "open_slot";
};

function toFormValues(row?: ProjectRow): ProjectFormValues {
  if (!row) {
    return {
      name: "",
      client: "",
      description: "",
      tags: [],
      status: "LIVE",
      href: "",
      kind: "project",
    };
  }
  let tags: string[] = [];
  try {
    tags = JSON.parse(row.tags);
  } catch {
    tags = [];
  }
  return {
    name: row.name,
    client: row.client,
    description: row.description,
    tags,
    status: row.status,
    href: row.href ?? "",
    kind: row.kind,
  };
}

export function ProjectForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: ProjectRow;
  onSave: (values: ProjectFormValues) => Promise<boolean>;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<ProjectFormValues>(
    toFormValues(initial),
  );
  const [tagsText, setTagsText] = useState(
    toFormValues(initial).tags.join(", "),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!values.name.trim() || !values.description.trim()) {
      setError("Name and description are required.");
      return;
    }

    setSaving(true);
    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const ok = await onSave({ ...values, tags });
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
            Name
          </span>
          <input
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            className="min-h-11 rounded-lg border border-line-strong bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-paper-dim">
            Client
          </span>
          <input
            value={values.client}
            onChange={(e) => setValues({ ...values, client: e.target.value })}
            placeholder="e.g. Client, live"
            className="min-h-11 rounded-lg border border-line-strong bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
          />
        </label>
      </div>

      <label className="mt-4 flex flex-col gap-1.5">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-paper-dim">
          Description
        </span>
        <textarea
          value={values.description}
          onChange={(e) =>
            setValues({ ...values, description: e.target.value })
          }
          rows={3}
          className="min-h-11 rounded-lg border border-line-strong bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
        />
      </label>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-paper-dim">
            Tags (comma separated)
          </span>
          <input
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="Next.js, Full-Stack, Legal"
            className="min-h-11 rounded-lg border border-line-strong bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-paper-dim">
            Link (optional)
          </span>
          <input
            value={values.href}
            onChange={(e) => setValues({ ...values, href: e.target.value })}
            placeholder="https://..."
            className="min-h-11 rounded-lg border border-line-strong bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-paper-dim">
            Status label
          </span>
          <input
            value={values.status}
            onChange={(e) => setValues({ ...values, status: e.target.value })}
            placeholder="LIVE, ACTIVE, ONGOING..."
            className="min-h-11 rounded-lg border border-line-strong bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-paper-dim">
            Kind
          </span>
          <select
            value={values.kind}
            onChange={(e) =>
              setValues({
                ...values,
                kind: e.target.value as "project" | "open_slot",
              })
            }
            className="min-h-11 rounded-lg border border-line-strong bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
          >
            <option value="project">Real project</option>
            <option value="open_slot">Open slot</option>
          </select>
        </label>
      </div>

      {error && (
        <p className="mt-4 font-mono text-xs text-signal">{error}</p>
      )}

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
