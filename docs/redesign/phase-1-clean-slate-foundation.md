# Phase 1: Clean slate and foundation

> Read `docs/redesign/README.md` first. Phase 0 must be merged into the `redesign` branch.
> **Goal:** delete the old UI, restructure `app/` into a `(frontend)` route group ready for Payload, remove unused dependencies, and set up fonts and design tokens. At the end the site is a nearly empty shell that builds cleanly.
> **Estimated time:** 1 day. **Depends on:** Phase 0.

---

## 1.1 Context

- The repo uses Next.js (App Router, `next@^16`), React 19.1, Tailwind CSS v4 (`@tailwindcss/postcss`) and TypeScript. The dev server runs on port 3001 (`next dev --turbopack --port 3001`).
- All published content has already been copied into `content/legacy/` (Phase 0). **Do not touch that folder.**
- We are rebuilding from scratch, so the old components, pages and animation libraries go.
- **Exception:** the two Academy AI legal pages must keep working at the same URLs.

---

## 1.2 Tasks

### Task 1: Delete the old UI

Before deleting, confirm `content/legacy/` exists and contains `posts.json`, `case-studies.json`, `services/`, `careers.json`, `team.json`, `faqs.json` and `legal/`. **If any are missing, stop and report.**

Delete these folders and files:
```
app/_home/
app/aboutus/
app/blog/
app/case-studies/
app/services/
app/teams/
app/careers/
app/contact-us/
app/construction/
app/api/                      (contact + careers routes; replaced by Payload + server actions in Phase 5)
app/page.tsx
app/not-found.tsx
components/                   (everything: animation/, global/, ui/)
components.json               (shadcn config)
public/fonts/Seven_Segment.ttf
public/file.svg  public/globe.svg  public/next.svg  public/vercel.svg  public/window.svg
```
**Keep:**
- `app/academyai/**`
- `app/robots.ts`, `app/sitemap.ts`, `app/icon.png`, `app/favicon-0.ico`
- `lib/utils.ts`
- all of `public/images/**` and `public/icons/**`, including images that are now unused (Phase 6 prunes them).

### Task 2: Restructure `app/` into route groups

Payload (Phase 3) needs its own root layout, so the site must live in a route group. There must be **no** `app/layout.tsx` at the root.

Target:
```
app/
  (frontend)/
    layout.tsx          ← new (Task 5)
    globals.css         ← new (Task 4); delete the old app/globals.css
    page.tsx            ← temporary placeholder home (Task 6)
    not-found.tsx       ← new simple 404 (Task 6)
    icon.png            ← moved from app/icon.png
    academyai/
      privacy-policy/page.tsx          ← moved from app/academyai/…
      terms-and-conditions/page.tsx    ← moved
  robots.ts
  sitemap.ts
```
- Move `app/favicon-0.ico` → `public/favicon.ico`. It isn't a valid Next.js favicon name, and a root favicon doesn't work without a root layout. Reference it in metadata: `icons: { icon: "/favicon.ico" }`, alongside the `icon.png` convention file.
- Use `git mv` so history is kept.

### Task 3: Dependencies

Remove:
```bash
npm uninstall @radix-ui/react-accordion @radix-ui/react-icons @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slot cobe gsap lenis motion tw-animate-css nodemailer @types/nodemailer
```
Keep: `next`, `react`, `react-dom`, `@vercel/analytics`, `@vercel/speed-insights`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `@tailwindcss/typography`, `tailwindcss`, `@tailwindcss/postcss`, `typescript`, `eslint`, types.

Align `eslint-config-next` with the installed `next` major version (currently it is `15.5.3` against `next@16`):
```bash
npm i -D eslint-config-next@$(node -p "require('next/package.json').version")
```
Add scripts to `package.json`:
```json
"typecheck": "tsc --noEmit",
"check": "npm run lint && npm run typecheck && npm run build"
```
Keep `"dev": "next dev --turbopack --port 3001"`. If `next build --turbopack` fails at any point in later phases, switch the build script to plain `next build`, and write that in Handoff notes.

`lib/utils.ts` must still export `cn()` (clsx + tailwind-merge). The tailwind-merge config must know about the custom font-size tokens (Task 4), otherwise `cn("text-sm","text-label")` merges wrongly:
```ts
import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["label", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl"] }],
    },
  },
});
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
```

### Task 4: Design tokens in `app/(frontend)/globals.css`

Write this file exactly, then extend it only in Phase 2. **This is the only file in the repo allowed to contain hex colours.**

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

/* ---------- Tokens: light (default) ---------- */
:root {
  --paper: #F1F2EE;
  --surface: #FBFBF9;
  --ink: #121418;
  --muted: #5A5F67;
  --line: #D8DAD4;
  --dot: #C6C9C1;
  --brand: #5B2BE0;
  --brand-soft: #E9E3FC;
  --signal: #A95F00;
  --signal-soft: #F6E8D2;
  --ok: #2F7A4B;
  --danger: #B42318;
  /* inverted band (dark section on a light page) */
  --inv-bg: #121418;
  --inv-ink: #E7E8E3;
  --inv-muted: #9A9FA8;
  --inv-line: #2A2E35;
  --inv-brand: #A487FF;
  --inv-signal: #F0A83A;
  --on-brand: #FFFFFF;
  --shadow-frame-color: rgb(18 20 24 / 0.55);
}

/* ---------- Tokens: dark (system) ---------- */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
    --paper: #0D0F12; --surface: #15181C; --ink: #E7E8E3; --muted: #9A9FA8;
    --line: #272B31; --dot: #2E333A; --brand: #A487FF; --brand-soft: #221B3D;
    --signal: #F0A83A; --signal-soft: #2E2414; --ok: #5FBF83; --danger: #F97066;
    --inv-bg: #1A1D22; --inv-line: #30343B;
    --shadow-frame-color: rgb(0 0 0 / 0.7);
  }
}
/* ---------- Tokens: dark (explicit toggle) ---------- */
:root[data-theme="dark"] {
  color-scheme: dark;
  --paper: #0D0F12; --surface: #15181C; --ink: #E7E8E3; --muted: #9A9FA8;
  --line: #272B31; --dot: #2E333A; --brand: #A487FF; --brand-soft: #221B3D;
  --signal: #F0A83A; --signal-soft: #2E2414; --ok: #5FBF83; --danger: #F97066;
  --inv-bg: #1A1D22; --inv-line: #30343B;
  --shadow-frame-color: rgb(0 0 0 / 0.7);
}

/* ---------- Tailwind theme: ONLY our tokens exist ---------- */
@theme inline {
  --color-*: initial;
  --color-paper: var(--paper);
  --color-surface: var(--surface);
  --color-ink: var(--ink);
  --color-muted: var(--muted);
  --color-line: var(--line);
  --color-dot: var(--dot);
  --color-brand: var(--brand);
  --color-brand-soft: var(--brand-soft);
  --color-signal: var(--signal);
  --color-signal-soft: var(--signal-soft);
  --color-ok: var(--ok);
  --color-danger: var(--danger);
  --color-inv-bg: var(--inv-bg);
  --color-inv-ink: var(--inv-ink);
  --color-inv-muted: var(--inv-muted);
  --color-inv-line: var(--inv-line);
  --color-inv-brand: var(--inv-brand);
  --color-inv-signal: var(--inv-signal);
  --color-on-brand: var(--on-brand);
  --color-transparent: transparent;
  --color-current: currentColor;

  --font-*: initial;
  --font-serif: var(--font-serif-src), Georgia, "Times New Roman", serif;
  --font-sans: var(--font-sans-src), ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-mono: var(--font-mono-src), ui-monospace, "SFMono-Regular", Consolas, monospace;

  /* Type scale, ratio 1.25 (px values in comments) */
  --text-*: initial;
  --text-label: 0.75rem;   --text-label--line-height: 1.4;  --text-label--letter-spacing: 0.08em;  /* 12 */
  --text-sm: 0.875rem;     --text-sm--line-height: 1.5;     /* 14 */
  --text-base: 1rem;       --text-base--line-height: 1.6;   /* 16 */
  --text-lg: 1.25rem;      --text-lg--line-height: 1.5;     /* 20 */
  --text-xl: 1.5625rem;    --text-xl--line-height: 1.25;    /* 25 */
  --text-2xl: 1.9375rem;   --text-2xl--line-height: 1.15;   /* 31 */
  --text-3xl: 2.4375rem;   --text-3xl--line-height: 1.1;    /* 39 */
  --text-4xl: 3.0625rem;   --text-4xl--line-height: 1.05;   /* 49 */
  --text-5xl: 3.8125rem;   --text-5xl--line-height: 1.02;   /* 61 */
  --text-6xl: 4.75rem;     --text-6xl--line-height: 1;      /* 76 */
  --text-7xl: 6rem;        --text-7xl--line-height: 0.98;   /* 96 */

  --radius-*: initial;
  --radius-none: 0;
  --radius-xs: 2px;
  --radius-full: 9999px;

  --shadow-*: initial;
  --shadow-frame: 0 60px 120px -60px var(--shadow-frame-color);

  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
}

/* ---------- Base ---------- */
@layer base {
  * { border-color: var(--line); }
  html { -webkit-text-size-adjust: 100%; }
  body {
    background: var(--paper);
    color: var(--ink);
    font-family: var(--font-sans);
    font-size: var(--text-base);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3, h4 { font-family: var(--font-serif); font-weight: 400; letter-spacing: -0.015em; text-wrap: balance; }
  :focus-visible { outline: 2px solid var(--brand); outline-offset: 3px; }
  ::selection { background: var(--brand-soft); color: var(--ink); }
  img, video { max-width: 100%; height: auto; }
}

/* ---------- Layout utilities ---------- */
@utility wrap {
  width: 100%;
  padding-inline: clamp(1.5rem, 4vw, 4.5rem);   /* full-bleed layout: 24px → 72px gutters */
}
@utility measure { max-width: 66ch; }
@utility dotgrid {
  background-image: radial-gradient(var(--dot) 1px, transparent 1.2px);
  background-size: 18px 18px;
}
@utility tabular { font-variant-numeric: tabular-nums; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
```

The layout is **full width**: there is no max-width container. `wrap` provides only the side gutters. Paragraphs are limited with `measure`.

### Task 5: `app/(frontend)/layout.tsx`

```tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans-src", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono-src", display: "swap" });
const serif = Source_Serif_4({
  subsets: ["latin"], variable: "--font-serif-src", display: "swap",
  style: ["normal", "italic"], axes: ["opsz"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://qbitlog.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Qbitlog: Software, on the record", template: "%s · Qbitlog" },
  description: "Qbitlog designs and builds web, mobile and AI products for teams in the US and Europe, with every decision documented and every result measured.",
  icons: { icon: [{ url: "/favicon.ico" }] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F1F2EE" },
    { media: "(prefers-color-scheme: dark)", color: "#0D0F12" },
  ],
};

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```
Note that the old layout placed `<SpeedInsights/>` outside `<body>`, which was a bug. Here they sit inside `<body>`. (The `themeColor` hex values are the one allowed exception to the hex rule, because they mirror the `paper` token.)

### Task 6: Placeholder pages and temporary chrome

1. Create temporary shells `components/site/SiteHeader.tsx` and `components/site/SiteFooter.tsx`. Each is a Server Component: a `wrap` row with the word **QBITLOG** in `font-mono`, and nothing else. Phase 5 replaces them.
2. `app/(frontend)/page.tsx`: a centred message on `bg-paper` containing a mono label `REBUILD IN PROGRESS` and an `h1` "Software, on the record." in `font-serif text-5xl`. Set `export const metadata = { robots: { index: false } }`.
3. `app/(frontend)/not-found.tsx`: label `LOG / 404`, `h1` "This entry doesn't exist.", and a link home.
4. **Legal pages:** in both `academyai/*/page.tsx`, replace the imports `@/components/global/navbar` and `@/components/global/footer` with `SiteHeader` / `SiteFooter`. Their body text must stay **exactly** the same (compare them with `content/legacy/legal/*.tsx`). Old utility classes that no longer exist (e.g. `text-primary`, `bg-gray-50`) will just stop styling; that's fine. Phase 5 restyles these pages. **Do not edit any legal text.**

### Task 7: Temporary `sitemap.ts` and `robots.ts`
- `app/sitemap.ts`: return only `/`, `/academyai/privacy-policy` and `/academyai/terms-and-conditions`. It must not import any deleted JSON. Phase 6 rewrites it.
- `app/robots.ts`: keep it as is (it already disallows `/admin/` and `/api/`).

### Task 8: `next.config.ts`
Remove `img.freepik.com` and `images.unsplash.com` from `images.remotePatterns`. The new site hosts every image itself (Payload media), so add an empty `remotePatterns: []`. Phase 3 adds the Vercel Blob host. Also add:
```ts
images: { formats: ["image/avif", "image/webp"], remotePatterns: [] },
poweredByHeader: false,
```

### Task 9: Update the root `README.md`
Replace the marketing text with a short developer README: stack, `npm run dev`, env setup (`cp .env.example .env`), and a link to `docs/redesign/README.md`.

---

## 1.3 Acceptance criteria
- [ ] `app/` contains only `(frontend)/`, `robots.ts` and `sitemap.ts`. There is no `app/layout.tsx`.
- [ ] `components/` contains only `site/SiteHeader.tsx` and `site/SiteFooter.tsx`.
- [ ] `grep -rEn "gsap|lenis|cobe|@radix-ui|motion/react|framer" app components lib` returns nothing.
- [ ] `grep -rEn "#[0-9a-fA-F]{3,6}\b" app components --include=*.tsx` only matches the `themeColor` lines in `layout.tsx` and the untouched legal pages.
- [ ] `/academyai/privacy-policy` and `/academyai/terms-and-conditions` render in `npm run dev`, with text identical to the legacy copies.
- [ ] `content/legacy/` is unchanged (`git diff --stat content/legacy` is empty).
- [ ] `npm run check` passes.
- [ ] Commit: `redesign(phase-1): clean slate, route groups, tokens and fonts`.

## 1.4 Handoff notes
_(Agents: add anything later phases must know here.)_
