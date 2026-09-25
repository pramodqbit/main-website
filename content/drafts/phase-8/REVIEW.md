# Phase 8 drafts: review before publishing

These files hold **draft** content for the deeper Services and Work pages. The Phase 8 seed step imports them as draft versions (case studies, services) or with `enabled: false` (index-page sections), so **nothing goes live until an editor publishes it.**

| File | What's in it |
|---|---|
| `services.json` | Problems, process, deliverables and typical projects for all 5 services |
| `case-studies.json` | Timeline, before/after, team roles, lessons and platforms per case study, plus recommended fixes to metrics and status |
| `index-pages.json` | `/services` and `/work` hero text and new sections (engagement models, working across time zones, capability matrix, write-up explainer, testimonials, recently shipped), plus 5 engagement FAQs |

Anything starting with `[VERIFY]` or `[REVIEW]` is a fact or promise the team must confirm. Delete the prefix once it's true. If it isn't true, change or delete the text.

---

## ⚠️ Read first: the source documents contradict the live case studies

While drafting from `content/legacy/docs/`, we found that several claims published on the site are **not supported by, or contradicted by, the project's own documentation**. For US and EU buyers this is a real risk. Invented or unverifiable results and testimonials damage trust when they're found out, and the US FTC's 2024 rule on fake reviews and testimonials allows penalties for fabricated or misrepresented endorsements. Please decide on each item below **before** publishing anything else.

### Batra Hospital / prescription OCR (`medical-prescription-ocr`)
The source (`BATRA_PROJECT_CASE_STUDY.md`) says:
> "This is a **prototype/demo product** … All data … is **synthetic demo data** … **NOT intended for production medical use**."

- [ ] **Status.** The site presents it as a hospital deployment ("We helped a healthcare provider reduce manual prescription processing"). Recommended: set status to **Prototype** and reword the title and summary (drafts provided).
- [ ] **"80% less manual data entry"** does not appear anywhere in the source. Remove it unless there's a measurement.
- [ ] **"3–5s processing"** conflicts with the document's own timing breakdown, which totals **~8.5 s**. 3–5 s was a target. Use "~8.5 s (demo)".
- [ ] **"99% extraction accuracy"** was measured in demo testing on synthetic data. Keep it only with that label (drafts provided: 98–99% medicine names, 97–98% dosages).
- [ ] **Client name.** Confirm that Batra Hospital commissioned this and has agreed to be named.
- [ ] **Testimonial ("Dr. Rajesh Mehta, Pharmacy Lead").** Confirm this is a real person who said this about a real deployment. If the product was a prototype on synthetic data, a quote about "time our pharmacists got back" can't be accurate. It stays hidden until `Approved` is ticked.

### RestaurantOS (`restaurant-os`)
The source (`RestaurantOS_CASE_STUDY.md`) describes a **"Frontend Web Application (Single Page Application)"**, and lists backend integration, real-time updates and authentication under *Future Enhancements*.

- [ ] **"60% fewer manual admin tasks", "24/7 monitoring" and "100% real-time visibility"** can't have been measured without a backend or real users. Remove them (replacement metrics are drafted).
- [ ] **Status.** Recommended: **Prototype**.
- [ ] **Testimonial ("Michael Anderson, Restaurant Operations Manager").** Confirm the person and the deployment, or delete it.
- [ ] **"Servos" branding** in the screenshots: was this built for a client called Servos, or is it a concept brand? The case study should say which.

### Hire Your Travel Partner (`hire-your-travel-partner`)
The source (`Hire-Your-Travel-Partner.md`) is written from HYTP's public About page and says the tech stack is "*likely*" React or WordPress. It **doesn't say what Qbitlog built.**

- [ ] **"98% customer satisfaction"** is HYTP's business metric since 2018, not a result of Qbitlog's work. Don't show it as Qbitlog proof unless the client approves and the label says so.
- [ ] **The Phase 7 decision-log drafts for HYTP** (vetting, itinerary engine, WhatsApp) are based on HYTP's operating model, not on confirmed engineering work. Keep them unpublished until the team answers the questions in `case-studies.json → questionsForTheTeam`.
- [ ] **Testimonial ("Ananya Sharma")**: same check as above.

### Homepage
The homepage hero log, results strip and showcase use the Batra, RestaurantOS and HYTP numbers above. Update them once the case studies are corrected: Home page → heroLog, proofStrip and showcase annotations.

> **The upside:** honest prototype write-ups with real engineering decisions (the Batra pipeline is genuinely strong) are more convincing to technical buyers than round-number claims. Label them clearly and let the decision logs do the selling. Then prioritise getting one **live client project** written up with measured, approved results.

---

## Review checklist

### Services (Content → Services → each service → draft version)
- [ ] AI & Machine Learning: problems, process, deliverables, typical projects
- [ ] Web Development
- [ ] Mobile App Development
- [ ] Product & UX Design
- [ ] Cloud & DevOps
- [ ] Typical project durations (all `[VERIFY]`)

### Case studies (Content → Case Studies → Story/Proof tabs → draft version)
- [ ] Batra: new title/summary/status, replace metrics, timeline, before/after, team roles, lessons
- [ ] RestaurantOS: status, metrics, lessons
- [ ] HYTP: answer the questions first

### `/services` and `/work` (Settings → Services Page / Work Page)
- [ ] Engagement models: durations, team sizes, pricing terms, notice period
- [ ] Working across time zones: every item is `[VERIFY]` (overlap hours, Friday update, demos, tools, IP, NDA, DPA)
- [ ] Tick `enabled` on each section once reviewed

### FAQs (Studio → FAQs)
- [ ] 5 new `[REVIEW]` FAQs on pricing and engagement
