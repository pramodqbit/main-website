# Baseline metrics (pre-rebuild)

Captured **2026-09-24** against production (`https://www.qbitlog.com`). Mobile form factor, Lighthouse 13.5.0.

Raw JSON: `lh-home.json` / `lh-home-full.json`, `lh-case-study.json` / `lh-case-study-full.json`, `lh-blog.json` / `lh-blog-full.json`.

## Lighthouse (mobile)

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|---:|
| Home (`/`) | 75 | 96 | 100 | 100 | 5.0 s | 0.001 | 120 ms |
| Case study (`/case-studies/medical-prescription-ocr`) | 90 | 97 | 100 | 100 | 3.5 s | 0 | 10 ms |
| Blog (`/blog/ai-trends-2025`) | 87 | 96 | 100 | 100 | 4.0 s | 0 | 20 ms |

Scores from full category runs (`lh-*-full.json`). Perf-preset JSON files (`lh-home.json`, etc.) are kept as Phase 0 script output.

## Traffic baseline `[HUMAN]`

Fill from the last 90 days before rebuild work ships:

| Metric | Source | Value |
|---|---|---|
| Organic clicks, impressions, avg position | Google Search Console | |
| Indexed pages | Search Console → Pages | |
| Top 10 queries | Search Console | |
| Sessions / visitors | Vercel Analytics | |
| Contact form submissions per month | inbox | |
| Top referrers | Vercel Analytics | |

The "+70–80% reach" goal is measured against this table.
