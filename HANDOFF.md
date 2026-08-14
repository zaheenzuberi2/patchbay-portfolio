# Patchbay Portfolio — Session Handoff

Everything a new session needs to pick this up. Written 13 Aug 2026, updated
14 Aug 2026 after a major session covering the 3D background rebuild, mobile
fixes, and a positioning change from solo to team. **Read section 0 first.**

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

## 0. Read this first — what changed 14 Aug 2026

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

## 11. Deployment (see `DEPLOY.md` for the click-path)

Decided: **Vercel, deploying from GitHub.** GitHub Pages was ruled out — it is
static-only and would kill the admin panel, lead capture, and database
entirely.

Roughly 5 minutes, once:
1. Push to a GitHub repo (not yet initialized — no git repo exists yet)
2. Import into Vercel (auto-detects Next.js)
3. **Storage → Create Database → Neon** *from inside Vercel* — this sets
   `DATABASE_URL` automatically, which is the exact variable the code reads.
   Do not sign up at neon.com separately.
4. Set `ADMIN_PASSWORD`, `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL` in Vercel
5. Add the domain, then submit to Google Search Console

Account creation is the one thing that cannot be automated on his behalf.

---

## 12. Outstanding / next steps

- [ ] **Register `zaheenzuberi.com`** and deploy (nothing is live yet)
- [ ] **Change `ADMIN_PASSWORD`** from the weak dev default, and set a fresh
      `SESSION_SECRET` in Vercel (see section 10)
- [ ] **Google Search Console** — submit sitemap after launch. Without this,
      the SEO work sits unindexed.
- [ ] **Add real starting prices** to service-page FAQs — highest-leverage
      remaining SEO/conversion win
- [ ] **Real before/after or efficiency metrics** — asked for twice this
      session, declined both times because Zaheen doesn't track this data
      yet ("I've been exceptional but I don't keep track"). If he gets even
      one real number from Umer Wazir / Lex Justitia / AB Juris (response
      time, leads/month, hours saved), it's worth more than any invented
      stat and should go into the FAQ/Contact copy immediately.
- [ ] **Social links** — he has no professional accounts yet; Contact.tsx says
      "Social channels coming soon" instead of dead links
- [ ] **Instagram reel reference** — he wants a portfolio styled like a reel by
      creator *Ruchit Patel*. **Never viewed.** The Claude-in-Chrome extension
      would not connect all session despite him logging into Instagram. A
      screen recording saved to disk is the reliable path; a logged-out fetch
      of an Instagram URL returns nothing.
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
