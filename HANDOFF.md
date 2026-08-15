# Patchbay Portfolio — Session Handoff

Everything a new session needs to pick this up. Written 13 Aug 2026, updated
14 Aug 2026 across two major sessions. **Read section 0 and 0b first.**

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
- [ ] **Google Search Console** — submit the sitemap. The SEO work sits
      unindexed until this happens.

**Not blocked — an agent can just do these:**

- [ ] **Cold outreach system.** Agreed in principle. Scope: prospect tracker
      in the existing admin panel, outreach copy, follow-up sequences,
      throttled sending with unsubscribe handling. Needs the second domain
      and the Resend key first. **Do not scrape addresses and mass-blast** —
      it gets the domain blacklisted and reply rates are near zero. The
      approach agreed was 20-30 genuinely researched emails a day.
- [ ] **Tests.** There are none. Everything has been verified manually. A
      future change could silently break lead capture or admin auth.
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

- ~~**The hero photo has not been replaced.**~~ **DONE 15 Aug 2026.** The
  mirror selfie from section 14 is gone. New source was a full-length shot in
  a green suit (`Documents/IMG_2985.JPG.jpeg`), cropped to **1040x1300, exactly
  4:5**, which matches the hero's `aspect-[4/5]` container so `object-cover`
  trims nothing. Filename kept as `public/zaheen.jpg`, so `Hero.tsx` and the
  `Person` schema `image` needed no change. Verified live: served at 39KB,
  natural and displayed ratios both 0.800.

  **Do not re-open the crop with him.** He was told plainly that his face is
  turned away and visibly soft in the source, most likely from an AI filter or
  upscale, and that the damage is more obvious the tighter you crop. He was
  shown a tight and a wide crop, the wide one was recommended for exactly that
  reason, and **he chose the tight crop**. That is his call and it is settled.
  A retake in the same suit and location, facing the camera and unfiltered,
  remains the real fix whenever he wants it.

  Cropping was done with PowerShell + `System.Drawing` (no ImageMagick, no
  Python on this machine, no `sharp` in the project). Check EXIF tag 274 for
  orientation first: it was 1 here, but a rotated source would need handling
  since `System.Drawing` does not auto-rotate.
