"use client";

import { useEffect, useState } from "react";
import type { KeyStatus } from "@/lib/secrets";

// Write-only: the server never sends a stored key back, only an id (so one key
// can be removed) and its last four characters. Pasted keys are each checked
// with Google; the valid ones join the pool and the site rotates through them.
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

  const say = (name: string, ok: boolean, text: string) =>
    setMessage((m) => ({ ...m, [name]: { ok, text } }));

  async function save(name: string) {
    setBusy(name);
    say(name, true, "Checking each key with Google...");
    const res = await fetch("/api/admin/secrets", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, value: drafts[name] ?? "" }),
    });
    const data = await res.json().catch(() => ({}));
    const bad = (data.rejected ?? []) as { last4: string; reason: string }[];
    const badText = bad.length
      ? ` Not added: ${bad.map((b) => `...${b.last4} (${b.reason})`).join(", ")}.`
      : "";
    if (res.ok) {
      setKeys(data.keys);
      setDrafts((d) => ({ ...d, [name]: "" }));
      const dup = data.duplicates ? ` ${data.duplicates} already saved.` : "";
      say(name, true, `Added ${data.added} key${data.added === 1 ? "" : "s"}.${dup}${badText}`);
    } else {
      say(name, false, `${data.error ?? "Could not save."}${badText}`);
    }
    setBusy(null);
  }

  async function remove(name: string, id?: string) {
    const ask = id
      ? "Remove this key?"
      : "Remove ALL saved keys? The site will fall back to the environment variable, if one is set.";
    if (!confirm(ask)) return;
    setBusy(name);
    const q = `name=${encodeURIComponent(name)}${id ? `&id=${id}` : ""}`;
    const res = await fetch(`/api/admin/secrets?${q}`, { method: "DELETE" });
    if (res.ok) {
      setKeys((await res.json()).keys);
      say(name, true, "Removed.");
    }
    setBusy(null);
  }

  if (!keys) return <p className="text-sm text-paper-dim">Loading...</p>;

  return (
    <div className="space-y-6">
      <p className="max-w-2xl text-sm text-paper-dim">
        Keys are stored encrypted and never shown again after saving. Paste as many as you like
        (one per line or separated by commas): each is checked with Google, and the site tries
        them in turn, so one failing or running out of quota does not take the assistant down.
      </p>
      {keys.map((k) => {
        const total = k.keys.length + (k.envLast4 ? 1 : 0);
        return (
          <div key={k.name} className="max-w-2xl rounded-xl border border-line-strong bg-ink-2 p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-lg">{k.label}</h3>
              <span
                className={`font-mono text-xs uppercase tracking-[0.1em] ${
                  total === 0 ? "text-signal" : "text-online"
                }`}
              >
                {total === 0 ? "Missing" : `${total} in rotation`}
              </span>
            </div>
            <p className="mt-1 text-sm text-paper-dim">{k.help}</p>

            <ul className="mt-3 divide-y divide-line border-y border-line">
              {k.keys.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 py-2">
                  <span className="font-mono text-xs text-paper-dim">Saved here, ends in {s.last4}</span>
                  <button
                    type="button"
                    onClick={() => remove(k.name, s.id)}
                    disabled={busy === k.name}
                    className="min-h-11 rounded-md px-3 text-xs text-paper-dim underline hover:text-paper disabled:opacity-40"
                  >
                    Remove
                  </button>
                </li>
              ))}
              {k.envLast4 && (
                <li className="py-2 font-mono text-xs text-paper-dim">
                  From the server environment, ends in {k.envLast4}
                </li>
              )}
              {total === 0 && <li className="py-2 font-mono text-xs text-paper-dim">No keys yet</li>}
            </ul>

            <div className="mt-4 flex flex-col gap-2">
              <label className="sr-only" htmlFor={`key-${k.name}`}>
                New {k.label}
              </label>
              <textarea
                id={`key-${k.name}`}
                autoComplete="off"
                spellCheck={false}
                rows={3}
                value={drafts[k.name] ?? ""}
                onChange={(e) => setDrafts((d) => ({ ...d, [k.name]: e.target.value }))}
                placeholder="Paste one or more keys"
                className="min-w-0 rounded-md border border-line-strong bg-ink px-3 py-2 font-mono text-base text-paper placeholder:text-paper-dim sm:text-sm"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => save(k.name)}
                  disabled={busy === k.name || !(drafts[k.name] ?? "").trim()}
                  className="min-h-11 rounded-md bg-signal px-4 text-sm font-medium text-ink disabled:opacity-40"
                >
                  Test and add
                </button>
                {k.keys.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(k.name)}
                    disabled={busy === k.name}
                    className="min-h-11 rounded-md border border-line-strong px-4 text-sm text-paper disabled:opacity-40"
                  >
                    Remove all
                  </button>
                )}
              </div>
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
        );
      })}
    </div>
  );
}
