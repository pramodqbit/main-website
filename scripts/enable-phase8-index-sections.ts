import { getSeedPayload } from "../cms/seed/lib/payload";

function refuseProduction() {
  const db = process.env.DATABASE_URI ?? "";
  const remoteDb = !/^mongodb:\/\/(127\.0\.0\.1|localhost|mongo)(:\d+)?\//i.test(db);
  if (process.env.VERCEL_ENV === "production" || remoteDb) {
    console.error("Refusing: production or remote database. Local dev only.");
    process.exit(1);
  }
}

async function main() {
  refuseProduction();
  const payload = await getSeedPayload();
  for (const slug of ["services-page", "work-page"] as const) {
    const g = await payload.findGlobal({ slug, depth: 0, overrideAccess: true });
    const sections = (g as { sections?: Array<{ enabled?: boolean }> }).sections;
    if (!sections?.length) {
      console.log(`${slug}: no sections — run npm run seed -- --only=16 first`);
      continue;
    }
    await payload.updateGlobal({
      slug,
      data: {
        sections: sections.map((s) => ({ ...s, enabled: true })),
      },
      overrideAccess: true,
    });
    console.log(`${slug}: enabled ${sections.length} section(s)`);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
