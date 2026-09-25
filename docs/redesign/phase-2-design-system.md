# Phase 2: Design system (`components/ds`, `components/motion`, `/styleguide`)

> Read `docs/redesign/README.md` first. Phase 1 must be complete.
> **Goal:** build every visual building block of "The Engineering Log" as typed, presentation-only React components, and show them all on `/styleguide`. Phase 5 builds pages **only** from these components.
> **Estimated time:** 3–4 days. **Depends on:** Phase 1. It can run in parallel with Phase 3.

**Visual source of truth:** open `docs/redesign/reference/homepage-prototype.html` in a browser. Match its spacing, type and behaviour. Its CSS is a working reference for every component below; port it to Tailwind token classes and don't invent new styles.

---

## 2.1 Rules for this phase
- Components are **presentation only**. They take plain props (strings, numbers, `ReactNode`, simple objects) and never import Payload or fetch data.
- Style with Tailwind token classes only (`bg-paper`, `text-muted`, `border-line`, `font-mono`, `text-label`…). No hex colours, and no arbitrary colour values like `bg-[#…]`. Arbitrary *sizes* such as `grid-cols-[200px_1fr_auto]` are fine.
- Server Components by default. Only files in `components/motion/` and interactive controls use `"use client"`.
- Every component gets a named export, a `Props` type and a short JSDoc comment. One component per file, with a barrel file `components/ds/index.ts`.
- Use `cn()` from `@/lib/utils` to merge `className`.
- Square corners: use only `rounded-none`, `rounded-xs`, or `rounded-full` (pins and dots only).
- Accessibility: visible focus states come from the global `:focus-visible` rule. Interactive elements are real `<a>`/`<button>` elements. Colour contrast must reach AA.

---

## 2.2 Additions to `app/(frontend)/globals.css`

Append these keyframes and helpers:
```css
@keyframes blink { 50% { opacity: 0; } }
@keyframes pulse-dot { 50% { opacity: .3; } }
@keyframes ring { from { transform: scale(1); opacity: .8; } to { transform: scale(2.1); opacity: 0; } }
@keyframes ticker { to { transform: translateX(-50%); } }
@keyframes row-in { from { background: var(--brand-soft); } to { background: transparent; } }

@utility animate-blink { animation: blink 1.1s steps(1) infinite; }
@utility animate-pulse-dot { animation: pulse-dot 2s infinite; }
@utility animate-ring { animation: ring 2.4s ease-out infinite; }
@utility animate-ticker { animation: ticker var(--ticker-duration, 70s) linear infinite; }
@utility animate-row-in { animation: row-in .6s ease-out both; }
```
Add a `.prose-log` variant for rich text (articles, legal, case-study bodies) using `@tailwindcss/typography`, with its colours mapped to tokens:
```css
@utility prose-log {
  --tw-prose-body: var(--ink);
  --tw-prose-headings: var(--ink);
  --tw-prose-links: var(--brand);
  --tw-prose-bold: var(--ink);
  --tw-prose-counters: var(--muted);
  --tw-prose-bullets: var(--muted);
  --tw-prose-hr: var(--line);
  --tw-prose-quotes: var(--ink);
  --tw-prose-quote-borders: var(--brand);
  --tw-prose-captions: var(--muted);
  --tw-prose-code: var(--ink);
  --tw-prose-pre-code: var(--inv-ink);
  --tw-prose-pre-bg: var(--inv-bg);
  --tw-prose-th-borders: var(--line);
  --tw-prose-td-borders: var(--line);
}
```
Use it together with `prose` and `max-w-[68ch]`. Headings inside prose use `font-serif`, and `code` uses `font-mono`.

---

## 2.3 Component specs: `components/ds/`

Class strings are guidance. Match the prototype exactly.

### Layout
| Component | Props | Spec |
|---|---|---|
| `Section` | `id?`, `tone?: "paper" \| "surface" \| "inverted"`, `bordered?: boolean = true`, `className?`, `children` | `<section>` with `py-24 max-md:py-16`, and `border-b border-line` when `bordered`. `inverted` → `bg-inv-bg text-inv-ink`; child components must read an `inverted` context (use a React context `ToneContext`) to switch muted/brand to the `inv-*` tokens. The inner `<div className="wrap">` is included. |
| `SectionHead` | `label` (e.g. `"LOG / WORK"`), `title`, `emphasis?`, `intro?`, `more?: {href,label}` | Grid `grid-cols-[200px_1fr_auto] gap-8 items-end mb-12`, stacked below `md`. The label is `font-mono text-sm text-brand`. The title is `Heading size="h2"`. The intro is `text-muted text-[17px] measure mt-3.5`. The more link is `font-mono text-sm text-brand` with an arrow. |
| `Stack`, `Cluster` | `gap`, `as` | Small flex helpers (column / wrapping row). |

### Typography
| Component | Props | Spec |
|---|---|---|
| `Heading` | `as?: "h1".."h4"`, `size: "display" \| "h1" \| "h2" \| "h3" \| "h4"`, `emphasis?: string`, `children` | Font sizes: display `text-[clamp(48px,7.6vw,116px)] leading-[.98] tracking-[-0.03em]`; h1 `clamp(40px,5.6vw,84px)`; h2 `clamp(32px,4vw,49px) leading-[1.05]`; h3 `text-2xl`/`28px`; h4 `text-xl`. `emphasis` is appended after the children as `<em className="italic text-brand">` (use `text-inv-brand` in the inverted tone). Serif, weight 400. |
| `Lede` | `children` | `text-lg text-muted measure`. |
| `LogLabel` | `items: string[]`, `className?` | `inline-flex items-center gap-2.5 font-mono text-label uppercase text-muted`. Starts with an 8×8 `bg-brand` square. Items are separated by `/` in `text-line`. Example: `["Case study","Healthcare","10 weeks"]`. |
| `MonoLabel` | `children`, `tone?: "muted" \| "ink" \| "brand"` | `font-mono text-label uppercase tracking-[.08em]`. |

### Actions
| Component | Props | Spec |
|---|---|---|
| `Button` | `href?`, `onClick?`, `type?`, `variant: "primary" \| "ghost"`, `size?: "md" \| "sm"`, `arrow?: boolean`, `children` | Use `class-variance-authority`. Primary: `bg-ink text-paper border border-ink hover:bg-brand hover:border-brand hover:text-on-brand`. Ghost: `bg-transparent text-ink border border-ink` with the same hover. Padding `px-[18px] py-3`, `text-[15px] font-medium`, square corners. The arrow is `→` in `font-mono`. Renders `next/link` when `href` is internal, and `<a target="_blank" rel="noopener">` when it's external. |
| `TextLink` | `href`, `children`, `arrow?` | `text-brand underline-offset-[3px] hover:underline`. |

### Data and proof
| Component | Props | Spec |
|---|---|---|
| `Metric` | `value: string`, `unit?: string`, `label: string`, `source: string`, `size?: "lg" \| "md" \| "sm"`, `accent?: boolean`, `countUp?: boolean` | The value is `font-mono tabular tracking-[-0.03em]` (lg `clamp(30px,3.4vw,44px)`, md `26px`, sm `22px`). The unit is `text-[.5em] text-muted`. With `accent`, the value is `text-signal`. The label is `text-sm`. The source is `font-mono text-[11px] text-muted uppercase tracking-[.05em]`. **`source` is required.** With `countUp`, wrap the numeric part of the value in `<CountUp>` (motion). |
| `ProofStrip` | `items: MetricProps[]` (2–4) | A `grid-cols-4` row with `border-y` and `border-r` dividers, 2 columns below `md` and 1 below 480px. The background is `bg-paper`. Uses `Metric size="lg" countUp`. |
| `DecisionRecord` | `problem`, `options: {label, chosen?: boolean}[]`, `decision`, `why` | A `<dl>` grid `grid-cols-[96px_1fr]`. `dt` is a mono label, and each row has `border-b border-line py-2.5`. Rejected options are `line-through text-muted`; the chosen one is plain. The decision text is `font-semibold`. |
| `Pill` | `tone: "ok" \| "signal" \| "brand" \| "muted"`, `children` | `font-mono text-[10.5px] px-1.5 py-0.5 border border-current tracking-[.04em]`, coloured by tone. |
| `Quote` | `quote`, `name`, `role?`, `company?` | Serif `text-[clamp(24px,2.8vw,34px)] leading-[1.3]`, with curly quotes in brand colour. The citation is a mono uppercase `text-label text-muted`. |

### Log motifs
| Component | Props | Spec |
|---|---|---|
| `LogPanel` | `title: string`, `status?: {label, tone:"ok" \| "brand"}`, `rows: {marker: string; phase: string; text: ReactNode; measured?: boolean}[]`, `footer?: {left: string; link?: {href,label}}`, `animate?: boolean` | Copy the prototype `.log`: a surface panel with a hairline border and a soft shadow. The header has the title in mono ink and a status dot that pulses (`animate-pulse-dot`). Rows use grid `52px 76px minmax(230px,1fr)` with a dashed bottom border. The phase text is mono 11.5px, in `text-signal` when `measured`. `text` uses the sans font, with `<b>` inside styled `font-mono text-signal`. The last row ends with a blinking caret (`animate-blink`). With `animate`, row *i* gets `animate-row-in` and `style={{animationDelay: 250 + i*420 + "ms"}}`. The panel scrolls horizontally inside `overflow-x-auto` below 420px, and the page never scrolls sideways. |
| `LogStream` | `entries: {date: string; type: string; text: string; href?: string}[]`, `title?`, `note?` | The prototype's `.stream`: a surface box with a header row, and entries in grid `56px 74px 1fr`. |
| `Ticker` | `items: {type: string; subject: string; text: string; highlight?: string}[]`, `duration?: number` (seconds, default 70) | A CSS-only marquee. Render the items **twice** in a `flex w-max animate-ticker` track, with `hover:[animation-play-state:paused]` on the wrapper. Each item is mono 12.5px `px-[30px] py-[15px] border-r border-dashed`: `type` in brand, `subject` in ink, `highlight` in signal. Add `aria-label` on the wrapper and `aria-hidden` on the duplicated half. |
| `AnnotatedMedia` | `image: {src, width, height, alt}`, `chromeLabel?: string`, `annotations: {x: number; y: number; title: string; note?: string}[]` (x/y are 0–100 %), `variant?: "showcase" \| "inline"`, `tilt?: boolean`, `priority?: boolean` | A browser-chrome frame (three dots plus a mono URL label) wrapping `next/image` with `sizes="100vw"`. Pins are lettered A, B, C… and absolutely positioned at `left:x% top:y%`, `-translate-1/2`. They are 30px brand circles with a white ring and a pulsing `::after` ring (`animate-ring`). Each pin is a `<button>` with `aria-describedby` pointing at its note. The notes list is rendered below as a 3-column grid (1 column on mobile): pin letter, title, and note in italic serif muted. `variant="showcase"` adds `shadow-frame` and `max-w-[1400px] mx-auto`. With `tilt`, wrap the frame in `<TiltFrame>`. |
| `Pin` | `letter`, `size?` | Reused by the component above. |

### Cards and rows
| Component | Props | Spec |
|---|---|---|
| `FeatureCase` | `href`, `labels: string[]`, `title`, `summary`, `metrics: MetricProps[]` (3), `visual: ReactNode` | The prototype's `.feature`: a 2-column bordered surface card (text | dot-grid visual), stacked below 900px. The hover border is ink. Metrics are `Metric size="md" accent`, with no source line (the source shows on the detail page) but a visually hidden source for screen readers. |
| `CaseCard` | `href`, `industry`, `meta` (e.g. "14 wks · 5 eng"), `client`, `title`, `summary`, `image?`, `metrics: [MetricProps, MetricProps]` | The prototype's `.case`: an optional 16:9 image (`object-cover object-left-top`, scaling to 1.04 on hover over .8s), then a top meta row, a middle (client label, serif title `text-[26px]`, muted summary), and a bottom row with 2 amber metrics. The whole card is a link. |
| `ServiceRow` | `href`, `category`, `title`, `summary` | Grid `200px 1.1fr 1fr 32px`, `border-b`. On hover: `bg-surface` and `px-4`, with a transition. The arrow is in brand. It stacks on mobile. |
| `IndustryTile` | `href`, `label`, `title`, `summary`, `footLabel` | Tiles in a 1px-gap grid on `bg-line`, `min-h-[190px]`. |
| `PostRow` | `href`, `date` (ISO), `category`, `title` | Grid `110px 1fr`. The date and category are mono, and the serif title turns brand on hover. |
| `TeamCard` | `name`, `role`, `photo?`, `bio?`, `links?` | A square photo (grayscale, colour on hover), mono role label and serif name. If there is no photo, show a fallback monogram on `dotgrid`. |
| `JobRow` | `href`, `title`, `department`, `location`, `type` | The same row pattern as `ServiceRow`. |
| `CTABox` | `label`, `title`, `emphasis?`, `body`, `button: {href,label}`, `details?: {label, value}[]` | The prototype's `.cta-box`: `border-ink` and a 2-column layout (pitch | details list with dashed rows). |
| `Steps` | `steps: {name, description, deliverable}[]`, `tone` | A 4-column grid with `border-t` and a rail element at the top. The step number is a mono label ("PHASE 1") in brand, the name is a serif `text-[28px]`, the description is muted, and "You get" is a mono block with a dashed top border. Wrap it in `<StepsRail>` (motion) for the scroll progress. |
| `FAQList` | `items: {question, answer: ReactNode}[]`, `defaultOpen?: number` | Native `<details>/<summary>` (no JS). The question is serif `text-[23px]`, and a `+`/`−` marker sits in mono brand on the right. The answer is muted `measure pb-6`. |

### Forms
| Component | Spec |
|---|---|
| `FormField` | `label`, `htmlFor`, `hint?`, `error?`, `required?`, `children`. The label is a mono uppercase `text-label`, the error is `text-danger text-sm` with `role="alert"`. |
| `Input`, `Textarea`, `Select`, `Checkbox`, `FileInput` | Native elements: `bg-surface border border-line focus:border-ink px-3.5 py-3 text-base w-full rounded-none`. On invalid (`aria-invalid="true"`): `border-danger`. Checkboxes use `accent-color: var(--brand)`. The file input shows the selected file name in mono. |
| `Honeypot` | A visually hidden `<input name="company_website" tabIndex={-1} autoComplete="off">` for spam traps. |

### Misc
| Component | Spec |
|---|---|
| `Prose` | `<div className="prose prose-log max-w-[68ch]">{children}</div>` |
| `Breadcrumbs` | `items: {href?, label}[]`. A mono `text-label`, separated by `/`, with JSON-LD emitted in Phase 6. |
| `Pagination` | `page`, `totalPages`, `basePath`. Previous/next buttons plus a mono "PAGE 2 / 5". |
| `Logo` | The 12×12 brand square plus "QBITLOG" in `font-mono font-medium tracking-[.04em]`, as a link to `/`. |
| `ThemeToggle` ("use client") | Cycles system → light → dark. It sets `document.documentElement.dataset.theme` and stores the choice in `localStorage` (wrapped in try/catch). Also export `ThemeScript`, an inline `<script>` placed in `<head>` that applies the stored theme before paint to avoid a flash. |
| `VisuallyHidden` | An `sr-only` helper. |

---

## 2.4 Motion: `components/motion/` (all `"use client"`)

The total client JS for this folder should be **≤ 6 KB gzipped**. Use no libraries.

### `useReducedMotion.ts`
Returns `true` when `matchMedia('(prefers-reduced-motion: reduce)')` matches, and subscribes to changes. Implement it with `useSyncExternalStore`.

### `useInView.ts`
`useInView(ref, { threshold = 0.2, once = true })` → a boolean, using `IntersectionObserver`.

### `CountUp.tsx`
Props: `value: string` (e.g. `"99"`, `"3–5s"`, `"24/7"`, `"253K+"`).
- Render the **final value** on the server (so there is no layout shift and screen readers get the real value).
- If the value starts with a pure integer (`/^\d+/`), animate only that integer from 0 to the target over 1400ms with easing `1-(1-k)^3` once in view (threshold 0.6). Otherwise, don't animate.
- Skip the animation when reduced motion is on.
- Set `aria-label={value}` on the wrapper and `aria-hidden` on the animated span.

### `TiltFrame.tsx`
Wraps children in a `perspective:1800px` stage. On scroll (throttled with rAF, passive listener) compute `p = clamp((vh - rect.top) / (vh*0.8), 0, 1)` and `e = 1-(1-p)^2`, then set `transform: rotateX(${(1-e)*24}deg) scale(${0.88 + 0.12*e})` with `transform-origin: 50% 0`. Use `will-change: transform` only while the frame is in view. With reduced motion, apply no transform. The server render has no transform, so the resting state is flat.

### `StepsRail.tsx`
Wraps `Steps`. It adds the class `tracking` (steps not yet reached get `opacity: .38`) and fills the 2px rail `scaleX(q)` where `q = clamp((vh*0.8 - top) / (height*0.9 + vh*0.2), 0, 1)`. Step *i* gets `data-on` when `q > i/n + 0.01 || q > 0.97`. With reduced motion, render everything fully visible with the rail full.

### `BitField.tsx`: the signature interaction
Props: `variant: "field" | "wordmark"`, `text?: string` (wordmark only, default `"QBITLOG"`), `className?`, `ariaLabel?`.

Port the algorithm from the prototype (`reference/homepage-prototype.html`, search for `function BitField`) into a React component:
- A `<canvas>` sized to its parent through `ResizeObserver`, with DPR capped at 2.
- **Points:** a grid with gap `field: W<600 ? 18 : 22` or `wordmark: max(5, round(W/190))`. For the wordmark, draw `text` on an offscreen canvas in `600 weight Geist` at height `W*0.2`, scaled to fit 99.5% of the width, and keep only the grid points where the text alpha is above 128.
- **Colours:** read `--dot` (field) or `--ink` (wordmark) for rest dots, plus `--brand` and `--signal`, using `getComputedStyle(document.documentElement)`. Re-read them when `prefers-color-scheme` changes or when `data-theme` changes (use a `MutationObserver`).
- **Energy per point** `e` (0–1): the pointer within radius `R` (field `W<600?90:150`, wordmark `W/9`) sets `e = max(e, (1-d/R)*(0.55+0.45*seed))`. The ambient scan line sweeps across every 7s (field) or 9s (wordmark); points within `gap*0.9` of it have a 7% chance per frame to get `e = 0.5..1`. Decay per frame is `0.955` (field) or `0.94` (wordmark).
- **Draw:** rest points are squares of size `2px` (field) or `gap*0.5` (wordmark). Hot points (`e > 0.04`) are drawn after them with `globalAlpha = 0.25+0.75e` and size `rest + e*grow` (grow is `7` for field, `gap*0.45` for wordmark). The colour is `signal` when `seed < 0.12`, otherwise `brand`.
- **Performance:** run the rAF loop only while the canvas is in view (`IntersectionObserver`). With reduced motion, draw one static frame and attach no listeners. Pointer events are attached to the **parent section** (a prop `hostRef` or the canvas's parent element).
- **Field only:** add a CSS mask so dots fade out at the bottom: `mask-image: linear-gradient(to bottom, #000 0%, #000 55%, transparent 88%)`.
- **Accessibility:** the field is `aria-hidden`. The wordmark gets `role="img" aria-label="Qbitlog"`.
- **Fonts:** for the wordmark, call `document.fonts.ready.then(layout)`.
- The component is dynamically imported by its users with `next/dynamic(..., { ssr: false })` so it never blocks LCP. The static fallback is the CSS `dotgrid` background.

---

## 2.5 `/styleguide` page
Create `app/(frontend)/styleguide/page.tsx`:
- `export const metadata = { robots: { index: false, follow: false } }`
- Sections, in order: Tokens (swatches read from CSS variables, with names and hex values for both themes), Type scale, LogLabel, Buttons, Metric + ProofStrip, DecisionRecord, LogPanel, LogStream, Ticker, AnnotatedMedia (use `/images/case-studies/re-os/dashboard.png`, 1536×1024), FeatureCase, CaseCard ×2 (images `/images/case-studies/re-os/ordering.png` and `/images/case-studies/hytp/booking.png`), ServiceRow ×3, IndustryTile ×4, PostRow ×3, Quote (inverted Section), Steps (inverted Section), FAQList, CTABox, Form fields (including error states), BitField field, BitField wordmark, ThemeToggle.
- Use the **real sample data** below so reviewers judge real content.

Sample data (from `content/legacy/case-studies.json`):
- Batra Hospital: healthcare, 10 weeks, 6 engineers. Metrics: 99% extraction accuracy, 3–5s per prescription, 80% less manual entry, 253K+ medicine knowledge base. Quote: "The biggest improvement wasn't just accuracy. It was how much time our pharmacists got back." (Dr. Rajesh Mehta, Pharmacy Lead)
- RestaurantOS: hospitality, 14 weeks, 5 engineers. Metrics: 60% fewer manual admin tasks, 24/7 business monitoring.
- Hire Your Travel Partner: travel & senior care, 16 weeks, 5 engineers. Metrics: 98% customer satisfaction, 100% digital trip management.

---

## 2.6 Acceptance criteria
- [ ] Every component in §2.3 and §2.4 exists, is exported from its barrel file, and appears on `/styleguide`.
- [ ] `/styleguide` matches the prototype visually in both light and dark mode (use the ThemeToggle), with no horizontal scroll at 375px width.
- [ ] Keyboard: every link, button, pin, summary and form control shows a visible focus ring. Tab order is logical.
- [ ] With reduced motion enabled in the OS, nothing animates, and every piece of content is visible and correct.
- [ ] `grep -rEn "#[0-9a-fA-F]{3,6}|bg-\[#|text-\[#" components` returns nothing.
- [ ] `grep -rn "dark:" components app` returns nothing.
- [ ] `/styleguide` Lighthouse mobile Accessibility ≥ 95.
- [ ] `npm run check` passes.
- [ ] Commit: `redesign(phase-2): design system and motion primitives`.

## 2.7 Handoff notes
- **Button styles.** The `cva` definition now lives in `components/ds/buttonStyles.ts`. `Button.tsx` re-exports it. Client components (`error.tsx`, `HeaderNav`) import `buttonStyles` directly, so that `Button`'s server-only dependencies stay out of client bundles.
- **Client components use `clsx`, not `cn()`.** `BitField`, `StepsRail`, `TiltFrame`, `ThemeToggle` and `HeaderNav` use `import { clsx as cn } from "clsx"`. Loading `tailwind-merge` in these components added about 10 kB gzip to every page's First Load JS. Keep `cn()` (tailwind-merge) in server components, where class conflicts can come from props.
- **Font sizes.** The spec's own component snippets use raw px sizes (for example `text-[11px]` on mono labels). These were kept as specified, even though they don't use the type tokens.
