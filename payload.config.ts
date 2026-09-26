import dns from "node:dns";
import path from "path";
import { fileURLToPath } from "url";

const mongoDns = process.env.MONGODB_DNS_SERVERS?.trim();
if (mongoDns) {
  dns.setServers(mongoDns.split(",").map((s) => s.trim()).filter(Boolean));
}
import sharp from "sharp";
import { buildConfig, type PayloadRequest } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import * as C from "./cms/collections";
import * as G from "./cms/globals";
import { defaultEditor } from "./cms/fields/editor";
import { publicUrlFor } from "./cms/utilities/paths";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

/**
 * Zoho SMTP is only wired when credentials exist. Without them Payload falls back to its console
 * email adapter, so local dev and CI boot without SMTP. `EMAIL_DRY_RUN=true` additionally makes the
 * lead/application hooks log a one-line dry run instead of sending (see cms/hooks/email.ts).
 */
const email = process.env.ZOHO_MAIL_USER
  ? nodemailerAdapter({
      defaultFromAddress: process.env.EMAIL_FROM ?? "hello@qbitlog.com",
      defaultFromName: "Qbitlog",
      skipVerify: process.env.EMAIL_DRY_RUN === "true",
      transportOptions: {
        host: process.env.ZOHO_SMTP_HOST ?? "smtp.zoho.com",
        port: 465,
        secure: true,
        auth: { user: process.env.ZOHO_MAIL_USER, pass: process.env.ZOHO_MAIL_APP_PASSWORD },
      },
    })
  : undefined;

/** Scheduled publish runs as a Payload job. Logged-in admins, or a cron presenting CRON_SECRET, may run the queue. */
const canRunJobs = ({ req }: { req: PayloadRequest }): boolean => {
  if (req.user) return true;
  const secret = process.env.CRON_SECRET;
  return Boolean(secret) && req.headers.get("authorization") === `Bearer ${secret}`;
};

type SeoDoc = { title?: unknown; summary?: unknown; excerpt?: unknown; slug?: unknown } | undefined;

export default buildConfig({
  serverURL: siteUrl,
  secret: process.env.PAYLOAD_SECRET ?? "",
  db: mongooseAdapter({ url: process.env.DATABASE_URI ?? "" }),
  editor: defaultEditor,
  sharp,
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  admin: {
    user: C.Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: " · Qbitlog CMS" },
    components: {
      beforeDashboard: ["/cms/components/BeforeDashboard#BeforeDashboard"],
      views: {
        contentHealth: { Component: "/cms/components/ContentHealth#ContentHealth", path: "/content-health" },
      },
      graphics: {
        Logo: "/cms/components/Graphics#Logo",
        Icon: "/cms/components/Graphics#Icon",
      },
    },
    livePreview: {
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 390, height: 844 },
        { label: "Tablet", name: "tablet", width: 820, height: 1180 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
  },
  collections: [
    C.Pages, C.CaseStudies, C.Services, C.Industries, C.Posts,
    C.LogEntries, C.Team, C.Jobs, C.Testimonials, C.Clients, C.Technologies, C.Faqs, C.Categories,
    C.Leads, C.Applications, C.Media, C.Resumes, C.Users,
  ],
  globals: [G.Header, G.Footer, G.SiteSettings, G.Announcement, G.ServicesPage, G.WorkPage],
  ...(email ? { email } : {}),
  jobs: {
    access: { run: canRunJobs },
    tasks: [],
  },
  cors: [siteUrl],
  csrf: [siteUrl],
  plugins: [
    seoPlugin({
      collections: ["pages", "case-studies", "services", "industries", "posts", "jobs"],
      uploadsCollection: "media",
      tabbedUI: true,
      fields: ({ defaultFields }) => [
        ...defaultFields,
        {
          name: "noindex",
          type: "checkbox",
          label: "Hide from search engines (noindex)",
          defaultValue: false,
          admin: { description: "Tick only for pages that must not appear in Google (e.g. thank-you pages)." },
        },
      ],
      generateTitle: ({ doc }) => `${String((doc as SeoDoc)?.title ?? "")} · Qbitlog`,
      generateDescription: ({ doc }) => {
        const d = doc as SeoDoc;
        return String(d?.summary ?? d?.excerpt ?? "");
      },
      generateURL: ({ doc, collectionSlug }) => {
        const slug = (doc as SeoDoc)?.slug;
        return `${siteUrl}${publicUrlFor(collectionSlug ?? "", typeof slug === "string" ? slug : null)}`;
      },
    }),
    redirectsPlugin({
      collections: ["pages", "case-studies", "services", "industries", "posts"],
      redirectTypes: ["301", "302"],
      overrides: {
        admin: {
          group: "Settings",
          description: "Send old URLs to new ones. Add one whenever you change a published slug.",
        },
      },
    }),
    /**
     * All uploads live in Vercel Blob; without a token Payload falls back to local disk (dev only).
     * Blob objects are public-only, so résumés get a random suffix (unguessable URL) and are still
     * served to the admin through /api/resumes/file/*, which enforces the collection's read access.
     * clientUploads sends admin uploads straight to Blob, bypassing Vercel's 4.5MB body limit.
     */
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      token: process.env.BLOB_READ_WRITE_TOKEN,
      collections: {
        media: { prefix: "media" },
        resumes: { prefix: "resumes" },
      },
      addRandomSuffix: true,
      alwaysInsertFields: true,
      clientUploads: true,
    }),
  ],
});
