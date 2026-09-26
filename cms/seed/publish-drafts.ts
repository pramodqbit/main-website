import type { CollectionSlug } from "payload";
import { seedContext } from "./lib/context";
import { getSeedPayload } from "./lib/payload";

/**
 * CI / local only: publishes every draft so end-to-end tests can see the seeded pages.
 * Never run against production. Marketing publishes real content by hand.
 */
const VERSIONED: CollectionSlug[] = ["pages", "case-studies", "services", "industries", "posts", "jobs"];

function refuseProduction() {
  const db = process.env.DATABASE_URI ?? "";
  const remoteDb = !/^mongodb:\/\/(127\.0\.0\.1|localhost|mongo)(:\d+)?\//i.test(db);
  if (process.env.VERCEL_ENV === "production" || remoteDb) {
    console.error("Refusing to publish drafts: this looks like a production or remote database. Local and CI databases only.");
    process.exit(1);
  }
}

async function main() {
  refuseProduction();
  const payload = await getSeedPayload();
  let published = 0;
  for (const collection of VERSIONED) {
    const res = await payload.find({
      collection,
      where: { _status: { equals: "draft" } },
      draft: true,
      depth: 0,
      limit: 0,
      pagination: false,
      overrideAccess: true,
    });
    for (const doc of res.docs) {
      await payload.update({
        collection,
        id: doc.id,
        data: { _status: "published" } as never,
        overrideAccess: true,
        context: seedContext,
        depth: 0,
      });
      published += 1;
    }
    console.log(`${collection}: published ${res.docs.length}`);
  }
  console.log(`Done. ${published} document(s) published.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
