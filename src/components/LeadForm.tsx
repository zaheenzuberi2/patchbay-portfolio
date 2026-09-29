"use client";

import { useState } from "react";
import { siteConfig, whatsappUrl } from "@/lib/site-config";

type Status = "idle" | "sending" | "done" | "error";

// The site otherwise captures leads conversationally through ChatWidget,
// which is why /api/leads existed with no actual <form> in the DOM before
// this component. That is a deliberate product choice for casual visitors,
// but someone who already knows exactly what they want (arriving from a
// specific service page, ready to describe a job) shouldn't have to open a
// chat panel and re-answer a scripted flow to do it. Posts to the same
// endpoint, tagged with its own `source` so the admin dashboard can tell a
// direct form submission from a chat-widget conversation.
export function LeadForm({
  interest,
  source,
}: {
  interest: string;
  source: string;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot, never shown
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, interest, message, source, website }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-line-strong bg-ink-2/60 p-6 text-center sm:p-8">
        <p className="text-paper">
          Thanks, {name.split(" ")[0]}. That&apos;s with Zaheen now, he&apos;ll
          reach out at {contact}.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex min-h-11 items-center rounded-full border border-line-strong px-5 py-2.5 font-mono text-xs uppercase tracking-[0.1em] text-paper transition-colors hover:border-signal/60 hover:text-signal"
        >
          Skip the wait, message on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-line-strong bg-ink-2/60 p-6 sm:p-8"
    >
      {/* Bots fill every field they find; a real visitor never sees or
          fills this one. Matches the honeypot contract in api/leads/route.ts. */}
      <input
        type="text"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-[0.1em] text-paper-dim">
            Name
          </span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="mt-2 min-h-11 w-full rounded-lg border border-line-strong bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
          />
        </label>
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-[0.1em] text-paper-dim">
            Email or WhatsApp
          </span>
          <input
            required
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Where should the reply go"
            className="mt-2 min-h-11 w-full rounded-lg border border-line-strong bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="font-mono text-xs uppercase tracking-[0.1em] text-paper-dim">
          What needs to happen (optional)
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="A sentence or two is enough"
          className="mt-2 w-full resize-none rounded-lg border border-line-strong bg-ink px-3 py-2 text-sm text-paper outline-none focus:border-signal"
        />
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-5 flex min-h-11 w-full items-center justify-center rounded-full bg-signal px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] text-ink transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 sm:w-auto"
      >
        {status === "sending" ? "Sending..." : "Send it over"}
      </button>

      {status === "error" && (
        <p className="mt-3 text-sm text-paper-dim">
          That didn&apos;t go through. Email{" "}
          <a href={`mailto:${siteConfig.contactEmail}`} className="text-signal underline">
            directly
          </a>{" "}
          instead.
        </p>
      )}
    </form>
  );
}
