# Content review list (marketing)

Everything below was imported or drafted by the seed scripts (`npm run seed`) and needs a human decision before launch.
Tick each item when done. "Where" is the path in `/admin`.

## Approvals

- [ ] **Testimonials: client approval for public use (3).** Quotes only appear on the site once `Approved` is ticked.
  Where: Studio → Testimonials → Dr. Rajesh Mehta (Batra Hospital), Ananya Sharma (HYTP), and the RestaurantOS testimonial.
- [ ] **Metrics: client approval for every number shown publicly.** Each case study's Proof tab lists value, unit, label and source.
  Where: Content → Case Studies (Work) → each study → Proof. Untick `Featured` on anything the client hasn't approved.
  Note: HYTP "2018 / Trusted Since" and RestaurantOS "1 / Unified Operations Platform" were imported with `Featured` off because they are not results.

## Claims that need confirming

These appear in the homepage prototype copy but are not backed by legacy data. They are only in **draft** content.

- [ ] "4+ hrs US / EU overlap" (home hero trust items; Site Settings → Contact → Time-zone note is left **empty** until confirmed)
- [ ] "GDPR-aware delivery" (home hero trust items; industry compliance lists)
- [ ] "Weekly written updates" / "a written update every Friday" (home hero, method step 3, FAQ)
- [ ] "Reply within one business day" (home CTA details, contact form confirmation; Site Settings → Contact → Reply time)
- [ ] The **0.80 confidence threshold** for pharmacist review (Batra Hospital; only in the prototype's illustrative Rx queue, not imported)
- [ ] All FAQ answers written for the prototype (see next section)

## FAQs prefixed `[REVIEW]`

- [ ] "[REVIEW] How do you work across US and European time zones?"
- [ ] "[REVIEW] Can you take over an existing codebase?"

Where: Studio → FAQs. Check the answer, then delete the `[REVIEW] ` prefix. Until then these FAQs are hidden on the live site (visible only in preview) and never appear in FAQ structured data.

## Company details

- [ ] Company email `hello@qbitlog.com` (Site Settings → Contact → Email)
- [ ] Founding date (Site Settings → Organization → Founding date; left empty on purpose, the old site's "2020" was unconfirmed)
- [ ] Social URLs: `https://linkedin.com/company/qbitlog`, `https://twitter.com/qbitlog` (Site Settings → Organization → Same as, and Socials)
- [ ] Booking link (Site Settings → Booking URL). Until it's set, every "Book a scoping call" button goes to `/contact`.

## Drafts to review and publish

- [ ] Industries (4 drafts): Healthcare, Hospitality & Restaurants, Travel & Senior Care, SaaS & Startups (Content → Industries)
- [ ] Home page (Content → Pages → Home). The site shows a 404 at `/` until Home is published.
- [ ] About page (Content → Pages → About)
- [ ] Contact page (Content → Pages → Contact)
- [ ] Case study decision logs: drafted from the source write-ups, saved as **draft versions** marked `[VERIFY]` (Content → Case Studies → Story → Decisions). Published versions are unaffected until you publish.

## Needs writing

- [ ] Qbitlog Privacy Policy (Content → Pages → Privacy, placeholder draft). Include the data-retention periods: leads 24 months, applications and résumés 12 months.
- [ ] Qbitlog Terms (Content → Pages → Terms, placeholder draft)

## Phase 8: recommended case-study corrections

These come from `content/drafts/phase-8/case-studies.json`. The seed step **does not** apply them — an editor must decide and publish. See also `content/drafts/phase-8/REVIEW.md`.

### Batra Hospital (`medical-prescription-ocr`)
- **Recommended status:** `prototype`
- **Recommended title:** `[VERIFY] Reading handwritten prescriptions with AI: a working prototype`
- **Recommended summary:** `[VERIFY] A prototype that turns photos of handwritten prescriptions into structured, validated medication records, with every uncertain result routed to a pharmacist.`
- **Recommended metrics** (all with prototype/demo sources):
  - 98–99% medicine-name extraction in demo testing
  - 97–98% dosage extraction in demo testing
  - ~8.5 s end-to-end processing per prescription (demo)
  - 253,973+ medicine records in the validation knowledge base
- **Metrics to remove:**
  - `80%` / Less Manual Data Entry — not in the source document; no measurement exists
  - `3-5s` / Average Processing Time — source timing breakdown totals ~8.5 s; 3–5 s was a target

### RestaurantOS (`restaurant-os`)
- **Recommended status:** `prototype`
- **Recommended title:** `[VERIFY] RestaurantOS: one interface for a restaurant's whole day`
- **Recommended summary:** `[VERIFY] A front-end prototype that brings menu, orders, tables, inventory and reports into one dashboard designed for staff on desktops, tablets and phones.`
- **Recommended metrics:** 8 working screens; 20+ reusable UI components; 6 order statuses in one consistent workflow (all sourced as prototype)
- **Metrics to remove:**
  - `60%` / Reduced Manual Administrative Tasks — not in the source; front-end only, no operational measurement
  - `24/7` / Business Monitoring — real-time updates and a backend are listed under Future Enhancements
  - `100%` / Real-Time Operational Visibility — same as above

### Hire Your Travel Partner (`hire-your-travel-partner`)
- **Recommended status:** `[VERIFY] live or prototype?`
- **Metrics to remove:**
  - `98%` / Customer Satisfaction — HYTP's business metric since 2018, not a Qbitlog result
  - `2018` / Trusted Since — the client's founding year, not a result
- **Note:** The source document is written from HYTP's public About page and does not describe what Qbitlog built. Do not publish new detail until the team confirms scope.
- **Questions for the team:**
  1. What exactly did Qbitlog build for HYTP (web app, admin, mobile app, integrations), and is it live?
  2. Which technologies did we actually use?
  3. Did we build the companion vetting workflow, the itinerary tools and the WhatsApp Business integration, or were those existing HYTP processes?
  4. What did we measure before and after launch?
  5. Does HYTP approve being named, the testimonial, and the screenshots?

### Phase 8 drafts to review (after `npm run seed -- --only=16`)
- [ ] Services: problems / process / deliverables / typical projects (draft versions; Content → Services)
- [ ] Case studies: platforms, timeline, before/after, team roles, lessons (draft versions; do **not** publish recommended status/metrics until decided above)
- [ ] Settings → Services Page / Work Page: enable each section after review
- [ ] Studio → FAQs: five new `[REVIEW]` engagement/pricing questions

## Images

- [ ] Freepik images on the 6 insights: replace with real diagrams or screenshots, or keep them with the "Image: Freepik" credit (Media → filter by credit)
- [ ] Team photos: none yet. Cards show a monogram until a photo is uploaded (Studio → Team → Photo)
