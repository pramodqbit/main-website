import type { Payload } from "payload";
import { report } from "../lib/report";
import { upsert } from "../lib/upsert";

/** Copy from docs/redesign/reference/homepage-prototype.html (#industries). Created as drafts. */
export const INDUSTRIES = [
  {
    slug: "healthcare",
    title: "Healthcare",
    headline: "Clinical workflows & AI",
    summary: "Prescription automation, patient portals, and privacy-conscious data handling.",
    compliance: ["HIPAA", "GDPR"],
    order: 1,
  },
  {
    slug: "hospitality",
    title: "Hospitality & Restaurants",
    headline: "Restaurant operations",
    summary: "Ordering, inventory, multi-location reporting and staff tooling.",
    compliance: ["GDPR"],
    order: 2,
  },
  {
    slug: "travel",
    title: "Travel & Senior Care",
    headline: "Booking & trip platforms",
    summary: "Itineraries, bookings, traveler support and family communication.",
    compliance: ["GDPR"],
    order: 3,
  },
  {
    slug: "saas",
    title: "SaaS & Startups",
    headline: "Products from zero to v1",
    summary: "MVPs, multi-tenant platforms and AI features for funded startups.",
    compliance: ["GDPR"],
    order: 4,
  },
] as const;

/** Legacy `industry` strings → industry slug. */
export const INDUSTRY_BY_LEGACY: Record<string, string> = {
  Healthcare: "healthcare",
  "Travel & Senior Care": "travel",
  "Hospitality & Restaurants": "hospitality",
};

export async function seedIndustries(payload: Payload) {
  report.step("06 industries (draft)");
  for (const i of INDUSTRIES) {
    await upsert(
      payload,
      "industries",
      i.slug,
      { slug: { equals: i.slug } },
      {
        title: i.title,
        slug: i.slug,
        headline: i.headline,
        summary: i.summary,
        compliance: i.compliance.map((name) => ({ name })),
        order: i.order,
      },
      { versioned: true, draft: true },
    );
  }
}
