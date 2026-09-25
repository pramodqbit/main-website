import "server-only";
import type { CaseStudy, Faq, Job, Media, Post, Service, SiteSetting, Team } from "@/payload-types";
import { lexicalToPlainHtml } from "@/lib/lexical";
import { absoluteUrl, siteUrl } from "@/lib/site";

type Crumb = { label: string; href?: string | null };

const ORG_ID = `${siteUrl}/#organization`;

function img(m: Media | string | number | null | undefined): string | undefined {
  if (!m || typeof m !== "object" || !m.url) return undefined;
  return absoluteUrl(m.sizes?.og?.url || m.url);
}

export function organizationLd(settings: SiteSetting | null) {
  const org = settings?.organization;
  const sameAs = [
    ...(org?.sameAs ?? []).map((s) => s.url),
    settings?.socials?.linkedin,
    settings?.socials?.x,
    settings?.socials?.github,
    settings?.socials?.clutch,
  ].filter((u): u is string => Boolean(u));
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: org?.legalName || settings?.siteName || "Qbitlog",
    url: siteUrl,
    logo: img(org?.logo) ?? absoluteUrl("/icon.png"),
    ...(sameAs.length ? { sameAs: Array.from(new Set(sameAs)) } : {}),
    ...(org?.foundingDate ? { foundingDate: org.foundingDate.slice(0, 10) } : {}),
    ...(settings?.contact?.email ? { email: settings.contact.email } : {}),
  };
}

export function websiteLd(settings: SiteSetting | null) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings?.siteName || "Qbitlog",
    url: siteUrl,
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbLd(items: Crumb[], currentPath: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: absoluteUrl(c.href || currentPath),
    })),
  };
}

function authorLd(a: Team | string | number) {
  if (typeof a !== "object") return null;
  if (a.kind === "team") return { "@type": "Organization", name: a.name, url: siteUrl };
  return { "@type": "Person", name: a.name, jobTitle: a.role, url: absoluteUrl(`/about/team#${a.slug}`) };
}

export function postLd(post: Post, path: string) {
  const authors = (post.authors ?? []).map(authorLd).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.meta?.description || post.excerpt,
    image: img(post.meta?.image) ?? img(post.heroImage) ?? absoluteUrl(`${path}/opengraph-image`),
    datePublished: post.publishedAt ?? post.createdAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: absoluteUrl(path),
    author: authors.length ? authors : { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

export function caseStudyLd(cs: CaseStudy, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: cs.title,
    description: cs.meta?.description || cs.summary,
    image: img(cs.meta?.image) ?? img(cs.heroImage) ?? absoluteUrl(`${path}/opengraph-image`),
    ...(cs.year ? { datePublished: String(cs.year) } : {}),
    dateModified: cs.updatedAt,
    about: { "@type": "Organization", name: cs.client },
    mainEntityOfPage: absoluteUrl(path),
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    ...(cs.status === "prototype" ? { creativeWorkStatus: "Prototype" } : {}),
  };
}

export function serviceLd(s: Service, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.title,
    description: s.meta?.description || s.summary,
    serviceType: s.category,
    url: absoluteUrl(path),
    provider: { "@id": ORG_ID },
    areaServed: ["US", "EU"],
  };
}

/** FAQPage for the questions visible on the page, excluding unreviewed `[REVIEW]` ones. */
export function faqLd(faqs: Array<Pick<Faq, "question" | "answer">>) {
  const visible = faqs.filter((f) => f.question && f.answer && !f.question.startsWith("[REVIEW]"));
  if (!visible.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: visible.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

const EMPLOYMENT: Record<string, string> = {
  "Full-time": "FULL_TIME",
  "Part-time": "PART_TIME",
  Contract: "CONTRACTOR",
  Internship: "INTERN",
};

/** Parses "$60,000 – $80,000 / year" style strings. Returns null if it can't be parsed confidently. */
function parseSalary(s: string | null | undefined) {
  if (!s) return null;
  const currency = /€|EUR/i.test(s) ? "EUR" : /£|GBP/i.test(s) ? "GBP" : /₹|INR/i.test(s) ? "INR" : /\$|USD/i.test(s) ? "USD" : null;
  const nums = (s.match(/\d[\d,.]*\s*[kK]?/g) ?? []).map((n) => {
    const k = /k/i.test(n);
    const v = Number(n.replace(/[^\d.]/g, ""));
    return k ? v * 1000 : v;
  });
  if (!currency || !nums.length || nums.some((n) => !Number.isFinite(n) || n <= 0)) return null;
  const unit = /hour/i.test(s) ? "HOUR" : /month/i.test(s) ? "MONTH" : "YEAR";
  const [min, max] = nums;
  return {
    "@type": "MonetaryAmount",
    currency,
    value: { "@type": "QuantitativeValue", ...(max ? { minValue: min, maxValue: max } : { value: min }), unitText: unit },
  };
}

export function jobLd(job: Job, path: string, settings: SiteSetting | null) {
  if (job.status !== "open") return null;
  const remote = /remote/i.test(job.location);
  const html = [
    job.summary ? `<p>${escape(job.summary)}</p>` : "",
    lexicalToPlainHtml(job.description),
    list("Responsibilities", job.responsibilities),
    list("Requirements", job.requirements),
    list("Benefits", job.benefits),
  ].join("");
  const salary = parseSalary(job.salary);
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: html,
    datePosted: (job.publishedAt ?? job.createdAt).slice(0, 10),
    ...(job.validThrough ? { validThrough: job.validThrough } : {}),
    ...(job.employmentType ? { employmentType: EMPLOYMENT[job.employmentType] } : {}),
    hiringOrganization: {
      "@type": "Organization",
      name: settings?.organization?.legalName || "Qbitlog",
      sameAs: siteUrl,
      logo: img(settings?.organization?.logo) ?? absoluteUrl("/icon.png"),
    },
    url: absoluteUrl(path),
    ...(remote
      ? { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "Worldwide" } }
      : { jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.location } } }),
    ...(salary ? { baseSalary: salary } : {}),
  };
}

function escape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function list(title: string, rows: Array<{ item?: string | null }> | null | undefined) {
  const items = (rows ?? []).map((r) => r.item).filter(Boolean) as string[];
  if (!items.length) return "";
  return `<h3>${title}</h3><ul>${items.map((i) => `<li>${escape(i)}</li>`).join("")}</ul>`;
}
