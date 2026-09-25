import type { Payload } from "payload";
import { flags, seedContext } from "../lib/context";
import { report } from "../lib/report";
import { findOne } from "../lib/upsert";

type Decision = {
  title: string;
  problem: string;
  options: { label: string; chosen?: boolean }[];
  decision: string;
  why: string;
};

const V = "[VERIFY] ";

/**
 * Phase 7 §B1 item 1: decision logs drafted from content/legacy/docs/*.md.
 * Saved as draft versions only; the published case studies are untouched until an editor publishes.
 */
const DECISIONS: Record<string, Decision[]> = {
  "medical-prescription-ocr": [
    {
      title: "How should we read handwritten prescriptions?",
      problem: `${V}Prescriptions are handwritten and often hard to read, and a misread medicine or dose leads to medication errors.`,
      options: [
        { label: "One OCR engine for everything" },
        { label: "Fixed templates per prescription layout" },
        { label: "Google, Azure and AWS OCR in parallel, best result per section", chosen: true },
      ],
      decision: `${V}Run Google Document AI, Azure Form Recognizer and AWS Textract in parallel on every section, and keep the result with the highest confidence.`,
      why: `${V}Different OCR engines are better at different kinds of content. Running all three in parallel keeps the OCR step to about 3 seconds while picking the strongest reading for each section.`,
    },
    {
      title: "Whole page or section by section?",
      problem: `${V}A prescription mixes patient details, a medication list, instructions and a signature. One pass over the whole page treats them all the same.`,
      options: [
        { label: "OCR the whole page in one pass" },
        { label: "Content-aware segmentation into sections", chosen: true },
      ],
      decision: `${V}Split each image into header, medications, instructions and signature sections (about 90 ms) before OCR.`,
      why: `${V}Sections can be processed and scored separately, which improves accuracy for each type of content.`,
    },
    {
      title: "How do we turn raw OCR text into medication records?",
      problem: `${V}OCR output contains misspellings ("Prctmol") and abbreviations ("BD", "TDS") that a pharmacy system can't use directly.`,
      options: [
        { label: "Hand-written parsing rules" },
        { label: "AWS Comprehend Medical + Gemini correction", chosen: true },
        { label: "Pharmacists re-type everything" },
      ],
      decision: `${V}Extract medication, dosage, frequency, duration and route with AWS Comprehend Medical, then correct errors and expand abbreviations with Gemini using medical context.`,
      why: `${V}Medical NLP understands drug entities, and the correction step turns "Prctmol" into "Paracetamol" and "BD" into "Twice daily" before anyone reviews it.`,
    },
    {
      title: "How do we know a medicine name is real?",
      problem: `${V}Even corrected text can name a medicine that doesn't exist or match the wrong brand.`,
      options: [
        { label: "Trust the model output" },
        { label: "Validate against RxNorm and a 253K+ Indian medicine database", chosen: true },
      ],
      decision: `${V}Fuzzy-match every extracted medicine against 253,973+ Indian medicine records and RxNorm codes.`,
      why: `${V}Every medication is checked against a known record, with brand, generic, manufacturer and price attached for the pharmacist.`,
    },
    {
      title: "When does a human check the result?",
      problem: `${V}Some prescriptions will always be too unclear to process automatically, and failing silently is not acceptable in a pharmacy.`,
      options: [
        { label: "Auto-approve everything" },
        { label: "Review every prescription by hand" },
        { label: "Route by confidence score", chosen: true },
      ],
      decision: `${V}Auto-approve at 0.95 confidence or above; below that, send to pharmacist review with low (0.85+), high (0.70+) or urgent priority.`,
      why: `${V}Pharmacists spend their time only on the prescriptions that need them, and nothing uncertain goes straight through.`,
    },
  ],
  "restaurant-os": [
    {
      title: "Build accessible UI components or adopt primitives?",
      problem: `${V}Dialogs, dropdowns and tooltips are complex to make accessible, and staff use the app all day on different devices.`,
      options: [
        { label: "Build every component from scratch" },
        { label: "A fully styled component library" },
        { label: "Radix UI headless primitives", chosen: true },
      ],
      decision: `${V}Use Radix UI primitives for dialogs, menus, switches, toasts and tooltips, styled to the RestaurantOS design system.`,
      why: `${V}Radix provides keyboard navigation, focus management and screen-reader support out of the box, while leaving the visual design fully custom.`,
    },
    {
      title: "How do we keep styling consistent as the app grows?",
      problem: `${V}As the app grew, class-name collisions and inconsistent styling became hard to manage.`,
      options: [
        { label: "Global CSS" },
        { label: "CSS-in-JS" },
        { label: "CSS Modules + CSS custom properties", chosen: true },
      ],
      decision: `${V}Scope styles per component with CSS Modules and share design tokens as CSS custom properties.`,
      why: `${V}No runtime styling cost, no collisions, and light/dark themes switch by changing variables.`,
    },
    {
      title: "How do we manage orders, inventory and menu data?",
      problem: `${V}Orders, inventory and menu items are server state that must stay fresh without a lot of boilerplate.`,
      options: [
        { label: "Redux" },
        { label: "TanStack Query", chosen: true },
      ],
      decision: `${V}Use TanStack Query for caching, background updates and loading/error states.`,
      why: `${V}It removes Redux boilerplate and is ready for a real API and live updates.`,
    },
    {
      title: "How do we model the order workflow?",
      problem: `${V}Orders move through pending, confirmed, preparing, ready, served and completed, and every screen needs to show the status the same way.`,
      options: [
        { label: "Handle statuses separately on each screen" },
        { label: "One central status configuration", chosen: true },
      ],
      decision: `${V}Define every status once, with its label, icon and colour, and use it everywhere.`,
      why: `${V}Status indicators stay consistent across screens, and adding a new status is a one-line change.`,
    },
  ],
  "hire-your-travel-partner": [
    {
      title: "How do families come to trust a companion?",
      problem: `${V}Families need confidence before sending an elderly parent to travel with someone they haven't met.`,
      options: [
        { label: "An open marketplace of companions" },
        { label: "Vetted companions with pre-trip meetings", chosen: true },
      ],
      decision: `${V}Build a companion vetting workflow with background checks, medical certification and a pre-trip meeting where the family interviews the companion.`,
      why: `${V}Trust is the product. Families meet and approve the companion before any booking is confirmed.`,
    },
    {
      title: "Standard travel APIs or a custom itinerary engine?",
      problem: `${V}Standard travel APIs don't account for senior-friendly needs such as wheelchair access, nearby hospitals or dietary restrictions.`,
      options: [
        { label: "Standard travel booking APIs" },
        { label: "A custom itinerary engine curated by companions", chosen: true },
      ],
      decision: `${V}Let companions curate itineraries that prioritise safety and comfort, with family check-ins built in.`,
      why: `${V}Every trip is planned around the traveler's health and mobility, not the fastest route.`,
    },
    {
      title: "How do families stay updated during a trip?",
      problem: `${V}Families want to know their parent is safe, and many seniors aren't comfortable with new apps.`,
      options: [
        { label: "Updates only inside a new app" },
        { label: "WhatsApp Business check-ins and photo updates", chosen: true },
      ],
      decision: `${V}Send family check-ins and photo/video updates over WhatsApp Business, backed by a 24/7 support line.`,
      why: `${V}Families get updates on an app they already use, and emergencies have a clear protocol.`,
    },
  ],
};

export async function seedDecisionDrafts(payload: Payload) {
  report.step("15 decision-log drafts");
  for (const [slug, decisions] of Object.entries(DECISIONS)) {
    const doc = await findOne(payload, "case-studies", { slug: { equals: slug } });
    if (!doc) {
      report.log("case-studies", slug, "failed", "case study not found");
      continue;
    }
    const existing = (doc as { decisions?: unknown[] | null }).decisions;
    if (existing?.length) {
      report.log("case-studies", slug, "skipped", "latest version already has decisions");
      continue;
    }
    if (flags.dryRun) {
      report.log("case-studies", slug, "updated", `dry run: ${decisions.length} draft decisions`);
      continue;
    }
    await payload.update({
      collection: "case-studies",
      id: doc.id,
      data: { decisions, _status: "draft" },
      draft: true,
      overrideAccess: true,
      context: seedContext,
    });
    report.log("case-studies", slug, "updated", `${decisions.length} decisions saved as a draft version`);
  }
}
