# Phase 4: Content migration (legacy → Payload)

> Read `docs/redesign/README.md` first. Phase 3 must be complete (collections exist, types generated).
> **Goal:** idempotent seed scripts that import **all** legacy content from `content/legacy/` into Payload, and create the starter content the new homepage needs. Nothing published today may be lost.
> **Estimated time:** 2 days. **Depends on:** Phase 3.

---

## 4.1 Rules
- **Read-only source:** scripts read `content/legacy/**` and `public/images/**`. They never modify or delete them.
- **Idempotent:** running a script twice must not create duplicates. Upsert by `slug` (or by `name` for team, `question` for FAQs, `filename` for media).
- **No revalidation:** pass `context: { disableRevalidate: true }` on every create/update.
- **Local API only:** use `getPayload({ config })` with `overrideAccess: true`. No HTTP.
- **Publish state:** migrated content that was live on the old site is created with `_status: "published"`. New starter content that needs human review (§4.6) is created as **draft**.
- **Log everything:** print one line per document (`created` / `updated` / `skipped`) and a final summary table. Exit code 1 on any error.

---

## 4.2 Setup

```
cms/seed/
  index.ts              runs all steps in order; CLI flags: --only=<step>, --dry-run
  lib/
    payload.ts          getPayload() for scripts (loads .env via dotenv)
    upsert.ts           upsertBySlug(collection, slug, data) → {id, action}
    media.ts            uploadLocalImage(path, alt, credit?) / uploadRemoteImage(url, alt, credit)
    html-to-lexical.ts  convertHtml(html) → Lexical JSON
    report.ts           collects and prints the summary
  steps/
    01-media.ts  02-taxonomy.ts  03-team.ts  04-technologies.ts  05-services.ts
    06-industries.ts  07-case-studies.ts  08-posts.ts  09-jobs.ts  10-faqs.ts
    11-testimonials.ts  12-log-entries.ts  13-globals.ts  14-pages.ts
```
Add the script `"seed": "cross-env NODE_OPTIONS=--no-deprecation tsx cms/seed/index.ts"` and install `tsx`, `dotenv` and `jsdom` (plus `@types/jsdom`) as dev dependencies. If the installed Payload recommends `payload run <script>` for scripts, use that instead (check the docs for the installed version).

### HTML → Lexical
Use Payload's official converter from `@payloadcms/richtext-lexical` (named `convertHTMLToLexical` in recent v3 versions, together with `editorConfigFactory.default({ config })` and `JSDOM`). Check the export name in the installed version's docs.
```ts
import { JSDOM } from "jsdom";
import { convertHTMLToLexical, editorConfigFactory } from "@payloadcms/richtext-lexical";
export async function convertHtml(html: string, config: SanitizedConfig) {
  return convertHTMLToLexical({ editorConfig: await editorConfigFactory.default({ config }), html, JSDOM });
}
```
Before converting, pre-clean the HTML: strip inline `style` attributes, turn `<h1>` into `<h2>`, remove empty `<p>`s, and keep `<pre><code>` blocks. After conversion, **spot-check** by rendering (Phase 5) or by logging the node types count.

---

## 4.3 Step details

### 01-media: images used by migrated content
For every local image path referenced in `content/legacy/case-studies.json` (`heroImage`, `iconImage`, `mobileImage`, `screenshots[].image`, `technologies[].icon`, `testimonial.avatar`), upload the file from `public/…` into `media`:
- `alt`: derive it from context. For a screenshot, use its `caption` + client ("RestaurantOS order tracking screen"). For a hero, use `"<client> dashboard"`. For a tech icon, use `"<name> logo"`.
- Keep a map `legacyPath → mediaId` in memory (and write it to `cms/seed/.cache/media-map.json`, gitignored) for later steps.
- **Remote images** (`posts.json` heroImage/iconImage on `img.freepik.com`): download them with `fetch`, upload with `credit: "Image: Freepik"` and alt from the post title. If a download fails, log it and continue (the post imports without an image).
- **SVG placeholders** (`*-shot-1.svg`, `*-avatar.svg`, `*-mobile.svg`): skip them. They're generated placeholders, not real content. Log them as skipped.

### 02-taxonomy: categories
Create categories from the unique first tag of each post in `posts.json`, with title-cased titles: `AI`, `RAG`, `Edge AI`, `Web`, `Platform`. Then merge them into a sensible set: **AI Engineering** (AI, RAG, Edge AI), **Web Architecture** (Web), **Platform Engineering** (Platform). Store the mapping in the step file so it's documented.

### 03-team: team
From `content/legacy/team.json` (11 people): `name`, `slug` (slugify name), `role`, `bio` ← `description`, `expertise` ← `skills`, `order`, `kind: "person"`, and `leadership` = true when the role contains "Chief". The photo is empty (legacy has none; Phase 7 backlog).
Also create one extra entry: **"Qbitlog Engineering"** with `kind: "team"`, role "Engineering team", `showOnSite: false`. This is the default author for migrated posts.

### 04-technologies: technologies
Unique technologies from case studies (`technologies[].name`, icon → media) and services (`techstack[].name`, `image` → upload from `public/icons/…`). Deduplicate by lower-cased name. Map a category by name (React/Next.js/Angular/Tailwind → Frontend; Node.js/PHP/Python/FastAPI → Backend; Flutter/Kotlin/Swift/React Native/Expo/Ionic → Mobile; TensorFlow/OpenAI/Gemini → AI; AWS/Azure/GCP/Vercel/DigitalOcean/Docker → Cloud; MongoDB/PostgreSQL/Redis/Prisma → Data; Figma/Adobe → Design). Anything unknown → Backend, and log it.

### 05-services: services
From `content/legacy/services/*.json` (5 files):

| legacy slug | title | category | outcomeHeadline (new) |
|---|---|---|---|
| `ai-machine-learning` | AI & Machine Learning | AI & ML | Automate the work your team does by hand |
| `web-development` | Web Development | Web | Web platforms that hold up under real traffic |
| `mobile-development` | Mobile App Development | Mobile | Apps your customers keep on their home screen |
| `uiux` | Product & UX Design | Product design | Design that shortens the path to "done" |
| `cloud-solutions` | Cloud & DevOps | Cloud | Infrastructure you don't have to think about |

- **Keep the legacy slugs** so URLs `/services/<slug>` still work.
- `summary` ← legacy `description`. `technologies` ← techstack names (via step 04).
- Put the legacy `section_name` + `section_description` into a `richText` block in `layout` titled with `section_name`, so no text is lost.
- `problems`, `deliverables` and `process` stay empty (Phase 7 writes them).
- Status: **published** (these pages were live).

### 06-industries: industries (new, **draft**)
Create 4: `healthcare` ("Healthcare"), `hospitality` ("Hospitality & Restaurants"), `travel` ("Travel & Senior Care"), `saas` ("SaaS & Startups"). Fill `headline` and `summary` with the homepage prototype copy (`docs/redesign/reference/homepage-prototype.html`, section `#industries`). Link the case studies by industry and add `compliance`: healthcare → HIPAA, GDPR; others → GDPR. Status: **draft** (marketing reviews before publishing).

### 07-case-studies: case studies
From `content/legacy/case-studies.json` (3). Keep the slugs `medical-prescription-ocr`, `hire-your-travel-partner` and `restaurant-os`.

| Payload field | Legacy source |
|---|---|
| `title`, `slug`, `client`, `summary` (← `excerpt`) | same names |
| `industry` | map `industry` string → industries doc from step 06 (Healthcare → healthcare; "Travel & Senior Care" → travel; "Hospitality & Restaurants" → hospitality) |
| `services` | infer from `categories`/`tags` (AI Automation → ai-machine-learning; mobile → mobile-development; web/dashboard → web-development) |
| `durationWeeks` | `parseInt(duration)` ("10 Weeks" → 10) |
| `teamSize` | `parseInt(teamSize)` |
| `year` | `new Date(date).getFullYear()` |
| `status` | `isPrototype ? "prototype" : "live"` |
| `liveUrl` | `liveUrl ?? demoUrl` |
| `metrics` | `metrics[]` → `{ value, unit, label, source: "<client>, <year>", featured }`. Split the value into number + unit when it matches `/^(\d+)(%|x)$/`, otherwise keep the whole string in `value` (e.g. "3-5s" → `value:"3–5", unit:"s"`; "24/7" → value "24/7"). Set `featured: false` for **"2018 / Trusted Since"** and **"1 / Unified Operations Platform"** (they aren't results). |
| `heroImage` | `heroImage` → media |
| `challenge` | `challenge` + `overviewAbout` as two paragraphs → Lexical |
| `solution` | `solutionIntro` + `solution` → Lexical |
| `features` | `solutionFeatures[]` → `{title, description}` (drop `icon`) |
| `gallery` | `screenshots[]` → `{image, caption}` (skip SVG placeholders) |
| `body` | `contentHtml` → Lexical via `convertHtml` |
| `technologies` | step 04 |
| `testimonial` | created in step 11, then linked back |
| `decisions` | **empty.** Phase 7 writes the decision logs from `content/legacy/docs/*_CASE_STUDY.md` |
| `featured` | true for all 3; `order`: medical-prescription-ocr 1, restaurant-os 2, hire-your-travel-partner 3 |

Legacy fields with no direct target (`tags`, `categories`, `projectType`, `description`, `features[]` string list, `results`, `mobileImage`, `iconImage`): **don't drop them**. Append `results` as a final "Results" paragraph in `body`, and `features[]` as a bullet list in `body` under "What we built". `mobileImage` goes into the gallery. `description` and `projectType` go into the SEO meta description if empty. Status: **published**.

### 08-posts: insights
From `content/legacy/posts.json` (6). Keep the slugs.
- `title`, `excerpt`, `publishedAt` ← `date`, `tags` ← `tags`, `category` (step 02 mapping), `authors` ← ["qbitlog-engineering"], `heroImage` ← downloaded media, `content` ← `convertHtml(contentHtml)`. `readingTime` is computed by the hook (run it, or compute it in the script since hooks still run with the Local API).
- SEO: `meta.title = title`, `meta.description = excerpt`.
- Status: **published**.
- **Verify** each post's word count before and after conversion (strip tags from the HTML vs. the Lexical text). Fail the step if any post loses more than 2% of its words.

### 09-jobs: careers
From `content/legacy/careers.json` → `careers[]`:
- `slug` = `slugify(title)` using the same function as the legacy site (`title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")`) so `/careers/<slug>` is unchanged.
- `title`, `location`, `salary`, `summary` ← `description`, `responsibilities` ← `keyResponsibilities`, `requirements`, `benefits`. `positionoverView[]` becomes a bullet list at the top of `description` (richText).
- `status: "open"`, `department: "Sales"` for the BD role, `employmentType: "Full-time"`. Status: **published**.

### 10-faqs: FAQs
From `content/legacy/faqs.json`. Upsert by question and keep the topic. Then **add** these new FAQs from the prototype as **drafts** isn't possible (FAQs have no drafts), so create them with a `[REVIEW]` prefix in the question and let marketing remove the prefix after checking:
- "How do you work across US and European time zones?"
- "Can you take over an existing codebase?"

### 11-testimonials: testimonials
From each case study's `testimonial`: `quote`, `name`, `role` ← `position`, `company` ← `client`, `avatar` (skip SVG placeholders), `caseStudy` link, `approved: false` (marketing must confirm client approval). Then set `testimonial` on the case study.

### 12-log-entries: studio log (starter)
Create entries for real, verifiable events only:
- `2024-12-26` MEASURED · Batra Hospital · "99% prescription extraction accuracy" · highlight "99%"
- `2024-12-26` SHIPPED · Batra Hospital · "Prescription processing in 3–5 seconds" · highlight "3–5s"
- The date of each post in `posts.json` · WROTE · "Insights" · the post title (link to the post)
- RestaurantOS and HYTP · SHIPPED · use each case study's `date`

Do **not** invent hires, talks or dates.

### 13-globals: globals
- `header.nav`: Work (/work), Services (/services), Industries (/industries/healthcare for now, or the first published industry), Insights (/insights), About (/about). CTA: "Book a scoping call" → `/contact`.
- `footer`: the columns Work / Services / Company from the prototype footer, and legal links to `/privacy`, `/terms`, `/academyai/privacy-policy` and `/academyai/terms-and-conditions`.
- `site-settings`: `siteName: "Qbitlog"`, the default SEO title and description from `app/(frontend)/layout.tsx`, `contact.email: "hello@qbitlog.com"` (**flag it for confirmation**), `organization.legalName: "Qbitlog"`, and `sameAs` from the old home page JSON-LD (`https://linkedin.com/company/qbitlog`, `https://twitter.com/qbitlog`). **Don't copy `foundingDate: "2020"`** unless it's confirmed; leave it empty and add it to the review list.

### 14-pages: pages
Create as **draft**:
1. **`home`**: blocks in this order, with copy from `docs/redesign/reference/homepage-prototype.html`:
   `heroLog` (logSource caseStudy → medical-prescription-ocr) → `logTicker` → `showcase` (image `re-os/dashboard.png`, the 3 annotations from the prototype at x/y 20/64, 57/42, 83/51) → `caseStudyGrid` (featured, 3, firstAsFeature) → `method` (4 steps from the prototype, testimonial Batra) → `serviceList` (all) → `industryGrid` (all) → `insights` (4, showStudioLog) → `faq` (4 FAQs) → `cta`.
2. **`about`**: `heroLog`-less. Use `richText` (story: the name qbit + log, the principles), `method`, `teamGrid` (leadership), `cta`.
3. **`contact`**: `contactForm` + `faq` (topic engagement).
4. **`privacy`** and **`terms`**: `richText` with a placeholder heading, "Qbitlog Privacy Policy (to be written)". Leave them as drafts, and add them to the review list. (The Academy AI legal pages stay code-owned.)

Every claim in the prototype that is **not** in legacy data must go to the review list (§4.6) and must not be published automatically: "4+ hrs overlap", "GDPR-aware delivery", "weekly written updates", "reply within one business day", the FAQ answers, and the 0.80 confidence threshold.

---

## 4.4 Verification script
`cms/seed/verify.ts` (script `"seed:verify"`) prints a table comparing legacy counts with Payload counts, and fails on any mismatch:

| Source | Expected |
|---|---|
| posts.json | 6 published posts |
| case-studies.json | 3 published case studies |
| services/*.json | 5 published services |
| careers.json | 1 published job |
| team.json | 11 team members (+1 team author) |
| faqs.json | ≥ 8 FAQs |

It also checks that every post and case-study slug in `content/legacy` exists in Payload **with the same slug**.

## 4.5 Acceptance criteria
- [ ] `npm run seed` completes on an empty database, and re-running it reports only `updated`/`skipped` with no duplicates.
- [ ] `npm run seed:verify` passes.
- [ ] Word-count check on the posts passes (≤ 2% loss).
- [ ] In `/admin`, every migrated item is visible, with images and alt text.
- [ ] `content/legacy/` is unchanged (`git diff --stat content/legacy` is empty).
- [ ] `docs/redesign/content-review.md` exists (§4.6).
- [ ] `npm run check` passes.
- [ ] Commit: `redesign(phase-4): seed scripts migrating legacy content into payload`.

## 4.6 Content review list (create `docs/redesign/content-review.md`)
A checklist for the marketing team. Each item has what to confirm and where it lives in `/admin`:
- Testimonials: client approval for public use (3)
- Metrics: client approval for every number shown publicly
- Claims: time-zone overlap, GDPR wording, reply SLA, weekly updates, the 0.80 threshold
- FAQs prefixed `[REVIEW]`
- Company email, founding date, social URLs
- Industries (4 drafts), Home, About and Contact pages (drafts)
- Qbitlog Privacy Policy and Terms (need writing)
- Freepik images on posts (replace or keep with credit)
- Team photos (none yet)

## 4.7 Handoff notes
- **Scripts.** `npm run seed`, `npm run seed:verify` and `npm run seed:publish-drafts` run through `tsx`, with `NODE_OPTIONS=--no-deprecation`. The seed accepts these flags:
  - `--dry-run`
  - `--only=posts,pages,…` (step names)
  - `--refresh`: re-seeds globals and pages that already have content. Without it, they are skipped, so edits made in `/admin` survive a re-run.
- **Idempotency.** A second `npm run seed` creates 0 documents. `seed:verify` passes: 6 posts, 3 case studies, 5 services, 1 job, 12 team members, 10 FAQs, and every legacy slug is matched.
- **Images.** Remote images are cached in `cms/seed/.cache/` (gitignored). The downloader follows redirects by hand (up to 5 hops), because the Freepik images now 301 to `img.magnific.com`. When a download fails, the post is imported without its hero image and logged as `skipped`. It does not fail the run. **Check in `/admin` whether each post has its hero image.**
- **Globals (step 13).** Header, footer and site settings. Site settings count as "already filled" when `contact.email` is set, because `siteName` and `timezoneNote` have schema defaults. `SiteSettings.contact.replyTime` (default "within one business day") was added for the contact confirmation. It is on the review list.
- **Pages (step 14).** Home, about, contact, privacy and terms are created as drafts. Deviations:
  - Home has an extra `proofStrip` after the hero, to match the prototype's metric strip.
  - The header's "Industries" link goes to `/industries/healthcare`. `/industries` itself redirects to the first industry.
- **`seed:publish-drafts`** (local QA only). It publishes every draft in pages, case studies, services, industries, posts and jobs. Before loading Payload, it refuses to run if `VERCEL_ENV=production`, if the site URL contains `qbitlog.com`, or if the database is not a local MongoDB. Never run it against production: marketing must publish there after completing `content-review.md`.
- **Case-study decisions** are seeded with `[VERIFY]` prefixes on their problem statements. They are on the review list.
