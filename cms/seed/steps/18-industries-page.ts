import type { Payload } from "payload";
import type { Faq, Footer, Header, Page } from "../../../payload-types";
import { flags, seedContext } from "../lib/context";
import { urlLink } from "../lib/links";
import { report } from "../lib/report";
import { findOne, idBySlug, upsert } from "../lib/upsert";

/**
 * The `/industries` landing page as a Payload page (slug "industries"), created as a DRAFT, with its own FAQs.
 * Also repoints header/footer "Industries" links from the first industry to the new index.
 */

/** FAQs have no drafts, so they carry a [REVIEW] prefix (hidden outside preview) until marketing approves them. */
const FAQS: { question: string; answer: string; topic: NonNullable<Faq["topic"]> }[] = [
  {
    question: "[REVIEW] We still run on spreadsheets and email. Is it too early to talk?",
    answer:
      "No, that’s often the best time. We start by mapping how the work flows today and pick the one process that costs your team the most time. You don’t need a spec, a technical team or a big budget to begin.",
    topic: "process",
  },
  {
    question: "[REVIEW] Can we start small?",
    answer: "Yes. Many clients start with a 2–4 week audit or a single feature, then decide whether to continue.",
    topic: "engagement",
  },
  {
    question: "[REVIEW] Do you need experience in our industry to help us?",
    answer:
      "It helps, which is why we list the industries we’ve shipped in. But most of the work is the same everywhere: understand how your people really work, remove the manual steps, and build software they want to use. Where your industry has rules we haven’t worked with, we say so in the first call and plan the research into the estimate.",
    topic: "general",
  },
  {
    question: "[REVIEW] Can you work with the systems we already use?",
    answer:
      "Usually, yes. We connect to your existing tools through their APIs or exports instead of asking you to replace everything on day one. If something does need replacing, we write down why and plan the move so the work never stops.",
    topic: "technical",
  },
  {
    question: "[REVIEW] How do you handle sensitive or regulated data?",
    answer:
      "We design for it from the start: access control, audit trails, encryption, and data stored in the region you need. We work to the rules that apply to you, such as GDPR, and document every decision so your compliance team can review it.",
    topic: "technical",
  },
  {
    question: "[REVIEW] How will we know it’s working?",
    answer:
      "Before we build, we agree the numbers that matter to you, such as hours saved or orders handled. We measure them before and after, and share the results in writing. If something isn’t working, you hear it from us first.",
    topic: "process",
  },
  /* Shared with /services and /work (Phase 8 drafts): reused as they are if they already exist. */
  {
    question: "[REVIEW] What happens after launch?",
    answer: "We hand over documentation and access, and can stay on for support and new features on a monthly basis.",
    topic: "engagement",
  },
];

/**
 * Creates the FAQs and returns their ids in order. A question that already exists (approved, or in review
 * from another step) is reused as it is, never overwritten: other pages may show it.
 */
async function seedFaqs(payload: Payload): Promise<string[]> {
  const ids: string[] = [];
  for (const [i, f] of FAQS.entries()) {
    const bare = f.question.replace(/^\[REVIEW\]\s*/, "");
    const existing = await findOne(payload, "faqs", { or: [{ question: { equals: bare } }, { question: { equals: f.question } }] });
    if (existing) {
      report.log("faqs", bare, "skipped", "already exists, reused as is");
      ids.push(existing.id);
      continue;
    }
    const id = await upsert(payload, "faqs", f.question, { question: { equals: f.question } }, { ...f, order: 200 + i });
    if (id) ids.push(id);
  }
  return ids;
}

const layout = (faqs: string[]): Page["layout"] => [
  {
    blockType: "industryGrid",
    label: "LOG / INDUSTRIES",
    title: "Where we’ve done it",
    emphasis: "before.",
    intro:
      "Every industry has its own rules: patient data, payments, peak-hour load, legacy systems. These are the ones we’ve already shipped through on real projects.",
  },
  {
    blockType: "beforeAfter",
    label: "LOG / WHAT GETS EASIER",
    title: "Less chasing,",
    emphasis: "more doing.",
    intro: "Whatever the industry, the same problems slow teams down. This is what we take off their plate.",
    rows: [
      {
        aspect: "Data entry",
        before: "People retype the same information into three different tools.",
        after: "It’s entered once and flows everywhere it’s needed.",
      },
      {
        aspect: "Status",
        before: "Knowing where things stand means a phone call or a meeting.",
        after: "One screen shows the whole day, live, to everyone who needs it.",
      },
      {
        aspect: "Reporting",
        before: "Someone spends Monday morning stitching spreadsheets together.",
        after: "Reports build themselves from the data you already have.",
      },
      {
        aspect: "Growth",
        before: "Every new customer or location adds more manual work.",
        after: "The system absorbs the extra load, so the team doesn’t have to.",
      },
      {
        aspect: "Knowledge",
        before: "How things work lives in a few people’s heads.",
        after: "Decisions and processes are written down, so anyone can pick them up.",
      },
    ],
  },
  {
    blockType: "method",
    label: "LOG / FROM 0 TO 1",
    title: "From the first call to a system",
    emphasis: "that grows with you.",
    intro:
      "You don’t need a big transformation plan. We start with the one workflow that costs you the most, prove it works, then build on it one step at a time.",
    steps: [
      {
        name: "Map",
        description: "We sit with your team and follow the work: where people retype data, wait on each other or chase spreadsheets.",
        deliverable: "Workflow map · the first problem worth fixing",
      },
      {
        name: "Prove",
        description: "We build a small working version around that one problem, used by real people on real data, before you commit to more.",
        deliverable: "Working pilot · before / after numbers",
      },
      {
        name: "Build",
        description: "The pilot becomes a product your whole team relies on: secure, connected to the tools you already use, every decision written down.",
        deliverable: "Production system · decision log",
      },
      {
        name: "Grow",
        description: "As you grow, we automate the next manual step and scale the system before it becomes the bottleneck.",
        deliverable: "Roadmap · results report",
      },
      {
        name: "Hand over",
        description: "Everything is documented well enough for your own team, or a new one, to run it. You’re never locked in.",
        deliverable: "Code · docs · runbooks",
      },
    ],
    inverted: true,
  },
  {
    blockType: "caseStudyGrid",
    label: "LOG / WORK",
    title: "The projects behind them",
    intro: "Each one is written up as a log: the problem, the options we weighed, what we chose, and what changed afterwards.",
    more: urlLink("All case studies", "/work"),
    mode: "featured",
    limit: 3,
    firstAsFeature: false,
  },
  {
    blockType: "insights",
    label: "LOG / INSIGHTS",
    title: "Notes from the work",
    intro: "Practical write-ups from the engineers who built these projects.",
    more: urlLink("All insights", "/insights"),
    limit: 3,
    showStudioLog: false,
  },
  { blockType: "faq", label: "LOG / FAQ", title: "Before you get in touch", faqs },
  {
    blockType: "cta",
    label: "Next entry",
    title: "Don’t see your industry?",
    emphasis: "Tell us about it.",
    body: "A 30-minute scoping call with an engineer. We’ll tell you honestly what we know, and what we’d need to learn.",
  },
];

/**
 * "Problems we solve" per industry, taken from each industry's case studies (SaaS has none yet, so it's general).
 * Shown on the industry tiles and as "What slows teams down" on the industry page. Saved as DRAFT versions.
 */
const PAIN_POINTS: Record<string, { title: string; description: string }[]> = {
  healthcare: [
    {
      title: "Handwritten records retyped by hand",
      description: "Staff read and retype handwritten prescriptions before anything else can happen.",
    },
    {
      title: "No room for silent errors",
      description: "A misread medicine or dose is a patient-safety risk, so anything unclear has to go to a person.",
    },
  ],
  hospitality: [
    {
      title: "Four tools that never agree",
      description: "Sales, orders, inventory and staff live in separate systems, reconciled by hand.",
    },
    {
      title: "Problems found during service",
      description: "Low stock and delayed orders surface when guests are already waiting.",
    },
  ],
  travel: [
    {
      title: "Trust before the first trip",
      description: "Families need confidence before sending a parent to travel with someone they haven’t met.",
    },
    {
      title: "Trips planned over calls",
      description: "Bookings, needs and updates are scattered across phone calls and messages.",
    },
  ],
  saas: [
    {
      title: "Ship fast without a rewrite",
      description: "You need a first version quickly, on foundations you won’t have to throw away.",
    },
    {
      title: "Founders stuck on infrastructure",
      description: "Time goes into servers and tooling instead of customers.",
    },
  ],
};

async function seedPainPoints(payload: Payload) {
  for (const [slug, painPoints] of Object.entries(PAIN_POINTS)) {
    const res = await payload.find({ collection: "industries", where: { slug: { equals: slug } }, limit: 1, depth: 0, draft: true, overrideAccess: true });
    const ind = res.docs[0];
    if (!ind) {
      report.log("industries", slug, "skipped", "not found");
      continue;
    }
    if (ind.painPoints?.length) {
      report.log("industries", slug, "skipped", "already has pain points");
      continue;
    }
    if (!flags.dryRun) {
      await payload.update({
        collection: "industries",
        id: ind.id,
        data: { painPoints, _status: "draft" },
        draft: true,
        overrideAccess: true,
        context: seedContext,
      });
    }
    report.log("industries", slug, "updated", "pain points added as a draft version");
  }
}

const OLD_HREF = /^\/industries\/[^/]+$/;

type NavItem = { link?: { type?: string | null; url?: string | null; label?: string | null } | null };

/** Repoint "Industries" links that go to a single industry. Returns true if anything changed. */
function repoint(items: NavItem[] | null | undefined): boolean {
  let changed = false;
  for (const item of items ?? []) {
    const l = item.link;
    if (l?.type === "external" && l.label === "Industries" && OLD_HREF.test(l.url ?? "")) {
      l.url = "/industries";
      changed = true;
    }
  }
  return changed;
}

export async function seedIndustriesPage(payload: Payload) {
  report.step("18 industries landing page (draft) + FAQs + nav links");

  const faqs = await seedFaqs(payload);
  await seedPainPoints(payload);
  const existing = await idBySlug(payload, "pages", "industries");
  if (existing && !flags.refresh) {
    report.log("pages", "industries", "skipped", "exists (use --refresh to overwrite the draft)");
  } else {
    await upsert(
      payload,
      "pages",
      "industries",
      { slug: { equals: "industries" } },
      { title: "Industries", slug: "industries", layout: layout(faqs) },
      { versioned: true, draft: true },
    );
  }

  const header = (await payload.findGlobal({ slug: "header", depth: 0 })) as Header;
  if (repoint(header.nav as NavItem[])) {
    if (!flags.dryRun) await payload.updateGlobal({ slug: "header", data: { nav: header.nav }, context: seedContext });
    report.log("globals", "header", "updated", "Industries → /industries");
  }

  const footer = (await payload.findGlobal({ slug: "footer", depth: 0 })) as Footer;
  const footerChanged = (footer.columns ?? []).map((c) => repoint(c.links as NavItem[])).some(Boolean);
  if (footerChanged) {
    if (!flags.dryRun) await payload.updateGlobal({ slug: "footer", data: { columns: footer.columns }, context: seedContext });
    report.log("globals", "footer", "updated", "Industries → /industries");
  }
}
