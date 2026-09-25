# URL inventory (pre-rebuild baseline)

Public URLs served by the current site and their post-rebuild targets (from `docs/redesign/README.md` §5). Phase 6 implements 301 redirects from this table.

| Current URL | New target URL | Notes |
|---|---|---|
| `/` | `/` | Payload page slug `home` |
| `/aboutus` | `/about` | |
| `/services` | `/services` | |
| `/services/ai-machine-learning` | `/services/ai-machine-learning` | |
| `/services/cloud-solutions` | `/services/cloud-solutions` | |
| `/services/mobile-development` | `/services/mobile-development` | |
| `/services/uiux` | `/services/uiux` | |
| `/services/web-development` | `/services/web-development` | |
| `/blog` | `/insights` | |
| `/blog/ai-trends-2025` | `/insights/ai-trends-2025` | |
| `/blog/secure-rag-architectures` | `/insights/secure-rag-architectures` | |
| `/blog/edge-ai-inference` | `/insights/edge-ai-inference` | |
| `/blog/modern-web-architecture-2025` | `/insights/modern-web-architecture-2025` | |
| `/blog/platform-engineering-playbook` | `/insights/platform-engineering-playbook` | |
| `/blog/ai-governance-and-ethics` | `/insights/ai-governance-and-ethics` | |
| `/case-studies` | `/work` | |
| `/case-studies/medical-prescription-ocr` | `/work/medical-prescription-ocr` | |
| `/case-studies/hire-your-travel-partner` | `/work/hire-your-travel-partner` | |
| `/case-studies/restaurant-os` | `/work/restaurant-os` | |
| `/teams` | `/about/team` | |
| `/contact-us` | `/contact` | |
| `/careers` | `/careers` | |
| `/careers/it-business-development-associate-lead-conversion` | `/careers/it-business-development-associate-lead-conversion` | Slug from `slugify(title)` |
| `/construction` | `/` | |
| `/academyai/privacy-policy` | `/academyai/privacy-policy` | Unchanged (code-owned) |
| `/academyai/terms-and-conditions` | `/academyai/terms-and-conditions` | Unchanged (code-owned) |

**Not in sitemap today but routed:** `/careers`, `/careers/[slug]`, `/construction` (included above).

**Homepage-only anchors (no standalone URL):** `/#about`, `/#services`, `/#faq`, `/#contact`, etc.
