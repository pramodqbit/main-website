# qbitlog.com

Marketing site for Qbitlog — Next.js frontend + Payload CMS (MongoDB).

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4 — tokens in `app/(frontend)/globals.css`
- Payload CMS 3 — admin at `/admin`
- Playwright e2e + GitHub Actions (see `.github/workflows/`)

## Local setup

1. **MongoDB** on `127.0.0.1:27017` (local install or Atlas with a dev cluster).
2. Copy env and fill required values:

   ```bash
   cp .env.example .env.local
   ```

   Minimum for dev: `DATABASE_URI`, `PAYLOAD_SECRET`, `CRON_SECRET` (any long random string). Leave `TURNSTILE_SECRET_KEY` unset unless you add a widget.

3. Install and seed:

   ```bash
   npm install
   npm run seed
   npm run seed -- --only=16      # Phase 8 drafts (disabled index sections + service/case-study draft fields)
   npm run seed:enable-phase8-sections   # local only — turn on /services and /work CMS sections
   npm run seed:publish-drafts   # local only — publishes seeded drafts so detail pages show new fields
   ```

   Phase 8 index sections are imported with **Enabled** off so production stays unchanged until you review. After `--only=16`, run `seed:enable-phase8-sections` locally (or tick **Enabled** on each block under **Settings → Services Page / Work Page** in `/admin`). In `npm run dev`, disabled sections also render with a **Hidden** pill until you enable them.

4. Run:

   ```bash
   npm run dev    # http://localhost:3001 — frontend + /admin
   ```

   Production-like check:

   ```bash
   npm run check   # lint + typecheck + build
   ```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Dev server (port 3001) |
| `npm run check` | Lint, typecheck, production build |
| `npm run seed` | Idempotent CMS seed from `content/legacy/` |
| `npm run seed -- --only=16` | Phase 8 drafts only (`content/drafts/phase-8/`) |
| `npm run seed:enable-phase8-sections` | Local: enable all Phase 8 index sections in CMS |
| `npm run seed:publish-drafts` | Publish all drafts (local preview) |
| `npm run seed:verify` | Verify seed integrity |
| `npm run test:e2e` | Playwright (`PLAYWRIGHT_BASE_URL=http://localhost:3001`) |
| `npm run docs:screenshots` | Regenerate editor-guide images |
| `npm run analyze` | Bundle analyzer (`ANALYZE=true`) |

## Docs

- Rebuild plan: [`docs/redesign/README.md`](docs/redesign/README.md)
- Content review after seed: [`docs/redesign/content-review.md`](docs/redesign/content-review.md)
- Phase 8 drafts review: [`content/drafts/phase-8/REVIEW.md`](content/drafts/phase-8/REVIEW.md)
- Editor guide: [`docs/editor-guide.md`](docs/editor-guide.md)
- Launch checklist: [`docs/redesign/baseline/launch-checks.md`](docs/redesign/baseline/launch-checks.md)

## Deploy notes

Set Vercel env vars from `.env.example` (Blob or S3, Zoho mail, `CRON_SECRET`, etc.). See `vercel.json` for crons. After deploy: Search Console, Lighthouse on preview, then enforce CSP per `docs/redesign/phase-6-seo-performance-launch.md`.
