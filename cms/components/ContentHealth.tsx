import { DefaultTemplate } from "@payloadcms/next/templates";
import { Gutter } from "@payloadcms/ui";
import { redirect } from "next/navigation";
import type { AdminViewServerProps, CollectionSlug, Payload, PayloadRequest } from "payload";
import { PROTOTYPE_SOURCE } from "../hooks/requirePrototypeSourceLabels";

type Issue = { href: string; label: string; problem: string };

const TITLE_MAX = 60;
const ALT_MIN = 8;
const STALE_MONTHS = 12;

const SEO_COLLECTIONS: CollectionSlug[] = ["pages", "case-studies", "services", "industries", "posts", "jobs"];

const editHref = (collection: string, id: string | number) => `/admin/collections/${collection}/${id}`;
const globalHref = (slug: string) => `/admin/globals/${slug}`;

async function caseStudyIssues(payload: Payload, req: PayloadRequest): Promise<Issue[]> {
  const res = await payload.find({
    collection: "case-studies",
    req,
    overrideAccess: false,
    pagination: false,
    depth: 1,
    select: { title: true, decisions: { id: true }, metrics: { id: true }, testimonial: true },
    populate: { testimonials: { approved: true } },
  });
  return res.docs.flatMap((cs) => {
    const problems: string[] = [];
    if (!cs.decisions?.length) problems.push("no decisions");
    if ((cs.metrics?.length ?? 0) < 3) problems.push(`${cs.metrics?.length ?? 0} metrics (needs 3+)`);
    const t = cs.testimonial;
    if (t && typeof t === "object" && !t.approved) problems.push("testimonial not approved");
    return problems.length ? [{ href: editHref("case-studies", cs.id), label: cs.title, problem: problems.join(" · ") }] : [];
  });
}

async function seoIssues(payload: Payload, req: PayloadRequest): Promise<Issue[]> {
  const lists = await Promise.all(
    SEO_COLLECTIONS.map(async (collection) => {
      const res = await payload.find({
        collection,
        req,
        overrideAccess: false,
        pagination: false,
        depth: 0,
        where: { _status: { equals: "published" } },
        select: { title: true, meta: { title: true, description: true } },
      });
      return (res.docs as Array<{ id: string; title?: string | null; meta?: { title?: string | null; description?: string | null } }>).flatMap(
        (doc) => {
          const problems: string[] = [];
          const title = (doc.meta?.title || doc.title || "").trim();
          if (!doc.meta?.description?.trim()) problems.push("missing meta description");
          if (title.length > TITLE_MAX) problems.push(`title is ${title.length} characters (max ${TITLE_MAX})`);
          return problems.length
            ? [{ href: editHref(collection, doc.id), label: `${collection}: ${doc.title ?? doc.id}`, problem: problems.join(" · ") }]
            : [];
        },
      );
    }),
  );
  return lists.flat();
}

async function mediaIssues(payload: Payload, req: PayloadRequest): Promise<Issue[]> {
  const res = await payload.find({
    collection: "media",
    req,
    overrideAccess: false,
    pagination: false,
    depth: 0,
    select: { alt: true, filename: true },
  });
  return res.docs
    .filter((m) => (m.alt ?? "").trim().length < ALT_MIN)
    .map((m) => ({
      href: editHref("media", m.id),
      label: m.filename ?? String(m.id),
      problem: m.alt?.trim() ? `alt text too short: “${m.alt.trim()}”` : "missing alt text",
    }));
}

async function stalePosts(payload: Payload, req: PayloadRequest): Promise<Issue[]> {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - STALE_MONTHS);
  const res = await payload.find({
    collection: "posts",
    req,
    overrideAccess: false,
    pagination: false,
    depth: 0,
    where: { and: [{ _status: { equals: "published" } }, { publishedAt: { less_than: cutoff.toISOString() } }] },
    sort: "publishedAt",
    select: { title: true, publishedAt: true },
  });
  return res.docs.map((p) => ({
    href: editHref("posts", p.id),
    label: p.title,
    problem: `published ${p.publishedAt?.slice(0, 10) ?? "?"}: refresh it`,
  }));
}

async function reviewFaqs(payload: Payload, req: PayloadRequest): Promise<Issue[]> {
  const res = await payload.find({
    collection: "faqs",
    req,
    overrideAccess: false,
    pagination: false,
    depth: 0,
    select: { question: true },
  });
  return res.docs
    .filter((f) => f.question.startsWith("[REVIEW]"))
    .map((f) => ({ href: editHref("faqs", f.id), label: f.question, problem: "awaiting marketing review (hidden on the site)" }));
}

async function serviceIssues(payload: Payload, req: PayloadRequest): Promise<Issue[]> {
  const res = await payload.find({
    collection: "services",
    req,
    overrideAccess: false,
    pagination: false,
    depth: 0,
    draft: true,
    select: {
      title: true,
      problems: { id: true },
      process: { id: true },
      deliverables: { id: true },
      typicalProjects: { id: true },
    },
  });
  return res.docs.flatMap((s) => {
    const missing = [
      !s.problems?.length && "problems",
      !s.process?.length && "process",
      !s.deliverables?.length && "deliverables",
      !s.typicalProjects?.length && "typicalProjects",
    ].filter(Boolean);
    return missing.length ? [{ href: editHref("services", s.id), label: s.title, problem: `missing ${missing.join(", ")}` }] : [];
  });
}

function textHasVerify(v: unknown): boolean {
  if (typeof v === "string") return v.includes("[VERIFY]");
  if (Array.isArray(v)) return v.some(textHasVerify);
  if (v && typeof v === "object") return Object.values(v).some(textHasVerify);
  return false;
}

async function verifyMarkerIssues(payload: Payload, req: PayloadRequest): Promise<Issue[]> {
  const [published, drafts] = await Promise.all([
    payload.find({
      collection: "case-studies",
      req,
      overrideAccess: false,
      pagination: false,
      depth: 0,
      select: {
        title: true,
        summary: true,
        platforms: true,
        timeline: true,
        beforeAfter: true,
        teamRoles: true,
        lessons: true,
        decisions: true,
        metrics: true,
      },
    }),
    payload.find({
      collection: "case-studies",
      req,
      overrideAccess: false,
      pagination: false,
      depth: 0,
      draft: true,
      select: {
        title: true,
        summary: true,
        platforms: true,
        timeline: true,
        beforeAfter: true,
        teamRoles: true,
        lessons: true,
        decisions: true,
        metrics: true,
      },
    }),
  ]);
  const byId = new Map<string, (typeof drafts.docs)[number]>();
  for (const d of [...published.docs, ...drafts.docs]) byId.set(String(d.id), d);
  return [...byId.values()]
    .filter((cs) => textHasVerify(cs))
    .map((cs) => ({
      href: editHref("case-studies", cs.id),
      label: cs.title,
      problem: "draft or published content still contains [VERIFY]",
    }));
}

async function prototypeMetricIssues(payload: Payload, req: PayloadRequest): Promise<Issue[]> {
  const res = await payload.find({
    collection: "case-studies",
    req,
    overrideAccess: false,
    pagination: false,
    depth: 0,
    draft: true,
    where: { status: { equals: "prototype" } },
    select: { title: true, metrics: true },
  });
  return res.docs.flatMap((cs) => {
    const bad = (cs.metrics ?? []).filter((m) => !PROTOTYPE_SOURCE.test(m.source ?? ""));
    return bad.length
      ? [
          {
            href: editHref("case-studies", cs.id),
            label: cs.title,
            problem: `${bad.length} metric(s) missing prototype/demo/synthetic in source`,
          },
        ]
      : [];
  });
}

async function publishedMetricSourceIssues(payload: Payload, req: PayloadRequest): Promise<Issue[]> {
  const res = await payload.find({
    collection: "case-studies",
    req,
    overrideAccess: false,
    pagination: false,
    depth: 0,
    where: { _status: { equals: "published" } },
    select: { title: true, metrics: true },
  });
  return res.docs.flatMap((cs) => {
    const missing = (cs.metrics ?? []).filter((m) => !(m.source ?? "").trim());
    return missing.length
      ? [{ href: editHref("case-studies", cs.id), label: cs.title, problem: `${missing.length} published metric(s) with no source` }]
      : [];
  });
}

async function disabledIndexSections(payload: Payload, req: PayloadRequest): Promise<Issue[]> {
  const issues: Issue[] = [];
  for (const slug of ["services-page", "work-page"] as const) {
    const g = await payload.findGlobal({ slug, req, overrideAccess: false, depth: 0 });
    const sections = (g as { sections?: Array<{ blockType?: string; enabled?: boolean | null; title?: string | null }> }).sections ?? [];
    for (const s of sections) {
      if (s.enabled) continue;
      issues.push({
        href: globalHref(slug),
        label: `${slug}: ${s.title || s.blockType || "section"}`,
        problem: "section disabled — review and tick “Show on the site”",
      });
    }
  }
  return issues;
}

const cell = { padding: "10px 12px", borderBottom: "1px solid var(--theme-elevation-100)", verticalAlign: "top" as const };

function Report({ title, description, issues }: { title: string; description: string; issues: Issue[] }) {
  return (
    <section style={{ marginTop: "calc(var(--base) * 2)" }}>
      <h2 style={{ margin: 0 }}>
        {title}{" "}
        <span style={{ fontSize: 14, fontWeight: 400, color: issues.length ? "var(--theme-error-500)" : "var(--theme-success-500)" }}>
          {issues.length ? `${issues.length} to fix` : "all good"}
        </span>
      </h2>
      <p style={{ marginTop: 6, color: "var(--theme-elevation-600)" }}>{description}</p>
      {issues.length ? (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
          <tbody>
            {issues.map((i) => (
              <tr key={`${i.href}-${i.problem}`}>
                <td style={{ ...cell, width: "45%" }}>
                  <a href={i.href}>{i.label}</a>
                </td>
                <td style={cell}>{i.problem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </section>
  );
}

/** Read-only `/admin/content-health` report of content gaps editors should fix (Phase 7 §A2 + Phase 8). */
export async function ContentHealth({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, permissions, locale, visibleEntities } = initPageResult;
  if (!req.user) redirect("/admin/login?redirect=%2Fadmin%2Fcontent-health");
  const { payload } = req;

  const [caseStudies, seo, media, stale, faqs, services, verifyMarks, prototypeMetrics, metricSources, disabledSections] =
    await Promise.all([
      caseStudyIssues(payload, req),
      seoIssues(payload, req),
      mediaIssues(payload, req),
      stalePosts(payload, req),
      reviewFaqs(payload, req),
      serviceIssues(payload, req),
      verifyMarkerIssues(payload, req),
      prototypeMetricIssues(payload, req),
      publishedMetricSourceIssues(payload, req),
      disabledIndexSections(payload, req),
    ]);

  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={payload}
      permissions={permissions}
      searchParams={searchParams}
      user={req.user}
      visibleEntities={visibleEntities}
    >
      <Gutter>
        <h1 style={{ marginTop: "calc(var(--base) * 1.5)" }}>Content health</h1>
        <p style={{ color: "var(--theme-elevation-600)" }}>
          Gaps to fix before they cost trust or rankings. This page only reads data; open an item to fix it.
        </p>
        <Report title="Case studies" description="Need decisions, at least 3 metrics and an approved testimonial." issues={caseStudies} />
        <Report
          title="SEO"
          description={`Published pages with no meta description, or a title over ${TITLE_MAX} characters.`}
          issues={seo}
        />
        <Report title="Image alt text" description={`Media with missing alt text or fewer than ${ALT_MIN} characters.`} issues={media} />
        <Report title="Insights to refresh" description={`Published more than ${STALE_MONTHS} months ago.`} issues={stale} />
        <Report title="FAQs awaiting review" description="Questions prefixed [REVIEW] stay hidden until approved." issues={faqs} />
        <Report
          title="Services"
          description="Each service needs problems, process steps, deliverables and typical projects."
          issues={services}
        />
        <Report
          title="[VERIFY] markers"
          description="Case studies (draft or published) whose copy still contains [VERIFY]."
          issues={verifyMarks}
        />
        <Report
          title="Prototype metric sources"
          description='Prototype case studies whose metric sources must mention "prototype", "demo" or "synthetic".'
          issues={prototypeMetrics}
        />
        <Report title="Published metrics without a source" description="Every public metric needs a source." issues={metricSources} />
        <Report
          title="Disabled index sections"
          description="Services Page / Work Page sections that are still unticked (hidden on the live site)."
          issues={disabledSections}
        />
      </Gutter>
    </DefaultTemplate>
  );
}
