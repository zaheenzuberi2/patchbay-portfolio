import { neon } from "@neondatabase/serverless";

// Postgres, not SQLite. Vercel's filesystem is ephemeral, so a file-backed
// database loses every lead and every admin-added project on redeploy.
//
// Two drivers, one dialect:
//   - DATABASE_URL set   -> Neon over HTTP (production, and locally if you
//                           point it at a real database)
//   - DATABASE_URL empty -> PGlite, real Postgres compiled to WASM, stored
//                           under ./data/pg
//
// PGlite is the same Postgres engine, so the SQL below behaves identically in
// both. That is the whole reason for the split: local development and testing
// need no signup, while production gets a managed database. Keep every query
// in standard Postgres so this stays true.

type SqlFn = (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<Record<string, unknown>[]>;

// Memoized on globalThis, not a module-scope variable. Next loads this module
// more than once per process (route handlers and server components get
// separate bundles), and PGlite is an in-process database: a second instance
// holds its own state and will not see writes made through the first. That
// showed up as admin edits not appearing on the public page until a restart.
// Neon is a shared server so it does not care, but one singleton keeps local
// and production behaviour identical.
const globalDb = globalThis as typeof globalThis & {
  __patchbaySql?: Promise<SqlFn> | null;
  __patchbayReady?: Promise<void> | null;
};

async function createSql(): Promise<SqlFn> {
  const url = process.env.DATABASE_URL;

  if (url) {
    const client = neon(url);
    return ((strings, ...values) =>
      client(strings, ...values) as Promise<
        Record<string, unknown>[]
      >) as SqlFn;
  }

  const { PGlite } = await import("@electric-sql/pglite");

  // PGlite's own mkdir is not recursive, so it fails if ./data does not
  // already exist. Create the parent tree first.
  const { mkdirSync } = await import("node:fs");
  const { join } = await import("node:path");
  const dataDir = join(process.cwd(), "data", "pg");
  mkdirSync(dataDir, { recursive: true });

  const pg = await PGlite.create(dataDir);

  // Convert a tagged template into a parameterised query so values are still
  // bound, never interpolated. Same injection safety as the Neon path.
  return async (strings, ...values) => {
    let text = "";
    strings.forEach((part, i) => {
      text += part;
      if (i < values.length) text += `$${i + 1}`;
    });
    const result = await pg.query(text, values as unknown[]);
    return result.rows as Record<string, unknown>[];
  };
}

async function getSql(): Promise<SqlFn> {
  if (!globalDb.__patchbaySql) {
    globalDb.__patchbaySql = createSql().catch((err) => {
      globalDb.__patchbaySql = null;
      throw err;
    });
  }
  return globalDb.__patchbaySql;
}

export type ProjectRow = {
  id: number;
  session_id: string;
  name: string;
  client: string;
  description: string;
  tags: string;
  status: string;
  href: string | null;
  kind: "project" | "open_slot";
  sort_order: number;
  created_at: string;
};

export type ReviewRow = {
  id: number;
  client_name: string;
  client_role: string;
  service_slug: string;
  rating: number;
  quote: string;
  sort_order: number;
  created_at: string;
};

export type LeadRow = {
  id: number;
  name: string;
  contact: string;
  interest: string | null;
  budget: string | null;
  message: string | null;
  source: string;
  status: string;
  created_at: string;
};

const SEED_PROJECTS = [
  {
    session_id: "0001",
    name: "Tryvoicely",
    client: "Own product, live",
    description:
      "Free AI text-to-speech for Urdu, Hindi & English. 22 languages, neural voices on Google Cloud's Chirp3-HD, no signup, MP3 out in seconds, for South Asian creators most TTS tools treat as an afterthought.",
    tags: ["Next.js", "Google Cloud TTS", "Product"],
    status: "LIVE",
    href: "https://tryvoicely.com",
    kind: "project",
    sort_order: 1,
  },
  {
    session_id: "0002",
    name: "Lex Justitia",
    client: "Client, live",
    description:
      "Full-stack website build for an Islamabad law practice. Eight practice areas, multilingual intake (Urdu, Roman Urdu, English), and secure online consultation booking, frontend to backend.",
    tags: ["Next.js", "Full-Stack", "Legal"],
    status: "LIVE",
    href: "https://lexjustitia.pk",
    kind: "project",
    sort_order: 2,
  },
  {
    session_id: "0003",
    name: "AB Juris",
    client: "Client, live",
    description:
      "Full-stack website for a full-service Islamabad law firm. Eight practice areas, case-record stats, and consultation scheduling, built end to end.",
    tags: ["Full-Stack", "Web Design", "Legal"],
    status: "LIVE",
    href: "https://abjuris.pk",
    kind: "project",
    sort_order: 3,
  },
  {
    session_id: "0004",
    name: "Umer Wazir",
    client: "Client, ongoing",
    description:
      "Built his website end-to-end and run his social media day to day: content, posting, and the accounts themselves.",
    tags: ["Web Design", "Full-Stack", "Social Mgmt"],
    status: "ACTIVE",
    href: null,
    kind: "project",
    sort_order: 4,
  },
  {
    session_id: "0005",
    name: "Open channel",
    client: "",
    description:
      "This slot is free. Bring a workflow worth automating and it runs through here next.",
    tags: [],
    status: "OPEN",
    href: null,
    kind: "open_slot",
    sort_order: 5,
  },
  {
    session_id: "0006",
    name: "Open channel",
    client: "",
    description:
      "This slot is free. Bring a workflow worth automating and it runs through here next.",
    tags: [],
    status: "OPEN",
    href: null,
    kind: "open_slot",
    sort_order: 6,
  },
];

// Schema creation and seeding run once per server process, not per request.

async function init() {
  const sql = await getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      contact TEXT NOT NULL,
      interest TEXT,
      budget TEXT,
      message TEXT,
      source TEXT NOT NULL DEFAULT 'chat',
      status TEXT NOT NULL DEFAULT 'new',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      session_id TEXT NOT NULL,
      name TEXT NOT NULL,
      client TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL,
      tags TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'LIVE',
      href TEXT,
      kind TEXT NOT NULL DEFAULT 'project',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      client_name TEXT NOT NULL,
      client_role TEXT NOT NULL DEFAULT '',
      service_slug TEXT NOT NULL DEFAULT '',
      rating INTEGER NOT NULL DEFAULT 5,
      quote TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY)`;

  // Covers databases created before the budget column existed.
  await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget TEXT`;

  // Claim the right to seed with a single atomic insert against a primary key.
  // Exactly one caller can win, so concurrent serverless cold starts on a fresh
  // database cannot seed the portfolio two or three times over. Counting rows
  // instead would let several callers all observe an empty table and duplicate
  // everything. The marker also persists, so deleting a seeded project in the
  // admin panel does not resurrect it on the next boot.
  const claimed = (await sql`
    INSERT INTO meta (key) VALUES ('projects_seeded')
    ON CONFLICT (key) DO NOTHING
    RETURNING key
  `) as { key: string }[];

  if (claimed.length > 0) {
    for (const p of SEED_PROJECTS) {
      await sql`
        INSERT INTO projects
          (session_id, name, client, description, tags, status, href, kind, sort_order)
        VALUES
          (${p.session_id}, ${p.name}, ${p.client}, ${p.description},
           ${JSON.stringify(p.tags)}, ${p.status}, ${p.href}, ${p.kind}, ${p.sort_order})
      `;
    }
  }
}

export async function getDb() {
  if (!globalDb.__patchbayReady) {
    globalDb.__patchbayReady = init().catch((err) => {
      // Reset so a transient failure (cold database, network blip) can retry
      // on the next request instead of poisoning the process permanently.
      globalDb.__patchbayReady = null;
      throw err;
    });
  }
  await globalDb.__patchbayReady;
  return await getSql();
}

export async function listProjects(): Promise<ProjectRow[]> {
  const sql = await getDb();
  return (await sql`
    SELECT * FROM projects ORDER BY sort_order ASC, id ASC
  `) as ProjectRow[];
}

export async function listLeads(): Promise<LeadRow[]> {
  const sql = await getDb();
  return (await sql`
    SELECT * FROM leads ORDER BY created_at DESC
  `) as LeadRow[];
}

export async function listReviews(): Promise<ReviewRow[]> {
  const sql = await getDb();
  return (await sql`
    SELECT * FROM reviews ORDER BY sort_order ASC, id ASC
  `) as ReviewRow[];
}
