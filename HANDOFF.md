# Patchbay Portfolio — Session Handoff

Everything a new session needs to pick this up. Written 13 Aug 2026, last
updated 31 Aug 2026. **Read section 0a first, then section 28** (the most
recent work: SEO, theme, security, voice).

**Project root:** `C:\Users\zaheen\claude\portfolio`

```bash
cd C:\Users\zaheen\claude\portfolio
npm run dev
```

That is the entire local setup. No database to install, no signup (see
Database below for why).

Node lives at `C:\Program Files\nodejs` and was installed during this project;
it was not on the machine before.

---

## 0a. THE SITE IS LIVE — read this before anything else

| What | Where |
|---|---|
| **Live site** | **https://zaheenzuberi.com** (real domain, live 15 Aug 2026) |
| **Old URL** | https://patchbay-portfolio.vercel.app — still serves, canonicals to the apex, kept as a fallback (section 24) |
| **GitHub** | https://github.com/zaheenzuberi2/patchbay-portfolio |
| **Vercel project** | `zaheen3/patchbay-portfolio` (Hobby/free plan) |
| **Domain / DNS** | Registered at Namecheap; **DNS is managed by Vercel** via nameservers, so `npx vercel dns add` works (section 24) |
| **Database** | Neon Postgres, `patchbay-db`, region `iad1`, free tier |
| **Admin panel** | https://zaheenzuberi.com/admin |

**Deployment is fully automatic: every push to `main` deploys to production.**
There is no separate deploy step. `git push origin main`, wait ~90 seconds,
done.

**The Vercel CLI is authenticated** as `zaheenzuberi2` and the project is
linked (`.vercel/` exists, gitignored). This means an agent can run
`npx vercel env ls`, `vercel ls`, `vercel domains add`, etc. directly. If auth
has expired, `npx vercel login` prints a device URL for Zaheen to approve —
never ask him to paste a token.

**Zaheen's explicit instruction as of this session:** he does not want to do
manual dashboard work. Do as much as possible yourself via the CLI and via
git push. The only things he must do personally are purchases (domain),
account creation (Resend), and approving auth prompts.

---

## 0b. What changed in the second 14 Aug 2026 session

This session took the site from "works locally" to "deployed, hardened, and
observable". Eight commits, all verified on production, not assumed.

**Shipped:**

- **Deployed to Vercel from a new git repo.** There was no git repo at all
  before this session. Now: `main`, 10 commits, auto-deploy wired.
- **Neon Postgres attached**, seeded with the 6 real projects.
- **Reviews feature is live and in use** — Umer Wazir's real 5-star review is
  on the homepage. The section auto-hides when the table is empty, so it
  showed nothing until he added it via `/admin`.
- **Canonical URL bug fixed** (section 16). Was emitting `localhost:3000` in
  every canonical tag, OG URL, JSON-LD `@id`, and all 8 sitemap entries on
  the live site.
- **Voice bot: three real bugs fixed** (section 17). Most important: speaking
  did nothing on mobile because the visualizer opened a second microphone
  stream that preempted speech recognition.
- **Spam protection on `/api/leads`** (section 18): per-IP rate limit +
  honeypot.
- **Lead notification emails** (section 19) — built, deployed, and dormant
  until `RESEND_API_KEY` is set.
- **`error.tsx`** runtime error boundary, plus the `not-found.tsx` from
  earlier.
- **Vercel Analytics + Speed Insights** installed and confirmed sending.
- **Urdu voice support removed** at Zaheen's request after being built. Do
  not re-add it without him asking.

**Behavioural pattern established this session — follow it.** Three separate
config values now *derive themselves* rather than failing when unset:
`SESSION_SECRET` (from `DATABASE_URL`), the canonical site URL (from
`VERCEL_PROJECT_PRODUCTION_URL`), and lead notifications (no-op without a
key). Zaheen struggled with the Vercel dashboard repeatedly. **Prefer
deriving a value in code over asking him to set an env var.** Only ask when
the value is a genuine secret only he can choose.

---

## 0. Read this first — what changed in the first 14 Aug 2026 session

- **Positioning flipped from solo to team.** Zaheen confirmed he has real
  collaborators (design, SEO, copy, dev specialists), Zaheen leading. Every
  "one person" / solo claim across the codebase was rewritten to "one
  accountable team" for consistency (`site-config.ts`, `home-faqs.ts`,
  `services.ts` ×2, `services/page.tsx`, `Milestones.tsx`, a `layout.tsx`
  comment). **If you add new copy, keep it team-framed. Do not reintroduce
  "one person" language** — it would now contradict the rest of the site.
  No names or headcounts were invented; only generic role framing
  (designer, SEO specialist, developer) that Zaheen confirmed is real.
- **The 3D hero field (SignalField/SignalFieldMount) is gone**, deleted.
  Replaced by a completely different system: a shape-morphing wireframe
  that lives site-wide, not just the hero. See section 8, fully rewritten.
- **No fabricated metrics.** Twice this session the request came to invent
  "before/after" numbers or efficiency stats with no real data behind them.
  Declined both times. Keep declining — this is a real business, inventing
  performance numbers is false advertising, not copywriting.
- Full verification (`npm run lint`, `npx tsc --noEmit`, `npm run build`)
  passes clean as of this write-up. If you change the 3D or animation code,
  re-run all three — this session hit a real SSR hydration bug and a real
  lint-rule trap doing exactly that (see section 13).

---

## 1. What this is

A portfolio and lead-generation site for **Zaheen Zuberi**, 19, Islamabad.

He leads **Patchbay** — a small team doing everything a marketing agency
does (brand, content, social) *plus* the AI and dev work agencies usually
outsource: voice agents, chatbots, automation, full-stack websites. Zaheen
is founder and lead; specialists on the team own design, SEO, copy, and
development respectively.

Positioning that matters: Patchbay is **not** a subcontractor to agencies,
it replaces one — one accountable team instead of an account manager, a
design agency, and a subcontracted developer who don't talk to each other.
Earlier copy had this backwards (agency vs. solo framing) and was corrected
more than once; don't re-litigate it without Zaheen's explicit input.

**Domain:** `zaheenzuberi.com` (confirmed available via RDAP, he is
registering it). Business name is Patchbay; the domain is his own name. That
mismatch is deliberate — the page title leads with his name, and an
exact-match domain on a personal name is the strongest signal for ranking when
someone Googles him after a referral.

**Contact:** zaheenzuberi2@gmail.com · +92 346 1223692 · Islamabad, PK

---

## 2. Design identity

**"Signal Console"** — a broadcast mixing console / telephone switchboard.
Near-black canvas, one warm signal-amber accent, live channel strips,
monospace used for real data (session IDs, tags, live status) and never as
costume.

| Token | Value | Role |
| --- | --- | --- |
| `--ink` | `#0a0a0b` | canvas |
| `--ink-2` / `--ink-3` | `#131315` / `#1c1c1f` | panels, raised |
| `--paper` / `--paper-dim` | `#f3efe7` / `#a3a19b` | text |
| `--signal` | `#ff5a1f` | accent, CTAs, key words |
| `--online` | `#6fcf7a` | live/status only |

Type: **Space Grotesk** display/body, **JetBrains Mono** for data and labels.
Elevation is border-only — no drop shadows.

**Hard rules, learned the hard way:**
- No em dashes (—) anywhere in visitor-facing copy. Zaheen asked for this
  specifically so it doesn't read as AI-written. Use periods, commas, colons.
- No eyebrow/kicker labels above headings.
- No gradient text, no glass decoration.

Full detail lives in **`DESIGN.md`** in the project root. Read it before
touching UI — it records *why* things are the way they are, not just what.

---

## 3. Tech stack

- **Next.js 16.3.0** (App Router, Turbopack), React 19.2.8, TypeScript
- **Tailwind v4** (CSS-first config in `src/app/globals.css`)
- **Postgres** — Neon in production, PGlite locally
- **Three.js** + React Three Fiber for the 3D hero

> ⚠️ `AGENTS.md` in the project root warns this Next version has breaking
> changes vs. training data. Read `node_modules/next/dist/docs/` before
> writing Next-specific code. This is real — several APIs differ.

---

## 4. Site structure

**Homepage** (`/`) — Hero → Channels (services, flip cards) → Projects →
About → Milestones → FAQ → Contact

**Service pages** — `/services` plus five children:
`ai-voice-agents`, `ai-chatbots`, `business-automation`, `web-development`,
`marketing-and-social`. All prerendered static.

These exist because a one-page site can only compete for one query cluster.
Each page targets its own commercial-intent cluster. All content is driven
from `src/lib/services.ts` — one file, five pages.

**Admin** — `/admin` (password-gated), `/admin/login`

---

## 5. Database — read this before touching data

Two drivers, one SQL dialect (`src/lib/db.ts`):

- `DATABASE_URL` set → **Neon Postgres** over HTTP (production)
- `DATABASE_URL` empty → **PGlite**, real Postgres compiled to WASM, stored in
  `./data/pg` (local dev, zero setup)

PGlite is the same engine, so SQL behaves identically. Keep every query
standard Postgres so that stays true. Placeholders are `$1`, not `?`.

**Why not SQLite:** Vercel's filesystem is ephemeral. A file-backed database
loses every lead and admin edit on redeploy. This was migrated mid-project.

**Three things that will bite you if you "clean them up":**

1. The connection and schema-init promise are memoized on **`globalThis`**,
   not module scope. Next loads this module more than once per process
   (route handlers and server components are separate bundles) and PGlite is
   in-process — a second instance has its own state. Without the globalThis
   singleton, **admin edits do not appear on the public page until restart.**
   This was a real bug, found and fixed.
2. Seeding claims the right to run via an atomic
   `INSERT INTO meta ... ON CONFLICT DO NOTHING RETURNING key`. Counting rows
   instead lets concurrent serverless cold starts each see an empty table and
   seed the portfolio several times over. The marker also persists, so a
   project deleted in the admin panel does not resurrect on next boot.
3. `Work.tsx` catches DB failures, logs loudly, returns `null`. A database
   outage must not 500 the whole marketing page. If the Projects section
   vanishes in production, grep server logs for
   `[Work] could not load projects`.

**Schema:** `leads` (name, contact, interest, budget, message, source, status,
created_at), `projects` (session_id, name, client, description, tags, status,
href, kind, sort_order), `meta` (seed marker).

---

## 6. Lead capture and admin

**Chat widget** (orange bubble, bottom-right, above the WhatsApp button):
guided flow — interest → name → contact → **budget** → optional message →
`POST /api/leads`. It is deterministic, **not** an LLM. That was chosen
because it needs no API key and no ongoing cost.

To upgrade it to real AI later: add `ANTHROPIC_API_KEY`, replace the fixed
buttons/step-machine with Claude API calls, and keep the same
`POST /api/leads` contract at the end so the admin panel needs no changes.

**Admin panel** (`/admin`): Leads tab (view, mark contacted, delete) and
Projects tab (add, edit, delete — changes appear on the public site
immediately). Auth is a single shared password plus an HMAC-signed session
cookie, 7-day expiry. No per-user accounts; it is a solo tool.

All four admin endpoints return **401** without a session and `/admin`
redirects — verified, not assumed.

---

## 7. SEO

On-page work is complete:

- Full metadata, canonical URLs, Open Graph + Twitter cards
- **JSON-LD** split by ownership: root layout emits the site-wide `@graph`
  (Person, ProfessionalService with OfferCatalog, WebSite); each page emits
  what it owns (Service, FAQPage, BreadcrumbList) referring back by `@id`.
  Do not duplicate the site-wide entities on individual pages.
- FAQ sections on homepage and every service page, with FAQPage schema
- Breadcrumbs with BreadcrumbList schema
- `sitemap.xml` (7 URLs), `robots.txt` (`/admin` and `/api` disallowed)
- OG image generated at `/opengraph-image` from brand tokens

**`Faq.tsx` keeps every answer in the DOM** whether expanded or not, animating
height only. FAQPage schema must match visible content — do not switch this to
conditional rendering.

**Research findings that shaped the copy:** cost questions ("how much does a
chatbot cost") are among the highest-volume commercial searches in this space,
so those FAQs lead. Professional services is a named top niche and he already
has two law-firm clients — "AI automation for law firms" is his most winnable
angle and far less contested than "AI automation".

**Be honest about limits:** on-page SEO is done, but ranking also depends on
domain age, backlinks, and competition. Nothing ranks until the site is
submitted to **Google Search Console** with the sitemap. Never imply rankings
are guaranteed by code.

Copy in `services.ts` and `home-faqs.ts` is deliberately **claim-free** — no
invented prices, client counts, or results. Pricing answers explain what drives
cost instead of quoting numbers he has not set. **Adding his real starting
prices would strengthen these pages significantly.**

---

## 8. 3D and animation (fully rebuilt this session)

The old bars-grid `SignalField`/`SignalFieldMount` is **deleted**. Current
system, in `src/components/three/`:

- **`WireframeShape.tsx`** — an icosahedron/octahedron/dodecahedron/cube/
  tetrahedron drawn as edges-only lines (unlit `LineBasicMaterial`, not a lit
  mesh — a lit shape's visibility depends on the lighting rig, which proved
  unreliable; a flat line is always exactly as visible as its own color).
  Small node-dot spheres at every vertex. When the target shape changes, it
  doesn't snap: a `ShapeLayer` component animates the old shape shrinking/
  fading out while the new one grows/fades in (see the layered-mount pattern
  in that file). Cursor parallax and a slow idle spin live on the *outer*
  group so they persist across shape changes.
- **`shapes.ts`** — builds each Platonic solid's edge geometry + deduped
  vertex list. All five shapes were chosen specifically because they have a
  small, clean vertex count; a smoothly curved shape (e.g. a torus) makes
  `EdgesGeometry` produce a dense, busy mesh instead of a crisp wireframe —
  don't add curved shapes to this set without addressing that.
- **`useActiveSection.ts`** — IntersectionObserver across every section id
  in `SECTION_THEME` (`src/lib/section-theme.ts`), reports the active
  section's `{color, shape}`. `rootMargin: "-15% 0px -15% 0px"` biases
  toward whichever section owns the vertical middle of the screen so two
  adjacent sections both partially visible doesn't cause flicker.
- **`SiteBackground.tsx`** — the R3F `Canvas`. **Centered** in the viewport
  (`restX/restY = 0`), not corner-anchored — this was deliberately changed
  from an earlier corner-anchored version. Opacity is `0.14` (tuned down
  twice this session; 0.3 and 0.45 both read as too prominent/competing with
  foreground text once centered — if asked to make it more/less visible,
  start by changing this one number).
- **`SiteBackgroundMount.tsx`** — mounted **once in the root layout**, not
  per-section and not just in the hero. Fixed, `-z-10`, `pointer-events-none`.
  Excluded from `/admin` via `usePathname()` (it's a utility tool, not a
  marketing surface). Same guards as the old SignalField: skipped on
  phones/coarse-pointer, respects `prefers-reduced-motion`, pauses via
  `document.visibilitychange` instead of IntersectionObserver (it's a fixed
  full-viewport layer, always "in view" by definition, so page-visibility is
  the right pause signal, not scroll intersection).
- **`SectionGlow.tsx`** — the CSS half of the same system. Every section
  (`Hero`, `Channels`, `Stack`, `Work`, `About`, `Milestones`, `Faq`,
  `Contact`) renders its own corner radial-gradient glow, colored from
  `SECTION_THEME`, same palette the 3D shape uses. **Pure CSS, no JS
  scroll-tracking** — this was a deliberate choice over a single scroll-synced
  layer, specifically because scroll-synced positioning is fragile (lag,
  flicker) and this is not: each section just owns its own glow, always
  correct, zero synchronization needed. If asked to change per-section
  colors, edit `SECTION_THEME` in `src/lib/section-theme.ts`, not the glow
  component.

**Two real bugs hit and fixed this session, don't reintroduce them:**

1. **SSR hydration mismatch.** An early version read `window.matchMedia`
   directly inside a `useState(() => ...)` lazy initializer to avoid a lint
   warning about calling `setState` inside an effect. This broke
   hydration: the server always renders with no `window`, so it renders the
   default; a client that computes the *real* value on its very first render
   disagrees with the server's HTML and React throws a hydration error. The
   fix (now in place): state defaults to a static value that matches the
   server (`useState(false)`), the real value is read inside a `useEffect`
   after hydration has already matched once, and the lint rule is suppressed
   with a comment explaining why (see `Reveal.tsx` and
   `SiteBackgroundMount.tsx`). **Never read `window`/`matchMedia`/
   `navigator` inside a `useState` initializer function** in a
   server-rendered component; always default-then-effect.
2. **`react-hooks/immutability` lint rule vs. react-three-fiber.** This
   project's eslint config includes a newer React-Compiler-oriented rule
   that flags mutating a `useMemo`-returned value (e.g. a Three.js
   material's `.opacity`/`.color`) inside `useFrame`. That mutation pattern
   is the *correct*, standard r3f animation model (materials are created
   once, mutated every frame; recreating them per-frame would defeat the
   whole point). It's suppressed with a scoped
   `/* eslint-disable react-hooks/immutability */` ... `/* eslint-enable */`
   block in `WireframeShape.tsx` — note the disable comment must wrap the
   entire `useFrame(...)` call expression, not just its body, or it silently
   doesn't suppress the reported line.

Also still true: `Reveal` takes a `variant` (`up`/`left`/`right`/`scale`/
`blur`) for rhythm, reveals content immediately under `prefers-reduced-motion`,
`ScrollProgress` draws an amber meter along the nav's bottom edge.

---

## 9. Real projects (do not treat as placeholder)

Order is intentional. All descriptions were verified by fetching the live
sites — don't re-invent them.

1. **Tryvoicely** (own product, live) — tryvoicely.com — free AI TTS for Urdu,
   Hindi & English, 22 languages, Google Cloud Chirp3-HD
2. **Lex Justitia** (client, live) — lexjustitia.pk — full-stack law firm site
3. **AB Juris** (client, live) — abjuris.pk — full-stack law firm site
4. **Umer Wazir** (client, ongoing) — site build + ongoing social management
5. & 6. **Open channel** ×2 — intentional capacity slots, not fake clients

Milestones facts are real, from Zaheen: national U16 cricket, father runs an
IT company, self-taught, founded Patchbay.

---

## 9b. Tech stack badges (`Stack.tsx`, new this session)

Site-wide section listing every tool actually used, pulled straight from the
real `stack: [...]` arrays in `services.ts` — nothing appears here unless a
service page already claims it, no fabricated integrations.

Real brand marks rendered via the `simple-icons` npm package (installed this
session) for: LangChain, WhatsApp, n8n, Zapier, Make, Next.js, TypeScript,
PostgreSQL, React, Node. Rendered in the page's own text color
(`currentColor`), not each brand's own hue, so fourteen different brand
colors don't turn this into the loudest thing on the page.

**Twilio, OpenAI, and Vapi have no icon in Simple Icons' catalog** — checked
both the installed npm package and the live CDN (`cdn.simpleicons.org`),
confirmed absent, not a version issue. Those three render as plain text
badges by design. If a future icon library adds them, wire it in the same
`STACK` array in `Stack.tsx` (each entry is `{ name, path? }`; omit `path`
for a text-only badge). GPT-4 and Whisper are both OpenAI products with no
separate brand mark of their own — don't go looking for one.

## 9c. Mobile fixes (this session)

Real bugs found by walking the site at 375px and actually testing tap
targets, not just eyeballing layout:
- The floating chat + WhatsApp buttons (`ChatWidget.tsx`, `WhatsAppButton.tsx`)
  were large enough on mobile to sit on top of *other* interactive elements —
  confirmed a tap on "Ask on WhatsApp" (a service-page CTA) would have hit
  the floating WhatsApp button instead. Fixed by shrinking both from 56px to
  44px on mobile (`sm:` breakpoint restores 56px on desktop) and pulling them
  tighter into the true corner (`bottom-4 right-4` instead of `bottom-5
  right-5`). If either button's size/position changes again, both files must
  stay in sync — same invariant as before, just smaller numbers now.
- Floating buttons briefly grazing the tail end of scrolling text/FAQ rows at
  certain scroll positions is normal, universal behavior for any floating
  chat widget (Intercom/Drift do this too) — not a bug, don't chase it
  further; the tap target itself remains functional.
- Admin panel (login + dashboard, including the project edit form) verified
  usable at 375px — no changes needed there.

---

## 10. Environment variables

`.env.local` (gitignored, does **not** deploy):

```
DATABASE_URL=            # empty locally = PGlite; set in prod
ADMIN_PASSWORD=<see your own .env.local / password manager>
SESSION_SECRET=<32-byte hex, see below>
NEXT_PUBLIC_SITE_URL=https://zaheenzuberi.com
```

⚠️ **Never write the real values into this file.** They used to be pasted
here in plaintext, which meant the admin password and the HMAC key that
signs admin session cookies would have been committed to git the moment the
repo was initialized. Real values live only in `.env.local` (gitignored)
locally and in the Vercel dashboard in production.

Generate a fresh `SESSION_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

The original development password was weak and guessable, and this panel
holds real client contact details. Set a strong one before launch.

`src/lib/site-config.ts` centralizes contact email, phone, WhatsApp number and
site URL so they can be changed via env without touching code. Restart the dev
server after editing `.env.local`.

---

## 11. Deployment — DONE. How it works now

**Already deployed.** GitHub Pages was ruled out and stays ruled out: it is
static-only, and this site has 8 API routes, a `force-dynamic` homepage, a
Postgres database, and server-side session auth. Roughly half the site — and
all of the revenue-generating half — cannot run there.

**Current pipeline:** push to `main` on GitHub → Vercel builds and deploys to
production automatically → live in ~90 seconds. Nothing else to do.

Useful CLI (already authenticated):

```bash
npx vercel ls --scope zaheen3        # deployment status
npx vercel env ls production          # env var names
npx vercel logs <deployment-url>      # runtime logs
```

**Env vars currently set in Vercel production:** `ADMIN_PASSWORD` (set by
Zaheen), `NEXT_PUBLIC_SITE_URL` (set 15 Aug 2026, see section 24), plus
`DATABASE_URL` and ~15 other `PG*`/`POSTGRES_*` variables injected
automatically by the Neon integration. **`SESSION_SECRET` is deliberately NOT
set** — it derives itself in code (sections 0b and 20). Do not "fix" that by
adding it.

`NEXT_PUBLIC_SITE_URL` *was* also deliberately unset while the site lived on
`patchbay-portfolio.vercel.app`, because it self-derived correctly from
`VERCEL_PROJECT_PRODUCTION_URL`. It is now set on purpose: section 16's
resolution order says to set it explicitly once the real domain is live, and
it is. **Do not remove it** thinking it is redundant — without it the
canonical origin falls back to the `.vercel.app` hostname.

**Trigger a rebuild without a code change** (e.g. after adding an env var):

```bash
git commit --allow-empty -m "chore: rebuild to pick up <VAR>" && git push
```

---

## 12. Outstanding / next steps

**Blocked on Zaheen (purchases and account creation only):**

- [x] ~~**Register `zaheenzuberi.com`.**~~ **DONE 15 Aug 2026.** Registered at
      Namecheap, nameservers moved to Vercel, live on HTTPS. See section 24.
- [ ] **A SECOND domain for cold outreach** (e.g. `getpatchbay.com`). This is
      important and he agreed to it: cold email complaints damage the sending
      domain's reputation, and if that is `zaheenzuberi.com` his real client
      email starts landing in spam. Never send cold email from the main
      domain.
- [ ] **Resend account** (free, 3,000 emails/month) → set `RESEND_API_KEY` in
      Vercel. This activates lead notifications, which are already built and
      deployed (section 19). Same account later covers cold outreach.
- [x] ~~**Google Search Console** — submit the sitemap.~~ **DONE.** Connected
      and indexing; 7 pages indexed and real click data by 28 Aug 2026. See
      section 28.

**Not blocked — an agent can just do these:**

- [ ] **Cold outreach system.** Agreed in principle. Scope: prospect tracker
      in the existing admin panel, outreach copy, follow-up sequences,
      throttled sending with unsubscribe handling. Needs the second domain
      and the Resend key first. **Do not scrape addresses and mass-blast** —
      it gets the domain blacklisted and reply rates are near zero. The
      approach agreed was 20-30 genuinely researched emails a day.
- [x] ~~**Tests.** There are none.~~ **DONE.** `npm test` runs 40 contract
      tests against production. See section 28.
- [ ] **Two more reviews.** One real review is live (Umer Wazir). Lex Justitia
      and AB Juris would fill the 3-column desktop grid properly.
- [ ] **Social links** — Contact.tsx still says "Social channels coming soon".
      He has no professional accounts yet.
- [ ] **Delete test rows** from `/admin` → Leads: `TEST LEAD - safe to delete`
      and `PROD NOTIFY CHECK - delete me`, both created while verifying the
      lead pipeline on production.
- [ ] **Umer Wazir's review role field** reads "International mma boxer, Umer
      Wazir", which duplicates his name since the name renders directly above
      it. Trivial fix in `/admin`, but it is a real client's attribution so
      ask before editing.

**Standing decisions — do not re-litigate:**

- [ ] **Real before/after or efficiency metrics.** Asked for repeatedly,
      declined every time because Zaheen does not track this data ("I've been
      exceptional but I don't keep track"). One real number from a client is
      worth more than any invented stat. Keep declining.
- [ ] **Prices.** He decided against listing them: pricing depends entirely on
      the project because the goal is growing the client's business and
      establishing fit. Both the voice bot and the homepage FAQ now say
      exactly that and point to a conversation with Zaheen. Do not add price
      ranges.
- [ ] **No LLM API for the bots.** Offered and explicitly declined ("no need
      for an api"). The chat and voice bots stay deterministic keyword
      matchers. If coverage gaps appear, widen the keywords (section 17).
- [ ] **Urdu** was built for the voice bot and then removed at his request.
      Do not re-add.
- [ ] Optional: business name "Patchbay" was chosen by Claude at his request —
      easy to rename (Nav, Footer, Hero, About, Milestones, `site-config.ts`)

---

## 13. Gotchas that cost real time

- **`window.scrollTo(0, document.body.scrollHeight)` does not scroll this
  page.** Body is a flex container so that height is wrong. Use
  `element.scrollIntoView()` when testing reveals, or you will wrongly
  conclude every Reveal is broken.
- **The preview pane throttles rAF to ~1 FPS when not compositing.** Confirmed
  by measuring a page with no canvas at all. Do not "optimize" this phantom.
- **`Channels.tsx` is a server component.** Passing an `onClick` to a child
  throws "Event handlers cannot be passed to Client Component props", which
  crashes the whole homepage render and silently strips its structured data.
  This happened once. If homepage schema goes missing, check the server log
  for that error first.
- **Hero's channel ticker must stay a single non-wrapping scroll row.** It is
  pinned to the hero's bottom; when it wrapped it ran underneath the photo
  caption on phones. The section's `pb-16 sm:pb-14` reserves its space — keep
  both halves of that fix together.
- **A full-bleed hero background was tried with `zaheen.jpg` and reverted.**
  In that photo the phone sits right beside his face, so no crop isolates one
  from the other at hero width. Don't retry it with that image.
- **Bloom MCP has nothing of his in it** — the only brands are "Prince Solar
  Engineering" and "Sunrun" under a workspace called "Muhammad's Team". Not
  his data. Onboard his own brand first if Bloom is ever needed.
- **Two chat sessions editing this repo at the same time will clobber each
  other's files.** Happened once this session — files ended up in a
  half-broken mixed state because a second, independent session was also
  writing to the same components. Confirm no other session has this
  directory open before starting parallel work; if the tree looks like it
  has code you didn't write, that's why.
- **After deleting/renaming component files or changing dynamic imports,
  clear `.next` before restarting the dev server** (`rm -rf .next`).
  Turbopack's persistent filesystem cache served a stale compiled chunk
  referencing a component that had already been deleted from source,
  producing a `ReferenceError` that looked like a real runtime bug but
  wasn't — `curl`-ing the raw server HTML showed the *server* was correct;
  only the cached client chunk was stale.
- **A raster/lit 3D object needs real contrast against `--ink`, or it's
  invisible.** An earlier orb attempt used a near-black chrome material on
  the near-black canvas and was genuinely camouflaged, not a rendering bug —
  wasted real debugging time on hydration/mounting theories before the
  actual cause (material color ≈ background color) was obvious from a real
  screenshot. Always verify a new 3D element with an actual screenshot
  before chasing mount/lifecycle bugs.

---

## 14. Photos

- `public/zaheen.jpg` → **Hero.** Cropped/graded mirror selfie. His phone
  still covers part of his face; a proper photo would convert better. Swap the
  file and keep the filename.
- `public/zaheen-about.jpg` → **About.** Night portrait by a car, cropped from
  1912×2080 to 4:5 and graded to the palette.
- `public/logo-mark.png` → nav + favicon (`src/app/icon.png`). Amber waveform
  through a circular node, generated to match the palette.

Two different photos deliberately — one face twice on a page reads as thin.

---

## 15. Verification status

As of 14 Aug 2026: `npm run lint` (0 problems), `npx tsc --noEmit` (0
errors), `npm run build` (production build succeeds) all pass clean. Verified
live in-browser this session: homepage, all 5 service pages, admin
login+dashboard on mobile, the new Stack section's logos, the new Contact CTA
and FAQ entries, chat widget's bottleneck-framed flow — zero console/server
errors, confirmed via real screenshots and DOM inspection, not assumed.

Earlier verification (still holds, not re-checked this session but nothing
here should have broken it): clean seed = exactly 6 rows; lead capture with
budget → stored → visible in admin; add project → appears on public page with
no restart; edit, delete, and mark-contacted all persist; all admin endpoints
401 without a session.

**If you change anything in `src/components/three/` or add new client-side
media-query/matchMedia state, re-run all three checks above before
considering it done** — this session hit a real hydration bug and a real
lint-suppression trap doing exactly that (section 8).

---

## 16. Canonical URL derives itself — do not "fix" it

`src/lib/site-config.ts` resolves the site origin in this order:

1. `NEXT_PUBLIC_SITE_URL` — set this only when the real domain is live. It is
   the only option visible to client components.
2. `VERCEL_PROJECT_PRODUCTION_URL` — injected automatically by Vercel on every
   deployment, no configuration needed, and **stable across deploys** (unlike
   `VERCEL_URL`, which is per-deployment and would churn canonical tags).
3. `http://localhost:3000` for local dev.

**Why this exists:** the first production deploy emitted canonical tags, OG
URLs, JSON-LD `@id`s, and all 8 sitemap entries pointing at
`http://localhost:3000`, because `NEXT_PUBLIC_SITE_URL` was unset. A canonical
tag pointing at localhost tells crawlers the authoritative page lives
somewhere unreachable, which would have wasted the entire SEO effort and
broken every social share preview. Deriving it means a fresh deploy is never
silently wrong.

Verified after the fix: zero occurrences of `localhost` in the live HTML or
sitemap.

**Caveat:** every consumer of `siteConfig.url` is a server component
(verified). `VERCEL_PROJECT_PRODUCTION_URL` is server-only, so if you ever
need `siteConfig.url` in a *client* component, set `NEXT_PUBLIC_SITE_URL`
explicitly first.

---

## 17. Voice bot (`VoiceDemo.tsx` / `VoiceWidget.tsx`) — three fixed bugs

English-only, deterministic keyword matching, no LLM, no API key. Speaks via
the browser's `speechSynthesis` and listens via `webkitSpeechRecognition`.
`prosody.ts` splits replies into clause-level segments with slight rate/pitch
jitter (the Web Speech API has no SSML, so chaining short utterances is the
only way to get pauses). `voice-selection.ts` scores installed voices to
prefer premium/neural ones.

**Bug 1 — speaking did nothing on mobile while typing worked.** The reported
symptom, and the diagnostic clue that cracked it. `startMicAnalysis()` opened
a **second** `getUserMedia` stream (purely to feed the visualizer, since
`SpeechRecognition` exposes no audio data). Desktop tolerates two concurrent
captures; mobile browsers frequently do not, and the second stream preempts
the recognizer so `onresult` never fires. **Fix:** skip the analyser entirely
on `(pointer: coarse)` devices and let the visualizer run its procedural
animation. The visualizer is decoration; speech input is the feature.
**Do not re-enable mic analysis on mobile.**

**Bug 2 — every recognition failure was silent.** `onerror`/`onend` just set
`listening = false` with no message, so permission denial, no-speech, and no
network all looked identical to the bot ignoring you. Now mapped to plain
explanations via `RECOGNITION_ERRORS`. `aborted` maps to an empty string on
purpose — that is the user tapping stop, not a failure.

**Bug 3 — the panel was see-through.** It used `bg-ink-2/60`, so at 60%
opacity the page showed through when floating over content and read as a
rendering fault. Now solid `bg-ink-2`, matching the chat widget.

**Coverage gaps are fixed by widening keywords, not by adding an LLM.** Two
real misses were reported and fixed this way: "how can i get more leads" and
pricing questions. There is also a `LOOSE_FALLBACK` substring pass that runs
**only after** every strict word-boundary check has failed, which catches
messy real input like `"tell mehow can i get moreleads"` (words run together)
without reintroducing false positives.

---

## 18. Lead capture spam protection

`/api/leads` POST is public by necessity (the chat widget posts with no auth),
making it the obvious thing to script against once indexed. Two defences,
neither costing a service:

1. **Per-IP rate limit** — 5 submissions per 10 minutes, held in memory on
   `globalThis`. Honest limitation: serverless instances do not share memory,
   so an attacker spraying cold starts gets more through. It stops casual
   form-spam bots and double-submits, which is the realistic threat. A shared
   store (Upstash/Redis) is the real fix if actual abuse appears.
2. **Honeypot** — a `website` field the real widget never sends. Anything
   arriving with it populated returns a normal-looking `200` so the bot does
   not learn it was caught.

Verified on production: 5 submissions succeeded, the 6th onward returned 429.

---

## 19. Lead notifications (`src/lib/notify.ts`) — built, dormant

Sends an email the moment a lead is captured. **Currently inactive** because
`RESEND_API_KEY` is not set. Setting that variable activates it with no code
change.

Three properties that matter more than the feature:

1. **A notification failure can never cost a lead.** The row commits before
   this runs, it is scheduled with `after()` from `next/server` so it executes
   *after* the response is sent, and every path swallows its own errors.
   **Verified with a deliberately invalid API key**: the submission still
   returned 200, the lead still saved, and the failure appeared only as a
   server log line.
2. **A missing key is not an error**, it is "not configured yet" — matching
   how `DATABASE_URL` and `SESSION_SECRET` already degrade.
3. **Lead fields are HTML-escaped.** They are attacker-controlled free text
   from a public endpoint.

Uses plain `fetch` to `api.resend.com` rather than the SDK: one HTTP POST does
not justify a dependency, and it keeps the provider swappable. `reply_to` is
set to the prospect's address when it looks like an email, so replying from
the inbox reaches them directly. Optional overrides: `LEAD_NOTIFY_TO`,
`LEAD_NOTIFY_FROM` (needs a verified domain in Resend; defaults to their
shared `onboarding@resend.dev` sender which works on a fresh account).

---

## 20. Admin auth — session key derives itself

`SESSION_SECRET` falls back to a SHA-256 derived from `DATABASE_URL` when
unset, so admin sessions work on a fresh deploy with no configuration.

**Why this is not a quiet security downgrade:** the derived key is a hash of a
high-entropy random credential, so its strength is fine. The question is blast
radius, and there is none added — this cookie only guards the admin panel, and
the admin panel only protects data living in that same database. Anyone
holding `DATABASE_URL` can already read every lead directly. The one real
tradeoff: rotating the database credential invalidates admin sessions, which
means logging in again.

`ADMIN_PASSWORD` genuinely cannot be derived and **is set in Vercel**. When it
is missing the login route returns a 503 explaining the situation rather than
an opaque 500 (which is what it did before, and which looks identical to a
broken site).

---

## 21. Error pages

- `not-found.tsx` — 404, branded, returns a real 404 status (verified, matters
  for SEO).
- `error.tsx` — runtime error boundary. Deliberately does **not** render `Nav`
  or `Footer`: if the failure originated in a shared layout component,
  rendering those again would throw inside the boundary itself. Surfaces
  Vercel's error `digest` so a reported problem can be found in logs.

---

## 22. Analytics

`@vercel/analytics` and `@vercel/speed-insights` are mounted in
`src/app/layout.tsx`. Both cookieless, both no-op off Vercel, so no consent
banner is required.

**Verification gotcha that cost time:** Vercel serves these scripts from
randomized paths like `/acf073f6ca7fd465/script.js` specifically so ad
blockers cannot pattern-match them. Searching the HTML for `_vercel` returns
nothing and looks like a failure. Check the **network panel** for a
`/<hash>/script.js` request and a `POST /<hash>/view` instead.

---

## 23. Verification status (end of second 14 Aug 2026 session)

`npm run lint`, `npx tsc --noEmit`, `npm run build` all clean.

Verified **on production**, not locally, not assumed:

- All 9 pages return 200; unknown routes return a real 404
- 6 projects and 1 review load from Neon
- Lead capture writes to the database and returns 200
- Rate limit triggers at the 6th submission; honeypot silently absorbed
- All admin write endpoints return 401 unauthenticated; `/admin` redirects
- Admin login rejects a wrong password with 401 (so `ADMIN_PASSWORD` is live)
- Notification path survives an invalid API key without losing the lead
- Zero `localhost` in HTML or sitemap; canonical, OG, and JSON-LD all correct
- OG image 200 (43KB PNG), favicon 200, `summary_large_image` card
- Analytics and Speed Insights scripts loading, pageview POST firing
- 375px: no horizontal scroll, zero sub-40px tap targets, review card fits

---

## 24. The real domain went live — 15 Aug 2026

**`https://zaheenzuberi.com` is the production site.** Registered at Namecheap
that morning, live on HTTPS the same hour.

**DNS is managed by Vercel, not Namecheap.** The nameservers were switched to
`ns1.vercel-dns.com` / `ns2.vercel-dns.com`, which means **an agent can add
DNS records directly with `npx vercel dns add`** and Zaheen never has to open
the registrar again. This was chosen deliberately over pasting A records: he
still needs DNS changes for Google Search Console verification and for
Resend's SPF/DKIM/DMARC, and this way those cost him nothing.

Zone baseline after the switch (everything else was added later, diff against
this):

```
CAA    0 issue "pki.goog" / "sectigo.com" / "letsencrypt.org"
*      ALIAS  cname.vercel-dns-017.com.
       ALIAS  3d97f066efbab01a.vercel-dns-017.com
```

**A CLI inconsistency to know about.** `vercel domains inspect` recommended
`A 76.76.21.21` while `vercel domains verify` returned `216.198.79.1` and
`64.29.17.1` for the same domain at the same moment. The first is Vercel's
older legacy anycast IP. Don't paste an A record from `inspect` on faith; the
nameserver route avoids the question entirely. Also note `inspect` kept
reporting the *old* registrar nameservers for several minutes after the
registry and public resolvers had already updated, so it is not a reliable
signal of whether propagation finished. Check the registry over RDAP or query
a public resolver directly instead.

**`www` redirects to the apex** via a `redirects()` entry in `next.config.ts`
matching `has: [{ type: "host", value: "www.zaheenzuberi.com" }]`. Both
hostnames are attached to the project, so without it every page served under
two URLs. `permanent: true` emits a **308**, not a 301 — that is Next's
deliberate choice to preserve the request method, and search engines treat
them equivalently. Verified: 308 on both the root and deep paths, exactly one
hop, no loop.

**`patchbay-portfolio.vercel.app` still serves the site and that is fine.**
It emits `canonical → https://zaheenzuberi.com` and its sitemap points at the
real domain, so Google consolidates to the apex on its own. It was kept
deliberately as a fallback if DNS ever breaks. A hard redirect was considered
and judged unnecessary.

**Verified on production after the switch, not assumed:** all 8 routes 200,
unknown route a real 404, `/admin` 307, `robots.txt` / `opengraph-image` /
`icon.png` all 200, all 8 sitemap entries on the new domain, canonical + OG
URL + all three JSON-LD `@id`s on the new domain, and **zero occurrences of
`localhost` or `patchbay-portfolio.vercel.app` in the served HTML**.

### Still open after this

- ~~**Google Search Console.**~~ **DONE 15 Aug 2026.** Domain property
  (`sc-domain:zaheenzuberi.com`, covers all subdomains and both protocols),
  verified by DNS TXT, sitemap `https://zaheenzuberi.com/sitemap.xml`
  submitted successfully.

  ⚠️ **Do not delete the `google-site-verification=` TXT record on the apex.**
  Removing it revokes Search Console ownership. It is in the Vercel-managed
  zone and looks like a stray record if you don't know what it is:

  ```
  TXT  @  google-site-verification=CS5EytMv_fDo2OyGacQzaiEYKKJ6z1jctUC9A3bF3kk
  ```

  Note the agent **cannot** submit sitemaps or read Search Console data — that
  needs Zaheen's Google account. The agent's reach stops at DNS. Don't promise
  otherwise; this was mis-stated once mid-session and corrected.
- **The second cold-outreach domain was never confirmed bought.** Asked twice,
  no answer. Do not send any cold email from `zaheenzuberi.com` — see
  section 12.
- ~~**Namecheap ALERT badge** on the domain the day it was registered.~~
  **RESOLVED 15 Aug 2026** — it was the ICANN registrant contact verification.
  Zaheen clicked the link in Namecheap's email. Registry status stayed clean
  throughout (`client transfer prohibited` only, never a hold).
- **Backlinks are the real ranking constraint, not on-page work**, which is
  finished. The highest-leverage available links are "built by" footer credits
  on the sites he already controls: tryvoicely.com (his own, no permission
  needed), lexjustitia.pk, abjuris.pk. He said he would add them. Google
  Business Profile is the other free high-value item, since Islamabad local
  intent is far less contested than the head terms.
- **`sameAs` is missing from the JSON-LD `Person` and `ProfessionalService`
  entities** — grep confirms it appears nowhere in `src/`. Once he has real
  LinkedIn/GitHub profiles, wiring `sameAs` plus the visible Contact social
  links is one pass and connects the site to his external identity. Contact.tsx
  still says "Social channels coming soon".

---

## 25. Mobile pass — 15 Aug 2026

Zaheen's read was that mobile is where nearly all his visitors are and that
it was not properly optimised. He was right, and the problems were found by
measuring the live page at 375x812, not by eyeballing it.

**Result: 17.9 screens of scrolling down to 14.1** (14,543px → 11,480px).

| Section | Before | After |
|---|---|---|
| channels | 2.8 screens | **0.9** |
| team | 2.7 | **1.6** |
| everything else | unchanged | unchanged |

Also: **85 elements rendering at 10-11px → 0**, and **8 tap targets under 44px
→ 0**. Desktop is byte-for-byte unchanged; every fix is behind a mobile-only
breakpoint and that was verified at 1280px afterwards.

### A flip card cannot be made short

This is the important lesson. The obvious fix for a tall card is to reduce its
height, and it does not work here: `.flip-card`'s box has to fit the *taller*
of its two faces, and the Channels back face carries a description, four tech
tags and a link. Shrinking the height just pushes content into the back face's
`overflow-y: auto` and creates a scroll inside a card, which is worse than the
length problem. A first pass that only tightened padding moved the whole page
by 816px, barely one screen, for exactly this reason.

**`ChannelAccordion.tsx`** is the mobile answer: collapsed rows (56px each,
above the tap-target floor) that expand on tap. Desktop still renders the flip
grid. Channels renders both and switches with `sm:hidden` / `hidden sm:grid`,
the same double-render `Nav.tsx` already uses for its two link rows.

**Both layouts carry all six service-page links** (5 unique slugs; CH.05 and
CH.06 both point at `marketing-and-social`). That is deliberate and must stay:
section 7 notes those internal links are how the service pages get discovered.
Verified on mobile that all 6 are in the DOM.

**The accordion drops closed panels from the DOM, and `Faq.tsx` deliberately
does not.** That is not an inconsistency to "fix". The FAQ must keep every
answer rendered because its FAQPage structured data has to match visible
content (section 7). Channels has no schema attached, so omitting closed
panels is free and is what actually makes the page short.

### Flip affordance

The hint in Channels was `hidden sm:block` — shown to desktop, which can
discover the flip by hovering, and hidden from phones, which cannot. Exactly
backwards. `FlipCard` now renders its own badge, so Channels and Milestones
both get it: **↻ TAP** under `(hover: none)`, **↻ HOVER** under
`(hover: hover)`, swapped by **CSS media query, never a JS pointer check** —
reading `matchMedia` during render is what caused the hydration bug in
section 8. Verified: 10 cards, correct variant on both, zero leakage.

Since Channels no longer flips on mobile, that badge is now load-bearing only
for Milestones there. Keep it: Milestones still flips on every width.

### Type and tap targets

Mono labels were `text-[10px]` / `text-[11px]` flat. They are now
`text-xs sm:text-[10px]` (and `sm:text-[11px]`), giving a 12px floor on mobile
and the original size from `sm:` up. Applied across 20 public files;
**`src/components/admin/` was deliberately skipped** — it is Zaheen's own
tool, not a marketing surface, and section 9c already verified it at 375px.

Nav links were only as wide as their text (`FAQ` was 26px). Padding moved into
the link and the row gap shrank to compensate, so it looks the same.

### Not done, and why

Getting under ~14 screens means deleting a section, not tightening one. Work
(2.2), About (2.0), Milestones (1.6) and FAQ (1.6) are all real content:
proof, trust, credibility, and schema-bearing SEO copy respectively. **Do not
cut them to chase a scroll-length number.** An earlier estimate in this
session that padding alone would reach 10 screens was wrong; the measured
ceiling for non-destructive work is roughly where it now sits.

**Nothing is hidden from mobile users** anywhere in this pass. Team's role
descriptions were a candidate for `hidden sm:block` and were kept, because
mobile is the primary audience and hiding content from them to win scroll
length is the wrong trade.

---

## 26. Per-URL OG images — 15 Aug 2026

Every page used to share the single homepage card, so a link to a specific
service page previewed identically to a link to the site. There are now
**8 cards, all prerendered**:

```
/opengraph-image                                 (homepage, pre-existing)
/services/opengraph-image
/faq/opengraph-image
/services/<slug>/opengraph-image                 x5, one per service
```

**`src/lib/og-image.tsx` is the single template** behind all of them. Do not
copy its markup into a new route; import `renderOgImage` instead, or the cards
drift apart.

Two constraints baked into that file, both real:

1. **Satori is not a browser.** Any element with more than one child needs an
   explicit `display: flex`, and unsupported CSS is dropped silently rather
   than throwing. Keep the markup boring. Colours are the brand tokens written
   as literals because Satori resolves neither CSS variables nor Tailwind.
2. **Long titles overflow.** Service names run well past headline length, so
   the template steps the font size down past 46 characters and `ogSubtitle()`
   trims descriptions on a word boundary. There is no text balancing to lean on.

`src/app/services/[slug]/opengraph-image.tsx` takes its
`generateStaticParams` from the same `services` array the pages use, so **a
sixth service gets a card with no edit here**.

⚠️ **`params` is a `Promise` in this Next version**, in the image route as well
as the page. The plain-object form from older versions typechecks against
nothing and fails at runtime. Confirmed against
`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md`.

**Schema:** the page-level `Service` entity now carries `image` pointing at its
own card rather than inheriting the site-wide one. The ownership split from
section 7 is unchanged and was re-verified live: root layout emits the
`@graph` (Person, ProfessionalService, WebSite), the page emits Service,
FAQPage and BreadcrumbList.

Verified on production: all 8 routes return `200 image/png` at distinct byte
sizes (proving they are genuinely different images), `og:image` and
`twitter:image` resolve per page, and the Service schema image is correct.

### Still open

- **The hero photo was replaced and then reverted, same day. The original
  mirror selfie from section 14 is what is live.** Do not treat this as
  unfinished work.

  A full-length shot in a green suit (`Documents/IMG_2985.JPG.jpeg`) was
  cropped to 1040x1300 and shipped, then Zaheen looked at it live and asked
  for the old one back. Reverted from git, verified visually.

  **He was right, and the reasoning is worth keeping.** The suit photo had
  better styling, but its face had been destroyed by what looks like an AI
  filter or upscale: smeared features, distorted hands. The current selfie has
  his phone across part of his face, which section 14 correctly calls a
  weakness, but **the face in it is sharp and readable**. A sharp face partly
  obscured beats a fully visible one that has been smeared. If a future
  session is tempted to swap in the suit photo, this is why it was rejected.

  **The real fix is still a retake**, and the suit and location were genuinely
  good: same outfit, same spot, facing the camera, someone else holding the
  camera, no filter and no AI enhancement.

  Practical notes if a swap is ever done: crop to exactly **4:5** to match the
  hero's `aspect-[4/5]` container so `object-cover` trims nothing, and keep the
  filename `public/zaheen.jpg` so `Hero.tsx` and the `Person` schema `image`
  need no edit. Use PowerShell + `System.Drawing` (no ImageMagick, no Python on
  this machine, no `sharp` in the project), and check EXIF tag 274 for
  orientation first, since `System.Drawing` does not auto-rotate.

---

## 27. Tests, FAQ search, favicon — 15 Aug 2026

### `npm test` exists now

```bash
npm test                              # against production
BASE_URL=http://localhost:3000 npm test
```

`tests/contract.test.mjs`, **33 checks, zero dependencies** (`node:test` ships
with Node, same reasoning as `notify.ts` using plain fetch over the Resend
SDK). Note the script is `node --test "tests/**/*.test.mjs"`: passing a bare
directory resolves as a *module* on Node 22.14 and fails with
`MODULE_NOT_FOUND`.

Covers: every page 200, real 404s, all 8 mutating admin endpoints 401
unauthenticated, honeypot absorbed with a 200, no `localhost` in the HTML,
canonical + `og:url` + JSON-LD sharing one origin, sitemap 8 URLs all
on-origin, robots disallowing `/admin` and `/api`, the root `@graph` holding
exactly Person + ProfessionalService + WebSite, service pages owning a Service
entity with their own OG image and *not* duplicating the site-wide entities,
and all 8 share cards decoding as real PNGs.

**Confirmed the suite can fail**: pointed at `https://example.com` it fails 30
of 33. If you extend it, re-check that — a suite that always passes is worse
than none.

**A real lead submission is deliberately untested.** It writes a row to the
production database, and stale test rows from earlier manual checks are still
in `/admin`. The honeypot path is tested instead, since it is specified to
return 200 while storing nothing.

### Measuring tap targets: use `offsetWidth`/`offsetHeight`, not `getBoundingClientRect`

This produced a **false bug report** earlier in the session. `Reveal` wrappers
sit at `transform: scale(0.94); opacity: 0` until they scroll into view, and
`getBoundingClientRect` returns the *transformed* box: 44 x 0.94 = 41.4, which
reads as a failing 41px tap target on an element that is genuinely 44px.
Several "undersized tap targets" were this artifact. `offsetHeight` ignores
transforms and reports layout size. Re-audited that way, the only genuine
offender site-wide was the breadcrumb link (34px wide, now `px-2`).

### FAQ search (`FaqLibrary.tsx`)

`/faq` is 200 questions and ran 31.5 screens on a phone with only category
jump links. Search filters across every category at once: **31.5 screens down
to 6.3 for a typical query**, verified live.

⚠️ **Filtering is CSS only and must stay that way.** Non-matching items get
`hidden`; nothing unmounts. The answers have to remain in the DOM or the
FAQPage schema stops matching the page, which is the same rule in section 7
that governs expand/collapse. With an empty query nothing is hidden, and that
is the state a crawler sees. Verified live: searching drops visible questions
to 25 while **all 200 stay in the DOM**.

`faqMatches()` in `Faq.tsx` is a plain substring test, deliberately *not* the
scored matcher in `faq-search.ts`: that one picks the single best answer for
the chat bot, where a filter needs every hit. Matches auto-expand while
searching, and the category bar hides during a search because its jump links
would point at hidden sections.

### The favicon was Next's default until now

`src/app/favicon.ico` was still the stock Next triangle, untouched since
project creation (same `Aug 11 16:40` timestamp as `eslint.config.mjs`), so
every browser tab showed Next's logo. Rebuilt from `public/logo-mark.png` as a
multi-size ico (16/32/48/64, PNG-compressed frames). `icon.png` was a
1024x1024 195KB file serving as a tab icon; now 256x256 / 19KB.

**`System.Drawing` cannot decode PNG-compressed ICO frames.** `Icon.ToBitmap()`
throws "Requested range extends past the end of the array" on a perfectly valid
file. Do not treat that as corruption. The container was validated by parsing
the bytes (header, per-frame offsets, PNG signatures, bounds) and then by
decoding it in a real browser, which is the consumer that matters.

### Mobile: measured state of every page

| Page | Screens | Text under 12px | Tap targets under 44px |
|---|---|---|---|
| Homepage | 14.1 | 0 | 0 |
| Service pages | 7.6 | 0 | 0 |
| `/faq` | 31.5, or 6.3 while searching | 0 | 0 |

Remaining length is content, not spacing, and cutting it is Zaheen's call. The
candidates raised with him, in order: Milestones (1.6 screens), the hero (1.5
screens before any service is visible), and Work's desktop-shaped three-column
rows. **Performance is 872ms / 23KB / 19 requests. Do not trade that away.**

### Hero tightened — 15 Aug 2026

**1,248px to 1,052px on a 375px screen (1.5 to 1.3 screens).** Mobile-only
padding and gap reductions, plus capping the portrait's width to 260px and
centring it rather than letting it run full-bleed (327px wide meant 409px tall
at 4:5, a third of the hero for one photo).

**The width was capped instead of the aspect ratio changed, on purpose.**
Squashing the box to 4:3 would save more, but `object-cover` then crops top and
bottom off a portrait, and the overlay chrome (the Signal/Live badge and the
process line) would collide inside the shorter box. Capping width keeps the
face framed exactly as it was.

Verified after: **ticker still a single non-wrapping row that scrolls
horizontally, 56px tall, with 32px clearance above it.** That is the invariant
from section 13, and it holds.

What the remaining 1,052px is made of, measured:

```
photo card   325px
paragraph    182px  (7 lines, 46 words)
headline     153px  (4 lines)
CTAs         104px
ticker        56px
padding etc  232px
```

**The only lever left is the 46-word paragraph.** Everything structural has
been taken. Shortening it is a copy decision and belongs to Zaheen; do not
trim it unilaterally. Note the hero copy is also the clearest statement of the
team positioning from section 0, so any edit has to stay team-framed.

⚠️ **Two false bug reports came from bad selectors this session.** Both looked
real. `hero.querySelector('.absolute.inset-x-0.bottom-0')` matches the photo's
*internal* bottom overlay before the ticker, making it look like the ticker
overlaps the photo card. And `[position:fixed]` filtered to `button, a` finds
nothing, because the floating chat/WhatsApp/voice controls are fixed on their
wrapper `div`s. Select the ticker as a direct child of `#top`, and check
`getComputedStyle(el).position` across all elements. Combined with the
`getBoundingClientRect` transform trap above, that is three measurement
artifacts in one session: **verify a suspicious DOM finding a second way
before acting on it.**

---

## 28. SEO, theme, security and voice pass — 15 to 31 Aug 2026

Twenty-nine commits. The through-line was moving the site from "built and
live" to "findable", plus a light/dark theme and a security pass. Everything
below is deployed and was verified on production, not just locally.

### The site is now indexed and getting real traffic

Google Search Console is connected and the sitemap is submitted (this was the
blocking item in section 12). As of 28 Aug: **7 pages indexed, 12 clicks, 81
impressions, 14.8% CTR, average position 11.9**, all from a standing start of
zero about two weeks earlier. The 4 "not indexed" pages are 3 redirects plus
1 not-yet-crawled, both normal, neither a bug.

Highest-clicked page after the homepage is `/services/web-development`, which
is the page that got the most targeted SEO work. Early, but the effect is
real.

### Tests exist now (section 12 said they did not)

`npm test` runs 40 contract tests across 8 suites against production
(`tests/contract.test.mjs`, `node:test`, no framework). They cover page 200s,
admin auth returning 401, canonical/OG/JSON-LD origin agreement, sitemap
contents, OG images being real PNGs, security headers, and the theme toggle.
Run them after any deploy.

### Light/dark theme

Real toggle, both breakpoints. `src/lib/theme.ts` owns the storage key and an
anti-FOUC inline script that runs before paint; `ThemeToggle.tsx` dispatches a
`patchbay:theme` CustomEvent rather than using React context, so
`SiteBackgroundMount` can react without being a descendant. Light palette
lives in `:root[data-theme="light"]` in `globals.css` and every value was
checked against the real WCAG relative-luminance formula, not eyeballed.

The 3D wireframe background is hidden in light mode, the same judgement
already made for mobile: its palette is tuned for a near-black canvas.

### Security

`next.config.ts` now sets CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options`,
`Referrer-Policy` and `Permissions-Policy`, and `x-powered-by` is off.
**Session tokens previously verified the signature but never checked the
embedded timestamp**, so they never actually expired. Fixed in
`src/lib/auth.ts`.

CSP keeps `'unsafe-inline'` for both `script-src` (Next's inline hydration)
and `style-src` (8 components use inline `style={{}}`). A nonce-based CSP was
considered and deliberately rejected as disproportionate.

### SEO work, in order of how much it mattered

1. **Meta titles and descriptions** were over Google's truncation limits on
   the homepage and 5 other pages. All rewritten to fit and to end on a CTA.
2. **A local FAQ category** ("Serving Islamabad", 16 Q&As) targeting
   "web developers in Islamabad", "AI automation agency Islamabad", "best
   SEO services in Islamabad" and similar. FAQ library is now 216 questions.
3. **The voice-agents page** gained comparison-intent FAQs (AI voice agent vs
   answering service, vs voicemail, vs AI receptionist) and two explicit
   local ones ("best AI calling agent developer in Islamabad").
4. **Per-service reviews.** `ServiceReviews.tsx` renders reviews tagged to
   that service and feeds the page's own `aggregateRating`, separate from the
   site-wide one on `ProfessionalService`.
5. **`revalidate = 300`** on service pages. They are statically generated, so
   **anything added through `/admin` (reviews, projects) would never have
   appeared without a redeploy.** That was a real latent bug, not a
   theoretical one.
6. **FAQ page linked to the service pages.** It had none: a visitor landing
   there from search hit a dead end, and the page passed no link equity on.
7. **A collapsed plain-language About block in the footer.** The brand voice
   is metaphor-forward, which gives AI answer engines little literal text to
   quote. This states the same facts plainly. It is a real `details` element,
   visible to anyone who clicks, **not crawler-only text, which would be
   cloaking.** That distinction was tested and is deliberate.

### Voice demo, three real bugs

All three were verified by intercepting `speechSynthesis.speak()` in a live
browser and reading the actual utterance values, not by ear.

1. `utterance.lang` was hardcoded `"en-US"` regardless of which voice
   `pickBestVoice` selected. On a machine whose best voice was `en-GB`, that
   mismatch can make a browser silently fall back to its own default voice,
   which explains "the voice sounds generic".
2. `rateMul`/`pitchMul` are *multipliers* but were assigned directly as
   `utterance.rate`/`.pitch`, with no base to multiply. Added `BASE_RATE` in
   `prosody.ts` and fixed the arithmetic.
3. `getVoices()` was only ever called at speak time. Chrome/Edge load voices
   asynchronously and the first call can return empty; now warmed on mount.

Also cut the inter-clause pause 110ms to 40ms. Each clause is a separate
utterance and Chrome adds its own startup delay per utterance, so the
intended pause was compounding with platform overhead into audible gaps.

**Ceiling worth knowing:** voice quality is capped by what is installed on the
visitor's OS. A legacy non-neural voice will sound robotic no matter what.
`voice-selection.ts` already prefers neural/"Natural" voices when present.

**Urdu, precisely:** removed from the *VoiceDemo browser widget* (still true,
do not re-add there). Urdu **is** claimed as a real service capability in
`services.ts` FAQs, the footer About block, and `knowsLanguage: ["en","ur"]`.
Those are different things; do not "fix" one into the other.

### Other

- `VoiceDemo` is code-split via `VoiceDemoLazy.tsx`. It is ~524 lines of
  client JS on the page most targeted for ranking, and Core Web Vitals are a
  ranking signal.
- Hero has a pulsing amber glow (`.hero-glow`, 7s, respects reduced-motion).
  The keyframe existed in `globals.css` but was never wired to anything.
- The voice-demo section was left-aligned at `max-w-md` inside `max-w-6xl`,
  leaving ~700px empty on desktop. Now a two-column layout at `lg:`.
- Brand intro animation on a fresh session; real mobile menu with
  active-page highlighting; header-height gap fixed on every page.

### Google Business Profile, live

Created and verified under `zaheenzuberi2@gmail.com`. Service-area business
(address hidden, DHA Phase 2 Islamabad as the anchor), open 24 hours, five
custom services matching the site, categories beyond the primary "Marketing
agency", real desk photo plus logo. **Ad-graphic images were deliberately kept
out of the Photos section**: Google's guidelines discourage promotional
overlay text there, and those belong in Posts.

Google Ads' $400 credit was declined. It is a spend-$400-get-$400 match, not
free budget, and Zaheen's position is no spend until the site earns.

### Gotchas from this session

- **`layout.tsx` appends `" | Patchbay"` to every page title via the metadata
  template.** The real budget for a page title is therefore ~49 characters,
  not 60. Getting this wrong shipped `"...Services | Patchbay | Patchbay"` to
  production for one deploy.
- **`next/dynamic` with `ssr: false` is rejected inside a Server Component.**
  It has to live in its own `"use client"` file.
- **Vercel production secrets cannot be pulled back.** `vercel env pull`
  returns `[SENSITIVE]` placeholders. A forgotten `ADMIN_PASSWORD` must be
  *reset* in the dashboard, then **redeployed**, since env changes do not
  affect the running deployment. This cost real time on 31 Aug.
- **Local `.env.local` and Vercel env vars drift.** `ADMIN_PASSWORD` differed
  between them, which is what made the admin panel reject the local password.
- **The Browser pane does not composite frames when not displayed.**
  Screenshots come back blank and `window.innerWidth` reads 0. Structural
  checks (`getComputedStyle`, `getBoundingClientRect`, intercepting API calls)
  are reliable; visual screenshots are not. Set an explicit viewport with
  `resize_window` before trusting any measurement.

### Still open

- [ ] **A review from Suleman Rashid** (real estate consultant) who reacted to
      the voice demo with "Very nice. This is what I want." Not yet added: it
      needs his permission, and a fuller quote naming the problem it solves
      would read far stronger. Add via `/admin` then Reviews, channel
      **AI Voice & Calling Agents**.
- [ ] **Instagram content is drafted and unused.** Seven ad graphics plus
      captions, an account bio, and a collab poster for Umer Wazir all exist
      but nothing has been posted.
- [ ] **Google Posts.** A 4-week cadence was drafted (launch, voice agents,
      chatbots, automation). Posts expire after 7 days, so this needs to be
      habitual or it is not worth starting.
- [ ] **A luxury colour direction was explored and parked.** Four prototypes
      (brass/oxblood, emerald, sapphire, monochrome) with Fraunces as the
      display face. Zaheen has not picked one. **Do not start re-skinning the
      real site without an explicit decision**: the current amber identity is
      deliberate and documented in section 2.
- [ ] **Rotate `ADMIN_PASSWORD` again.** The current value passed through a
      chat transcript on 31 Aug.
- [ ] Bloom (trybloom.ai) has ~3 credits left in Zaheen's own workspace
      (`Zaheen's Team`), brand `Patchbay` onboarded from the live site.

### Standing decision added this session

- **No cloaking, no keyword stuffing, no invisible crawler text.** Asked for
  directly, declined, and the reasoning holds: hidden-but-indexed text is a
  Search Essentials violation with real deindexing risk, and the `keywords`
  meta tag has been ignored for ranking since 2009. The legitimate version of
  that request is real content answering real search intent, which is what
  the local FAQ category and the footer About block actually are.
