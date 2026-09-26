import type { Payload } from "payload";
import type { Footer, Header, SiteSetting } from "../../../payload-types";
import { flags, seedContext } from "../lib/context";
import { urlLink } from "../lib/links";
import { report } from "../lib/report";

const header: Omit<Header, "id"> = {
  nav: [
    { link: urlLink("Work", "/work") },
    { link: urlLink("Services", "/services") },
    { link: urlLink("Industries", "/industries") },
    { link: urlLink("Insights", "/insights") },
    { link: urlLink("About", "/about") },
  ],
  cta: urlLink("Book a scoping call", "/contact"),
};

const footer: Omit<Footer, "id"> = {
  tagline: "Software, on the record.",
  columns: [
    {
      title: "Work",
      links: [
        { link: urlLink("Case studies", "/work") },
        { link: urlLink("Industries", "/industries") },
        { link: urlLink("Studio log", "/log") },
      ],
    },
    {
      title: "Services",
      links: [
        { link: urlLink("AI & ML", "/services/ai-machine-learning") },
        { link: urlLink("Web", "/services/web-development") },
        { link: urlLink("Mobile", "/services/mobile-development") },
        { link: urlLink("Design", "/services/uiux") },
        { link: urlLink("Cloud", "/services/cloud-solutions") },
      ],
    },
    {
      title: "Company",
      links: [
        { link: urlLink("About", "/about") },
        { link: urlLink("Team", "/about/team") },
        { link: urlLink("Careers", "/careers") },
        { link: urlLink("Insights", "/insights") },
        { link: urlLink("Contact", "/contact") },
      ],
    },
  ],
  legalLinks: [
    { link: urlLink("Privacy", "/privacy") },
    { link: urlLink("Terms", "/terms") },
    { link: urlLink("Academy AI Privacy", "/academyai/privacy-policy") },
    { link: urlLink("Academy AI Terms", "/academyai/terms-and-conditions") },
  ],
  wordmarkCaption: "Every bit, on the record",
};

const siteSettings: Omit<SiteSetting, "id"> = {
  siteName: "Qbitlog",
  defaultSeo: {
    title: "Qbitlog: Software, on the record",
    description:
      "Qbitlog designs and builds web, mobile and AI products for teams in the US and Europe, with every decision documented and every result measured.",
  },
  contact: { email: "hello@qbitlog.com" },
  organization: {
    legalName: "Qbitlog",
    sameAs: [{ url: "https://linkedin.com/company/qbitlog" }, { url: "https://twitter.com/qbitlog" }],
  },
  socials: { linkedin: "https://linkedin.com/company/qbitlog", x: "https://twitter.com/qbitlog" },
};

async function seedGlobal<T extends object>(
  payload: Payload,
  slug: "header" | "footer" | "site-settings",
  data: T,
  isFilled: (current: Record<string, unknown>) => boolean,
) {
  const current = (await payload.findGlobal({ slug, depth: 0, overrideAccess: true })) as unknown as Record<string, unknown>;
  if (isFilled(current) && !flags.refresh) {
    report.log("globals", slug, "skipped", "already has content (use --refresh to overwrite)");
    return;
  }
  if (flags.dryRun) {
    report.log("globals", slug, "updated", "dry-run");
    return;
  }
  try {
    await payload.updateGlobal({ slug, data: data as never, overrideAccess: true, context: seedContext });
    report.log("globals", slug, "updated");
  } catch (err) {
    report.log("globals", slug, "failed", err instanceof Error ? err.message : String(err));
  }
}

export async function seedGlobals(payload: Payload) {
  report.step("13 globals");
  await seedGlobal(payload, "header", header, (c) => Array.isArray(c.nav) && c.nav.length > 0);
  await seedGlobal(payload, "footer", footer, (c) => Array.isArray(c.columns) && c.columns.length > 0);
  // siteName and timezoneNote have defaults, so "filled" means an editor has set the contact email.
  await seedGlobal(payload, "site-settings", siteSettings, (c) => Boolean((c.contact as { email?: string } | undefined)?.email));
}
