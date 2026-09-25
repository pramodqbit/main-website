import type { Metadata } from "next";
import { RenderSections } from "@/components/blocks/RenderSections";
import { ProofStrip } from "@/components/ds/ProofStrip";
import { Section } from "@/components/ds/Section";
import { SectionHead } from "@/components/ds/SectionHead";
import { ServiceRow } from "@/components/ds/ServiceRow";
import { DefaultCta } from "@/components/site/DefaultCta";
import { serviceRow, toMetric } from "@/lib/content";
import { caseStudyCountsByService } from "@/lib/queries/caseStudies";
import { getServicesPage } from "@/lib/queries/globals";
import { listServices } from "@/lib/queries/services";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/services",
    fallbackTitle: "Services",
    fallbackDescription: "AI, web, mobile, design and cloud engineering from Qbitlog, described by the outcome you’re buying.",
    generatedImage: true,
  });
}

export default async function ServicesPage() {
  const [services, page, counts] = await Promise.all([listServices(), getServicesPage(), caseStudyCountsByService()]);
  const hero = page?.hero;
  const proof = page?.proof ?? [];
  return (
    <>
      <Section bordered={false} className="pt-[104px]">
        <SectionHead
          as="h1"
          label={hero?.title ? hero.label : "LOG / SERVICES"}
          title={hero?.title || "What we can own for you"}
          emphasis={hero?.title ? hero.emphasis : null}
          intro={hero?.title ? hero.intro : "Described by the outcome you’re buying, not the stack we happen to use."}
        />
        {proof.length ? <ProofStrip className="mb-14" items={proof.map((m) => toMetric(m))} /> : null}
        {services.length ? (
          <div className="border-t border-line">
            {services.map((s) => (
              <ServiceRow
                key={s.id}
                {...serviceRow(s)}
                highlights={(s.deliverables ?? []).map((d) => d.item).filter((x): x is string => Boolean(x)).slice(0, 3)}
                caseCount={counts[s.id] ?? 0}
                casesHref={`/work?service=${s.slug}`}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted">No services published yet.</p>
        )}
      </Section>
      <RenderSections sections={page?.sections} />
      <DefaultCta />
    </>
  );
}
