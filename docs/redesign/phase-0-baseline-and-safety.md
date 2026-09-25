# Phase 0: Baseline, safety and content preservation

> Read `docs/redesign/README.md` first.
> **Goal:** make the rebuild safe to start. Fix leaked secrets, copy every piece of published content into `content/legacy/`, and record today's numbers so we can measure growth later.
> **Estimated time:** 0.5–1 day. **Depends on:** nothing.

---

## 0.1 Context you need

The current site is a Next.js App Router project. Content lives in JSON files and inside TSX components:

| Content | Current location |
|---|---|
| Blog articles (6, full HTML bodies) | `app/blog/_data/posts.json`. Fields: `slug, title, excerpt, date, tags, heroImage, iconImage, contentHtml` |
| Case studies (3) | `app/case-studies/_data/case-studies.json` (rich schema, see §0.4) and type file `app/case-studies/_data/types.ts` |
| Services (5) | `app/services/_data/{ai-machine-learning,cloud-solutions,mobile-development,uiux,web-development}.json`. Fields: `slug, tags, title, description, section_name, section_description, techstack[]` |
| Careers (1 role) | `app/careers/__data/carrer.json` → `{ careers: Career[] }`; type in `app/careers/__types/index.ts`; slug = `slugify(title)` in `app/careers/__utils.ts` |
| Team (11 people) | hardcoded `teamData` array in `app/teams/_components/team-members/index.tsx` |
| FAQs (8) | `faqStructuredData` in `app/page.tsx` and the component in `components/global/faq/index.tsx` |
| Legal pages | `app/academyai/privacy-policy/page.tsx`, `app/academyai/terms-and-conditions/page.tsx` (content written in JSX) |
| Source documents | repo root: `BATRA_PROJECT_CASE_STUDY.md`, `RestaurantOS_CASE_STUDY.md`, `Hire-Your-Travel-Partner` (markdown, no extension), `SEO-GUIDE.md`, `SEO-IMPLEMENTATION-SUMMARY.md`, `SEO-UPDATE-REPORT.md`, `MISSING-IMAGES-REPORT.md`, `propmt.txt` |
| Images | `public/images/**`, `public/icons/**` |

---

## 0.2 Tasks

### Task 1: Create the working branch
```bash
git checkout main && git pull
git checkout -b redesign
```
All rebuild work happens on `redesign`. `main` stays deployable until launch (Phase 6).

### Task 2: Remove leaked secrets (SECURITY, do first)

Problems found in the current code:
1. `app/api/contact/route.ts` hardcodes a **ZeptoMail API key** (`ZEPTO_API_KEY = "PHtE6r0…"`), a Google Apps Script URL and a personal Gmail recipient. It has been in git history since commit `4303ee4`.
2. `app/api/careers/apply/route.ts` line ~18 runs `console.log(ZOHO_USER, ZOHO_APP_PASSWORD)`, which writes the SMTP password to Vercel logs.

Do this:
- In `app/api/careers/apply/route.ts`, delete the `console.log` line.
- In `app/api/contact/route.ts`, replace the hardcoded constants with `process.env.ZEPTO_API_KEY`, `process.env.CONTACT_SCRIPT_URL`, `process.env.CONTACT_FROM_EMAIL` and `process.env.CONTACT_TO_EMAIL`. If a value is missing, return HTTP 500 with a generic message. These routes are deleted in Phase 1, but `main` still ships them, so **cherry-pick this fix onto `main` too**.
- `[HUMAN]` **Rotate the ZeptoMail API key** in the Zoho ZeptoMail console. The old key is public in git history and must be treated as compromised. Put the new key in Vercel env vars.
- `[HUMAN]` Rotate the Zoho app password, because it may have been logged.
- `[HUMAN]` Check Vercel logs for exposure and purge them if possible.
- Do **not** rewrite git history unless a human asks. Rotating the keys is the fix.

### Task 3: Create `content/legacy/`, the preserved content archive

Create this structure by **copying** files (use `git mv` only for files Phase 1 would delete anyway; copying is always safe):

```
content/legacy/
  README.md                  explains the folder is read-only (text below)
  posts.json                 ← app/blog/_data/posts.json
  case-studies.json          ← app/case-studies/_data/case-studies.json
  case-studies.types.ts      ← app/case-studies/_data/types.ts
  services/
    ai-machine-learning.json ← app/services/_data/ai-machine-learning.json
    cloud-solutions.json
    mobile-development.json
    uiux.json
    web-development.json
  careers.json               ← app/careers/__data/carrer.json   (note: fix the filename typo)
  team.json                  ← extracted from teamData (Task 4)
  faqs.json                  ← extracted from app/page.tsx (Task 4)
  home-copy.md               ← all visible text from the current home page (Task 4)
  legal/
    academyai-privacy-policy.tsx        ← copy of app/academyai/privacy-policy/page.tsx
    academyai-terms-and-conditions.tsx  ← copy of app/academyai/terms-and-conditions/page.tsx
  docs/
    BATRA_PROJECT_CASE_STUDY.md
    RestaurantOS_CASE_STUDY.md
    Hire-Your-Travel-Partner.md         ← add the .md extension
    SEO-GUIDE.md
    SEO-IMPLEMENTATION-SUMMARY.md
    SEO-UPDATE-REPORT.md
    MISSING-IMAGES-REPORT.md
    prompt-critique.txt                 ← propmt.txt
```

Contents of `content/legacy/README.md`:
```md
# Legacy content (read-only)
Snapshot of all content published on qbitlog.com before the 2026 rebuild.
- Never delete or edit files here. The Payload seed scripts (cms/seed/) read from this folder.
- After migration, Payload is the source of truth. This folder is the audit trail.
```

After copying, **move** (not copy) the root-level docs (`*.md` case studies, SEO docs, `propmt.txt`, `Hire-Your-Travel-Partner`) so the repo root is clean. Keep the root `README.md`.

### Task 4: Extract hardcoded content into JSON

1. **`team.json`**: open `app/teams/_components/team-members/index.tsx` and copy the `teamData` array exactly into JSON, keeping every field (`name, role, description, skills`, plus any image or social fields). Add `"order": <index>` to each item.
2. **`faqs.json`**: from `app/page.tsx`, copy each `mainEntity` item of `faqStructuredData` as `{ "question": "...", "answer": "...", "topic": "general" }`. Also check `components/global/faq/index.tsx`. If it has extra or different Q&As, include them too and deduplicate by question.
3. **`home-copy.md`**: record every visible headline and paragraph from the current home page components (`app/_home/components/hero_5`, `about/about-v3.tsx`, `about/life-at-qbitlog.tsx`, `components/global/services`, `how-it-works`, `cta-banner`, `our-marque`) in the order they appear on the page. This is reference only; the new homepage copy is written fresh.

Validate each JSON file with `node -e "require('./content/legacy/team.json')"`, and the same for each of the others.

### Task 5: Clean the image folder
- Delete these exact duplicates: `public/images/case-studies/hytp/booking - Copy.png`, `family - Copy.png`, `trip-planer - Copy.png`. Also delete `app/case-studies/_data/New Text Document.txt`.
- Before deleting, check with `grep -rn "Copy.png" app components` that nothing references them.
- Rename `public/images/case-studies/hytp/trip-planer.png` → `trip-planner.png`, and update any reference to it in `content/legacy/case-studies.json`. **Exception:** this is the one allowed edit to legacy content, because it is a path fix.

### Task 6: Record the URL inventory
Create `docs/redesign/baseline/url-inventory.md` listing every public URL the current site serves. Get them by running the current `app/sitemap.ts` logic, or by reading all `app/**/page.tsx` routes plus the slugs from the JSON files. Expected list:
- `/`, `/aboutus`, `/services`, `/services/{5 slugs}`, `/blog`, `/blog/{6 slugs}`, `/case-studies`, `/case-studies/{3 slugs}`, `/teams`, `/contact-us`, `/careers`, `/careers/{1 slug}`, `/construction`, `/academyai/privacy-policy`, `/academyai/terms-and-conditions`

For each URL, write the new target URL (see README §5). Phase 6 turns this table into redirects.

### Task 7: Record the performance baseline
On the current production site (`https://qbitlog.com`), run Lighthouse in mobile mode for `/`, `/case-studies/medical-prescription-ocr` and `/blog/ai-trends-2025`:
```bash
npx lighthouse https://qbitlog.com/ --preset=perf --form-factor=mobile --output=json --output-path=docs/redesign/baseline/lh-home.json --quiet --chrome-flags="--headless"
```
Summarise Performance, Accessibility, Best Practices, SEO, LCP, CLS and TBT in `docs/redesign/baseline/metrics.md`.

### Task 8: `[HUMAN]` Record the traffic baseline
A person with access fills this table in `docs/redesign/baseline/metrics.md` (the last 90 days):

| Metric | Source | Value |
|---|---|---|
| Organic clicks, impressions, avg position | Google Search Console | |
| Indexed pages | Search Console → Pages | |
| Top 10 queries | Search Console | |
| Sessions / visitors | Vercel Analytics | |
| Contact form submissions per month | inbox | |
| Top referrers | Vercel Analytics | |

The goal of "+70–80% reach" is measured against this table.

### Task 9: Add `.env.example`
Create `.env.example` at the repo root with every variable from README §7 and empty values. Make sure `.gitignore` still ignores `.env*` but **not** `.env.example`: add the line `!.env.example`.

---

## 0.3 Acceptance criteria
- [ ] Branch `redesign` exists.
- [ ] No hardcoded API keys or recipients remain in `app/api/**`. There is no `console.log` of credentials. The fix is also on `main`.
- [ ] `content/legacy/` contains every file listed in Task 3, and each JSON file parses.
- [ ] `team.json` has 11 people and `faqs.json` has at least 8 questions.
- [ ] The repo root only has config files, `README.md`, `.env.example`, `docs/`, `content/`, and the source folders.
- [ ] `docs/redesign/baseline/url-inventory.md` and `metrics.md` exist.
- [ ] `npm run build` still passes. This phase does not change the site's behaviour.
- [ ] Commit: `redesign(phase-0): preserve legacy content, remove leaked secrets, record baseline`.

## 0.4 Reference: legacy case-study fields
`slug, title, excerpt, date, tags[], heroImage, iconImage, client, industry, duration ("10 Weeks"), teamSize ("6 Developers"), challenge, solution, results, technologies[{name,icon}], categories[], projectType, description, mobileImage, liveUrl, metrics[{value,label,icon}], overviewAbout, solutionIntro, solutionFeatures[{icon,title,description}], features[], screenshots[{image,caption}], testimonial{quote,name,position,avatar,rating}, demoUrl, isPrototype, contentHtml`

## 0.5 Handoff notes
- Freepik images are hotlinked in `posts.json` (`heroImage`/`iconImage` point at `img.freepik.com`). Phase 4 downloads them into Payload media with credit text, and Phase 7 replaces them.
- The HYTP metric `"2018" / "Trusted Since"` is not a result. Phase 4 imports it with `featured: false`.
