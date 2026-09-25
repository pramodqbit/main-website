# Phase 9: Story layer and motion (as built)

> Read `docs/redesign/README.md` first.
> **Status: implemented.** This file documents how the story layer works so agents can maintain and extend it.
> **Why it exists:** the design was right but the site "had no feeling". This phase adds an opening moment, a founding story, a narrator and a consistent "things get written" motion across every page, without changing the design.
> **Visual reference:** `docs/redesign/reference/homepage-prototype.html` (open it in a browser; the footer has "Replay intro ↺").

---

## 9.1 What visitors experience

| Piece | Where | Behaviour |
|---|---|---|
| **Opening intro** ("the first entry") | Home (`/`) only, first visit per browser session | Lines type out on a blank page (≈32ms per character), then the letters break into dots that fly into the hero's bit field; the field flashes, the headline writes in, the log rows play. ≈8s. **Skip:** button, scroll, key or touch. |
| **Manifesto** ("Why we exist") | Any page with the `manifesto` block (home: after the hero) | Large serif lines fill in word by word as you scroll; the last few words glow violet like a pen; beside it a 9×16 dot block fills row by row and blinks when complete. |
| **Narrator** | Every page with ≥ 3 chapters | Small fixed panel, bottom-right, after the first screen: `ENTRY 00N` + chapter name + a 12×12 bit shape that morphs per chapter (screen, branch, clusters, lines, people, cursor, square) + progress bar. |
| **Headlines write in** | Every `Heading` of size display / h1 / h2 | Word by word: each word rises, un-blurs and darkens (80ms stagger). |
| **Content reveals** | Every page | Section label → headline → intro/“more” link → content rises in, siblings staggered 70–150ms. |
| **Decision plays out** | Every `DecisionRecord` (case studies, service pages, blocks) | Rejected options are crossed out one by one, then the chosen option lights up with “✓ CHOSEN”. |
| **Pins A → B → C** | Every `AnnotatedMedia` with annotations | Pins pop in one after another. |
| **Hero bit field** | `heroLog` | Calm: one quick sweep every 25s (first after 9s); cursor still flips bits. |
| **Footer wordmark** | Site footer | Dots fly together into QBITLOG the first time it scrolls into view; one sweep every 28s. |
| **Smooth scrolling** | Site-wide | Lenis (`lerp 0.085`); same-page anchors glide; paused during the intro. |

**Never animated:** anything for visitors with *reduced motion* on (everything shows at once, no intro, no smooth scroll), draft/live-preview sessions (editors see content immediately), and visitors without JavaScript.

---

## 9.2 Architecture

```
components/motion/
  MotionScript.tsx     inline <head> script, runs before first paint:
                       html.rv  → reveals active   (skipped for reduced motion and when <html data-draft>)
                       html.qb-intro → intro on "/" if not seen this session (sessionStorage "qb-intro")
                       6s safety net: if MotionRuntime never starts, removes both classes (everything shows)
  MotionRuntime.tsx    client, in layout: scans [data-reveal], staggers siblings (--rv-d), adds .rv-in on scroll
                       into view, .rv-done after the transition (returns hover transitions). Re-scans per route.
                       Waits for the intro to finish. Clears a stale qb-intro if a page has no intro overlay.
  SmoothScroll.tsx     client, in layout: Lenis instance, anchor handling, stop/start around the intro.
  Narrator.tsx         client, in layout: chapters = every `#main [data-chapter]`; shape chosen from the label.
  IntroLog.tsx         client, rendered by HeroLogBlock: typing + dot dissolve; dispatches qb:bits-burst and qb:intro-done.
  ManifestoMotion.tsx  client, wraps the manifesto: scroll progress → .mw.lit/.edge + cursor dot block.
  BitField.tsx         canvas field/wordmark: sweep interval, wordmark assemble, listens for qb:bits-burst.
  events.ts            INTRO_DONE, BITS_BURST, afterIntro()
app/(frontend)/globals.css   "Story layer" section: all hidden/visible states, keyed on html.rv / html.qb-intro.
```

The layout sets `data-draft` on `<html>` in draft mode. All state styles live in CSS; components only carry attributes.

## 9.3 How to animate something new (the only API)

Add attributes; don't write animation code in pages.

| Attribute | Effect |
|---|---|
| `data-reveal="up"` | Starts transparent and 34px lower; rises in when scrolled into view. |
| `data-reveal="fade"` | Same, opacity only (use for tables, big frames, wrappers). |
| `data-reveal-delay={ms}` | Extra delay (e.g. intro text 260, “more” link 420, hero buttons 600). |
| `data-reveal-stagger={ms}` | Delay step between siblings under the same parent (default 110, capped at 6 steps). |
| `data-reveal="words"` | Added automatically by `Heading` (display/h1/h2, string children). Opt out with `reveal={false}`. |
| `data-reveal="decision"` / `"pins"` | Added automatically by `DecisionRecord` / `AnnotatedMedia`. |
| `data-chapter="LOG / WORK"` | Names a chapter for the narrator. `SectionHead` labels, the FAQ label, showcase and manifesto labels already set it. The `LOG /` / `ENTRY 001 /` prefix is stripped for display. |

Rules:
- **Never** put `data-reveal` on the LCP element or on `priority` images (it would delay LCP). `CaseCard` skips it when `priority`.
- Don't nest `up` inside `up` unless intended (the child waits for its own scroll trigger).
- Server Components only need the attributes. No `"use client"`.

Components that already reveal: `SectionHead` (label/intro/more), `Heading`, `Lede`, `Prose`, `CaseCard`, `FeatureCase`, `ServiceRow`, `IndustryTile`, `PostRow`, `JobRow`, `TeamCard`, `Quote`, `LogStream`, `CTABox` (box, body, button, details), `FAQList` items, `ProofStrip` items, `Steps` steps, `AnnotatedMedia` notes + pins, `DecisionRecord`, `EngagementCard`, `LessonGrid`, `BeforeAfterTable` rows, `FactsPanel`, `PrevNext`, `TypicalProjectRow`, `TechByCategory`, `CapabilityTable`, `HairlineGrid`, `FilterChips`, `Pagination`, footer columns; plus page-level heroes and lists in `services/[slug]`, `work/[slug]`, `insights/[slug]`, `careers/[slug]`, `industries/[slug]` and the blocks `ShowcaseBlock`, `MetricsBlock`, `LogoWallBlock`, `RemoteWorkingBlock`, `WriteupExplainerBlock`, `ContactFormBlock`.

## 9.4 CMS (editor-facing)

- **Hero (log panel) → Opening intro (home page only):** `enabled` + up to 5 lines (`label` in violet mono, `text` typed, ≤ 70 chars). Hero blocks saved before this field existed use the defaults in `cms/blocks/heroIntroDefaults.ts`.
- **New block “Manifesto (why we exist)”** (`cms/blocks/Manifesto.ts`): `label`, 1–6 `lines` (`*asterisks*` = violet italic), `signature`.
- Seed step `17` (`npm run seed -- --only=17`) adds the manifesto to the home page **as a draft**. Publish it in `/admin` → Pages → Home after review.

## 9.5 Testing

- `tests/motion.spec.ts` (Playwright project `motion`): the intro plays, skips and doesn't replay in the session; on `/`, `/services`, `/work`, `/insights` and `/about` every revealed block arrives with no page errors; reduced motion shows everything with no intro and no smooth scroll.
- All other suites (project `chromium`) run with **reduced motion**, so functional, SEO and a11y results don't depend on animation timing.
- Run: `npx playwright test --project=motion`.

## 9.6 Content to confirm (added to the review list)

- Intro line **“SHIPPED · Academy AI, our own product.”**: confirm Academy AI is live and can be described as Qbitlog's own product.
- Manifesto line **“Deadlines paid for by tired teams.”**: the boldest line, so confirm the founders are happy with the tone.
- Founding year **2025** (given by the product owner).

## 9.7 Known issues found while testing (not caused by this phase)

- `tests/a11y.spec.ts` (light theme): colour contrast on the small amber **Prototype** pill (`Pill tone="signal"`, 10.5px) on case-study pages. Fix: use `tone="brand"`/`muted` for small pills, or raise the size to ≥ 12px bold.
- `tests/smoke.spec.ts` “disabled services/work sections stay off”: fails on databases where `npm run seed:enable-phase8-sections` has been run (expected).

## 9.8 Budget

The story layer adds ≈ 12–15 kB gzipped of client JS site-wide (Lenis ≈ 5 kB, runtime + narrator + smooth scroll ≈ 6 kB); the intro (≈ 3 kB) and manifesto (≈ 1.5 kB) only load on pages that use them. Re-check First Load JS with `npm run analyze`; the Phase 6 budget of ≤ 150 kB per route still applies.
