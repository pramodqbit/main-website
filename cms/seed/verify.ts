import type { CollectionSlug, Where } from "payload";
import { readLegacy } from "./lib/context";
import type { LegacyCareer, LegacyCaseStudy, LegacyFaq, LegacyPost, LegacyTeamMember } from "./lib/legacy-types";
import { getSeedPayload } from "./lib/payload";

const published: Where = { _status: { equals: "published" } };

async function main() {
  const payload = await getSeedPayload();
  const count = async (collection: CollectionSlug, where?: Where) =>
    (await payload.count({ collection, where, overrideAccess: true })).totalDocs;

  const posts = readLegacy<LegacyPost[]>("posts.json");
  const studies = readLegacy<LegacyCaseStudy[]>("case-studies.json");
  const team = readLegacy<LegacyTeamMember[]>("team.json");
  const faqs = readLegacy<LegacyFaq[]>("faqs.json");
  const { careers } = readLegacy<{ careers: LegacyCareer[] }>("careers.json");

  const rows = [
    { source: "posts.json", expected: `${posts.length} published`, actual: await count("posts", published), ok: (n: number) => n === posts.length },
    { source: "case-studies.json", expected: `${studies.length} published`, actual: await count("case-studies", published), ok: (n: number) => n === studies.length },
    { source: "services/*.json", expected: "5 published", actual: await count("services", published), ok: (n: number) => n === 5 },
    { source: "careers.json", expected: `${careers.length} published`, actual: await count("jobs", published), ok: (n: number) => n === careers.length },
    { source: "team.json", expected: `${team.length} (+1 team author)`, actual: await count("team"), ok: (n: number) => n === team.length + 1 },
    { source: "faqs.json", expected: `>= ${faqs.length}`, actual: await count("faqs"), ok: (n: number) => n >= faqs.length },
  ];

  let failed = 0;
  const table = rows.map((r) => {
    const pass = r.ok(r.actual);
    if (!pass) failed++;
    return { source: r.source, expected: r.expected, payload: r.actual, result: pass ? "PASS" : "FAIL" };
  });
  console.table(table);

  const missing: string[] = [];
  for (const [collection, slugs] of [
    ["posts", posts.map((p) => p.slug)],
    ["case-studies", studies.map((c) => c.slug)],
  ] as const) {
    for (const slug of slugs) {
      const n = await count(collection, { and: [{ slug: { equals: slug } }, published] });
      if (n !== 1) missing.push(`${collection}/${slug}`);
    }
  }
  if (missing.length) {
    failed++;
    console.error("Missing slugs:", missing.join(", "));
  } else {
    console.log("All legacy post and case-study slugs exist in Payload with the same slug.");
  }

  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
