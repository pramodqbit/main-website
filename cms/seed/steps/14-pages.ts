import type { Payload } from "payload";
import type { Page } from "../../../payload-types";
import { flags } from "../lib/context";
import { blocksToLexical } from "../lib/html-to-lexical";
import { docLink, urlLink } from "../lib/links";
import { mediaIdFor } from "../lib/media";
import { report } from "../lib/report";
import { findOne, idBySlug, upsert } from "../lib/upsert";

type Layout = Page["layout"];

async function faqId(payload: Payload, question: string): Promise<string | null> {
  return (await findOne(payload, "faqs", { question: { equals: question } }))?.id ?? null;
}

async function testimonialFor(payload: Payload, caseStudySlug: string): Promise<string | null> {
  const cs = await idBySlug(payload, "case-studies", caseStudySlug);
  if (!cs) return null;
  return (await findOne(payload, "testimonials", { caseStudy: { equals: cs } }))?.id ?? null;
}

const METHOD_STEPS = [
  {
    name: "Discover",
    description: "We sit with the people doing the work and write down what actually slows them down.",
    deliverable: "Problem brief · success metrics",
  },
  {
    name: "Decide",
    description: "We weigh the options on paper, including the ones we reject, before writing code.",
    deliverable: "Decision log · architecture · estimate",
  },
  {
    name: "Build",
    description: "Two-week sprints, a demo every sprint, and a written update every Friday in your time zone.",
    deliverable: "Working software · weekly log",
  },
  {
    name: "Measure",
    description: "We check the metrics we agreed in Phase 1 and publish the results, good or bad.",
    deliverable: "Results report · roadmap",
  },
];

async function homeLayout(payload: Payload): Promise<Layout> {
  const batra = await idBySlug(payload, "case-studies", "medical-prescription-ocr");
  const restaurant = await idBySlug(payload, "case-studies", "restaurant-os");
  const dashboard = await mediaIdFor(payload, "/images/case-studies/re-os/dashboard.png");
  const faqs = (
    await Promise.all(
      [
        "[REVIEW] How do you work across US and European time zones?",
        "How long does a typical project take?",
        "What are your pricing models?",
        "[REVIEW] Can you take over an existing codebase?",
      ].map((q) => faqId(payload, q)),
    )
  ).filter((id): id is string => Boolean(id));

  const layout: Layout = [
    {
      blockType: "heroLog",
      labels: ["Software studio", "Web · Mobile · AI"],
      title: "We build the software.",
      emphasis: "And we show our working.",
      subhead:
        "Product teams in the US and Europe use Qbitlog to design, build and ship web, mobile and AI products, with every decision documented and every result measured.",
      primaryCta: urlLink("See the work", "/work"),
      secondaryCta: urlLink("How we work", "/#method"),
      trustItems: [{ text: "GDPR-aware delivery" }, { text: "4+ hrs US / EU overlap" }, { text: "Weekly written updates" }],
      logSource: "caseStudy",
      caseStudy: batra,
      manualLog: {
        title: "batra-hospital / rx-automation",
        status: "SHIPPED",
        rows: [
          { marker: "Wk 01", phase: "DISCOVER", text: "Pharmacists read every handwritten prescription by hand before dispensing." },
          { marker: "Wk 02", phase: "DECIDE", text: "AI handwriting recognition + medical NLP, not fixed templates. No two doctors write alike." },
          { marker: "Wk 06", phase: "BUILD", text: "Every extraction validated against a 253K+ medicine knowledge base." },
          { marker: "Wk 10", phase: "MEASURE", measured: true, text: "99% accuracy · 3–5s per prescription · 80% less manual entry" },
        ],
        footerLeft: "10 weeks · 6 engineers",
        footerLink: docLink("Read the full log", "case-studies", batra, "/work/medical-prescription-ocr"),
      },
      showBitField: true,
    },
    {
      blockType: "proofStrip",
      items: [
        { value: "99", unit: "%", label: "Prescription extraction accuracy", source: "Batra Hospital · Healthcare", featured: true },
        { value: "80", unit: "%", label: "Less manual data entry", source: "Batra Hospital · Healthcare", featured: true },
        { value: "60", unit: "%", label: "Fewer manual admin tasks", source: "RestaurantOS · Hospitality", featured: true },
        { value: "98", unit: "%", label: "Customer satisfaction", source: "HYTP · Travel", featured: true },
      ],
    },
    { blockType: "logTicker", limit: 8 },
  ];

  if (dashboard) {
    layout.push({
      blockType: "showcase",
      label: "Shipped / RestaurantOS / 14 weeks",
      title: "Four tools became",
      emphasis: "one screen.",
      intro:
        "Sales, orders, inventory and staff used to live in separate systems. We designed and built one operations platform that shows a restaurant’s whole day at a glance.",
      image: dashboard,
      chromeLabel: "restaurantos / operations-dashboard",
      annotations: [
        { x: 20, y: 64, title: "Low-stock items surface next to their thresholds.", note: "Kitchens reorder before service, not during it." },
        { x: 57, y: 42, title: "Dine-in, takeaway, delivery and online in one chart.", note: "No more reconciling four reports on Monday." },
        { x: 83, y: 51, title: "Delayed orders are counted live.", note: "Managers act while guests are still at the table." },
      ],
      tilt: true,
      caseStudy: restaurant,
    });
  }

  layout.push(
    {
      blockType: "caseStudyGrid",
      label: "LOG / WORK",
      title: "Selected work, with the receipts",
      intro: "Each project is written up as a log: the problem, the options we weighed, what we chose, and what changed afterwards.",
      more: urlLink("All case studies", "/work"),
      mode: "featured",
      limit: 3,
      firstAsFeature: true,
    },
    {
      blockType: "method",
      label: "LOG / METHOD",
      title: "How a Qbitlog project runs",
      intro: "Four phases, each ending in something you can read, not just a status meeting. You always know what we decided and why.",
      steps: METHOD_STEPS,
      testimonial: await testimonialFor(payload, "medical-prescription-ocr"),
      inverted: true,
    },
    {
      blockType: "serviceList",
      label: "LOG / SERVICES",
      title: "What we can own for you",
      intro: "Described by the outcome you’re buying, not the stack we happen to use.",
      more: urlLink("All services", "/services"),
    },
    {
      blockType: "industryGrid",
      label: "LOG / INDUSTRIES",
      title: "Where we’ve done it before",
      intro: "We’ve worked through the regulations and quirks of these industries on real projects.",
    },
    {
      blockType: "insights",
      label: "LOG / INSIGHTS",
      title: "Written by the people doing the work",
      intro: "Practical notes on AI, web architecture and platform engineering from our engineers.",
      more: urlLink("All insights", "/insights"),
      limit: 4,
      showStudioLog: true,
    },
    { blockType: "faq", label: "LOG / FAQ", faqs },
    {
      blockType: "cta",
      label: "Next entry",
      title: "Let’s write the first page of",
      emphasis: "your log.",
      body: "A 30-minute scoping call with an engineer, not a salesperson. You’ll leave with a clear next step, even if it isn’t us.",
      details: [
        { label: "Reply", value: "Within one business day" },
        { label: "Call", value: "30 minutes, video" },
        { label: "You get", value: "Written summary + rough estimate" },
        { label: "Email", value: "hello@qbitlog.com" },
      ],
    },
  );
  return layout;
}

async function aboutLayout(payload: Payload): Promise<Layout> {
  const story = await blocksToLexical(
    [
      { h2: "Why qbit + log" },
      {
        p: "A qbit is the smallest unit of information. A log is the record of what happened. Qbitlog is a software studio that designs and builds web, mobile and AI products, and writes down every decision along the way.",
      },
      { h2: "How we work" },
      {
        ul: [
          "Show the receipts. Every claim gets a number, a name, or a screenshot.",
          "Decisions over decoration. Each project is built around a decision log: problem, options, decision, why.",
          "Measure what we agreed. We check the metrics we set at the start and publish the results.",
        ],
      },
    ],
    payload.config,
  );
  return [
    { blockType: "richText", content: story, width: "measure" },
    {
      blockType: "method",
      label: "LOG / METHOD",
      title: "How a Qbitlog project runs",
      intro: "Four phases, each ending in something you can read, not just a status meeting.",
      steps: METHOD_STEPS,
      inverted: true,
    },
    { blockType: "teamGrid", label: "LOG / TEAM", title: "The people who lead the work", filter: "leadership", more: urlLink("Meet the whole team", "/about/team") },
    {
      blockType: "cta",
      label: "Next entry",
      title: "Let’s write the first page of",
      emphasis: "your log.",
      body: "A 30-minute scoping call with an engineer, not a salesperson.",
    },
  ];
}

function contactLayout(): Layout {
  return [
    {
      blockType: "contactForm",
      label: "LOG / CONTACT",
      title: "Tell us what you’re building",
      intro: "A few details help us send the right engineer to the first call.",
      showBooking: true,
    },
    { blockType: "faq", label: "LOG / FAQ", title: "Working with us", topic: "engagement" },
  ];
}

async function placeholderLayout(payload: Payload, heading: string): Promise<Layout> {
  const content = await blocksToLexical([{ h2: heading }], payload.config);
  return [{ blockType: "richText", content, width: "measure" }];
}

/** Placeholder privacy policy. The retention periods match app/(frontend)/next/cron/retention (Phase 7 §A3); legal review pending. */
async function privacyLayout(payload: Payload): Promise<Layout> {
  const content = await blocksToLexical(
    [
      { h2: "Qbitlog Privacy Policy (to be written)" },
      { h2: "How long we keep your data" },
      {
        ul: [
          "Contact enquiries (leads): deleted automatically 24 months after you send them.",
          "Job applications and résumés: deleted automatically 12 months after you apply.",
        ],
      },
    ],
    payload.config,
  );
  return [{ blockType: "richText", content, width: "measure" }];
}

export async function seedPages(payload: Payload) {
  report.step("14 pages (drafts)");
  const pages: Array<{ slug: string; title: string; build: () => Promise<Layout> | Layout }> = [
    { slug: "home", title: "Home", build: () => homeLayout(payload) },
    { slug: "about", title: "About", build: () => aboutLayout(payload) },
    { slug: "contact", title: "Contact", build: contactLayout },
    { slug: "privacy", title: "Privacy Policy", build: () => privacyLayout(payload) },
    { slug: "terms", title: "Terms", build: () => placeholderLayout(payload, "Qbitlog Terms (to be written)") },
  ];

  for (const p of pages) {
    const existing = await idBySlug(payload, "pages", p.slug);
    if (existing && !flags.refresh) {
      report.log("pages", p.slug, "skipped", "exists (use --refresh to overwrite the draft)");
      continue;
    }
    await upsert(
      payload,
      "pages",
      p.slug,
      { slug: { equals: p.slug } },
      { title: p.title, slug: p.slug, layout: await p.build() },
      { versioned: true, draft: true },
    );
  }
}
