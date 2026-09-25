import { CaseCard } from "@/components/ds/CaseCard";
import { FeatureCase } from "@/components/ds/FeatureCase";
import { Media } from "@/components/ds/Media";
import { Section } from "@/components/ds/Section";
import { caseStudyCard, featuredMetrics, industryOf, populatedList, toMetric } from "@/lib/content";
import { listCaseStudies } from "@/lib/queries/caseStudies";
import type { CaseStudy, CaseStudyGridBlock as CaseStudyGridData } from "@/payload-types";
import { SectionHeader } from "./SectionHeader";

export function FeatureCaseFor({ cs }: { cs: CaseStudy }) {
  const services = populatedList(cs.services);
  return (
    <FeatureCase
      href={`/work/${cs.slug}`}
      labels={[
        industryOf(cs)?.title,
        services[0]?.category,
        cs.durationWeeks ? `${cs.durationWeeks} weeks` : null,
      ].filter((x): x is string => Boolean(x))}
      title={cs.title}
      summary={cs.summary}
      metrics={featuredMetrics(cs, 3).map((m) => toMetric(m, { hideSource: true }))}
      prototype={cs.status === "prototype"}
      visual={
        <div className="w-full border border-line bg-surface shadow-frame">
          <Media media={cs.heroImage} size="card" sizes="(min-width: 1024px) 640px, 100vw" />
        </div>
      }
    />
  );
}

/** Case studies: first as a large feature, the rest as 2-column cards. */
export async function CaseStudyGridBlock({ block }: { block: CaseStudyGridData }) {
  const limit = block.limit ?? 3;
  const items =
    block.mode === "manual"
      ? populatedList(block.items)
      : block.mode === "latest"
        ? await listCaseStudies({ limit })
        : await listCaseStudies({ featured: true, limit }).then(async (f) => (f.length ? f : listCaseStudies({ limit })));
  if (!items.length) return null;
  const feature = block.firstAsFeature !== false;
  const first = feature ? items[0] : null;
  const rest = feature ? items.slice(1) : items;
  return (
    <Section id="work">
      <SectionHeader data={block} />
      {first ? <FeatureCaseFor cs={first} /> : null}
      {rest.length ? (
        <div className="mt-5 grid grid-cols-2 gap-5 max-[860px]:grid-cols-1">
          {rest.map((cs) => (
            <CaseCard key={cs.id} {...caseStudyCard(cs)} />
          ))}
        </div>
      ) : null}
    </Section>
  );
}

export default CaseStudyGridBlock;
