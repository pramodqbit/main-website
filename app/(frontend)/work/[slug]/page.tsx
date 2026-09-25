import type { Metadata } from "next";
import Link from "next/link";
import { MetricGrid } from "@/components/blocks/MetricsBlock";
import { AnnotatedMedia } from "@/components/ds/AnnotatedMedia";
import { BeforeAfterTable } from "@/components/ds/BeforeAfterTable";
import { Breadcrumbs } from "@/components/ds/Breadcrumbs";
import { Button } from "@/components/ds/Button";
import { CaseCard } from "@/components/ds/CaseCard";
import { DecisionRecord } from "@/components/ds/DecisionRecord";
import { FactsPanel, type FactsPanelRow } from "@/components/ds/FactsPanel";
import { Heading } from "@/components/ds/Heading";
import { Lede } from "@/components/ds/Lede";
import { LessonGrid } from "@/components/ds/LessonGrid";
import { LogLabel } from "@/components/ds/LogLabel";
import { LogPanel } from "@/components/ds/LogPanel";
import { mediaSource } from "@/components/ds/Media";
import { Pill } from "@/components/ds/Pill";
import { PostRow } from "@/components/ds/PostRow";
import { PrevNext } from "@/components/ds/PrevNext";
import { ProofStrip } from "@/components/ds/ProofStrip";
import { Quote } from "@/components/ds/Quote";
import { Section } from "@/components/ds/Section";
import { SectionHead } from "@/components/ds/SectionHead";
import { TextLink } from "@/components/ds/TextLink";
import { ViewDepthTracker } from "@/components/forms/ViewDepthTracker";
import { RichText } from "@/components/richtext/RichText";
import { DefaultCta } from "@/components/site/DefaultCta";
import { JsonLd } from "@/components/site/JsonLd";
import { caseStudyCard, featuredMetrics, industryOf, populated, populatedList, toMetric } from "@/lib/content";
import { isDraft } from "@/lib/draft";
import { breadcrumbLd, caseStudyLd } from "@/lib/jsonld";
import { hasContent } from "@/lib/lexical";
import { caseStudyNeighbours, caseStudySlugs, getCaseStudy, listCaseStudies } from "@/lib/queries/caseStudies";
import { getSiteSettings } from "@/lib/queries/globals";
import { postsForService } from "@/lib/queries/posts";
import { redirectOrNotFound } from "@/lib/redirects";
import { buildMetadata } from "@/lib/seo";
import type { CaseStudy, Media, Service } from "@/payload-types";

export const revalidate = 3600;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await caseStudySlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCaseStudy(slug);
  if (!cs) return {};
  return buildMetadata({ doc: cs, path: `/work/${slug}`, type: "article", generatedImage: true });
}

async function relatedFor(cs: CaseStudy): Promise<CaseStudy[]> {
  const picked = populatedList(cs.related).slice(0, 2);
  if (picked.length) return picked;
  const industry = industryOf(cs)?.slug;
  const same = industry ? await listCaseStudies({ industry, exclude: [cs.id], limit: 2 }) : [];
  if (same.length >= 2) return same;
  const latest = await listCaseStudies({ exclude: [cs.id, ...same.map((c) => c.id)], limit: 2 - same.length });
  return [...same, ...latest];
}

function teamLine(roles: NonNullable<CaseStudy["teamRoles"]>): string {
  return roles
    .filter((r) => r.role)
    .map((r) => (r.count != null ? `${r.count} × ${r.role}` : r.role!))
    .join(" · ");
}

function clientSlug(client: string): string {
  return client.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "client";
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const [cs, draft, settings, neighbours] = await Promise.all([
    getCaseStudy(slug),
    isDraft(),
    getSiteSettings(),
    caseStudyNeighbours(slug),
  ]);
  if (!cs) return redirectOrNotFound(`/work/${slug}`);

  const path = `/work/${cs.slug}`;
  const industry = industryOf(cs);
  const featured = featuredMetrics(cs);
  const hero = mediaSource(cs.heroImage as Media | null, "feature");
  const testimonial = populated(cs.testimonial) ? cs.testimonial : null;
  const showQuote = testimonial && (testimonial.approved || draft);
  const services = populatedList<Service>(cs.services);
  const related = await relatedFor(cs);
  const relatedPosts = await postsForService(services[0], 3);
  const isPrototype = cs.status === "prototype";
  const disclaimer =
    settings?.prototypeDisclaimer?.trim() ||
    "Prototype built on synthetic/demo data. Results are from demo testing.";
  const timeline = (cs.timeline ?? []).filter((r) => r.marker && r.phase && r.text);
  const beforeAfter = (cs.beforeAfter ?? []).filter((r) => r.aspect && r.before && r.after);
  const lessons = (cs.lessons ?? []).filter((l) => l.title && l.text);
  const team = teamLine(cs.teamRoles ?? []);
  let logN = 0;
  const nextLog = (name: string) => {
    logN += 1;
    return `LOG / ${String(logN).padStart(2, "0")} ${name}`;
  };

  const facts: FactsPanelRow[] = (
    [
      { label: "Client", value: cs.client },
      industry ? { label: "Industry", value: <TextLink href={`/industries/${industry.slug}`}>{industry.title}</TextLink> } : null,
      cs.year ? { label: "Year", value: String(cs.year) } : null,
      cs.durationWeeks ? { label: "Duration", value: `${cs.durationWeeks} weeks` } : null,
      cs.teamSize ? { label: "Team", value: `${cs.teamSize} people` } : null,
      services.length
        ? {
            label: "Services",
            value: (
              <span className="flex flex-wrap gap-x-2 gap-y-1">
                {services.map((s, i) => (
                  <span key={s.id}>
                    {i > 0 ? <span className="text-muted"> · </span> : null}
                    <TextLink href={`/services/${s.slug}`}>{s.title}</TextLink>
                  </span>
                ))}
              </span>
            ),
          }
        : null,
      cs.platforms?.length ? { label: "Platforms", value: cs.platforms.join(", ") } : null,
      {
        label: "Status",
        value: isPrototype ? <Pill tone="signal">Prototype</Pill> : <Pill tone="ok">Live</Pill>,
      },
      cs.status === "live" && cs.liveUrl
        ? {
            label: "Live",
            value: (
              <Link href={cs.liveUrl} target="_blank" rel="noopener noreferrer" className="text-brand no-underline hover:underline">
                View product ↗
              </Link>
            ),
          }
        : null,
    ] as Array<FactsPanelRow | null>
  ).filter((r): r is FactsPanelRow => r != null);

  const crumbs = [
    { label: "Work", href: "/work" },
    { label: cs.client, href: path },
  ];

  return (
    <>
      <JsonLd data={[caseStudyLd(cs, path), breadcrumbLd(crumbs, path)]} />
      <ViewDepthTracker slug={cs.slug ?? slug} />

      <Section bordered={false} className="pt-[104px]">
        <Breadcrumbs items={crumbs} className="mb-8" />
        <div className="flex flex-wrap items-center gap-3">
          <LogLabel
            items={[
              industry?.title,
              cs.durationWeeks ? `${cs.durationWeeks} weeks` : null,
              cs.teamSize ? `${cs.teamSize} engineers` : null,
            ]}
          />
          {isPrototype ? <Pill tone="signal">Prototype</Pill> : null}
        </div>
        <Heading size="h1" className="mt-5 max-w-[20ch]">
          {cs.title}
        </Heading>
        <Lede className="mt-6">{cs.summary}</Lede>
        {isPrototype ? <p className="mt-4 max-w-[54ch] text-sm text-muted">{disclaimer}</p> : null}
        {cs.status === "live" && cs.liveUrl ? (
          <div className="mt-8">
            <Button href={cs.liveUrl} newTab variant="ghost">
              View live product ↗
            </Button>
          </div>
        ) : null}
        {featured.length ? <ProofStrip className="mt-14" items={featured.map((m) => toMetric(m))} /> : null}
      </Section>

      {facts.length ? (
        <Section className="min-[1100px]:hidden">
          <FactsPanel rows={facts} />
        </Section>
      ) : null}

      <div className="min-[1100px]:wrap min-[1100px]:grid min-[1100px]:grid-cols-[minmax(0,1fr)_280px] min-[1100px]:items-start min-[1100px]:gap-12">
        <div className="min-w-0">
          {hero ? (
            <section className="overflow-hidden border-b border-line pb-24 max-md:pb-16 min-[1100px]:border-0 min-[1100px]:pb-12">
              <div className="wrap min-[1100px]:px-0">
                <AnnotatedMedia
                  image={{ src: hero.src, width: hero.width, height: hero.height, alt: hero.alt }}
                  chromeLabel={`${industry?.slug ?? "work"} / ${cs.slug}`}
                  annotations={(cs.heroAnnotations ?? []).map((a) => ({ x: a.x, y: a.y, title: a.title, note: a.note }))}
                  variant="showcase"
                  tilt
                  priority
                  sizes="(min-width: 1440px) 1100px, 100vw"
                />
              </div>
            </section>
          ) : null}

          {hasContent(cs.challenge) ? (
            <Section className="min-[1100px]:px-0 min-[1100px]:[&_.wrap]:px-0">
              <SectionHead label={nextLog("CHALLENGE")} title="The challenge" />
              <RichText data={cs.challenge} />
            </Section>
          ) : null}

          {timeline.length ? (
            <Section className="min-[1100px]:px-0 min-[1100px]:[&_.wrap]:px-0">
              <SectionHead label={nextLog("TIMELINE")} title="Project timeline" />
              <LogPanel
                title={`${clientSlug(cs.client)} / ${cs.slug}`}
                status={{ label: isPrototype ? "PROTOTYPE" : "SHIPPED", tone: isPrototype ? "brand" : "ok" }}
                rows={timeline.map((r) => ({
                  marker: r.marker!,
                  phase: r.phase!,
                  text: r.text!,
                  measured: r.phase === "MEASURE",
                }))}
              />
            </Section>
          ) : null}

          {cs.decisions?.length ? (
            <Section id="decisions" className="min-[1100px]:px-0 min-[1100px]:[&_.wrap]:px-0">
              <SectionHead
                label={nextLog("DECISIONS")}
                title="Decision log"
                intro="What we weighed, what we chose, and why."
              />
              <ol className="m-0 flex list-none flex-col gap-16 p-0">
                {cs.decisions.map((d, i) => (
                  <li key={d.id ?? i} className="grid grid-cols-[200px_1fr] gap-8 max-[860px]:grid-cols-1 max-[860px]:gap-4">
                    <span className="font-mono text-label uppercase text-muted">Decision {String(i + 1).padStart(2, "0")}</span>
                    <div className="measure">
                      <Heading as="h3" size="h3" className="mb-6">
                        {d.title}
                      </Heading>
                      <DecisionRecord
                        problem={d.problem}
                        options={(d.options ?? []).map((o) => ({ label: o.label, chosen: o.chosen }))}
                        decision={d.decision}
                        why={d.why}
                      />
                    </div>
                  </li>
                ))}
              </ol>
            </Section>
          ) : null}
        </div>

        {facts.length ? (
          <aside className="sticky top-28 hidden self-start py-24 min-[1100px]:block">
            <FactsPanel rows={facts} />
          </aside>
        ) : null}
      </div>

      {hasContent(cs.solution) || cs.features?.length ? (
        <Section>
          <SectionHead label={nextLog("BUILD")} title="What we built" />
          {hasContent(cs.solution) ? <RichText data={cs.solution} /> : null}
          {cs.features?.length ? (
            <ul className="m-0 mt-12 grid list-none grid-cols-2 gap-px border border-line bg-line p-0 max-[760px]:grid-cols-1">
              {cs.features.map((f, i) => (
                <li key={f.id ?? i} className="bg-paper p-6">
                  <h3 className="m-0 font-serif text-xl">{f.title}</h3>
                  {f.description ? <p className="mb-0 mt-2 text-muted">{f.description}</p> : null}
                </li>
              ))}
            </ul>
          ) : null}
        </Section>
      ) : null}

      {beforeAfter.length ? (
        <Section>
          <SectionHead label={nextLog("CHANGE")} title="Before → After" />
          <BeforeAfterTable rows={beforeAfter.map((r) => ({ aspect: r.aspect!, before: r.before!, after: r.after! }))} />
        </Section>
      ) : null}

      {cs.gallery?.length ? (
        <Section>
          <div className="flex flex-col gap-16">
            {cs.gallery.map((g, i) => {
              const img = mediaSource(g.image as Media | null, "feature");
              if (!img) return null;
              return (
                <AnnotatedMedia
                  key={g.id ?? i}
                  image={{ src: img.src, width: img.width, height: img.height, alt: img.alt }}
                  annotations={(g.annotations ?? []).map((a) => ({ x: a.x, y: a.y, title: a.title, note: a.note }))}
                  caption={g.caption}
                  variant="inline"
                  sizes="(min-width: 1280px) 1200px, 100vw"
                />
              );
            })}
          </div>
        </Section>
      ) : null}

      {cs.metrics?.length ? (
        <Section id="results">
          <SectionHead label={nextLog("RESULTS")} title="What changed" />
          <MetricGrid items={cs.metrics.map((m) => toMetric(m, { accent: true, size: "lg" }))} />
        </Section>
      ) : null}

      {team ? (
        <Section>
          <SectionHead label={nextLog("TEAM")} title="Who built it" />
          <p className="m-0 font-mono text-sm text-ink">{team}</p>
        </Section>
      ) : null}

      {lessons.length ? (
        <Section>
          <SectionHead label={nextLog("LESSONS")} title="What we’d do differently" />
          <LessonGrid items={lessons.map((l) => ({ title: l.title!, text: l.text! }))} />
        </Section>
      ) : null}

      {showQuote && testimonial ? (
        <Section tone="inverted">
          <Quote
            quote={testimonial.quote}
            name={testimonial.name}
            role={testimonial.role}
            company={testimonial.company}
            badge={testimonial.approved ? null : <Pill tone="signal">Not approved</Pill>}
          />
        </Section>
      ) : null}

      {hasContent(cs.body) ? (
        <Section>
          <SectionHead label={nextLog("STORY")} title="The full story" />
          <RichText data={cs.body} />
        </Section>
      ) : null}

      {neighbours ? (
        <Section>
          <PrevNext prev={neighbours.prev} next={neighbours.next} />
        </Section>
      ) : null}

      {relatedPosts.length ? (
        <Section>
          <SectionHead label="LOG / INSIGHTS" title="Related insights" />
          <div>
            {relatedPosts.map((p) => (
              <PostRow
                key={p.id}
                href={`/insights/${p.slug}`}
                date={(p.publishedAt ?? p.createdAt).slice(0, 10)}
                category={typeof p.category === "object" && p.category ? p.category.title : null}
                title={p.title}
              />
            ))}
          </div>
        </Section>
      ) : null}

      {related.length ? (
        <Section>
          <SectionHead label="LOG / MORE" title="More work" />
          <div className="grid grid-cols-2 gap-5 max-[860px]:grid-cols-1">
            {related.map((r) => (
              <CaseCard key={r.id} {...caseStudyCard(r)} />
            ))}
          </div>
        </Section>
      ) : null}

      <DefaultCta />
    </>
  );
}
