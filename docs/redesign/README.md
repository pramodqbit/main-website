# Qbitlog Website Rebuild: Master Brief

> **Read this file first, every time.** Every phase file assumes you have read this one.
> It holds the context, rules and decisions shared by all phases.

---

## 1. What we are building

A full rebuild of **qbitlog.com**, the marketing site of Qbitlog, a software studio that designs and builds web, mobile and AI products.

| Item | Decision |
|---|---|
| Target buyers | Product leaders, founders and operations heads at companies in the **US and EU** |
| Primary conversion | "Book a scoping call" (booking link or contact form) |
| Content owners | The **marketing team**, who are non-developers. They publish weekly through the CMS. |
| Framework | Next.js (App Router) + React 19 + TypeScript + Tailwind CSS v4 |
| CMS | **Payload CMS v3**, installed inside the same Next.js app, admin at `/admin` |
| Database | **MongoDB** (MongoDB Atlas), via `@payloadcms/db-mongodb` |
| Media storage | Vercel Blob (public media); a private S3-compatible bucket for résumés |
| Hosting | Vercel |
| Email | Zoho SMTP through Payload's nodemailer email adapter |
| Design language | **"The Engineering Log"** (see §4) |

**Brand line:** *Software, on the record.*
**Positioning:** We build web, mobile and AI products. We write down every decision, measure every outcome, and show the receipts.

---

## 2. Phase index

Run the phases **in order**. Each phase ends with a green build and a commit.

| # | File | Goal | Est. |
|---|---|---|---|
| 0 | [phase-0-baseline-and-safety.md](phase-0-baseline-and-safety.md) | Branch, fix leaked secrets, preserve all content, record the baseline | 0.5–1 day |
| 1 | [phase-1-clean-slate-foundation.md](phase-1-clean-slate-foundation.md) | Delete the old UI, restructure the app, strip dependencies, add fonts and tokens | 1 day |
| 2 | [phase-2-design-system.md](phase-2-design-system.md) | Build `components/ds` + `components/motion` + `/styleguide` | 3–4 days |
| 3 | [phase-3-payload-cms.md](phase-3-payload-cms.md) | Install Payload, add all collections, globals, blocks, access, plugins and storage | 3–4 days |
| 4 | [phase-4-content-migration.md](phase-4-content-migration.md) | Seed scripts: move legacy JSON content, images and team into Payload | 2 days |
| 5 | [phase-5-pages-and-templates.md](phase-5-pages-and-templates.md) | Build every route, the block renderer, forms, live preview and the homepage | 5–7 days |
| 6 | [phase-6-seo-performance-launch.md](phase-6-seo-performance-launch.md) | SEO, redirects, JSON-LD, performance, accessibility, tests, go-live | 2–3 days |
| 7 | [phase-7-growth-and-editor-enablement.md](phase-7-growth-and-editor-enablement.md) | Editor guide, content backlog, industry pages, analytics, cadence | Ongoing |
| 8 | [phase-8-services-and-work-depth.md](phase-8-services-and-work-depth.md) | Deeper `/services` and `/work` pages, new case-study fields, drafted content from `content/drafts/phase-8/` | 3–4 days |

Phases 2 and 3 can run in parallel with two agents. Phase 5 needs both finished.

---

## 3. Non-negotiable rules for every agent

1. **Never delete content.** `content/legacy/` is read-only and must never be deleted, even after migration. This covers blog articles, case studies, services, careers, team, FAQs, the Academy AI legal pages, and the case-study source documents. If a file holds text that was published on the site, it is preserved.
2. **Keep these URLs live, with the same content:** `/academyai/privacy-policy` and `/academyai/terms-and-conditions`. They are linked from a mobile app store listing.
3. **Never hardcode secrets.** All keys go in environment variables (see §7). Never log secrets.
4. **Use design tokens only.** Never write a hex colour, a raw `px` font size or Tailwind's default palette (`bg-purple-600`, `text-gray-500`…) in a component. Use the token classes defined in Phase 2. Never use Tailwind's `dark:` variant; tokens switch themselves.
5. **No new UI libraries.** Radix, shadcn, GSAP, Lenis, cobe, Motion, Framer and similar are banned. Motion is handled by the small vanilla hooks in `components/motion`. `lucide-react` is the only icon set, and icons are used sparingly.
6. **Server Components by default.** Add `"use client"` only to leaf components that need interaction.
7. **All content comes from Payload** (Phase 5 onwards). The only exceptions are the two legal pages and `/styleguide`.
8. **Every phase ends with** `npm run lint`, `npx tsc --noEmit` and `npm run build` all passing, then one commit per phase using the message format `redesign(phase-N): <summary>`.
9. **Do not change the scope of another phase.** If you find something that belongs to a later phase, add it to that phase file's "Handoff notes" section instead of doing it.
10. **Tasks marked `[HUMAN]`** need account access (Vercel, MongoDB Atlas, DNS, Zoho, Google). Do not attempt them. List them in your final report so a person can do them.

---

## 4. Design language: "The Engineering Log" (summary)

The site reads like a well-kept engineering notebook: calm paper, precise monospace metadata, one confident accent. Full spec in Phase 2.

**Principles**
- **Show the receipts.** Every claim gets a number, a name, or a screenshot.
- **Decisions over decoration.** Case studies are built around a *decision log*: problem, options, decision, why.
- **One accent, spent on meaning.** Violet means Qbitlog, links and interaction. Amber means a measured result, and nothing else.
- **Calm motion.** Things get *written*, they don't bounce. No parallax, no scroll hijacking.

**Signature motifs**
- `LogLabel`: monospace uppercase eyebrow with a violet square, e.g. `■ CASE STUDY / HEALTHCARE / 10 WEEKS`
- `Metric`: value + unit + label + **source** (a source is mandatory)
- `DecisionRecord`: Problem / Options / Decision / Why
- `LogStream`: a dated list of studio activity
- `AnnotatedMedia`: screenshots with lettered pins and notes
- `BitField`: interactive dot grid in the hero (dots flip into violet "bits" under the cursor), plus the dotted **QBITLOG** wordmark in the footer

**Tokens (light / dark)**

| Token | Light | Dark | Use |
|---|---|---|---|
| `paper` | `#F1F2EE` | `#0D0F12` | page background |
| `surface` | `#FBFBF9` | `#15181C` | panels, cards |
| `ink` | `#121418` | `#E7E8E3` | text, primary button |
| `muted` | `#5A5F67` | `#9A9FA8` | secondary text, labels |
| `line` | `#D8DAD4` | `#272B31` | hairlines |
| `dot` | `#C6C9C1` | `#2E333A` | dot grid |
| `brand` | `#5B2BE0` | `#A487FF` | Qbit Violet |
| `signal` | `#A95F00` | `#F0A83A` | Signal Amber: results only |
| `ok` | `#2F7A4B` | `#5FBF83` | success state |

**Type:** *Source Serif 4* (display, regular + italic, never bold) · *Geist* (text/UI) · *Geist Mono* (labels, metrics, timestamps). Scale ratio 1.25. Corners are square (radius 0–2px). There are no gradients, glows, glassmorphism or drop shadows, except one deep shadow on the showcase frame.

**Visual references** (open them in a browser):
- `docs/redesign/reference/homepage-prototype.html`: the approved homepage prototype. **This is the source of truth for look and feel.**
- `docs/redesign/reference/design-language.html`: the design language reference board.

---

## 5. Information architecture (final URLs)

```
/                          Home                 (Payload page, slug "home")
/work                      Case studies index
/work/[slug]               Case study
/services                  Services index
/services/[slug]           Service
/industries/[slug]         Industry landing page     (new; SEO engine)
/insights                  Articles index            (was /blog)
/insights/[slug]           Article
/about                     About                     (Payload page, slug "about")
/about/team                Team
/careers                   Open roles
/careers/[slug]            Role + application form
/contact                   Contact form + booking
/log                       Studio log (dated activity feed)
/[...slug]                 Any other Payload page (e.g. /privacy, /terms)
/academyai/privacy-policy        (kept, code-owned)
/academyai/terms-and-conditions  (kept, code-owned)
/admin                     Payload admin
/styleguide                Design system preview (noindex, dev aid)
```

Old URLs are 301-redirected (full map in Phase 6):
`/aboutus` → `/about`, `/teams` → `/about/team`, `/contact-us` → `/contact`, `/case-studies(/*)` → `/work(/*)`, `/blog(/*)` → `/insights(/*)`, `/construction` → `/`.

---

## 6. Target repository layout (after Phase 5)

```
app/
  (frontend)/            public site: layout.tsx, globals.css, all routes above
  (payload)/             generated by Payload: admin + REST/GraphQL API
  robots.ts
  sitemap.ts
cms/
  collections/           one file per collection
  globals/               header, footer, site-settings, announcement
  blocks/                page-builder block configs
  fields/                reusable field factories (slug, link, sectionHead, metric, seo)
  access/                access-control functions
  hooks/                 revalidation, reading time, email notifications
  seed/                  migration scripts (Phase 4)
components/
  ds/                    design-system primitives (Phase 2)
  motion/                BitField, Ticker, TiltFrame, CountUp, RailProgress (Phase 2)
  blocks/                React renderers for each Payload block (Phase 5)
  site/                  Header, Footer, AnnouncementBar, MobileNav (Phase 5)
  richtext/              Lexical → React converters (Phase 5)
content/legacy/          preserved original content (read-only)
docs/redesign/           these briefs + reference prototypes
lib/                     payload client, queries, seo, json-ld, utils
public/                  static assets (fonts, icons, images)
payload.config.ts
payload-types.ts         generated
```

---

## 7. Environment variables

| Variable | Used by | Notes |
|---|---|---|
| `DATABASE_URI` | Payload | MongoDB Atlas connection string `[HUMAN]` |
| `PAYLOAD_SECRET` | Payload | 32+ random chars |
| `NEXT_PUBLIC_SITE_URL` | SEO, preview | `https://qbitlog.com` in production |
| `PREVIEW_SECRET` | draft preview | random string |
| `BLOB_READ_WRITE_TOKEN` | media storage | Vercel Blob `[HUMAN]` |
| `S3_BUCKET`, `S3_REGION`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` | résumé storage (private) | Cloudflare R2 or AWS S3 `[HUMAN]` |
| `ZOHO_SMTP_HOST`, `ZOHO_MAIL_USER`, `ZOHO_MAIL_APP_PASSWORD` | email | already exist |
| `EMAIL_FROM` | email | e.g. `hello@qbitlog.com` |
| `LEADS_NOTIFY_TO` | contact form notifications | company inbox, **not** a personal Gmail |
| `CAREERS_NOTIFY_TO` | job applications | company inbox |
| `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | spam protection (optional) | Cloudflare Turnstile |

Keep `.env.example` in the repo with every key and no values.

---

## 8. Definition of done (whole project)

- Every URL in §5 renders from Payload data. Every old URL 301-redirects.
- Marketing can create and publish a case study, article, service, industry page, job and log entry **without a developer**, with live preview.
- Lighthouse (mobile) on Home, a case study and an article: Performance ≥ 90, Accessibility ≥ 95, SEO = 100, Best Practices ≥ 95.
- Core Web Vitals targets: LCP < 2.0s, CLS < 0.05, INP < 200ms.
- No hex colours outside `app/(frontend)/globals.css`. No secrets in the repo.
- All legacy content is migrated **and** still present in `content/legacy/`.
