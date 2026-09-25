# Launch checks (Phase 6)

Results recorded against a local production build (`npm run build` + `next start`, local MongoDB seeded with `npm run seed` and `npm run seed:publish-drafts`, `EMAIL_DRY_RUN=true`). Items marked **[HUMAN]** must be re-run on the Vercel preview before launch.

## Automated (Playwright, `npm run test:e2e`)
| Spec | Result |
|---|---|
| `smoke.spec.ts`: 11 static routes + one slug per detail type: 200, one `h1`, `<title>`, canonical, no console errors; unknown URL → 404 + noindex | Pass |
| `redirects.spec.ts`: 15 legacy URLs → 308 to their new path (which returns 200); 10 unchanged inventory URLs → 200 | Pass (0 legacy URLs 404) |
| `forms.spec.ts`: empty contact form marks fields `aria-invalid` and shows an alert; valid submission shows the confirmation | Pass |
| `a11y.spec.ts`: axe (WCAG 2.1 A/AA), no serious/critical issues on `/`, first case study, insight, service, `/contact`, first job, in **light and dark** themes (reduced motion) | Pass |
| `seo.spec.ts`: sitemap lists every published doc and nothing else; robots disallows `/admin`; security headers; case-study OG image returns an image | Pass |

36 tests, all passing.

## Structured data
Every JSON-LD block on these pages parses, and each template carries the expected types:

| Page | Types |
|---|---|
| `/` | Organization, WebSite, FAQPage (approved questions only) |
| `/work/medical-prescription-ocr` | Organization, Article, BreadcrumbList |
| `/insights/ai-trends-2025` | Organization, BlogPosting, BreadcrumbList |
| `/services/ai-machine-learning` | Organization, Service, BreadcrumbList |
| `/industries/healthcare` | Organization, BreadcrumbList |
| `/careers/it-business-development-associate-lead-conversion` | Organization, JobPosting, BreadcrumbList |

- [ ] **[HUMAN]** Paste one URL of each type into the [Schema.org validator](https://validator.schema.org/) and Google's [Rich Results Test](https://search.google.com/test/rich-results) on the preview deployment.

## Performance
First Load JS (gzip, measured with `node scripts/first-load-js.mjs <url>`; `noModule` polyfills excluded):

| Route | First Load JS | Budget |
|---|---|---|
| `/` | 147.9 kB | ≤ 150 kB |
| `/work/[slug]` | 147.6 kB | ≤ 150 kB |
| `/insights/[slug]` | 147.6 kB | ≤ 150 kB |

- Hero LCP element is the H1 text. The bit field is a client-only lazy canvas.
- Only above-the-fold media use `priority` (case-study showcase, insight hero, first showcase block on a page).
- Fonts: Source Serif 4 (normal + italic, `opsz`), Geist and Geist Mono through `next/font`, latin subset, `display: swap`.
- Payload admin code lives only in the `(payload)` route group. Frontend client components don't import `tailwind-merge` or server modules (see Phase 2 and Phase 5 handoff notes). Inspect with `npm run analyze`.
- [ ] **[HUMAN]** Lighthouse mobile scores on the preview (`.github/workflows/lighthouse.yml` runs on every PR against the Vercel preview, budgets in `lighthouserc.json`). Record them here:

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | | | | | | | |
| `/work/medical-prescription-ocr` | | | | | | | |
| `/insights/ai-trends-2025` | | | | | | | |

## Accessibility (manual)
Checked locally in a browser:
- [x] No horizontal scroll at 375px on 15 templates (home, work, case study, services, service, industry, insights, insight, about, team, contact, careers, log, both Academy AI legal pages).
- [x] Skip link is the first focusable element and targets `#main`.
- [x] Mobile menu: the toggle reports `aria-expanded`, focus moves to the first link, Tab and Shift+Tab stay inside the menu and its toggle, and Esc closes it and returns focus to the toggle.
- [x] Contact form: server errors set `aria-invalid` and render in `role="alert"`; the confirmation replaces the form.
- [x] Reduced motion: entrance animations and their delays are disabled (`globals.css`), so all content is visible immediately.
- [x] Both themes: axe contrast checks pass on the key templates.
- [ ] **[HUMAN]** Screen reader pass (NVDA or VoiceOver): heading outline, pins announce their notes, form errors announced.
- [ ] **[HUMAN]** 200% zoom and 320px width.
