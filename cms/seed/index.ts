import type { Payload } from "payload";
import { flags } from "./lib/context";
import { getSeedPayload } from "./lib/payload";
import { report } from "./lib/report";
import { seedMedia } from "./steps/01-media";
import { seedTaxonomy } from "./steps/02-taxonomy";
import { seedTeam } from "./steps/03-team";
import { seedTechnologies } from "./steps/04-technologies";
import { seedServices } from "./steps/05-services";
import { seedIndustries } from "./steps/06-industries";
import { seedCaseStudies } from "./steps/07-case-studies";
import { seedPosts } from "./steps/08-posts";
import { seedJobs } from "./steps/09-jobs";
import { seedFaqs } from "./steps/10-faqs";
import { seedTestimonials } from "./steps/11-testimonials";
import { seedLogEntries } from "./steps/12-log-entries";
import { seedGlobals } from "./steps/13-globals";
import { seedPages } from "./steps/14-pages";
import { seedDecisionDrafts } from "./steps/15-decision-drafts";
import { seedPhase8Drafts } from "./steps/16-phase8-drafts";
import { seedStoryLayer } from "./steps/17-story-layer";
import { seedIndustriesPage } from "./steps/18-industries-page";
import { seedCaseStudyDrafts2026 } from "./steps/19-case-study-drafts-2026";

const STEPS: Array<[string, (p: Payload) => Promise<void>]> = [
  ["media", seedMedia],
  ["taxonomy", seedTaxonomy],
  ["team", seedTeam],
  ["technologies", seedTechnologies],
  ["services", seedServices],
  ["industries", seedIndustries],
  ["case-studies", seedCaseStudies],
  ["posts", seedPosts],
  ["jobs", seedJobs],
  ["faqs", seedFaqs],
  ["testimonials", seedTestimonials],
  ["log-entries", seedLogEntries],
  ["globals", seedGlobals],
  ["pages", seedPages],
  ["decision-drafts", seedDecisionDrafts],
  ["16", seedPhase8Drafts],
  ["17", seedStoryLayer],
  ["18", seedIndustriesPage],
  ["19", seedCaseStudyDrafts2026],
];

async function main() {
  const payload = await getSeedPayload();
  const steps = flags.only ? STEPS.filter(([name]) => flags.only?.split(",").includes(name)) : STEPS;
  if (!steps.length) throw new Error(`Unknown step "${flags.only}". Steps: ${STEPS.map(([n]) => n).join(", ")}`);
  if (flags.dryRun) console.log("Dry run: nothing will be written.");
  for (const [, run] of steps) await run(payload);
  report.summary();
  if (report.failures.length) {
    console.error(`\n${report.failures.length} failure(s).`);
    process.exit(1);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
