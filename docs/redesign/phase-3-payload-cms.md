# Phase 3: Payload CMS (MongoDB)

> Read `docs/redesign/README.md` first. Phase 1 must be complete.
> **Goal:** install Payload v3 inside the Next.js app and define the complete content model (collections, globals, page-builder blocks, access control, plugins, storage, email, revalidation), so the marketing team can manage the whole site from `/admin`.
> **Estimated time:** 3–4 days. **Depends on:** Phase 1. It can run in parallel with Phase 2.

**Official docs to follow for any API detail:** https://payloadcms.com/docs. Payload's API evolves. **Where these specs and the installed version disagree, the installed version's docs win.** Record any deviation in Handoff notes.

---

## 3.1 Prerequisites (`[HUMAN]` unless you already have the values)
- A MongoDB Atlas cluster (M0 is fine for dev, M10+ for production) → `DATABASE_URI`
- `PAYLOAD_SECRET`: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- A Vercel Blob store → `BLOB_READ_WRITE_TOKEN` (optional in dev; without it, media is saved to local disk)
- A private S3-compatible bucket (Cloudflare R2 recommended) → `S3_*` (optional in dev)
- The Zoho SMTP variables (already in `.env`)

For local dev without Atlas you can run `docker run -d -p 27017:27017 mongo:7` and use `DATABASE_URI=mongodb://127.0.0.1:27017/qbitlog`.

---

## 3.2 Install

1. **Check version compatibility first.** Run `npm view @payloadcms/next peerDependencies`. If the latest Payload does **not** support the installed `next` major version, pin `next` (and `eslint-config-next`) to the highest version it supports, and note this in Handoff notes.
2. Install into the existing app, following the official guide ("Installation → Adding Payload to an existing Next.js app"):
   ```bash
   npm i payload @payloadcms/next @payloadcms/ui @payloadcms/richtext-lexical @payloadcms/db-mongodb \
         @payloadcms/email-nodemailer @payloadcms/plugin-seo @payloadcms/plugin-redirects \
         @payloadcms/storage-vercel-blob @payloadcms/storage-s3 @payloadcms/live-preview-react \
         sharp graphql
   npm i -D cross-env
   ```
   All `@payloadcms/*` packages **must be the exact same version** as `payload`.
3. Copy the `(payload)` route group from the official blank template (`templates/blank/src/app/(payload)` in the payload GitHub repo, matching the installed version tag) into `app/(payload)/`. It contains `layout.tsx`, `custom.scss`, `admin/[[...segments]]/page.tsx`, `admin/[[...segments]]/not-found.tsx`, `admin/importMap.js`, `api/[...slug]/route.ts`, `api/graphql/route.ts` and `api/graphql-playground/route.ts`. Fix the import paths so they point at `@payload-config`.
4. `tsconfig.json` → add to `compilerOptions.paths`: `"@payload-config": ["./payload.config.ts"]`.
5. `next.config.ts`:
   ```ts
   import { withPayload } from "@payloadcms/next/withPayload";
   // …existing config…
   images: { formats: ["image/avif","image/webp"], remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }] },
   export default withPayload(nextConfig);
   ```
6. `package.json` scripts:
   ```json
   "payload": "cross-env NODE_OPTIONS=--no-deprecation payload",
   "generate:types": "npm run payload generate:types",
   "generate:importmap": "npm run payload generate:importmap"
   ```
7. `.gitignore`: add `/media` (the local upload folder).
8. If Payload complains about ESM/CJS, set `"type": "module"` in `package.json` and confirm that `postcss.config.mjs`, `eslint.config.mjs` and `next.config.ts` still load.

---

## 3.3 File layout
```
payload.config.ts
cms/
  access/        index.ts (anyone, authenticated, isAdmin, isAdminOrEditor, publishedOrLoggedIn, isAdminField)
  fields/        slug.ts, link.ts, sectionHead.ts, metrics.ts, annotations.ts, publishedAt.ts
  hooks/         revalidate.ts, readingTime.ts, notifyLead.ts, notifyApplication.ts, preventAuthorPublish.ts, firstUserIsAdmin.ts
  blocks/        one file per block (§3.8) + index.ts exporting `pageBlocks`
  collections/   Users.ts Media.ts Resumes.ts Pages.ts CaseStudies.ts Services.ts Industries.ts Posts.ts
                 Categories.ts Team.ts Jobs.ts Testimonials.ts Technologies.ts Faqs.ts LogEntries.ts Clients.ts
                 Leads.ts Applications.ts
  globals/       Header.ts Footer.ts SiteSettings.ts Announcement.ts
  utilities/     paths.ts (collection → public URL), previewPath.ts
lib/
  payload.ts     cached getPayload() client
```

---

## 3.4 `payload.config.ts` (skeleton)

```ts
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { buildConfig } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { s3Storage } from "@payloadcms/storage-s3";
import * as C from "./cms/collections";
import * as G from "./cms/globals";
import { publicUrlFor } from "./cms/utilities/paths";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

export default buildConfig({
  serverURL: siteUrl,
  secret: process.env.PAYLOAD_SECRET!,
  db: mongooseAdapter({ url: process.env.DATABASE_URI! }),
  editor: lexicalEditor(),
  sharp,
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  admin: {
    user: C.Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: " · Qbitlog CMS" },
    livePreview: {
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 390, height: 844 },
        { label: "Tablet", name: "tablet", width: 820, height: 1180 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
  },
  collections: [
    C.Pages, C.CaseStudies, C.Services, C.Industries, C.Posts, C.Categories,
    C.Team, C.Jobs, C.Testimonials, C.Technologies, C.Faqs, C.LogEntries, C.Clients,
    C.Leads, C.Applications, C.Media, C.Resumes, C.Users,
  ],
  globals: [G.Header, G.Footer, G.SiteSettings, G.Announcement],
  email: nodemailerAdapter({
    defaultFromAddress: process.env.EMAIL_FROM ?? "hello@qbitlog.com",
    defaultFromName: "Qbitlog",
    transportOptions: {
      host: process.env.ZOHO_SMTP_HOST, port: 465, secure: true,
      auth: { user: process.env.ZOHO_MAIL_USER, pass: process.env.ZOHO_MAIL_APP_PASSWORD },
    },
  }),
  cors: [siteUrl],
  csrf: [siteUrl],
  plugins: [
    seoPlugin({
      collections: ["pages", "case-studies", "services", "industries", "posts", "jobs"],
      uploadsCollection: "media",
      tabbedUI: true,
      generateTitle: ({ doc }) => `${doc?.title ?? ""} · Qbitlog`,
      generateDescription: ({ doc }) => doc?.summary ?? doc?.excerpt ?? "",
      generateURL: ({ doc, collectionSlug }) => `${siteUrl}${publicUrlFor(collectionSlug!, doc?.slug)}`,
    }),
    redirectsPlugin({
      collections: ["pages", "case-studies", "services", "industries", "posts"],
      overrides: { admin: { group: "Settings" } },
    }),
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN ?? "",
    }),
    s3Storage({
      enabled: Boolean(process.env.S3_BUCKET),
      collections: { resumes: { prefix: "resumes" } },   // served through Payload access control (private)
      bucket: process.env.S3_BUCKET ?? "",
      config: {
        region: process.env.S3_REGION ?? "auto",
        endpoint: process.env.S3_ENDPOINT,
        credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "", secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "" },
      },
    }),
  ],
});
```

`cms/utilities/paths.ts`: this is the **single source of truth** for public URLs:
```ts
export function publicUrlFor(collection: string, slug?: string | null): string {
  switch (collection) {
    case "pages": return !slug || slug === "home" ? "/" : `/${slug}`;
    case "case-studies": return `/work/${slug}`;
    case "services": return `/services/${slug}`;
    case "industries": return `/industries/${slug}`;
    case "posts": return `/insights/${slug}`;
    case "jobs": return `/careers/${slug}`;
    case "team": return `/about/team#${slug}`;
    default: return "/";
  }
}
```

`lib/payload.ts`:
```ts
import "server-only";
import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
export const getPayloadClient = cache(() => getPayload({ config }));
```

---

## 3.5 Access control and roles

`Users` collection: `auth: { tokenExpiration: 28800, maxLoginAttempts: 5, lockTime: 900000 }`. Fields: `name` (text, required), `role` (select `admin | editor | author`, default `editor`, required, `saveToJWT: true`, and field-level update access for admins only).

| Role | Can do |
|---|---|
| `admin` | Everything, including Users, Settings and deleting any document |
| `editor` | Create, update and publish all content, globals except SiteSettings' technical fields, and read/update Leads and Applications |
| `author` | Create and update **drafts** of Posts and LogEntries only; they cannot publish (enforced by the `preventAuthorPublish` beforeChange hook, which throws `Forbidden` if `role==='author' && data._status==='published'`) |

The `firstUserIsAdmin` hook (Users `beforeChange`, on create): if `payload.count({collection:'users'})` is 0, force `role = 'admin'`.

Access helpers (`cms/access/index.ts`):
```ts
export const anyone = () => true;
export const authenticated = ({ req }) => Boolean(req.user);
export const isAdmin = ({ req }) => req.user?.role === "admin";
export const isAdminOrEditor = ({ req }) => ["admin", "editor"].includes(req.user?.role);
export const publishedOrLoggedIn = ({ req }) => (req.user ? true : { _status: { equals: "published" } });
```

Default for content collections: `read: publishedOrLoggedIn`, `create/update: isAdminOrEditor` (Posts/LogEntries also allow `author`), `delete: isAdmin`.

---

## 3.6 Reusable fields (`cms/fields/`)

- **`slugField(from = "title")`**: `text`, `unique`, `index`, `required`, `admin.position: "sidebar"`. A `beforeValidate` hook generates the slug from `from` when it's empty. Validation: `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`. Description: "URL part. Changing it after publishing breaks links; add a redirect."
- **`linkField(name)`**: group `{ type: radio("internal","external"), reference: relationship to ["pages","case-studies","services","industries","posts","jobs"] (when internal), url: text (when external), label: text required, newTab: checkbox }`. Frontend resolves internal links with `publicUrlFor`.
- **`sectionHeadFields`**: `label` (text, e.g. "LOG / WORK"), `title` (required), `emphasis` (text, "Shown in violet italic after the title"), `intro` (textarea), `more` (linkField, optional).
- **`metricsField(name = "metrics")`**: array (maxRows 6) of `{ value: text required ("99" or "3–5s"), unit: text ("%", "s"), label: text required, source: text required ("Batra Hospital, 2024"), featured: checkbox default true }`. Description: "Every number needs a source. Only publish numbers the client has approved."
- **`annotationsField`**: array (maxRows 6) of `{ x: number 0–100 required, y: number 0–100 required, title: text required, note: text }`. Description: "Pin position in % from the top-left of the image. Pins are lettered A, B, C in order."
- **`publishedAtField`**: date in the sidebar. A `beforeChange` hook sets it to now the first time `_status` becomes `published`.

---

## 3.7 Collections (field-level spec)

Legend: **R** = required. Every collection sets `admin.useAsTitle`, `admin.defaultColumns`, `admin.group`, and an `admin.description` on non-obvious fields, written for non-developers.

### Content group (drafts + autosave + live preview + SEO tab + revalidation)
All five use `versions: { drafts: { autosave: { interval: 375 }, schedulePublish: true }, maxPerDoc: 25 }`, `admin.livePreview.url` and `admin.preview` built with `previewPath()` (§3.10), and hooks `afterChange: [revalidateDoc]` and `afterDelete: [revalidateDoc]`.

**`pages`** (group Content): `title` R, `slug` (slugField; `home` is the homepage), `layout` (blocks: `pageBlocks`, R, minRows 1), `publishedAt`. SEO comes from the plugin.

**`case-studies`** (group Content; public URL `/work/[slug]`), in tabs:
- *Overview*: `title` R (max 90), `slug`, `client` R, `clientLogo` (upload media), `industry` (relationship `industries`), `services` (relationship `services`, hasMany), `summary` R (textarea, max 200, "Shown on cards and in Google"), `durationWeeks` (number), `teamSize` (number), `year` (number), `status` (select `live|prototype`, default live), `liveUrl` (text), `featured` (checkbox), `order` (number).
- *Proof*: `metrics` (metricsField), `testimonial` (relationship `testimonials`).
- *Story*: `heroImage` (upload, R), `heroAnnotations` (annotationsField), `challenge` (richText R), `decisions` (array: `title` R, `problem` textarea R, `options` array `{label R, chosen checkbox}`, `decision` textarea R, `why` textarea R; description: "The heart of the case study: what we weighed and why we chose it"), `solution` (richText), `features` (array `{title R, description}`), `gallery` (array `{image upload R, caption, annotations: annotationsField}`), `body` (richText, "Optional long-form write-up; migrated articles land here"), `technologies` (relationship `technologies`, hasMany), `related` (relationship `case-studies`, hasMany, max 2).

**`services`** (group Content; `/services/[slug]`): `title` R, `slug`, `category` R (short label, e.g. "AI & ML"), `outcomeHeadline` R ("Automate the work your team does by hand"), `summary` R (max 200), `problems` (array `{title, description}`), `deliverables` (array `{item}`), `process` (array `{name, description, deliverable}`), `technologies` (rel hasMany), `industries` (rel hasMany), `caseStudies` (rel hasMany), `faqs` (rel `faqs` hasMany), `layout` (blocks, optional extra sections), `order` (number).

**`industries`** (group Content; `/industries/[slug]`): `title` R ("Healthcare"), `slug`, `headline` R, `summary` R, `painPoints` (array `{title, description}`), `compliance` (array `{name}`, e.g. HIPAA, GDPR), `services` (rel hasMany), `caseStudies` (rel hasMany), `faqs` (rel hasMany), `layout` (blocks, optional), `order`.

**`posts`** (group Content; `/insights/[slug]`): `title` R, `slug`, `excerpt` R (max 200), `heroImage` (upload), `content` R (richText; Lexical with `BlocksFeature` enabling the inline blocks `Code`, `Callout`, `MediaAnnotated`, `DecisionRecordInline` and `MetricsInline`, plus the default features with h2–h4 only), `authors` (rel `team`, hasMany, R), `category` (rel `categories`, R), `tags` (text, hasMany), `readingTime` (number, readOnly, computed by the `readingTime` hook at ~220 wpm from the Lexical text), `related` (rel posts, hasMany, max 3), `publishedAt`. Authors may create and update posts.

### Studio group (no drafts; plain published data)
- **`categories`**: `title` R, `slug`.
- **`team`**: `name` R, `slug`, `kind` (select `person|team`, default person; the "Qbitlog Engineering" author uses `team`), `role` R, `bio` (textarea), `photo` (upload), `expertise` (text hasMany), `links` group `{linkedin, github, x, website}`, `leadership` (checkbox), `showOnSite` (checkbox default true), `order`.
- **`jobs`** (`/careers/[slug]`, has drafts, no autosave): `title` R, `slug`, `status` (select `open|closed` R), `department` (select `Engineering|Design|Sales|Marketing|Operations`), `location` R, `employmentType` (select `Full-time|Part-time|Contract|Internship`), `salary` (text, optional), `summary` R, `description` (richText), `responsibilities` (array `{item}`), `requirements` (array `{item}`), `benefits` (array `{item}`), `publishedAt`, `validThrough` (date, used in JobPosting schema).
- **`testimonials`**: `quote` R (textarea), `name` R, `role`, `company`, `avatar` (upload), `caseStudy` (rel), `approved` (checkbox, "Client approved public use").
- **`technologies`**: `name` R, `slug`, `logo` (upload), `category` (select `Frontend|Backend|Mobile|AI|Cloud|Data|Design`).
- **`faqs`**: `question` R, `answer` R (textarea; plain text keeps FAQ schema clean), `topic` (select `general|process|pricing|engagement|technical`), `order`.
- **`log-entries`** (the studio log, `/log` and the ticker): `date` R (default today), `type` R (select `SHIPPED|MEASURED|DECIDED|WROTE|HIRED|TALK|LAUNCHED`), `subject` R ("RestaurantOS"), `text` R (max 120), `highlight` (text, e.g. "99%"), `link` (linkField, optional), `showInTicker` (checkbox default true). Sorted by `-date`. Authors may create these.
- **`clients`**: `name` R, `logo` (upload), `url`, `showLogo` (checkbox default **false**, "Only enable with written permission").

### Inbox group (private)
- **`leads`**: access `create: () => false` (created only by the server action with `overrideAccess: true`), `read/update: isAdminOrEditor`, `delete: isAdmin`. Fields: `name` R, `email` R (email), `company`, `role`, `website`, `budget` (select `<25k|25-50k|50-100k|100k+|unsure`), `timeline` (select `asap|1-3m|3-6m|exploring`), `services` (select hasMany, using the service categories), `message` R (textarea), `consent` R (checkbox), `sourcePath` (text), `utm` group `{source, medium, campaign, term, content}`, `referrer`, `status` (select `new|contacted|qualified|won|lost`, default new), `internalNotes` (textarea). **Do not store IP addresses.** Hook `afterChange` (create only) → `notifyLead` (§3.9). `admin.defaultColumns: ["name","company","budget","status","createdAt"]`.
- **`applications`**: the same access as leads. Fields: `job` (rel `jobs` R), `name` R, `email` R, `phone`, `linkedin`, `portfolio`, `coverLetter` (textarea), `resume` (upload → `resumes`, R), `consent` R, `status` (select `new|screening|interview|offer|rejected`). Hook → `notifyApplication`.

### Media
- **`media`** (upload, public read): `alt` R ("Describe the image for screen readers and Google"), `caption`, `credit` (text, e.g. "Image: Freepik"). `upload: { mimeTypes: ["image/*","video/mp4"], focalPoint: true, imageSizes: [ {name:"thumb",width:480}, {name:"card",width:960}, {name:"feature",width:1600}, {name:"og",width:1200,height:630,position:"centre"} ], adminThumbnail: "thumb" }`. Group Media.
- **`resumes`** (upload, **private**): access `read: isAdminOrEditor`, `create: () => false` (server action only), `mimeTypes: ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"]`, with the size limit enforced in the server action (5 MB). Hidden from the nav except for admins/editors.

---

## 3.8 Page-builder blocks (`cms/blocks/`)

Each block has a `slug`, an `interfaceName` (PascalCase + `Block`), `labels`, and an `admin.description`. They are all exported as `pageBlocks`. The frontend renderers are built in Phase 5 from the `components/ds` equivalents shown here.

| Block slug | Fields | Renders with |
|---|---|---|
| `heroLog` | `labels` (text hasMany, e.g. ["Software studio","Web · Mobile · AI"]), `title` R, `emphasis`, `subhead` R, `primaryCta` (linkField), `secondaryCta` (linkField), `trustItems` (array `{text}` max 4), `logSource` (radio `caseStudy|manual`), `caseStudy` (rel, when caseStudy: rows are built from its decisions and metrics), `manualLog` (group `{title, status, rows: array {marker, phase select DISCOVER/DECIDE/BUILD/MEASURE, text, measured checkbox}, footerLeft, footerLink: linkField}`), `showBitField` (checkbox default true) | `Heading display` + `LogPanel` + `BitField` |
| `proofStrip` | `items` (metricsField, 2–4) | `ProofStrip` |
| `logTicker` | `limit` (number default 8) → reads `log-entries` where `showInTicker` | `Ticker` |
| `showcase` | sectionHead fields (label, title, emphasis, intro), `image` (upload R), `chromeLabel`, `annotations`, `tilt` (checkbox default true), `caseStudy` (rel, optional link) | `AnnotatedMedia variant="showcase"` |
| `caseStudyGrid` | sectionHead fields, `mode` (select `featured|manual|latest`), `items` (rel case-studies hasMany, when manual), `limit` (default 3), `firstAsFeature` (checkbox default true) | `FeatureCase` + `CaseCard` |
| `method` | sectionHead fields, `steps` (array `{name, description, deliverable}` 3–5), `testimonial` (rel), `inverted` (checkbox default true) | `Section tone=inverted` + `Steps` + `Quote` |
| `serviceList` | sectionHead fields, `services` (rel hasMany; empty = all ordered by `order`) | `ServiceRow` |
| `industryGrid` | sectionHead fields, `industries` (rel hasMany; empty = all) | `IndustryTile` |
| `insights` | sectionHead fields, `limit` (default 4), `category` (rel optional), `showStudioLog` (checkbox default true) | `PostRow` + `LogStream` |
| `faq` | `label`, `title`, `faqs` (rel hasMany) or `topic` (select) | `FAQList` (+ FAQPage JSON-LD in Phase 6) |
| `cta` | `label`, `title` R, `emphasis`, `body`, `button` (linkField; "Leave empty to use the booking link from Site Settings"), `details` (array `{label, value}`) | `CTABox` |
| `richText` | `content` (richText), `width` (select `measure|wide`) | `Prose` |
| `mediaAnnotated` | `image` R, `chromeLabel`, `annotations`, `caption` | `AnnotatedMedia variant="inline"` |
| `metrics` | sectionHead fields, `items` (metricsField) | `Metric` grid |
| `decisionRecord` | `problem`, `options`, `decision`, `why` | `DecisionRecord` |
| `teamGrid` | sectionHead fields, `filter` (select `all|leadership`) | `TeamCard` grid |
| `jobsList` | sectionHead fields | `JobRow` list of open jobs |
| `contactForm` | sectionHead fields, `showBooking` (checkbox) | Contact form (Phase 5) |
| `logoWall` | sectionHead fields | `clients` where `showLogo` |

---

## 3.9 Hooks
- **`revalidateDoc`** (`cms/hooks/revalidate.ts`): in `afterChange`/`afterDelete`, when `doc._status === "published"` (or the collection has no drafts), call `revalidatePath(publicUrlFor(collection, doc.slug))` plus the related index paths: case-studies → `/work` and `/`; posts → `/insights` and `/`; services → `/services`; industries → `/`; jobs → `/careers`; log-entries → `/log` and `/`; team → `/about/team`; faqs/testimonials → `/`. Also revalidate the **previous** slug if it changed (`previousDoc.slug`). Wrap the calls in try/catch, because `revalidatePath` throws outside a Next request context (e.g. in seed scripts). Skip when `context.disableRevalidate` is set.
- **Globals** `afterChange`: `revalidatePath("/", "layout")`.
- **`readingTime`**: walk the Lexical JSON, count words in text nodes, and store `Math.max(2, Math.ceil(words/220))`.
- **`notifyLead`**: on create, run `req.payload.sendEmail({ to: process.env.LEADS_NOTIFY_TO, subject: "New lead: <name> (<company>)", html })`. The HTML is a simple table of fields plus a link to `${siteUrl}/admin/collections/leads/<id>`. **Escape all user input** with a small `escapeHtml` helper. Then send the auto-reply to the lead: "Thanks, we'll reply within one business day." Errors are logged (without PII) and never thrown.
- **`notifyApplication`**: the same pattern to `CAREERS_NOTIFY_TO`, with an admin link and **no attachment**.
- **`preventAuthorPublish`** and **`firstUserIsAdmin`**: see §3.5.

## 3.10 Draft preview routes
- `cms/utilities/previewPath.ts`: `previewPath({collection, slug}) => "/next/preview?" + new URLSearchParams({ path: publicUrlFor(collection, slug), collection, slug, secret: process.env.PREVIEW_SECRET })`.
- `app/(frontend)/next/preview/route.ts`: verify the `secret` and check that the user is logged in via `payload.auth({ headers })`, then `(await draftMode()).enable()` and redirect to `path` (only relative paths starting with `/`).
- `app/(frontend)/next/exit-preview/route.ts`: disable draft mode and redirect to `/`.
- Frontend queries pass `draft: isDraftMode` and `overrideAccess: isDraftMode` (Phase 5).
- Live preview: the frontend uses `RefreshRouteOnSave` from `@payloadcms/live-preview-react` (server-side live preview pattern) inside draft mode. Build it in Phase 5; here just configure `admin.livePreview.url` per collection.

## 3.11 Globals
- **`header`**: `nav` (array max 6 of linkField), `cta` (linkField, default "Book a scoping call").
- **`footer`**: `tagline` (default "Software, on the record."), `columns` (array `{title, links: array linkField}` max 4), `legalLinks` (array linkField), `wordmarkCaption` (default "Every bit, on the record").
- **`site-settings`** (update: admin only): `siteName`, `defaultSeo` group `{title, description, ogImage upload}`, `contact` group `{email, phone, address, timezoneNote ("4+ hours overlap with US and EU")}`, `bookingUrl` (text; Cal.com or Calendly link), `organization` group `{legalName, foundingDate, logo upload, sameAs array {url}}`, `socials` group `{linkedin, x, github, clutch}`.
- **`announcement`**: `enabled`, `text`, `link` (linkField).

Every global gets `access.read: anyone`.

---

## 3.12 Admin UX for the marketing team
- Groups in the sidebar: **Content** (Pages, Case Studies, Services, Industries, Insights), **Studio** (Log Entries, Team, Jobs, Testimonials, Clients, Technologies, FAQs, Categories), **Inbox** (Leads, Applications), **Media** (Media, Résumés), **Settings** (Header, Footer, Site Settings, Announcement, Redirects, Users).
- Rename labels for editors: collection `posts` shows as **"Insights"**, and `case-studies` as **"Case Studies (Work)"**.
- Every field that isn't self-explanatory has `admin.description`, and every array has `admin.initCollapsed` and a `RowLabel` showing the row title where useful.
- Add a custom admin **dashboard banner** (`admin.components.beforeDashboard`) with 4 links: "New case study", "New insight", "Add a log entry", "View new leads".
- Branding: `admin.components.graphics.Logo` and `Icon` render the brand square plus "QBITLOG" in mono.

---

## 3.13 Acceptance criteria
- [ ] `npm run dev` → `/admin` loads, the first user signs up and becomes `admin`.
- [ ] Every collection and global in §3.7–§3.11 exists with the listed fields, groups and descriptions.
- [ ] `npm run generate:types` produces `payload-types.ts` with no `any` for these collections, and `npm run generate:importmap` succeeds.
- [ ] An editor can create a draft case study, open live preview (the URL resolves even though the Phase 5 page may still 404), save, and publish.
- [ ] An `author` cannot publish a post (the hook blocks it with a clear error message).
- [ ] Anonymous REST `GET /api/leads` returns 403, `GET /api/resumes` returns 403, and `GET /api/posts` returns only published documents.
- [ ] Uploading an image creates the `thumb/card/feature/og` sizes. With `BLOB_READ_WRITE_TOKEN` set, files land in Vercel Blob.
- [ ] A test lead created via a local script (`payload.create({collection:'leads', overrideAccess:true, …})`) sends both emails (check the Zoho sent folder or log a dry-run).
- [ ] `npm run check` passes.
- [ ] Commit: `redesign(phase-3): payload cms with mongodb, content model and access control`.

## 3.14 Handoff notes

### Versions
- `payload` and every `@payloadcms/*` package: **3.90.2** (pinned exact). `next` **16.3.6** (Payload 3.90.2 peer range: `>=16.3.3 <17`), React 19.1.0, `graphql` 16.14.2, `sharp` 0.35.4, `cross-env` 10, `dotenv` 18 (dev), `server-only`.
- `package.json` now has `"type": "module"` (as in the official blank template). `postcss.config.mjs`, `eslint.config.mjs` and `next.config.ts` still load.
- `next.config.ts` is wrapped with `withPayload(nextConfig, { devBundleServerPackages: false })`. It allows Vercel Blob remote images and local `/api/media/file/**` images.
- `npm run build` still uses `next build --turbopack` (Turbopack compiles Payload without problems). `dev`, `build` and `start` run through `cross-env NODE_OPTIONS=--no-deprecation`. `build` also raises the heap size (`--max-old-space-size=8000`), as the template does.
- The `(payload)` route group was copied from `templates/blank` at tag `v3.90.2`. `app/(payload)/admin/importMap.js` and `payload-types.ts` are generated files, and ESLint ignores them. Re-run `npm run generate:importmap` after adding or renaming any admin component, and `npm run generate:types` after any schema change.

### Email (dry run and fallback)
- The nodemailer (Zoho) adapter is configured **only when `ZOHO_MAIL_USER` is set**. Without it, Payload uses its built-in console email adapter, so dev and CI boot without SMTP.
- `EMAIL_DRY_RUN=true` makes the `notifyLead` and `notifyApplication` hooks skip `sendEmail` and log a single line per email, for example `[email:dry-run] lead notification email skipped (EMAIL_DRY_RUN=true)`. The line contains no names, addresses or form content. In dry-run mode the SMTP verification at boot is also skipped (`skipVerify`).
- If `LEADS_NOTIFY_TO` or `CAREERS_NOTIFY_TO` is missing, the internal email is skipped with a warning. The auto-reply is still sent. Send failures log only the error name and are never thrown.
- The shared helpers (`escapeHtml` and the table builder) are in `cms/hooks/email.ts` and `cms/utilities/escapeHtml.ts`.

### Deviations from the spec
- **Block descriptions.** Payload blocks have no `admin.description`. Instead, each page block starts with a read-only UI field named `help` (`cms/fields/blockHelp.ts`, which renders `cms/components/BlockHelp.tsx`) that holds the editor-facing description. It adds no data and no types.
- **SEO tab.** `seoPlugin` `tabbedUI` only appends its SEO tab when a collection's **first** field is a `tabs` field. Otherwise it moves every field into a "Content" tab, including the sidebar fields. So each SEO collection starts with its own tabs, and `slug`, `publishedAt` and similar fields stay at the top level so they remain in the sidebar. The `meta` group gets an extra `noindex` checkbox (`meta.noindex`, default false) for Phase 6.
- **Delete hook.** `afterDelete` uses a separate `revalidateDelete` hook, because its signature differs from `afterChange`'s `revalidateDoc`. `revalidateDoc` also revalidates when a published document is unpublished, and it revalidates the previous slug when the slug changes. The hook is also attached to the Studio collections listed in §3.9 (jobs, log-entries, team, faqs, testimonials), plus categories and clients.
- **Scheduled publish.** `schedulePublish: true` needs Payload jobs. The config has `jobs: { tasks: [], access.run }`. `run` is allowed for any logged-in user, or for a request with `Authorization: Bearer ${CRON_SECRET}`. Payload registers the `schedulePublish` task itself. **Nothing runs the queue yet.** A later phase must add a cron that calls `GET /api/payload-jobs/run` with that header (for example, Vercel Cron).
- **Author role.** An author can create and update Posts and Log Entries, and can upload Media. Log Entries have no drafts, so an author's log entry is live immediately. Only Posts are protected by `preventAuthorPublish`, which returns a 403 `APIError` with the message "Authors can save drafts but cannot publish…". Authors do not see Leads, Applications or Résumés in the navigation. Scheduling a publish through the jobs queue is not blocked for authors. Review this if it matters.
- **Users.** Admins can read and update everyone. Other users can read and update only themselves. The `role` field has admin-only field-level `create` and `update` access. `firstUserIsAdmin` forces `role: "admin"` when the users collection is empty.
- **Lexical blocks in Posts.** These are block-level nodes (`BlocksFeature({ blocks })`), not inline-in-a-sentence nodes. Their slugs differ from the page-block slugs so the generated types don't collide: `code`, `callout`, `mediaAnnotatedInline`, `decisionRecordInline`, `metricsInline`. The default editor (all other rich-text fields) is Payload's default feature set with headings limited to h2–h4.
- **Link field.** `linkField` has `type` (`internal|external`), `newTab`, `reference` (polymorphic `{ relationTo, value }`), `url` and `label`. It also has a shared `interfaceName: "LinkField"`. When a link is optional, its label is only required once a target is set.
- **Local uploads.** Without Blob or S3, media go to `media/public` and résumés go to `media/resumes`. Both are covered by `/media` in `.gitignore`. Résumés are always served through Payload access control.
- **Image sizes.** Sharp does not upscale images. If a source image is narrower than a size's width, that size exists but has no file (for example, `feature` 1600 from a 960 px source).
- **Extra `admin` UX.** Dashboard banner: `cms/components/BeforeDashboard.tsx`. Its `links` array is where Phase 7 should add the editor-guide link. Logo and Icon: `cms/components/Graphics.tsx`. Array row labels: `cms/components/RowLabel.tsx` (via the `rowLabel(field, fallback)` helper). The admin brand colour is set as `--qbit-brand` in `app/(payload)/custom.scss`.
- `.env.example` gains `CRON_SECRET` and `EMAIL_DRY_RUN`.
- `next dev` (16.3) writes `AGENTS.md` and `CLAUDE.md` at the repo root. Either commit them or set `agentRules: false` in `next.config.ts`.

### Verified locally (MongoDB 8, then the `qbitlog` database was dropped)
`/admin` returns 200. The first user created through `first-register` with `role: "author"` became `admin`. An author can create a draft post but gets a 403 on publish, with the message above. Anonymous `GET /api/leads`, `GET /api/resumes` and `POST /api/leads` return 403. Anonymous `GET /api/posts` returns only published posts. `readingTime` is computed (700 words gives 4 minutes). An upload created the `thumb`, `card`, `feature` and `og` sizes. The draft case study got an auto-generated slug, `/next/preview` returned a 307 to `/work/draft-case` for a logged-in user and a 403 for an anonymous one, and the case study then published. A Local API lead printed both dry-run email lines. The dashboard shows the banner, the logo and the renamed groups.

### [HUMAN]
- Production `DATABASE_URI` (MongoDB Atlas), `PAYLOAD_SECRET`, `PREVIEW_SECRET` and `CRON_SECRET` in Vercel.
- `BLOB_READ_WRITE_TOKEN` (Vercel Blob store) and the private bucket `S3_*` values (Cloudflare R2).
- `LEADS_NOTIFY_TO`, `CAREERS_NOTIFY_TO` and `EMAIL_FROM` (company inboxes). Make sure `EMAIL_DRY_RUN` is **not** `true` in production.
- A Vercel Cron that calls `/api/payload-jobs/run` with `Authorization: Bearer $CRON_SECRET` (needed for scheduled publish).
