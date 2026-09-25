# Phase 8: Depth for Services and Work

> Read `docs/redesign/README.md` first. Phases 0–7 must be complete.
> **Goal:** `/services`, `/work`, `/services/[slug]` and `/work/[slug]` currently render one or two sections. That's partly because the index pages were built with a single list, and partly because the detail sections hide when their fields are empty. This phase adds new sections and fields and imports the drafted content in `content/drafts/phase-8/` **as drafts**, so every page tells a complete story once marketing approves it.
> **Estimated time:** 3–4 days engineering, plus content review. **Depends on:** Phases 2–7.

**Read `content/drafts/phase-8/REVIEW.md` before starting.** The source documents contradict several published case-study claims. This phase must **never publish or overwrite published content**. Everything lands as a draft version or as a disabled section.

---

## 8.1 Rules
- Every existing rule in README §3 applies (tokens only, no new UI libraries, Server Components by default, `content/legacy/` read-only).
- **Nothing goes live automatically.** Collections get draft versions (`draft: true`). Globals have no drafts, so every new section has an `enabled` checkbox that defaults to `false`, and the renderer skips disabled sections. (In draft mode, show disabled sections with a `Pill tone="muted"` "Hidden" label so editors can preview them.)
- **Honesty guardrails, built into the UI:**
  - A case study with `status: "prototype"` shows a `Pill tone="signal"` **"Prototype"** in the hero, on its card, and in its OG image.
  - Metrics on a prototype case study must have a source that mentions "prototype", "demo" or "synthetic". Add a validation hook that blocks publishing otherwise, with the error: "Prototype metrics must say they come from demo or prototype testing."
- New sections follow the existing patterns: `Section` + `SectionHead`, `LogLabel`, hairline grids, and mono data.

---

## 8.2 Schema changes (Payload)

### 8.2.1 `services`: new field
In the tab that holds `problems`/`process`/`deliverables`, add:
- `typicalProjects`: array (maxRows 5) of `{ name: text R, duration: text ("8–12 weeks"), description: textarea }`. Description: "Example projects with a realistic length. Buyers use this to picture their own project."

### 8.2.2 `case-studies`: new fields
*Overview* tab:
- `platforms`: text, hasMany ("Web app", "iOS", "Android", "REST API").

*Story* tab, after `decisions`:
- `timeline`: array (maxRows 12) of `{ marker: text R ("Wk 03–04"), phase: select R (DISCOVER|DECIDE|BUILD|LAUNCH|MEASURE), text: text R (max 160) }`. Description: "The project week by week. Shown in the log-panel style."
- `beforeAfter`: array (maxRows 6) of `{ aspect: text R, before: textarea R, after: textarea R }`. Description: "What changed for the people using it. Only describe what you actually observed."
- `teamRoles`: array (maxRows 8) of `{ role: text R, count: number }`.
- `lessons`: array (maxRows 5) of `{ title: text R, text: textarea R }`. Description: "What we'd do differently. Honest lessons build more trust than perfect stories."

*Proof* tab: add a `beforeValidate`/`beforeChange` hook `requirePrototypeSourceLabels`. When `status === "prototype"` and `_status === "published"`, every metric's `source` must match `/prototype|demo|synthetic/i`.

### 8.2.3 New globals: `services-page` and `work-page`
Both are in the Settings group, with `read: anyone`, `update: isAdminOrEditor`, and `afterChange` revalidating `/services` or `/work`:
- `hero`: group `{ label, title R, emphasis, intro }`
- `proof`: `metricsField` (0–4). Description: "Optional results strip under the hero. Leave empty to hide."
- `sections`: blocks (the §8.3 blocks plus the existing `method`, `industryGrid`, `caseStudyGrid`, `faq`, `cta` and `richText`). **Every block used here gets an `enabled` checkbox (default false)**. Add it via a small `withEnabled(block)` helper that clones the block config and prepends the field, so the page-builder blocks on `pages` stay unchanged.

Register both in `cms/globals/index.ts` and `payload.config.ts`, then run `npm run generate:types` and `npm run generate:importmap`.

## 8.3 New blocks (`cms/blocks/` + `components/blocks/`)

| Block slug | Fields | Renders |
|---|---|---|
| `engagementModels` | sectionHead fields; `models` array (2–4) of `{ name R, bestFor R, duration, team, pricing, includes: array {item} }` | A grid of 3 bordered surface columns. The name is serif `text-[28px]`. "Best for" is muted. Then a `dl` with mono labels DURATION / TEAM / PRICING, then an `includes` checklist (brand ✓ in mono). The grid stacks below 900px. The `enabled` flag comes from the wrapper. |
| `remoteWorking` | sectionHead fields; `items` array (3–8) of `{ title R, text R }` | A 3-column hairline grid (`gap-px bg-line`), each cell a `bg-surface p-6` with a mono label title and body text. On pages with a `timezoneNote` in site settings, prepend that as a large mono line. |
| `capabilityMatrix` | sectionHead fields; `emptyCellLabel` (default "Ask us") | **Data-driven:** rows = published industries (by `order`), columns = published services (by `order`, header = `category`). A cell links to the first published case study matching both industry and service (showing its client name), or shows `emptyCellLabel` in muted text linking to `/contact`. A real `<table>` with `<th scope>` headers, inside `overflow-x-auto`. Sticky first column on mobile. |
| `writeupExplainer` | sectionHead fields; `parts` array `{ name, text }`; `sampleCaseStudy` (rel); `sampleDecisionIndex` (number) | Two columns: left is an ordered list of parts (numbered, because the order is real), right is the chosen `DecisionRecord` from the sample case study inside a surface panel, labelled "EXAMPLE · <client>". |
| `testimonialStrip` | sectionHead fields; `limit` (default 3) | Only `testimonials` with `approved: true`. A 1–3 column grid of `Quote` (smaller size, `text-[22px]`), each linking to its case study. **Renders nothing if there are none approved.** |
| `shippedLog` | sectionHead fields; `types` (select hasMany of the log-entry types); `limit` (default 6) | `LogStream` of matching `log-entries`, with a "Full log →" link to `/log`. |

Add all six to `RenderBlocks` as well, so they can also be used on normal pages.

## 8.4 Page changes

### `/services` (`app/(frontend)/services/page.tsx`)
Order:
1. Hero from `services-page.hero` (fall back to the current hardcoded strings if empty), plus a `ProofStrip` if `proof` has items.
2. **Enriched service list.** Upgrade `ServiceRow` with optional props `highlights?: string[]` (the first 3 `deliverables`, as a mono list under the summary) and `caseCount?: number` ("2 case studies" mono label, linked). Compute `caseCount` in one query: fetch published case studies with `depth:0, select:{services:true}` and count per service id. **No N+1 queries.**
3. `<RenderSections sections={servicesPage.sections} />`, which skips `enabled: false` sections (and shows them with a "Hidden" pill in draft mode).
4. `DefaultCta`.

### `/work` (`app/(frontend)/work/page.tsx`)
1. Hero from `work-page.hero` + optional `proof`.
2. **Filters:** the existing industry chips plus a second chip row for **service** (`?service=<slug>`). Both combine. Extend `listCaseStudies` to accept `service` by slug. Keep `noindex` when any filter is set.
3. Existing featured + grid. Cards show the "Prototype" pill when relevant.
4. `RenderSections(workPage.sections)` (matrix, explainer, testimonials, recently shipped).
5. `DefaultCta` with the title override "Have a similar problem?". Add an optional `title` prop to `DefaultCta` if it doesn't have one.

### `/services/[slug]`
Keep the existing sections and add:
- After "Problems we solve": **"Typical projects"**. `typicalProjects` as rows: serif name, mono duration pill, muted description.
- Replace the plain "Where we've done it" grid with: **the first related case study as `FeatureCase`, with its first `decision` rendered as a `DecisionRecord`** under a mono label "HOW WE DECIDED", then the remaining ones as `CaseCard`s.
- **Technologies grouped by category**: a `dl` of mono category labels (Frontend, Backend, AI…) followed by comma-separated names, instead of the flat comma list.
- **Related insights**: up to 3 `PostRow`s. Map service to post category in `lib/queries/posts.ts#postsForService(service)`: `ai-machine-learning` → "AI Engineering"; `web-development` → "Web Architecture"; `cloud-solutions` → "Platform Engineering"; others → latest posts. Hide the section if there are none.
- A section appears only when its data exists (current behaviour).

### `/work/[slug]`
New sections, and their order (renumber the `LOG / 0N` labels to match):
1. Hero. Add the **"Prototype" pill** when `status === "prototype"`, and a small muted line: "Prototype built on synthetic/demo data. Results are from demo testing." (the text comes from a new site-settings field `prototypeDisclaimer`, with this as the default).
2. **Project facts panel.** On ≥1100px it's a sticky right-hand `aside` next to sections 3–6. On smaller screens it's a bordered `dl` block under the hero. Rows: CLIENT, INDUSTRY, YEAR, DURATION, TEAM, SERVICES (links), PLATFORMS, STATUS (pill), LIVE (link if `liveUrl` and live). Mono labels, ink values.
3. Showcase image (existing).
4. Challenge (existing).
5. **Timeline**: `LogPanel` with `rows` built from `timeline` (marker → marker, phase → phase, `measured` when phase is MEASURE). The title is `"<client-slug> / <slug>"` and the status is "SHIPPED", or "PROTOTYPE" for prototypes.
6. Decision log (existing).
7. What we built (existing).
8. **Before → After**: a 3-column table (ASPECT / BEFORE / AFTER). "Before" is in muted text, "After" in ink, with an arrow column (mono). It stacks on mobile as label/value pairs.
9. Gallery (existing).
10. Results (existing). Metrics show their sources.
11. **Team**: `teamRoles` as a mono line ("2 × Backend · 1 × ML · 1 × Design"). Roles without a count are listed without a multiplier.
12. **Lessons**: a hairline 2-column grid, with each lesson's title in serif `text-xl` and its text in muted.
13. Testimonial (existing, approved only).
14. Full story (existing).
15. **Previous / next case study**: two large links (mono label "PREVIOUS" / "NEXT", serif client + title) in `order` sequence, wrapping around.
16. Related insights (the same mapping as services, via the case study's first service).
17. More work + CTA (existing).

Update `lib/jsonld.ts#caseStudyLd` so prototypes are described accurately: add `"creativeWorkStatus": "Prototype"`.

### OG images
`/work/[slug]/opengraph-image.tsx`: show "PROTOTYPE" in the label line for prototype case studies.

## 8.5 Seed step: import the drafts
Create `cms/seed/steps/16-phase8-drafts.ts` and register it in `cms/seed/index.ts` (flag `--only=16`). Follow the conventions of `15-decision-drafts.ts` (`findOne`, `report`, `flags.dryRun`, `seedContext`).

1. **Services** (`content/drafts/phase-8/services.json`): for each slug, find the service. For each of `problems`, `process`, `deliverables` and `typicalProjects`, set it **only if the latest version's field is empty** (never overwrite editor work). Save with `payload.update({ …, data: {...fields, _status: "draft"}, draft: true })`. Log `skipped` if nothing was empty.
2. **Case studies** (`case-studies.json`): the same pattern for `platforms`, `timeline`, `beforeAfter`, `teamRoles` and `lessons` (empty arrays in the JSON mean "nothing to import"). **Do not** apply `recommended.*` (title, summary, status, metrics). Those need a human decision. Instead, write them into `docs/redesign/content-review.md` under a new heading "Phase 8: recommended case-study corrections", listing each recommendation and `metricsToRemove` reason, and HYTP's `questionsForTheTeam`.
3. **Globals** (`index-pages.json`): if `services-page` / `work-page` have no `sections` yet, write the hero and the sections with `enabled: false`. Resolve `sampleCaseStudySlug` to an id. For blocks whose `note` says "reuse", create the existing block with sensible defaults (e.g. `method` copies the 4 steps from the Home page's method block). If sections already exist, skip them.
4. **FAQs**: upsert the 5 `[REVIEW]` FAQs by question (existing convention: `[REVIEW]` questions are hidden on the live site). Link the `engagement`/`pricing` ones to the `/services` FAQ section by using `topic: "engagement"`.
5. Every string keeps its `[VERIFY]`/`[REVIEW]` prefix exactly as in the JSON.
6. `content/drafts/phase-8/` is read-only for the script, just like `content/legacy/`.

Then extend `cms/components/ContentHealth.tsx` (the Phase 7 content-health view):
- Case studies whose **draft or published** content contains `[VERIFY]`
- Prototype case studies whose metric sources lack "prototype/demo/synthetic"
- Published metrics with no `source`
- Services missing `typicalProjects`
- Disabled sections on `services-page` / `work-page` (reminder to review)

## 8.6 Design-system additions (`components/ds/`)
Add these to `/styleguide` with real sample data from the drafts:
- `EngagementCard`, `FactsPanel`, `BeforeAfterTable`, `LessonGrid`, `CapabilityTable`, `PrevNext`, `TypicalProjectRow`, `TechByCategory`
- `ServiceRow`: the new optional `highlights` and `caseCount` props
- `CaseCard` / `FeatureCase`: an optional `prototype?: boolean` that shows the pill

## 8.7 Acceptance criteria
- [ ] `npm run seed -- --only=16` imports everything as drafts or disabled sections. Re-running reports only `skipped`. No published version changes (`payload.find` without `draft` returns the same documents before and after).
- [ ] With drafts **published locally** (`cms/seed/publish-drafts.ts`, local database only) and all sections enabled: `/services` shows at least 7 sections, `/work` at least 6, `/services/ai-machine-learning` at least 8, and `/work/medical-prescription-ocr` at least 14.
- [ ] With nothing published or enabled, the live pages look exactly as before Phase 8 (except the "Prototype" pill if a status is already prototype).
- [ ] Publishing a prototype case study whose metric source lacks "prototype/demo/synthetic" is blocked with a clear message.
- [ ] The capability matrix is a semantic table and works on mobile without page-level horizontal scroll.
- [ ] Lighthouse mobile on `/work/medical-prescription-ocr`: Performance ≥ 90, Accessibility ≥ 95. First Load JS stays ≤ 150 kB.
- [ ] `docs/redesign/content-review.md` has the Phase 8 section.
- [ ] Playwright: add the new sections to `smoke.spec.ts` (render when enabled, hidden when disabled) and a test for the prototype-metric validation.
- [ ] `npm run check` and `npm run test:e2e` pass.
- [ ] Commit: `redesign(phase-8): deeper services and work pages, drafted content`.

## 8.8 Handoff notes

### Done in this pass (resume after model-limit failure)
- Schema: `typicalProjects`, case-study story fields, `requirePrototypeSourceLabels`, `services-page` / `work-page` globals, `prototypeDisclaimer`, six new blocks + `withEnabled`, DS components, `/services` enriched list + `RenderSections`.
- Finished remaining page work: `/work` (hero, proof, industry + service filters, sections, CTA title), `/services/[slug]` (typical projects, FeatureCase + DecisionRecord, TechByCategory, related insights), `/work/[slug]` (facts panel, timeline, before/after, team, lessons, prev/next, prototype pill + disclaimer, related insights, renumbered LOG labels), OG `PROTOTYPE`, `caseStudyLd.creativeWorkStatus`.
- Seed: `cms/seed/steps/16-phase8-drafts.ts` registered as `--only=16`. Content health Phase 8 checks. `docs/redesign/content-review.md` Phase 8 section. Styleguide samples. Playwright: disabled-section smoke + `tests/prototype-metrics.spec.ts`.

### Local verify
```bash
npm run seed -- --only=16
# optional local QA only — refuses production:
npm run seed:publish-drafts
# then in admin: enable services-page / work-page sections and publish drafts
npm run check
npm run test:e2e
```

### [HUMAN]
- Review and decide every item in `content/drafts/phase-8/REVIEW.md` and the Phase 8 section of `docs/redesign/content-review.md` before publishing draft versions or enabling index sections.
- Do **not** run `seed:publish-drafts` against production.
- After enabling sections locally: confirm `/services` ≥7 sections, `/work` ≥6, `/services/ai-machine-learning` ≥8, `/work/medical-prescription-ocr` ≥14; Lighthouse mobile on that case study (Perf ≥90, A11y ≥95, First Load JS ≤150 kB).
- Commit when ready: `redesign(phase-8): deeper services and work pages, drafted content`.
