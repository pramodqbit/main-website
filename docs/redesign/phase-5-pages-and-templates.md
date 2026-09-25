# Phase 5: Pages, templates, forms and live preview

> Read `docs/redesign/README.md` first. Phases 2, 3 and 4 must be complete (design system, CMS and seeded content).
> **Goal:** build every public route from Payload data using only `components/ds` and `components/motion`. That includes the block renderer, site chrome, rich text, forms (contact and job applications) and live preview. The homepage must match `docs/redesign/reference/homepage-prototype.html`.
> **Estimated time:** 5–7 days. **Depends on:** Phases 2, 3, 4.

---

## 5.1 Rules
- Pages are **Server Components** that fetch through `lib/queries/*` (Payload Local API). Never call the REST API from the frontend.
- **No hardcoded copy** except UI microcopy (button states, form errors, empty states). Everything else comes from Payload.
- Every page supports **draft mode** (preview) and works when optional fields are empty. Empty fields hide their section; they never render placeholders.
- **Caching:** set `export const revalidate = 3600` on every route (ISR). Payload hooks revalidate on publish (Phase 3). Detail routes use `generateStaticParams` over published slugs, with `dynamicParams = true`.
- Only `components/motion/*`, the forms, the mobile nav, the ThemeToggle and the live-preview listener may be client components.
- Images always go through `components/ds/Media` (§5.3). Only the hero or first image gets `priority`.

---

## 5.2 Data layer: `lib/`

```
lib/
  payload.ts          (Phase 3) cached getPayloadClient()
  draft.ts            isDraft(): Promise<boolean> → (await draftMode()).isEnabled
  links.ts            resolveLink(link) → { href, label, newTab } using publicUrlFor
  queries/
    pages.ts          getPage(slug)
    caseStudies.ts    getCaseStudy(slug), listCaseStudies({ industry?, featured?, limit? }), caseStudySlugs()
    services.ts       getService(slug), listServices(), serviceSlugs()
    industries.ts     getIndustry(slug), listIndustries(), industrySlugs()
    posts.ts          getPost(slug), listPosts({ page, limit=12, category? }), postSlugs(), relatedPosts(post)
    jobs.ts           getJob(slug), listOpenJobs(), jobSlugs()
    team.ts           listTeam({ leadership? })
    log.ts            listLogEntries({ limit?, tickerOnly? })
    globals.ts        getHeader(), getFooter(), getSiteSettings(), getAnnouncement()
```
Query pattern:
```ts
export async function getCaseStudy(slug: string) {
  const draft = await isDraft();
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "case-studies",
    where: { slug: { equals: slug } },
    limit: 1, depth: 2, draft, overrideAccess: draft,
  });
  return res.docs[0] ?? null;
}
```
Wrap each query in React `cache()` so `generateMetadata` and the page share one call. Use `depth: 2` for detail pages and `depth: 1` for lists. Use `select` to trim list queries where the installed Payload version supports it.

---

## 5.3 Shared rendering pieces

- **`components/ds/Media.tsx`**: props `media: Media | string | null`, `size?: "thumb" | "card" | "feature" | "og"`, `sizes`, `priority?`, `className?`, `fill?`. It picks the best `sizes[size].url` (falling back to `url`), sets `alt` from `media.alt`, and sets `style.objectPosition` from `focalX/focalY`. It returns `null` if `media` isn't populated.
- **`components/richtext/RichText.tsx`**: wraps `RichText` from `@payloadcms/richtext-lexical/react` in `Prose`. Custom converters:
  - `heading`: add `id={slugify(text)}` for h2 (used by the table of contents)
  - `link`/`autolink`: internal links resolve through `publicUrlFor`; external links get `target="_blank" rel="noopener"`
  - `upload`: `Media` + figcaption
  - blocks `Code` (`<pre class="font-mono">`, no syntax-highlight library), `Callout` (`bg-surface border-l-2 border-brand p-5`), `MediaAnnotated`, `DecisionRecordInline`, `MetricsInline` → the matching ds components.
  - Also export `extractToc(lexicalJson) → {id, text}[]` from the h2 nodes.
- **`components/blocks/RenderBlocks.tsx`**: a `switch (block.blockType)` over every block in Phase 3 §3.8, calling `components/blocks/<Name>Block.tsx`. Unknown block types render nothing in production and a red warning box in development. Each block component is a Server Component that fetches whatever relations it needs (e.g. `LogTickerBlock` calls `listLogEntries({tickerOnly:true, limit})`).
- **`components/blocks/HeroLogBlock.tsx`**:
  - `Section bordered={false}` with `relative overflow-hidden pt-[104px]`. The `BitField variant="field"` sits absolutely behind it (`next/dynamic`, `ssr:false`), with a static `dotgrid` fallback div.
  - A pointer hint "MOVE YOUR CURSOR · FLIP SOME BITS" (mono label, top-right, hidden on `hover:none` devices).
  - Grid `1.1fr 1fr`: left has `LogLabel`, `Heading size="display" emphasis`, subhead, buttons and trust items; right has `LogPanel animate`.
  - When `logSource === "caseStudy"`, build the rows from that case study: its first 2 `decisions` → phases DISCOVER/DECIDE, and its featured metrics → a MEASURED row with bold values. The panel title is `"<client-slug> / <case-study-slug>"`, the status is "SHIPPED", and the footer is `"<durationWeeks> weeks · <teamSize> engineers"` with a link to the case study. If the case study has no decisions, fall back to the `manualLog` rows.
  - Below the grid comes a `ProofStrip` if the next block is `proofStrip`. Otherwise, render the featured metrics of the referenced case study (max 4).
- **`components/blocks/CtaBlock.tsx`**: if `button` is empty, use `siteSettings.bookingUrl` (label "Book a scoping call"), falling back to `/contact`.

---

## 5.4 Site chrome
- **`app/(frontend)/layout.tsx`**: add `ThemeScript` in `<head>`, then `AnnouncementBar`, `SiteHeader`, `<main id="main">`, `SiteFooter`, a "Skip to content" link as the first focusable element, and, when draft mode is on, `LivePreviewListener` plus a fixed `DraftBanner` ("Preview · Exit" → `/next/exit-preview`).
- **`SiteHeader`** (server) + **`MobileNav`** (client):
  - Sticky at `top: env(safe-area-inset-top)`, `bg-paper/92` with backdrop blur and a `border-b` (use `color-mix` or a token-based bg with opacity).
  - Contents: `Logo`, the nav links from the `header` global (`text-muted hover:text-ink`, active route in ink with `aria-current="page"`), and the CTA button (`size="sm"`).
  - Below 860px, the links collapse into a "MENU" mono button that opens a full-height panel (Esc closes it, focus returns to the button, body scroll is locked, and the panel closes on route change).
- **`SiteFooter`**: the `footer` global. Logo and tagline, link columns, then the **dotted QBITLOG wordmark** (`BitField variant="wordmark"`, dynamic, `ssr:false`, with a static text fallback `font-mono` for no-JS), the caption, then the bottom row: © year, legal links, `ThemeToggle`.
- **`AnnouncementBar`**: only when enabled. A single mono line on `bg-ink text-paper`.
- **`LivePreviewListener`** (client): `RefreshRouteOnSave` from `@payloadcms/live-preview-react` with `serverURL={process.env.NEXT_PUBLIC_SITE_URL}` and `refresh={() => router.refresh()}`.

---

## 5.5 Routes

Each route needs `generateMetadata` using a shared `lib/seo.ts#buildMetadata(doc, path)` helper. Build it here in its basic form (title, description, canonical, OG image from `meta.image` → heroImage → siteSettings default); Phase 6 completes it.

### `/` (`app/(frontend)/page.tsx`)
`getPage("home")` → `<RenderBlocks blocks={page.layout} />`. If there's no published home, return 404 (in preview, the draft renders).
**Visual check:** compare it side by side with `reference/homepage-prototype.html` at 1440px, 820px and 390px widths.

### `/[...slug]` (generic CMS pages)
`getPage(slug.join("/"))`. Reserved slugs that must 404 here: `home`, `work`, `services`, `industries`, `insights`, `about`, `careers`, `contact`, `log`, `styleguide`, `next`, `admin`, `api`. (`/about` and `/contact` have their own route files, which read pages `about` and `contact`.)

### `/work` and `/work/[slug]`
- **Index:** `SectionHead` (label "LOG / WORK", title "Selected work, with the receipts"), industry filter chips as links (`?industry=healthcare`, `aria-current` on the active one), then a `FeatureCase` for the first item and a 2-column `CaseCard` grid for the rest. Empty state: "No case studies in this industry yet." with a link to all work.
- **Detail**, sections in this order (a section is skipped when its data is empty):
  1. `Breadcrumbs` (Work / Client)
  2. Hero: `LogLabel [industry, "<durationWeeks> weeks", "<teamSize> engineers", status==="prototype" ? "Prototype" : null]`, `Heading size="h1"` title, `Lede` summary, and a `ProofStrip` of featured metrics (with sources shown)
  3. `AnnotatedMedia variant="showcase" tilt` with `heroImage` + `heroAnnotations`
  4. "The challenge": `SectionHead` label "LOG / 01 CHALLENGE" + RichText `challenge`
  5. "Decision log": the `decisions[]` as `DecisionRecord`s, each with its title as an h3. **This is the key section.**
  6. "What we built": RichText `solution` + a `features[]` grid (2 columns, hairline dividers)
  7. Gallery: each item is `AnnotatedMedia variant="inline"`
  8. Results: `Metric` grid (all metrics, `accent`, with sources)
  9. `Quote` in an inverted `Section` (only if the testimonial is `approved`; in draft mode, show it with a "Not approved" `Pill`)
  10. Long-form `body` (RichText) under "The full story"
  11. Technologies: a mono comma-separated list (no logo wall)
  12. Related: 2 `CaseCard`s (the `related` field, or else same industry, or else latest)
  13. `CTABox` from the site defaults
  - `liveUrl`: a ghost button "View live product ↗" in the hero, only when `status === "live"`.

### `/services` and `/services/[slug]`
- **Index:** `SectionHead` + all `ServiceRow`s + `CTABox`.
- **Detail:**
  1. Hero (`LogLabel ["Service", category]`, h1 `outcomeHeadline`, lede `summary`, primary CTA to booking)
  2. "Problems we solve" (`problems[]` as a 2-column hairline grid)
  3. "How we run it" (`Steps` in an inverted section from `process[]`)
  4. "What you get" (`deliverables[]` as a mono checklist)
  5. Case studies (`CaseCard` ×≤3 from `caseStudies`, falling back to ones that reference this service)
  6. Industries (`IndustryTile`s)
  7. Technologies (mono list)
  8. `layout` blocks (the migrated legacy text lands here)
  9. FAQ
  10. CTA

### `/industries/[slug]`
Hero (`LogLabel ["Industry", title]`, h1 `headline`, lede `summary`), "What slows teams down" (`painPoints[]`), "Compliance we design for" (`compliance[]` as `Pill tone="muted"` items), case studies, services (`ServiceRow`), `layout` blocks, FAQ, CTA. There is no `/industries` index page: redirect `/industries` → the first industry by `order` (a `redirect()` in `app/(frontend)/industries/page.tsx`).

### `/insights` and `/insights/[slug]`
- **Index:** `SectionHead` (label "LOG / INSIGHTS"), category chips (`?category=`), `PostRow` list (12 per page, `?page=`), and `Pagination`. In a right column on desktop, a `LogStream` of the 6 latest log entries.
- **Detail:**
  - Layout: a main column (`measure`) plus a sticky right-hand TOC on ≥1100px.
  - Top: `Breadcrumbs`, `LogLabel [category, "<readingTime> min read", formatted date]`, `Heading h1`, `Lede` excerpt, and the author row (name(s) linking to `/about/team#slug`, with role)
  - Then the hero `Media` (`size="feature"`, priority), `RichText content`, share links (LinkedIn and X intent URLs, plus a "Copy link" button: a client component using `navigator.clipboard` with a fallback), an author card, 3 related posts (the `related` field, or else same category), and the CTA.
  - Dates are formatted `en-US` (`September 15, 2025`), and `<time dateTime>` is always set.

### `/about` and `/about/team`
- `/about` → `getPage("about")` blocks.
- `/about/team` → `SectionHead` + a `TeamCard` grid (leadership first, then others by `order`; only `showOnSite`). Each card gets an `id={slug}` anchor.

### `/careers` and `/careers/[slug]`
- **Index:** intro, a list of open jobs as `JobRow`s. Empty state: "No open roles right now. Send your CV to <siteSettings.contact.email>." (show the address as text).
- **Detail:** hero (`LogLabel [department, location, employmentType]`, h1, salary as a mono line if present), RichText description, then Responsibilities / Requirements / Benefits as mono-bulleted lists, and `ApplyForm` (§5.6). Closed job → the page still renders, with a "This role is closed" `Pill` and no form.

### `/contact`
`getPage("contact")` blocks. The `contactForm` block renders `ContactForm` (§5.6) next to the contact details from site settings: email (as text), the time-zone note, the booking link button, and "what happens next" rows (from the CTA details pattern).

### `/log`
`SectionHead` (label "LOG / STUDIO", title "What we've been doing"). Entries grouped by month (`<h2>` "September 2026" in mono), each group a `LogStream`. Show 50, then "Older entries" pagination.

### `/academyai/privacy-policy` and `/academyai/terms-and-conditions`
Restyle them with the new chrome: wrap the existing content in `Section` + `Prose`, and replace the old icon/hero markup with `LogLabel ["Academy AI","Legal"]` + `Heading h1`.
**Do not change a single word of legal text.** Verify with `git diff --word-diff` that only markup and class names changed. Keep their existing `metadata` exports.

### `app/(frontend)/not-found.tsx` and `error.tsx`
404: label "LOG / 404", "This entry doesn't exist.", links to Home, Work and Insights. `error.tsx` (client): "Something broke on our side." with a retry button, and no stack trace shown.

---

## 5.6 Forms (server actions)

Add `zod` for validation (the only new dependency in this phase).

### Contact form: `components/forms/ContactForm.tsx` (client) + `app/(frontend)/contact/actions.ts`
- **Fields:** name*, email*, company, role, budget (select), timeline (select), services (checkbox group from the service categories), message* (min 20 chars), consent* (checkbox: "I agree to Qbitlog storing my details to reply to this enquiry. [Privacy policy]"), plus the hidden fields `sourcePath` and `utm_*`, the `Honeypot`, and a hidden `startedAt` timestamp.
- **Client:** `useActionState(createLead, initialState)`, field-level errors from the server shown inline with `aria-invalid` and `aria-describedby`. While submitting, the button reads "Sending…". On success, replace the form with a `LogPanel`-style confirmation ("ENTRY #<short id> RECEIVED · We'll reply within one business day" — use the reply SLA from site settings, not a hardcoded promise).
- **UTM capture:** `components/forms/UtmCapture.tsx` (client, mounted in the layout) stores `utm_*` and `document.referrer` in `sessionStorage` on first landing (wrapped in try/catch). The form reads them into its hidden inputs.
- **Server action `createLead(prev, formData)`:**
  1. Reject silently (fake success) if the honeypot is filled or `Date.now() - startedAt < 3000`.
  2. If `TURNSTILE_SECRET_KEY` is set, verify the token with Cloudflare.
  3. Validate with zod: trim strings, email format, lengths (name ≤ 100, message ≤ 5000).
  4. `payload.create({ collection: "leads", data, overrideAccess: true })`. The Phase 3 hook sends the emails.
  5. Return `{ ok: true, id }` or `{ ok: false, errors }`. Never return raw exceptions.

### Job application: `components/forms/ApplyForm.tsx` + `app/(frontend)/careers/[slug]/actions.ts`
- **Fields:** name*, email*, phone, LinkedIn URL, portfolio URL, cover letter, résumé* (a file input accepting `.pdf,.doc,.docx`, max 5 MB), consent*, honeypot, startedAt, and hidden `jobId`.
- **Action:**
  - Validate as above, and check the file size and MIME type **on the server**.
  - Then `payload.create({ collection: "resumes", data: { alt: name }, file: { data: Buffer.from(await file.arrayBuffer()), mimetype: file.type, name: safeName, size: file.size }, overrideAccess: true })`, followed by `payload.create({ collection: "applications", data: { job, …, resume: resume.id }, overrideAccess: true })`.
  - The file name is sanitised as `slugify(name)-<timestamp>.<ext>`.
- **Success:** "Application received. We reply to every applicant within 10 working days." (from site settings, or omit the promise).

---

## 5.7 Preview and live preview checks
- The Phase 3 `/next/preview` route enables draft mode, and every query passes `draft: true`.
- Open a draft case study in `/admin`, then click Live Preview. Edits appear after autosave (≈375ms) with no manual refresh.
- The draft banner is visible, and exit preview works.

---

## 5.8 Acceptance criteria
- [ ] Every route in README §5 renders from Payload data. Empty optional fields hide their sections cleanly.
- [ ] The homepage matches the prototype at 1440, 820 and 390px (check the hero, bit field, log panel, ticker, tilted showcase with pins, case cards with real screenshots, inverted method section with rail, services, industries, insights + studio log, FAQ, CTA and footer wordmark).
- [ ] Draft preview and live preview work for pages, case studies, services, industries, posts and jobs.
- [ ] The contact form creates a lead, sends both emails, and shows the confirmation. Errors are announced to screen readers.
- [ ] The application form uploads a résumé (private: fetching `/api/resumes/file/<name>` logged out returns 403), creates the application and sends the email.
- [ ] The honeypot and too-fast submissions are rejected silently.
- [ ] The legal pages' text is unchanged (`git diff --word-diff` shows markup only).
- [ ] No page scrolls horizontally at 375px. Keyboard navigation works across the header, mobile nav, forms, FAQ and pins.
- [ ] `grep -rEn "#[0-9a-fA-F]{3,6}|dark:" app/\(frontend\) components --include=*.tsx` → only the `layout.tsx` `themeColor` lines.
- [ ] `npm run check` passes. In the `next build` output, the First Load JS for `/` is ≤ 150 kB.
- [ ] Commit: `redesign(phase-5): pages, templates, forms and live preview`.

## 5.9 Handoff notes
- **Caching.** Every route sets `revalidate = 3600`. Detail routes also set `generateStaticParams` and `dynamicParams = true`. A page that was prerendered while its content was a draft stays a 404 until it is revalidated. The `revalidate` hook handles this in production. Locally, run `seed:publish-drafts` **before** `npm run build`.
- **Revalidate targets.** `cms/hooks/revalidate.ts` accepts `string | [path, "page" | "layout"]`. Publishing `home` revalidates `["/", "layout"]`, because `DefaultCta` (`components/site/DefaultCta.tsx`) reuses the home page's first `cta` block as the closing CTA on every template. If that block is missing, it falls back to "Book a scoping call".
- **First Load JS.** Next 16 no longer prints First Load JS. Measure it with `node scripts/first-load-js.mjs <url> [--verbose]`, which sums gzip sizes of `/_next/static/*.js` and excludes `noModule` polyfills. Results: `/` **147.9 kB** and an insight **147.6 kB** (limit 150 kB).
- **Lazy client code.** In Turbopack, `next/dynamic` inside a server component does not split client code. `LazyContactForm` and `LazyLivePreview` are `"use client"` wrappers around `dynamic(..., { ssr: false })`. Use the same pattern for any heavy client island.
- **Attribution.** `ContactForm` reads UTM fields and the referrer from `sessionStorage` when the form is submitted, instead of in an effect (to satisfy React 19 lint). It does this inside a `submit(formData)` wrapper around the server action.
- **FAQs.** Questions prefixed `[REVIEW]` are hidden outside draft mode, both in `FaqBlock` and in the FAQPage JSON-LD. So the home FAQ currently shows 2 of its 4 questions, and the contact page's `engagement` FAQ is hidden until marketing approves those questions.
- **Academy AI legal pages.** These now use the shared layout, `Section`, `LogLabel` and `prose-log`. The pages' own header, footer, breadcrumb and badge were removed. `git diff --word-diff` shows class and markup changes only.
- **Copy in code.** Index pages (work, services, insights, careers, log) keep their `SectionHead` copy in code, as the spec's page tables prescribe. Privacy and terms are placeholder CMS drafts.
- **Verified locally** (production build on a second port, MongoDB, `EMAIL_DRY_RUN=true`):
  - Every route renders.
  - No horizontal scroll at 375px on 15 templates.
  - The mobile menu expands and moves focus to its first link.
  - Submitting the contact form created a lead and showed the confirmation panel.
  - The 404 page returns status 404 with `noindex`.
  - The hex/`dark:` grep is clean.
  - Media URLs are absolute (`NEXT_PUBLIC_SITE_URL`), so a local server on any port other than that URL shows broken images. In production this doesn't happen.
