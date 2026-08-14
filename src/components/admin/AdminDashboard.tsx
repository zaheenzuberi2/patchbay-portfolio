"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LeadRow, ProjectRow, ReviewRow } from "@/lib/db";
import { ProjectForm, type ProjectFormValues } from "./ProjectForm";
import { ReviewForm, type ReviewFormValues } from "./ReviewForm";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function formatDate(iso: string) {
  return dateFormatter.format(new Date(iso));
}

export function AdminDashboard({
  initialLeads,
  initialProjects,
  initialReviews,
}: {
  initialLeads: LeadRow[];
  initialProjects: ProjectRow[];
  initialReviews: ReviewRow[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"leads" | "projects" | "reviews">("leads");
  const [leads, setLeads] = useState(initialLeads);
  const [projects, setProjects] = useState(initialProjects);
  const [reviews, setReviews] = useState(initialReviews);
  const [editing, setEditing] = useState<ProjectRow | "new" | null>(null);
  const [editingReview, setEditingReview] = useState<
    ReviewRow | "new" | null
  >(null);

  async function refreshLeads() {
    const res = await fetch("/api/leads");
    if (res.ok) {
      const data = await res.json();
      setLeads(data.leads);
    }
  }

  async function refreshProjects() {
    const res = await fetch("/api/projects");
    if (res.ok) {
      const data = await res.json();
      setProjects(data.projects);
    }
  }

  async function updateLeadStatus(id: number, status: string) {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    refreshLeads();
  }

  async function deleteLead(id: number) {
    if (!confirm("Delete this lead?")) return;
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    refreshLeads();
  }

  async function deleteProject(id: number) {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    refreshProjects();
  }

  async function saveProject(values: ProjectFormValues, id?: number) {
    const url = id ? `/api/projects/${id}` : "/api/projects";
    const method = id ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      setEditing(null);
      refreshProjects();
    }
    return res.ok;
  }

  async function refreshReviews() {
    const res = await fetch("/api/reviews");
    if (res.ok) {
      const data = await res.json();
      setReviews(data.reviews);
    }
  }

  async function saveReview(values: ReviewFormValues, id?: number) {
    const url = id ? `/api/reviews/${id}` : "/api/reviews";
    const method = id ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      setEditingReview(null);
      refreshReviews();
    }
    return res.ok;
  }

  async function deleteReview(id: number) {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    refreshReviews();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-ink px-6 py-10 text-paper">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal">
              Patchbay
            </p>
            <h1 className="mt-2 text-2xl font-medium tracking-[-0.02em]">
              Admin
            </h1>
          </div>
          <button
            onClick={logout}
            className="flex min-h-11 items-center rounded-full border border-line-strong px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] text-paper-dim transition-colors hover:text-paper"
          >
            Log out
          </button>
        </div>

        <div className="mt-8 flex gap-2 border-b border-line">
          <button
            onClick={() => setTab("leads")}
            className={`flex min-h-11 items-center px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] ${
              tab === "leads"
                ? "border-b-2 border-signal text-signal"
                : "text-paper-dim"
            }`}
          >
            Leads ({leads.length})
          </button>
          <button
            onClick={() => setTab("projects")}
            className={`flex min-h-11 items-center px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] ${
              tab === "projects"
                ? "border-b-2 border-signal text-signal"
                : "text-paper-dim"
            }`}
          >
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setTab("reviews")}
            className={`flex min-h-11 items-center px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] ${
              tab === "reviews"
                ? "border-b-2 border-signal text-signal"
                : "text-paper-dim"
            }`}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        {tab === "leads" && (
          <div className="mt-8 divide-y divide-line border-y border-line">
            {leads.length === 0 && (
              <p className="py-8 text-sm text-paper-dim">
                No leads yet. They&apos;ll show up here once the chat
                widget collects one.
              </p>
            )}
            {leads.map((lead) => (
              <div key={lead.id} className="py-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-paper">{lead.name}</h3>
                      <span
                        className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] ${
                          lead.status === "new"
                            ? "border-signal/40 text-signal"
                            : lead.status === "contacted"
                              ? "border-online/40 text-online"
                              : "border-line-strong text-paper-dim"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-sm text-paper-dim">
                      {lead.contact}
                      {lead.interest ? ` · ${lead.interest}` : ""}
                      {lead.budget ? ` · ${lead.budget}` : ""}
                    </p>
                    {lead.message && (
                      <p className="mt-2 max-w-xl text-sm text-paper-dim">
                        {lead.message}
                      </p>
                    )}
                    <p className="mt-2 font-mono text-[11px] text-paper-dim">
                      {formatDate(lead.created_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {lead.status !== "contacted" && (
                      <button
                        onClick={() => updateLeadStatus(lead.id, "contacted")}
                        className="flex min-h-11 items-center rounded-full border border-line-strong px-3 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-paper-dim hover:text-paper"
                      >
                        Mark contacted
                      </button>
                    )}
                    <button
                      onClick={() => deleteLead(lead.id)}
                      className="flex min-h-11 items-center rounded-full border border-line-strong px-3 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-paper-dim hover:text-signal"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "projects" && (
          <div className="mt-8">
            {editing ? (
              <ProjectForm
                initial={editing === "new" ? undefined : editing}
                onCancel={() => setEditing(null)}
                onSave={(values) =>
                  saveProject(values, editing === "new" ? undefined : editing.id)
                }
              />
            ) : (
              <button
                onClick={() => setEditing("new")}
                className="flex min-h-11 items-center rounded-full bg-signal px-5 py-2.5 font-mono text-xs uppercase tracking-[0.1em] text-ink transition-transform hover:scale-[1.02]"
              >
                + Add project
              </button>
            )}

            <div className="mt-8 divide-y divide-line border-y border-line">
              {projects.map((project) => (
                <div key={project.id} className="py-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-signal">
                          {project.session_id}
                        </span>
                        <h3 className="font-medium text-paper">
                          {project.name}
                        </h3>
                        <span className="rounded-full border border-line-strong px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-paper-dim">
                          {project.kind === "open_slot"
                            ? "open slot"
                            : project.status}
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-xs text-paper-dim">
                        {project.client}
                      </p>
                      <p className="mt-2 max-w-xl text-sm text-paper-dim">
                        {project.description}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => setEditing(project)}
                        className="flex min-h-11 items-center rounded-full border border-line-strong px-3 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-paper-dim hover:text-paper"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="flex min-h-11 items-center rounded-full border border-line-strong px-3 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-paper-dim hover:text-signal"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "reviews" && (
          <div className="mt-8">
            {editingReview ? (
              <ReviewForm
                initial={editingReview === "new" ? undefined : editingReview}
                onCancel={() => setEditingReview(null)}
                onSave={(values) =>
                  saveReview(
                    values,
                    editingReview === "new" ? undefined : editingReview.id,
                  )
                }
              />
            ) : (
              <button
                onClick={() => setEditingReview("new")}
                className="flex min-h-11 items-center rounded-full bg-signal px-5 py-2.5 font-mono text-xs uppercase tracking-[0.1em] text-ink transition-transform hover:scale-[1.02]"
              >
                + Add review
              </button>
            )}

            <div className="mt-8 divide-y divide-line border-y border-line">
              {reviews.length === 0 && !editingReview && (
                <p className="py-8 text-sm text-paper-dim">
                  No reviews yet. Add a real client review to show it on the
                  public site.
                </p>
              )}
              {reviews.map((review) => (
                <div key={review.id} className="py-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-paper">
                          {review.client_name}
                        </h3>
                        <span className="rounded-full border border-line-strong px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-paper-dim">
                          {review.rating} / 5
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-xs text-paper-dim">
                        {review.client_role}
                        {review.service_slug ? ` · ${review.service_slug}` : ""}
                      </p>
                      <p className="mt-2 max-w-xl text-sm text-paper-dim">
                        {review.quote}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => setEditingReview(review)}
                        className="flex min-h-11 items-center rounded-full border border-line-strong px-3 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-paper-dim hover:text-paper"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteReview(review.id)}
                        className="flex min-h-11 items-center rounded-full border border-line-strong px-3 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-paper-dim hover:text-signal"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
