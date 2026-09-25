import type { Metadata } from "next";
import { FeatureCaseFor } from "@/components/blocks/CaseStudyGridBlock";
import { RenderSections } from "@/components/blocks/RenderSections";
import { CaseCard } from "@/components/ds/CaseCard";
import { ProofStrip } from "@/components/ds/ProofStrip";
import { Section } from "@/components/ds/Section";
import { SectionHead } from "@/components/ds/SectionHead";
import { TextLink } from "@/components/ds/TextLink";
import { DefaultCta } from "@/components/site/DefaultCta";
import { FilterChips } from "@/components/site/FilterChips";
import { caseStudyCard, toMetric } from "@/lib/content";
import { listCaseStudies } from "@/lib/queries/caseStudies";
import { getWorkPage } from "@/lib/queries/globals";
import { listIndustries } from "@/lib/queries/industries";
import { listServices } from "@/lib/queries/services";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

type Props = { searchParams: Promise<{ industry?: string; service?: string }> };

function workHref(opts: { industry?: string | null; service?: string | null }) {
  const p = new URLSearchParams();
  if (opts.industry) p.set("industry", opts.industry);
  if (opts.service) p.set("service", opts.service);
  const q = p.toString();
  return q ? `/work?${q}` : "/work";
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { industry, service } = await searchParams;
  return buildMetadata({
    path: "/work",
    fallbackTitle: "Work",
    fallbackDescription: "Case studies from Qbitlog: the problem, the options we weighed, what we chose, and what changed afterwards.",
    noindex: Boolean(industry || service),
    generatedImage: true,
  });
}

export default async function WorkPage({ searchParams }: Props) {
  const { industry, service } = await searchParams;
  const [items, industries, services, page] = await Promise.all([
    listCaseStudies({ industry: industry ?? null, serviceSlug: service ?? null }),
    listIndustries(),
    listServices(),
    getWorkPage(),
  ]);
  const hero = page?.hero;
  const proof = page?.proof ?? [];
  const industryChips = [
    { href: workHref({ service }), label: "All", active: !industry },
    ...industries.map((i) => ({
      href: workHref({ industry: i.slug, service }),
      label: i.title,
      active: industry === i.slug,
    })),
  ];
  const serviceChips = [
    { href: workHref({ industry }), label: "All", active: !service },
    ...services.map((s) => ({
      href: workHref({ industry, service: s.slug }),
      label: s.category,
      active: service === s.slug,
    })),
  ];
  const [first, ...rest] = items;
  const filtered = Boolean(industry || service);

  return (
    <>
      <Section bordered={false} className="pt-[104px]">
        <SectionHead
          as="h1"
          label={hero?.title ? hero.label : "LOG / WORK"}
          title={hero?.title || "Selected work, with the receipts"}
          emphasis={hero?.title ? hero.emphasis : null}
          intro={
            hero?.title
              ? hero.intro
              : "Each project is written up as a log: the problem, the options we weighed, what we chose, and what changed afterwards."
          }
        />
        {proof.length ? <ProofStrip className="mb-10" items={proof.map((m) => toMetric(m))} /> : null}
        <FilterChips chips={industryChips} label="Filter by industry" />
        <FilterChips chips={serviceChips} label="Filter by service" />
        {first ? (
          <>
            <FeatureCaseFor cs={first} />
            {rest.length ? (
              <div className="mt-5 grid grid-cols-2 gap-5 max-[860px]:grid-cols-1">
                {rest.map((cs) => (
                  <CaseCard key={cs.id} {...caseStudyCard(cs)} />
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <p className="text-muted">
            No case studies{filtered ? " for this filter" : ""} yet.{" "}
            <TextLink href="/work">See all work</TextLink>
          </p>
        )}
      </Section>
      <RenderSections sections={page?.sections} />
      <DefaultCta title="Have a similar problem?" />
    </>
  );
}
