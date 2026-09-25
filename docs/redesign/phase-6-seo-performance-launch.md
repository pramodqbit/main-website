# Phase 6: SEO, performance, accessibility, testing and launch

> Read `docs/redesign/README.md` first. Phase 5 must be complete.
> **Goal:** make the new site rank at least as well as the old one from day one (no lost URLs, complete structured data), make it fast and accessible, add automated smoke tests, and ship it to production safely.
> **Estimated time:** 2–3 days (plus `[HUMAN]` launch tasks). **Depends on:** Phase 5.

---

## 6.1 Metadata: complete `lib/seo.ts`

`buildMetadata({ doc, path, fallbackTitle, fallbackDescription, type })` returns Next `Metadata`:
- `title`: `doc.meta.title` → `doc.title` → the fallback. The layout template adds `· Qbitlog`, so **don't** double the suffix. Payload's SEO plugin `generateTitle` already appends it, so strip a trailing ` · Qbitlog` before returning.
- `description`: `meta.description` → `summary`/`excerpt` → the site default. Truncate at 160 characters on a word boundary.
- `alternates.canonical`: the absolute URL `${siteUrl}${path}` (no query string, no trailing slash).
- `openGraph`: `type` ("website" | "article"), `url`, `siteName: "Qbitlog"`, `locale: "en_US"`, `images` (see §6.2). For articles also `publishedTime`, `modifiedTime` and `authors`.
- `twitter`: `summary_large_image`.
- `robots`: `noindex` for drafts, `/styleguide`, `/next/*`, and any page whose `meta.noindex` is set. Add a `noindex` checkbox to the SEO tab via a plugin field override if it's missing.

Remove the old placeholder verification tokens (`yandex: "your-yandex-verification-code"`, `msvalidate.01: "your-bing-verification-code"`). Keep Google's verification code `sjK98A76LzMwXaZmTO1dNeZjbQPckDpM2uKNvkpraI8` in the layout metadata `verification.google`.

## 6.2 Open Graph images
Create `opengraph-image.tsx` (1200×630, `next/og` `ImageResponse`) for `/`, `/work/[slug]`, `/insights/[slug]`, `/services/[slug]` and `/industries/[slug]`:
- **Layout:** `paper` background with a faint dot grid (drawn with repeating divs), top-left brand square + "QBITLOG" in mono, the `LogLabel` line (e.g. "CASE STUDY / HEALTHCARE / 10 WEEKS"), and the title in Source Serif at 64px (2 lines max, ellipsis). For case studies, the bottom-right shows the first featured metric in mono amber ("99% extraction accuracy").
- **Fonts:** download Source Serif 4 Regular and Geist Mono Regular `.ttf` files (both SIL Open Font License) into `app/(frontend)/_og/fonts/` and load them with `fs.readFile`. Use hex values that mirror the tokens here (this is the documented exception to the hex rule, because the image renderer can't read CSS variables).
- If `meta.image` is set in Payload, use that instead of the generated image.

## 6.3 Structured data (JSON-LD)
Create `lib/jsonld.ts` and a `components/site/JsonLd.tsx` that renders `<script type="application/ld+json">`. **Only describe what is true and visible on the page.**

| Where | Schema | Source |
|---|---|---|
| Layout (all pages) | `Organization`: name, url, logo, `sameAs` from site settings; `foundingDate` only if it's set | site-settings |
| Home | `WebSite`: name, url. **No `SearchAction`** (the site has no search; the old site's was invalid). | — |
| Every page except home | `BreadcrumbList` matching the visible breadcrumbs | route |
| `/insights/[slug]` | `Article` (or `BlogPosting`): headline, description, image, datePublished, dateModified, author (a `Person` for `kind:person`, an `Organization` for the team author), publisher = Organization | post |
| `/work/[slug]` | `Article`: headline, description, image, datePublished (`year`), `about` = client name, publisher | case study |
| `/services/[slug]` | `Service`: name, description, `provider` = Organization, `areaServed: ["US","EU"]`, `serviceType` = category | service |
| Pages with a visible FAQ | `FAQPage` containing **only** the questions shown on that page (never the `[REVIEW]` ones) | faqs |
| `/careers/[slug]` (open jobs only) | `JobPosting`: title, description (HTML), datePosted, validThrough, employmentType (`FULL_TIME`…), hiringOrganization, `jobLocationType: "TELECOMMUTE"` + `applicantLocationRequirements` when location is "Remote", `baseSalary` only if the salary field parses | job |

Validate a sample of each schema type with the Schema.org validator and Google's Rich Results Test (`[HUMAN]`, or with a headless check if available). Record the results in `docs/redesign/baseline/launch-checks.md`.

## 6.4 Sitemap and robots
- `app/sitemap.ts`: query Payload for **published** docs: pages (excluding `home`, which becomes `/`), case studies, services, published industries, posts, and **open** jobs. Add static entries for `/work`, `/services`, `/insights`, `/about/team`, `/careers`, `/log` and the two `/academyai/*` legal pages. Set `lastModified` from `updatedAt` (legal pages: `2026-09-18`). Don't include `changeFrequency` or `priority` (search engines ignore them).
- `app/robots.ts`: allow `/`, disallow `/admin`, `/api/`, `/next/` and `/styleguide`. Point the sitemap at `${siteUrl}/sitemap.xml`.

## 6.5 Redirects
1. **Static legacy redirects** in `next.config.ts` → `async redirects()`, all `permanent: true`, built from `docs/redesign/baseline/url-inventory.md`:
   ```ts
   { source: "/aboutus", destination: "/about", permanent: true },
   { source: "/teams", destination: "/about/team", permanent: true },
   { source: "/contact-us", destination: "/contact", permanent: true },
   { source: "/case-studies", destination: "/work", permanent: true },
   { source: "/case-studies/:slug", destination: "/work/:slug", permanent: true },
   { source: "/blog", destination: "/insights", permanent: true },
   { source: "/blog/:slug", destination: "/insights/:slug", permanent: true },
   { source: "/construction", destination: "/", permanent: true },
   ```
   Also add any URL from the inventory whose target changed.
2. **Editor redirects** (Payload redirects plugin): create `lib/redirects.ts#findRedirect(path)` that queries the `redirects` collection. Call it in the `[...slug]` page and in every detail page **before** `notFound()`, and `permanentRedirect()` when it matches. Document in the editor guide (Phase 7) that changing a slug requires adding a redirect.
3. `[HUMAN]` In Vercel → Domains, redirect `www.qbitlog.com` → `qbitlog.com` (or the reverse, whichever Search Console has as the canonical today). **Keep the current canonical host.**

## 6.6 Security headers
In `next.config.ts` → `async headers()` for `/(.*)`:
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: SAMEORIGIN          (admin live preview iframes same-origin pages)
Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()
```
Add a `Content-Security-Policy-Report-Only` header allowing `self`, Vercel Analytics/Insights, the Vercel Blob host, and Cloudflare Turnstile if it's used. Promote it to enforcing after a week with no reports (Phase 7).

## 6.7 Performance
**Budgets** (mobile Lighthouse, throttled): Performance ≥ 90, LCP < 2.0s, CLS < 0.05, TBT < 200ms. First Load JS ≤ 150 kB for `/`, `/work/[slug]` and `/insights/[slug]`.

Checklist:
- [ ] The hero LCP element is the H1 text, not an image. The bit-field canvas loads after hydration (`ssr:false`) and doesn't delay LCP.
- [ ] Only above-the-fold images use `priority`. Every `Media` has a correct `sizes` value.
- [ ] Fonts: exactly three families via `next/font` (Source Serif 4 variable with italic, Geist, Geist Mono), `display: swap`, latin subset only.
- [ ] No client component imports a server-only module. Check the bundle with `ANALYZE=true` (add `@next/bundle-analyzer` as a dev dependency behind that env flag).
- [ ] `motion/*` client JS totals ≤ 6 kB gzipped.
- [ ] Payload admin code never appears in frontend bundles (it lives in the `(payload)` group only).
- [ ] Lists use `depth: 1` and `select`/`limit`. No N+1 queries inside block renderers (batch relationship fetches per block).
- [ ] Set up Lighthouse CI: add `lighthouserc.json` with the budgets above, running against the Vercel preview URL in a GitHub Action (`.github/workflows/lighthouse.yml`) on PRs to `main`.

## 6.8 Accessibility
- Automated: add `@axe-core/playwright`, and fail the test run on any `serious` or `critical` violation for `/`, `/work/[first]`, `/insights/[first]`, `/services/[first]`, `/contact` and `/careers/[first]`.
- Manual checklist (record the results in `launch-checks.md`):
  - [ ] Keyboard only: skip link, nav, mobile menu (focus trap and Esc), FAQ, pins, forms, pagination
  - [ ] Screen reader (NVDA on Windows or VoiceOver): headings form a logical outline (one `h1` per page); pins announce their notes; form errors are announced
  - [ ] 200% browser zoom and 320px width: no loss of content, no horizontal scroll
  - [ ] Reduced motion: no animation, and every piece of content is visible
  - [ ] Both themes: text contrast reaches AA everywhere (including `muted` on `surface`, and amber metrics on `surface`)

## 6.9 Automated tests (Playwright)
Add `@playwright/test`, a `playwright.config.ts` (baseURL from `PLAYWRIGHT_BASE_URL`, defaulting to `http://localhost:3001`), and `tests/`:
- `smoke.spec.ts`: every static route plus one slug of each type returns 200, has exactly one `h1`, has a `<title>`, has a canonical URL, and logs no console errors.
- `redirects.spec.ts`: every legacy URL in the inventory ends at its new URL with a 308 or 301.
- `forms.spec.ts`: the contact form shows validation errors; a valid submission shows the confirmation. Run it against a test database with `LEADS_NOTIFY_TO` pointed at a test inbox, or with email disabled via `EMAIL_DRY_RUN=true`. If you add that flag, make the notify hooks log instead of sending.
- `a11y.spec.ts`: the axe checks from §6.8.
- `seo.spec.ts`: `/sitemap.xml` includes all published slugs from Payload and **no** drafts. `/robots.txt` disallows `/admin`.
Add the scripts `"test:e2e": "playwright test"` and a GitHub Action running build + e2e on PRs.

## 6.10 Launch runbook

**T–3 days: content freeze and review**
- [ ] `[HUMAN]` The marketing team completes `docs/redesign/content-review.md` (approvals, claims, drafts published or left as drafts).
- [ ] `[HUMAN]` Create marketing users in `/admin` with the `editor` role.

**T–1 day: production infrastructure (`[HUMAN]`)**
- [ ] MongoDB Atlas production cluster (M10+ recommended), a database user with least privilege, network access configured for Vercel (Atlas ↔ Vercel integration, or an IP access list), and backups enabled.
- [ ] Vercel production env vars: every key in README §7 (`NEXT_PUBLIC_SITE_URL=https://qbitlog.com`).
- [ ] Vercel Blob store connected, and the R2/S3 private bucket created with keys scoped to that bucket.
- [ ] Run `npm run seed` against the **production** database from a trusted machine, then `npm run seed:verify`.
- [ ] Deploy the `redesign` branch to a Vercel **preview** and run the full Playwright suite against the preview URL.

**Launch**
- [ ] Merge `redesign` → `main`, and Vercel deploys to production.
- [ ] Smoke test production: home, one of each detail type, the contact form (a real submission), preview mode, and `/admin` login.
- [ ] Check that every legacy URL redirects on production (`npm run test:e2e -- redirects` with `PLAYWRIGHT_BASE_URL=https://qbitlog.com`).

**T+1 day**
- [ ] `[HUMAN]` Search Console: submit `sitemap.xml`, request indexing for the home page, `/work`, the 3 case studies and `/insights`.
- [ ] Monitor Vercel logs for 404s and 500s daily for 7 days. Add a redirect for any legacy URL that 404s.

**Rollback:** in Vercel → Deployments, promote the last pre-launch production deployment ("Instant Rollback"). The old site doesn't need MongoDB, so a rollback is safe.

## 6.11 Acceptance criteria
- [ ] Every item in §6.7 and §6.8 is checked, and the Lighthouse targets are met on the preview deployment (scores recorded in `launch-checks.md`).
- [ ] Playwright suite green in CI.
- [ ] 0 legacy URLs return 404.
- [ ] JSON-LD validates for each schema type.
- [ ] Production launch completed per the runbook, and the rollback path is documented.
- [ ] Commit(s): `redesign(phase-6): seo, performance, accessibility, tests and launch`.

## 6.12 Handoff notes
- **Results** are in `docs/redesign/baseline/launch-checks.md`. The Playwright suite has 36 tests, all green locally. Lighthouse scores and the rich-results validation must be recorded from the Vercel preview (`[HUMAN]`).
- **OG images.**
  - `app/(frontend)/_og/render.tsx` renders every card.
  - Fonts are the `@fontsource` **WOFF** files (Source Serif 4 and Geist Mono, OFL) copied into `app/(frontend)/_og/fonts/`, instead of downloaded `.ttf` files. `next/og` reads WOFF, but not WOFF2.
  - When `meta.image` is set, the route renders that image instead of the generated card, but only if it's PNG or JPEG. The renderer can't draw WebP, so a WebP `meta.image` falls back to the generated card.
  - The root `app/(frontend)/opengraph-image.tsx` also acts as the default for index pages and CMS pages.
  - The seed no longer copies the hero image into `meta.image` for case studies and posts, so they get the branded card with the metric. A database seeded before this change keeps the hero image as OG until someone clears `meta.image` in `/admin` or re-runs the seed.
- **Organization JSON-LD** is now rendered in the layout `<head>`, so it appears on every page. `WebSite` stays on home only.
- **Breadcrumbs.** `BreadcrumbList` is only emitted where breadcrumbs are visible (the detail pages). Index pages have no visible breadcrumb, so they get no list ("only describe what is visible").
- **Verification.** `verification.google` uses `GOOGLE_SITE_VERIFICATION` when it is set, and otherwise falls back to the spec's code.
- **Editor redirects.** `redirectOrNotFound(path)` in `lib/redirects.ts` is called by `[...slug]` and every detail route before rendering the 404.
- **CSP (report-only)** is defined in `next.config.ts`. Reports go to `POST /csp-report` (`app/csp-report/route.ts`), which logs only the directive and the blocked origin (`[csp] …`) to the Vercel logs. Cloudflare Turnstile is not in the policy because the forms don't render a Turnstile widget yet.
  - **Don't set `TURNSTILE_SECRET_KEY`** until a widget is added. The server check requires the widget's token, so setting the key alone rejects every submission.
- **Media URLs.** `mediaSource` strips the site's own origin from Payload file URLs, so next/image optimises them as local paths. Absolute same-host URLs were returning 400, because the host isn't in `remotePatterns`.
- **One `h1` per page.** `RenderBlocks` takes an optional `pageTitle`. When no block renders an `h1` (only `heroLog` and `contactForm` do), it prints the page title as the `h1`. This applies to About and CMS pages such as privacy and terms.
- **Reduced motion** now also zeroes `animation-delay`. Previously the log-panel rows kept their brand-soft start frame during the delay.
- **Running locally on another port:** set `NEXT_PUBLIC_SITE_URL=http://localhost:<port>` for both `npm run build` and `next start`, then `PLAYWRIGHT_BASE_URL=http://localhost:<port> npm run test:e2e`.
