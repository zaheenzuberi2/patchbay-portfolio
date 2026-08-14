# Deploying

Everything that can be automated already is. What is left needs an account
login, which cannot be done on your behalf.

Total: about 5 minutes, once.

## Running it locally right now

```bash
npm run dev
```

That is the whole setup. No database to install and no signup: with
`DATABASE_URL` empty the site runs on PGlite, a real Postgres engine stored in
`./data/pg`, and seeds your six projects on first load. The admin panel, the
chat widget, and lead capture all work locally exactly as they will in
production.

---

## 1. Put the code on GitHub

The repo is already initialised and committed locally. Create an empty repo
on github.com (no README, no .gitignore), then run the two commands GitHub
shows you, which look like this:

```bash
git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
git push -u origin main
```

## 2. Deploy on Vercel

1. Go to vercel.com and sign in **with GitHub**.
2. Click **Add New > Project**, pick the repo, click **Deploy**.

Vercel detects Next.js on its own. No build settings to configure.

## 3. Add the database (one click)

In your new Vercel project: **Storage > Create Database > Neon (Postgres)**.

Do not sign up at neon.com separately. Adding it from inside Vercel creates
the database and sets `DATABASE_URL` automatically, which is the exact
variable this project reads. Tables and your six starter projects are created
on first page load.

## 4. Add three environment variables

**Settings > Environment Variables**, paste each one, then **Redeploy**.

| Name | Value |
| --- | --- |
| `ADMIN_PASSWORD` | pick something better than the current one |
| `SESSION_SECRET` | the long hex string from your local `.env.local` |
| `NEXT_PUBLIC_SITE_URL` | `https://zaheenzuberi.com` |

`.env.local` is gitignored, so these do not travel with the code. That is
deliberate: secrets in a repo are a security problem, not a convenience.

## 5. Point the domain

**Settings > Domains**, add `zaheenzuberi.com`, and follow the DNS records
Vercel gives you at your registrar.

---

## After it is live

- Admin panel: `https://zaheenzuberi.com/admin`
- Submit the site to Google Search Console and give it your sitemap:
  `https://zaheenzuberi.com/sitemap.xml`. Nothing ranks until Google knows
  the site exists, and this is the step that tells it.

## Ongoing

No code edits and no redeploys to run the business. Add or edit projects in
the admin panel and the public site updates immediately. Leads from the chat
widget arrive in the same panel.
