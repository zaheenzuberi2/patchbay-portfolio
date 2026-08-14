// Real roles only, no invented headcount beyond who is actually on the
// team. This file is the single source both the homepage Team section and
// each service page's "who's on this channel" strip pull from, so the claim
// stays consistent everywhere it appears.

export type TeamRoleKey =
  | "lead"
  | "dev"
  | "uiux"
  | "growth"
  | "data"
  | "seo"
  | "copy";

export type TeamRole = {
  key: TeamRoleKey;
  title: string;
  role: string;
  focus: string;
};

export const TEAM_ROLES: TeamRole[] = [
  {
    key: "lead",
    title: "Zaheen Zuberi",
    role: "Founder & Lead",
    focus:
      "Runs every project end to end: strategy, scope, and the client relationship, so nothing gets lost in a handoff between departments.",
  },
  {
    key: "dev",
    title: "Development specialist",
    role: "Development",
    focus:
      "Full-stack builds, AI systems, and automation logic, from schema to shipped code.",
  },
  {
    key: "uiux",
    title: "UI/UX Designer",
    role: "Design",
    focus:
      "Visual identity and interface design, kept consistent across every channel a project touches.",
  },
  {
    key: "growth",
    title: "Growth Strategist",
    role: "Growth",
    focus:
      "Campaign strategy and attribution, so marketing spend is judged against real leads and revenue, not vanity metrics.",
  },
  {
    key: "data",
    title: "Data Analyst",
    role: "Data",
    focus:
      "Reads what the numbers actually say, from call logs to campaign performance, and turns it into the next decision.",
  },
  {
    key: "seo",
    title: "SEO specialist",
    role: "SEO",
    focus:
      "Technical SEO, content structure, and search visibility, built in from the start rather than bolted on later.",
  },
  {
    key: "copy",
    title: "Chief Editor / Copywriter",
    role: "Copy",
    focus:
      "Website copy, ad copy, and brand voice, written to sound like the business it belongs to.",
  },
];

export function getTeamRole(key: TeamRoleKey) {
  return TEAM_ROLES.find((r) => r.key === key);
}
