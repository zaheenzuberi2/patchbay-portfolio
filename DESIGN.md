# Design system — Signal Console

## Identity
Zaheen Zuberi, 19, Islamabad. Runs **Patchbay** — full-service marketing agency
(brand, content, social) plus AI automation and full-stack dev, solo. Not a
subcontractor to agencies; replaces the whole agency.

## World
Broadcast mixing console / telephone switchboard. Near-black canvas, one warm
signal-amber accent, live channel strips, monospace status readouts used for
actual data (session IDs, tags, live signal), never as costume. v2 extends the
system with flip cards and floaty motion per explicit brief — both are now
reusable motifs, not one-offs.

## Tokens (src/app/globals.css)
- `--ink` #0a0a0b canvas · `--ink-2` #131315 panel · `--ink-3` #1c1c1f raised
- `--paper` #f3efe7 text · `--paper-dim` #a3a19b secondary text
- `--signal` #ff5a1f accent (CTAs, active state, key words)
- `--online` #6fcf7a status/live indicator only
- `--line` / `--line-strong` hairline borders — elevation is border-only, no shadows

## Type
- Display/body/UI: Space Grotesk (`--font-display`)
- Data/labels/technical: JetBrains Mono (`--font-mono`) — session IDs, tags, nav, stack chips
- Tracking floor -0.03em on display, mono labels use 0.08–0.25em positive tracking

## Motifs (reuse these, don't invent new ones)
- `SignalBars` — animated live-signal bars (hero panel, channel-card fronts)
- `FlipCard` (`src/components/FlipCard.tsx`) — click/tap or hover to flip;
  front = identity, back = detail. Used in Channels and Milestones. The CSS in
  globals.css forces the active face to a higher z-index in addition to the
  3D rotation — some rendering engines don't fully honor
  `backface-visibility: hidden`, so the z-index is the real guarantee that the
  inactive face never shows; keep both when touching this component.
- `.floaty` / `.floaty-slow` — slow vertical bob for accent panels (hero
  signal panel, About photo frame). Don't apply to more than 1-2 elements per
  viewport.
- Channel numbering `CH.01…` and session IDs `SESSION 0142` — literal
  console/log numbering, not decorative section counters
- Status dot + label (`status-dot` class) for any "live/online/available" state
- Logo mark: `public/logo-mark.png` (also `src/app/icon.png` for favicon) —
  amber waveform routed through a circular node, generated to match this
  palette. Swap only if the business identity changes.

## Banned in this system
- Eyebrow/kicker labels centered above headings
- Gradient text, glass decoration, drop shadows (borders only)

## Real content on file (do not treat as placeholder)
- Work.tsx order is intentional per Zaheen: Tryvoicely, Lex Justitia,
  AB Juris, Umer Wazir, then two open slots. All four are real (descriptions
  verified via live fetch of each site — don't re-invent them): Tryvoicely
  (own product), Lex Justitia + AB Juris (client law-firm sites, full-stack),
  Umer Wazir (client, site + social management). The "Open channel" rows are
  intentionally generic — capacity slots, not fake clients.
- Milestones.tsx facts (cricket, father's company, self-taught, Patchbay) are
  real, sourced directly from Zaheen.
- Contact.tsx: real email/phone/location.

## System (leads + admin-editable projects)
- **Postgres, two drivers, one dialect** (`src/lib/db.ts`):
  `DATABASE_URL` set means Neon over HTTP (production); unset means PGlite,
  real Postgres compiled to WASM, stored in `./data/pg`. PGlite is the same
  engine, so the SQL behaves identically and local development needs no
  signup. Keep every query standard Postgres so that stays true.
- The connection and the schema-init promise are memoized on **`globalThis`**,
  not module scope. Next loads this module more than once per process (route
  handlers and server components are separate bundles) and PGlite is
  in-process, so a second instance holds its own state. Without the
  globalThis singleton, admin edits did not appear on the public page until
  a server restart. Do not "clean this up" into a module-level variable.
- Seeding claims the right to run via an atomic
  `INSERT INTO meta ... ON CONFLICT DO NOTHING RETURNING key`. Counting rows
  instead lets concurrent serverless cold starts all see an empty table and
  seed the portfolio several times over. The marker also persists, so a
  project deleted in the admin panel does not come back on the next boot.
- Hosting is **Vercel, deploying from GitHub** (Zaheen's choice). This is why
  the database is Postgres and not SQLite: Vercel's filesystem is ephemeral,
  so a file-backed database loses every lead and admin edit on redeploy. One
  code path runs both locally and in production, so there is no dev/prod
  drift to debug.
- The SQL was validated against a real Postgres engine (PGlite) before
  shipping, since Neon credentials were not available at build time. If you
  change any query, re-validate rather than assuming SQLite habits carry
  over: placeholders are `$1`, not `?`, and `session_id::int` casts matter.
- `Work.tsx` catches database failures, logs loudly, and returns `null`
  rather than throwing. A database outage must not 500 the whole marketing
  page; the hero, services, FAQ, and contact still render and still convert.
  If the Projects section disappears in production, check the server logs
  for `[Work] could not load projects`.
- `src/app/page.tsx` sets `export const dynamic = "force-dynamic"` — the
  homepage must not be statically prerendered, since Work.tsx reads projects
  from the DB on every request so admin edits show up live.
- Auth: single shared admin password (`ADMIN_PASSWORD` in `.env.local`),
  HMAC-signed session cookie (`SESSION_SECRET` in `.env.local`, 7-day expiry).
  No per-user accounts — this is a solo tool. `.env.local` is gitignored;
  regenerate both values if this repo is ever made public.
- API: `POST /api/leads` (public, called by ChatWidget), `GET/PATCH/DELETE`
  variants are admin-only (checked via `getSession()` in `src/lib/auth.ts`).
  Same pattern for `/api/projects`.
- `ChatWidget.tsx` is a guided/deterministic flow (interest, name, contact,
  budget, optional message, then POST to `/api/leads`), not an LLM. Chosen
  as the default because Zaheen didn't answer when asked AI-vs-guided, and
  this path needed no API key or ongoing cost. To upgrade to a real AI
  conversation later: add `ANTHROPIC_API_KEY`, replace the fixed
  buttons/step-machine with calls to the Claude API, keep the same
  `POST /api/leads` contract at the end so the admin panel doesn't change.
- Chat bubble and WhatsApp button are both bottom-right, stacked (chat above
  WhatsApp, 16px gap, same right offset). If either button's size changes,
  update both `WhatsAppButton.tsx` (fixed offset) and `ChatWidget.tsx`
  (`bottom-[88px] sm:bottom-24` on both the toggle button and the open panel)
  to keep them aligned.

## Contact details and site config
`src/lib/site-config.ts` centralizes the contact email, phone, WhatsApp
number, and site URL. Every component reads from here instead of hardcoding
values, so all of it can be changed via `.env.local` without touching code:
`NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE_DISPLAY`,
`NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_SITE_URL`. Restart the dev server
after editing `.env.local` (env vars are read once at server start).

## SEO
- `layout.tsx` metadata: full title/description/keywords, canonical URL,
  Open Graph and Twitter card tags, robots directives. All pull from
  `siteConfig`, so fixing the copy or the domain in one place updates
  everything.
- `StructuredData.tsx` renders JSON-LD (Person + ProfessionalService schema)
  in the document body, helping Google understand who Zaheen and Patchbay
  are as entities.
- `app/sitemap.ts` and `app/robots.ts` are Next.js's generated-file
  conventions (serve at `/sitemap.xml` and `/robots.txt` automatically).
  `/admin` and `/api` are disallowed from crawling.
- `app/opengraph-image.tsx` generates the social-share preview image on the
  fly from the same brand tokens (no static asset to keep in sync).
- Domain is **zaheenzuberi.com** (confirmed unregistered via RDAP on
  2026-08-11, Zaheen registering it). Brand name stays Patchbay; the domain
  is his own name. That mismatch is intentional: the page title leads with
  "Zaheen Zuberi", so domain and title reinforce each other, and an
  exact-match domain on his name is the strongest single signal for ranking
  when someone Googles him after a referral.
  `NEXT_PUBLIC_SITE_URL=https://zaheenzuberi.com` is set in `.env.local`.
- `.env.local` is gitignored and does NOT travel to the host. Every env var
  (`NEXT_PUBLIC_SITE_URL`, `ADMIN_PASSWORD`, `SESSION_SECRET`, plus any
  contact overrides) must be set again in the hosting provider's own
  environment-variable settings, or the site falls back to localhost URLs
  and the admin login breaks.
- `og:image` / `twitter:image` are generated by `app/opengraph-image.tsx`
  (Next file convention) and resolve against the serving host, so they show
  `localhost` in dev and the real domain in production. That is expected;
  do not "fix" it by hardcoding an images array in `layout.tsx` metadata,
  the convention supersedes it and the duplicate drifts.
- On-page SEO is complete, but ranking for competitive terms also depends on
  factors outside this codebase: domain age, backlinks, and submitting the
  site to Google Search Console after launch. See the note left for Zaheen
  in the conversation for the full explanation; don't imply search rankings
  are guaranteed by code alone.

## Service pages and the SEO architecture
- `src/lib/services.ts` is the single source for all five service pages.
  `src/app/services/[slug]/page.tsx` renders them via `generateStaticParams`,
  so they prerender as static HTML and cost nothing to serve.
- Why they exist: a one-page site competes for one query cluster. Each service
  page targets its own commercial-intent cluster (voice agents, chatbots,
  automation, websites, marketing). This is the main lever for ranking on
  buying-intent searches rather than just the owner's name.
- The homepage Channels cards each link to their service page. Those internal
  links are how the pages get crawled and how authority flows. Every card
  must keep a `slug` pointing at a real page.
- Schema is split by ownership: the root layout emits the site-wide `@graph`
  (Person, ProfessionalService with an OfferCatalog, WebSite); each page emits
  what it owns (Service, FAQPage, BreadcrumbList) and refers back by `@id`.
  Do not duplicate the site-wide entities on individual pages.
- `Faq.tsx` keeps every answer in the DOM whether or not the item is expanded,
  animating height only. FAQPage schema must match visible page content, so
  do not switch this to conditional rendering.
- Copy in `services.ts` and `home-faqs.ts` is deliberately claim-free: no
  invented prices, client counts, or results. Pricing answers explain what
  drives cost instead of quoting numbers Zaheen has not set. Adding his real
  starting prices would strengthen these pages significantly.

## Known gotcha: server components
`Channels.tsx` is a server component. Passing an `onClick` (or any handler)
to a child there throws "Event handlers cannot be passed to Client Component
props", which crashes the whole homepage render and silently strips its
structured data. This already happened once. If homepage schema goes missing,
check the server log for that error before suspecting the schema code.

## 3D hero field (Three.js)
`src/components/three/` holds a WebGL grid of instanced bars whose heights and
colour ripple like a signal crossing a patchbay. It is the console identity in
motion, not decorative floating geometry: same amber, same meter language as
`SignalBars`. The cursor acts as a probe that lifts nearby bars.

Non-negotiables, all of which cost real debugging to get right:
- **Never import it statically.** `SignalFieldMount` pulls it in via
  `next/dynamic` with `ssr: false`. The three chunk is ~868KB and is verified
  absent from the initial HTML; the hero renders complete without it.
- **Skipped entirely on phones** (coarse pointer + <768px). The cursor probe
  that makes it interesting does not exist on touch, so it would be pure
  battery cost. Verified: no canvas element on mobile.
- **Paused offscreen** by IntersectionObserver, and `frameloop="demand"` under
  `prefers-reduced-motion` so it paints one frame and stops.
- **DPR capped at 1.6.** Uncapped retina on a full-bleed canvas is the single
  biggest cost here.
- Tuning is delicate and was arrived at empirically. Bars must stay short
  (`h` ≈ 0.09–0.35): tall ones read as vertical stripes that fight the
  headline. The heat curve must be driven mainly by `wave`, not `probe` —
  a probe-weighted curve leaves the field invisible whenever the cursor is
  elsewhere, which is most of the time. Hero also lays two scrims between the
  canvas and the copy; without them the field competes with body text.

## Scroll animation
`Reveal` takes a `variant` (`up`/`left`/`right`/`scale`/`blur`) so sections
have rhythm instead of everything sliding up identically. It reveals content
immediately (no transition) under `prefers-reduced-motion` rather than
animating, and never leaves content stuck at opacity 0. `ScrollProgress` draws
an amber level meter along the bottom edge of the nav, coalescing scroll events
into one rAF.

Note for future testing: `window.scrollTo(0, document.body.scrollHeight)` does
**not** scroll this page — body is a flex container so that height is wrong.
Use `element.scrollIntoView()` when verifying reveals, or you will conclude
every Reveal is broken when it is fine.

## Photos
Two different photos, deliberately not the same shot reused: showing one face
twice on a single page reads as thin.

- `/public/zaheen.jpg` (Hero.tsx): a cropped and graded mirror selfie. The
  crop removes the restroom fixtures behind him and the grade matches the
  palette, but his phone still covers part of his face. A face beside "Hey,
  I'm Zaheen" is stronger for a solo operator than the fallback signal-panel
  that sat there before, so it went in the hero despite the phone. The
  portrait carries the console chrome (SIGNAL / LIVE row on top, signal meter
  and process line at the base) rather than replacing that panel, so the
  live-system motif survives. Holds `priority` — it's the LCP element.
- `/public/zaheen-about.jpg` (About.tsx): a night portrait by a car, supplied
  later, replacing the ZZ-monogram holding frame that was there while this
  was pending. Cropped from source 1912x2080 to the 4:5 the card needs,
  graded to match. No `priority` — it's below the fold.
- **A full-bleed hero background was tried with `/zaheen.jpg` and reverted.**
  In that specific photo the phone is held up right beside his face, so no
  crop window isolates one from the other at hero width; every attempt (object
  position at multiple Y values) showed mostly phone/hand, not face. Don't
  retry full-bleed with this photo. It could work with a plain, face-forward
  shot that has nothing held up in frame.
- Hero's channel ticker must stay a single non-wrapping scroll row. It is
  pinned to the bottom of the hero, so when it wrapped to several lines on
  phones the taller stack ran underneath the photo caption. The section's
  `pb-16 sm:pb-14` reserves its space; keep both halves of that fix together.
- No social links yet (Zaheen hasn't made professional accounts). Contact.tsx
  shows "Social channels coming soon" instead of dead links. Add real links
  there once accounts exist.
- Business name "Patchbay" was chosen by Claude per Zaheen's request to name
  it; easy to rename (appears in Nav.tsx, Footer.tsx, Hero.tsx, About.tsx,
  Milestones.tsx, and `site-config.ts`) if he wants something else.
- Copy style: keep sentences free of em dashes (—) across all visitor-facing
  text per Zaheen's request. Use periods, commas, or colons instead. This
  applies to any new copy added to Hero, About, Channels, Work, Milestones,
  Contact, and ChatWidget.
