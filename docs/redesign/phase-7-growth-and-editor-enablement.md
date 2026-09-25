# Phase 7: Growth engine and editor enablement

> Read `docs/redesign/README.md` first. Phase 6 must be complete (the site is live).
> **Goal:** turn the site into a machine that grows reach. The marketing team publishes confidently every week, content gaps get filled, and results are measured against the Phase 0 baseline. The target is **+70–80% organic reach within 6–9 months of launch**.
> **Estimated time:** engineering tasks take ~3 days; content work is ongoing.

This phase has two tracks. **Track A** is engineering (an agent can do it). **Track B** is content and operations (the marketing team, with an agent drafting where marked).

---

## Track A: Engineering

### A1. Editor guide: `docs/editor-guide.md`
Write a plain-language guide for non-developers, with screenshots taken from `/admin` (save them in `docs/editor-guide/`). Sections:
1. **Logging in and roles**: what editors and authors can do.
2. **The house rules**: every number needs a source; only client-approved numbers and quotes; no stock photos of people; write for US/EU buyers (US English, no jargon); one call to action per page.
3. **Publish a case study, step by step**, including how to write a **decision log** entry (problem → options → decision → why) with one worked example taken from the Batra Hospital study.
4. **Screenshots and annotations**: export at 1600px+ width, PNG or WebP, never with client PII; how to place pins (x/y %), and keep to at most 3 pins per image.
5. **Write an insight**: structure (a hook, 3–5 h2 sections, a takeaway), 1,200–2,000 words, choosing a category, adding the author, inline blocks (callout, metrics, decision record, code).
6. **SEO tab**: title ≤ 60 characters, description 140–160 characters, the OG image, and when to tick `noindex`.
7. **Preview, schedule, publish**: live preview, autosave, scheduled publishing.
8. **Changing a slug means adding a redirect** (Settings → Redirects).
9. **Weekly log entry** (the ticker and `/log`): what counts (shipped, measured, decided, wrote, hired, talk) and what doesn't (no vague "working hard" entries).
10. **Leads inbox**: status workflow `new → contacted → qualified → won/lost`, and the response SLA.
11. **Images**: alt text rules (describe what's shown and why it matters) and the credit field.

Also add a link to the guide in the admin dashboard banner (Phase 3 §3.12).

### A2. Content health report (admin view)
Add a custom admin view `/admin/content-health` (`admin.components.views`) that lists:
- Case studies with no `decisions`, fewer than 3 metrics, or testimonials not approved
- Published docs with a missing meta description, or a title over 60 characters
- Media with missing or very short alt text (< 8 characters)
- Posts older than 12 months (candidates for a refresh)
- `[REVIEW]`-prefixed FAQs
- Services missing `problems`, `process` or `deliverables`

Make it read-only and fast (use `select` fields only).

### A3. Data retention (GDPR)
- Add a route `app/(frontend)/next/cron/retention/route.ts`, protected by `Authorization: Bearer ${CRON_SECRET}`. It deletes `leads` older than **24 months** and `applications` (plus their `resumes` files) older than **12 months**, and logs only the counts.
- Add a Vercel Cron in `vercel.json`: `{ "crons": [{ "path": "/next/cron/retention", "schedule": "0 3 * * 1" }] }`.
- Update the Qbitlog privacy policy page (Payload page `privacy`) with these retention periods. `[HUMAN]` legal review.

### A4. Scheduled publishing runner
If `schedulePublish` is enabled (Phase 3), Payload's jobs queue must run. Add a Vercel Cron hitting Payload's jobs endpoint every 5–15 minutes (see the installed version's docs: "Jobs Queue → running jobs on Vercel/serverless"), protected by `CRON_SECRET`.

### A5. Analytics events
With `track()` from `@vercel/analytics` (cookieless, so no consent banner is needed for it), send:
- `cta_click` `{ location: "hero" | "header" | "cta_block" | "footer", label }`
- `booking_click` `{ location }`
- `lead_submitted` `{ budget, timeline }` (never PII)
- `application_submitted` `{ job }`
- `case_study_view_depth` `{ slug, reached: "decisions" | "results" }` (use an IntersectionObserver on those sections)

If the team later wants GA4, it **must** go behind a consent banner with Google Consent Mode v2 (EU requirement). That is out of scope unless requested.

### A6. CSP enforcement
After 7 days with no violation reports, switch `Content-Security-Policy-Report-Only` (Phase 6) to an enforcing `Content-Security-Policy`.

### A7. Growth dashboard: `docs/redesign/growth/dashboard.md`
A monthly table template comparing against `baseline/metrics.md`: organic clicks, impressions, average position, indexed pages, non-branded clicks, sessions, leads, lead→call rate, top 10 pages, and top 10 queries. Add a short "what we'll change next month" section.

---

## Track B: Content and operations

### B1. Priority content backlog (first 8 weeks after launch)

| # | Item | Owner | Agent can draft? | Source material |
|---|---|---|---|---|
| 1 | **Decision logs** for all 3 case studies (3–5 decisions each) | Marketing + the project's tech lead | Yes, as a draft for review | `content/legacy/docs/BATRA_PROJECT_CASE_STUDY.md`, `RestaurantOS_CASE_STUDY.md`, `Hire-Your-Travel-Partner.md` |
| 2 | Client approval of metrics and testimonials | Account lead | No | — |
| 3 | Service pages: `problems`, `process`, `deliverables` for all 5 | Marketing | Yes | Legacy service JSON + case studies |
| 4 | Publish the 4 industry pages (healthcare, hospitality, travel, SaaS) | Marketing | Yes | Case studies |
| 5 | Qbitlog Privacy Policy and Terms | Legal | No | — |
| 6 | Team photos (consistent style: same background, natural light) | Ops | No | — |
| 7 | Replace the Freepik post images with real diagrams or screenshots | Design | Partly | — |
| 8 | About page story ("Why *qbit* + *log*", principles, how we work) | Founders | Yes | `docs/redesign/README.md` §4 |

**Rule for agents drafting content:** only use facts found in `content/legacy/**`, in Payload, or given by the team. Mark every sentence that needs verification with `[VERIFY]`. Save as **draft** and never publish.

### B2. Publishing cadence
| Cadence | What | Why |
|---|---|---|
| Weekly | 1 log entry minimum | Signals activity (ticker, `/log`) and gives LinkedIn material |
| Weekly | 1 insight (1,200–2,000 words), written by or with an engineer, named author | Topical authority, E-E-A-T, long-tail traffic |
| Monthly | 1 new case study, or a major update to one, with a decision log | Highest-converting content; also used for sales |
| Monthly | Refresh 1 older insight (new data, better title/description) | Keeps rankings |
| Quarterly | 1 new industry page or service × industry deep-dive | New ranking surfaces for high-intent searches |

### B3. Keyword map (US/EU buyer intent)
Validate these with a keyword tool (Search Console, Ahrefs, Semrush or Google Keyword Planner) before writing. Map each to exactly **one** page so pages don't compete:

| Intent cluster | Example queries to validate | Target page |
|---|---|---|
| AI automation | "AI document processing development", "healthcare AI software development company", "RAG development services" | `/services/ai-machine-learning`, `/industries/healthcare`, insights |
| Restaurant tech | "restaurant management software development", "custom restaurant POS development" | `/industries/hospitality`, RestaurantOS case study |
| Travel platforms | "travel booking platform development", "senior travel app" | `/industries/travel`, HYTP case study |
| Web platforms | "Next.js development agency", "SaaS MVP development company" | `/services/web-development`, `/industries/saas` |
| Mobile | "React Native app development company", "Flutter app development agency" | `/services/mobile-development` |
| Engagement | "offshore development team US time zone", "nearshore software development Europe" | `/about`, `/contact`, an insight on how we work across time zones |

### B4. Distribution (reach beyond Google)
- Turn every case study into a LinkedIn carousel from its decision log ("3 decisions that got Batra Hospital to 99% accuracy"), posted from the company page **and** the engineers' personal profiles.
- Get listed on Clutch, GoodFirms and DesignRush with the same case studies, and ask each client for a Clutch review (US/EU buyers check Clutch).
- Cross-post insights to dev.to or Medium with the canonical URL set to qbitlog.com.
- Guest posts and podcasts: one a month, linking to a case study.
- Add the site link and case studies to every sales proposal and email signature.

### B5. Monthly review ritual (45 minutes)
1. Fill in `growth/dashboard.md` for the month.
2. Top 5 pages by clicks: what worked?
3. Queries with high impressions but low CTR → rewrite those titles and descriptions.
4. Pages sitting at positions 8–20 → refresh the content and add internal links.
5. Leads: which pages did they come from (`sourcePath`, UTM)? Put more effort there.
6. Choose next month's case study, 4 insight topics, and 1 page to refresh.

---

## 7.1 Acceptance criteria (Track A)
- [x] `docs/editor-guide.md` is complete with screenshots and linked from the admin dashboard.
- [x] `/admin/content-health` lists the issues from A2 correctly.
- [x] The retention cron deletes test records older than the threshold and is protected by `CRON_SECRET`.
- [ ] Scheduled publishing works on production (schedule a test post 10 minutes ahead and confirm it goes live). [HUMAN, after deploy]
- [ ] Analytics events appear in Vercel Analytics. [HUMAN, after deploy]
- [ ] CSP enforced with no breakage. [After 7 days of clean report-only data]
- [ ] Commit: `redesign(phase-7): editor guide, content health, retention, analytics`. [Not done: commits were not requested]

### Handoff notes (Phase 7)

- **Editor guide (A1):** screenshots are in `docs/editor-guide/`. Regenerate them with `npm run docs:screenshots` against a local server (`SCREENSHOT_BASE_URL`). The script refuses non-local databases and deletes its temporary admin afterwards. The dashboard link points at the guide on GitHub (`EDITOR_GUIDE_URL` in `cms/components/BeforeDashboard.tsx`). Editors need repo access, or the guide can be moved to Drive or Notion and the constant updated.
- **Content health (A2):** `cms/components/ContentHealth.tsx`, registered at `/admin/content-health`. Every query runs with the viewer's access (`overrideAccess: false`).
- **Retention (A3):** `app/(frontend)/next/cron/retention/route.ts` deletes leads older than 24 months, and applications older than 12 months along with their résumés. It returns 401 without `Authorization: Bearer $CRON_SECRET`. Scheduled weekly in `vercel.json`. Verified locally with a backdated lead. The seeded privacy placeholder now states these periods; the final privacy text needs [HUMAN] legal review. Existing databases pick it up with `npm run seed -- --refresh`.
- **Scheduled publishing (A4):** `vercel.json` calls `/api/payload-jobs/run` every 10 minutes (Vercel Cron sends the `CRON_SECRET` bearer automatically). A `*/10` schedule needs Vercel Pro; the Hobby plan only allows daily crons. [HUMAN] Set `CRON_SECRET` in Vercel and run the 10-minute test post on production.
- **Analytics (A5):** events are wired through `lib/analytics.ts`. [HUMAN] Confirm they appear in Vercel Analytics (custom events need Pro).
- **CSP (A6):** shipped as `Content-Security-Policy-Report-Only`, with violations logged by `/csp-report`. After 7 days with no unexpected `[csp]` log lines, rename the header key to `Content-Security-Policy` in `next.config.ts` (the policy itself stays the same) and re-run `npm run test:e2e`.
- **Track B** is editorial and operational work for the team; there is no engineering deliverable.

## 7.2 Success metrics (reviewed monthly against the baseline)
| Metric | 3 months | 6 months | 9 months |
|---|---|---|---|
| Organic clicks (Search Console) | +20% | +50% | **+70–80%** |
| Indexed pages | 2× | 3× | 3–4× |
| Contact form conversion rate | 1.5× | 2× | 2× |
| Published case studies | 4 | 7 | 10 |
| Published insights | 12 new | 24 new | 36 new |

Traffic growth depends on actually keeping this publishing cadence. The site makes publishing easy, but it doesn't replace it.
