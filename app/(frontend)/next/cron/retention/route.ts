import { getPayloadClient } from "@/lib/payload";

export const dynamic = "force-dynamic";

const LEAD_MONTHS = 24;
const APPLICATION_MONTHS = 12;

function monthsAgo(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return d.toISOString();
}

/**
 * GDPR retention (Phase 7 §A3): deletes leads older than 24 months and applications, with their résumé files,
 * older than 12 months. Vercel Cron sends `Authorization: Bearer $CRON_SECRET`. Logs counts only.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = await getPayloadClient();

  const leads = await payload.delete({
    collection: "leads",
    where: { createdAt: { less_than: monthsAgo(LEAD_MONTHS) } },
    overrideAccess: true,
  });

  const oldApps = await payload.find({
    collection: "applications",
    where: { createdAt: { less_than: monthsAgo(APPLICATION_MONTHS) } },
    select: { resume: true },
    depth: 0,
    pagination: false,
    overrideAccess: true,
  });
  const appIds = oldApps.docs.map((a) => a.id);
  const resumeIds = oldApps.docs
    .map((a) => (typeof a.resume === "object" ? a.resume?.id : a.resume))
    .filter((id): id is string => Boolean(id));

  const applications = appIds.length
    ? await payload.delete({ collection: "applications", where: { id: { in: appIds } }, overrideAccess: true })
    : { docs: [], errors: [] };
  const resumes = resumeIds.length
    ? await payload.delete({ collection: "resumes", where: { id: { in: resumeIds } }, overrideAccess: true })
    : { docs: [], errors: [] };

  const result = {
    leads: leads.docs.length,
    applications: applications.docs.length,
    resumes: resumes.docs.length,
    errors: leads.errors.length + applications.errors.length + resumes.errors.length,
  };
  console.info(
    `[retention] deleted ${result.leads} leads, ${result.applications} applications, ${result.resumes} résumés (${result.errors} errors)`,
  );
  return Response.json(result, { status: result.errors ? 207 : 200 });
}
