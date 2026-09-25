import type { Payload } from "payload";
import { readLegacy, slugify } from "../lib/context";
import { blocksToLexical } from "../lib/html-to-lexical";
import type { LegacyCareer } from "../lib/legacy-types";
import { report } from "../lib/report";
import { upsert } from "../lib/upsert";

export async function seedJobs(payload: Payload) {
  report.step("09 jobs");
  const { careers } = readLegacy<{ careers: LegacyCareer[] }>("careers.json");
  for (const job of careers) {
    const slug = slugify(job.title);
    const items = (list?: string[]) => (list ?? []).map((item) => ({ item }));
    await upsert(
      payload,
      "jobs",
      slug,
      { slug: { equals: slug } },
      {
        title: job.title,
        slug,
        status: "open",
        department: /business development|sales/i.test(job.title) ? "Sales" : "Engineering",
        location: job.location,
        employmentType: "Full-time",
        salary: job.salary,
        summary: job.description,
        description: await blocksToLexical([{ ul: job.positionoverView ?? [] }, { p: job.description }], payload.config),
        responsibilities: items(job.keyResponsibilities),
        requirements: items(job.requirements),
        benefits: items(job.benefits),
        publishedAt: new Date().toISOString(),
        meta: { title: job.title, description: job.description.slice(0, 160) },
      },
      { versioned: true },
    );
  }
}
