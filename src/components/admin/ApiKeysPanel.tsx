"use client";

import { useEffect, useState } from "react";
import type { KeyStatus } from "@/lib/secrets";

// Write-only: the server never sends a stored key back, only where it comes
// from and its last four characters. A new key is checked with Google before
// it is saved, so a typo cannot replace a working key.
export function ApiKeysPanel() {
  const [keys, setKeys] = useState<KeyStatus[] | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<Record<string, { ok: boolean; text: string }>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/admin/secrets");
      if (!cancelled && res.ok) setKeys((await res.json()).keys);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function save(name: string) {
    setBusy(name);
    setMessage((m) => ({ ...m, [name]: { ok: true, text: "Checking with Google..." } }));
    const res = await fetch("/api/admin/secrets", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, value: drafts[name] ?? "" }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setKeys(data.keys);
      setDrafts((d) => ({ ...d, [name]: "" }));
      setMessage((m) => ({ ...m, [name]: { ok: true, text: "Saved. The site uses it from the next request." } }));
    } else {
      setMessage((m) => ({ ...m, [name]: { ok: false, text: data.error ?? "Could not save." } }));
    }
    setBusy(null);
  }

  async function remove(name: string) {
    if (!confirm("Remove the saved key? The site will fall back to the environment variable, if one is set.")) return;
    setBusy(name);
    const res = await fetch(`/api/admin/secrets?name=${encodeURIComponent(name)}`, { method: "DELETE" });
    if (res.ok) {
      setKeys((await res.json()).keys);
      setMessage((m) => ({ ...m, [name]: { ok: true, text: "Removed." } }));
    }
    setBusy(null);
  }

  if (!keys) return <p className="text-sm text-paper-dim">Loading...</p>;

  const sourceText = (k: KeyStatus) =>
    k.source === "panel"
      ? `Saved here, ends in ${k.last4}`
      : k.source === "env"
        ? `From the server environment, ends in ${k.last4}. Saving a key here overrides it.`
        : "Not set";

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm text-paper-dim">
        Keys are stored encrypted and are never shown again after saving. A new key is checked with
        the provider before it replaces the old one.
      </p>
      {keys.map((k) => (
        <div key={k.name} className="max-w-2xl rounded-xl border border-line-strong bg-ink-2 p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-display text-lg">{k.label}</h3>
            <span
              className={`font-mono text-xs uppercase tracking-[0.1em] ${
                k.source === "none" ? "text-signal" : "text-online"
              }`}
            >
              {k.source === "none" ? "Missing" : "Set"}
            </span>
          </div>
          <p className="mt-1 text-sm text-paper-dim">{k.help}</p>
          <p className="mt-2 font-mono text-xs text-paper-dim">{sourceText(k)}</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <label className="sr-only" htmlFor={`key-${k.name}`}>
              New {k.label}
            </label>
            <input
              id={`key-${k.name}`}
              type="password"
              autoComplete="off"
              spellCheck={false}
              value={drafts[k.name] ?? ""}
              onChange={(e) => setDrafts((d) => ({ ...d, [k.name]: e.target.value }))}
              placeholder="Paste new key"
              className="min-h-11 min-w-0 flex-1 rounded-md border border-line-strong bg-ink px-3 py-2 font-mono text-base text-paper placeholder:text-paper-dim sm:text-sm"
            />
            <button
              type="button"
              onClick={() => save(k.name)}
              disabled={busy === k.name || !(drafts[k.name] ?? "").trim()}
              className="min-h-11 rounded-md bg-signal px-4 text-sm font-medium text-ink disabled:opacity-40"
            >
              Test and save
            </button>
            {k.source === "panel" && (
              <button
                type="button"
                onClick={() => remove(k.name)}
                disabled={busy === k.name}
                className="min-h-11 rounded-md border border-line-strong px-4 text-sm text-paper disabled:opacity-40"
              >
                Remove
              </button>
            )}
          </div>
          {message[k.name] && (
            <p
              role="status"
              className={`mt-3 text-sm ${message[k.name].ok ? "text-online" : "text-signal"}`}
            >
              {message[k.name].text}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
