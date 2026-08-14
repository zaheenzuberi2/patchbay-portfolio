import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { listLeads, listProjects, listReviews } from "@/lib/db";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

// Each query is isolated so one failing table (e.g. a migration that hasn't
// run yet) degrades to an empty list for that tab instead of 500ing the
// whole admin panel and locking out leads/projects too. Same resilience
// contract as the public site's Work.tsx/Reviews.tsx, just per-tab instead
// of per-section.
async function safeList<T>(fn: () => Promise<T[]>, label: string): Promise<T[]> {
  try {
    return await fn();
  } catch (err) {
    console.error(`[admin] could not load ${label}:`, err);
    return [];
  }
}

export default async function AdminPage() {
  const authed = await getSession();
  if (!authed) {
    redirect("/admin/login");
  }

  const [leads, projects, reviews] = await Promise.all([
    safeList(listLeads, "leads"),
    safeList(listProjects, "projects"),
    safeList(listReviews, "reviews"),
  ]);

  return (
    <AdminDashboard
      initialLeads={leads}
      initialProjects={projects}
      initialReviews={reviews}
    />
  );
}
