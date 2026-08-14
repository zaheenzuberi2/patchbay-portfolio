"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Incorrect password.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6 text-paper">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-line-strong bg-ink-2/60 p-8"
      >
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal">
          Patchbay
        </p>
        <h1 className="mt-3 text-2xl font-medium tracking-[-0.02em]">
          Admin access
        </h1>
        <p className="mt-2 text-sm text-paper-dim">
          Enter the admin password to continue.
        </p>

        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mt-6 w-full rounded-lg border border-line-strong bg-ink px-4 py-3 font-mono text-sm text-paper outline-none focus:border-signal"
        />

        {error && (
          <p className="mt-3 font-mono text-xs text-signal">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="mt-6 w-full rounded-full bg-signal px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-ink transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? "Checking..." : "Enter"}
        </button>
      </form>
    </div>
  );
}
