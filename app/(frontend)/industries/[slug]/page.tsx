import type { Metadata } from "next";
import { FaqSection, visibleFaqs } from "@/components/blocks/FaqBlock";
import { RenderBlocks } from "@/components/blocks/RenderBlocks";
import { CaseCard } from "@/components/ds/CaseCard";
import { Heading } from "@/components/ds/Heading";
import { Lede } from "@/components/ds/Lede";
import { LogLabel } from "@/components/ds/LogLabel";
import { Pill } from "@/components/ds/Pill";
import { Section } from "@/components/ds/Section";
import { SectionHead } from "@/components/ds/SectionHead";
import { ServiceRow } from "@/components/ds/ServiceRow";
import { DefaultCta } from "@/components/site/DefaultCta";
import { HairlineGrid } from "@/components/site/HairlineGrid";
import { JsonLd } from "@/components/site/JsonLd";
import { caseStudyCard, populatedList, serviceRow } from "@/lib/content";
import { isDraft } from "@/lib/draft";
import { breadcrumbLd } from "@/lib/jsonld";
import { listCaseStudies } from "@/lib/queries/caseStudies";
import { getIndustry, industrySlugs } from "@/lib/queries/industries";
import { redirectOrNotFound } from "@/lib/redirects";
import { buildMetadata } from "@/lib/seo";
import type { CaseStudy, Faq, Service } from "@/payload-types";

export const revalidate = 3600;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await industrySlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ind = await getIndustry(slug);
  if (!ind) return {};
  return buildMetadata({
    doc: { ...ind, title: ind.meta?.title || `${ind.title}: ${ind.headline}` },
    path: `/industries/${slug}`,
    generatedImage: true,
  });
}

export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const [ind, draft] = await Promise.all([getIndustry(slug), isDraft()]);
  if (!ind) return redirectOrNotFound(`/industries/${slug}`);

  const path = `/industries/${ind.slug}`;
  const picked = populatedList<CaseStudy>(ind.caseStudies);
  const caseStudies = picked.length ? picked : await listCaseStudies({ industry: ind.slug, limit: 4 });
  const services = populatedList<Service>(ind.services);
  const compliance = (ind.compliance ?? []).map((c) => c.name).filter((x): x is string => Boolean(x));
  const faqs = visibleFaqs(populatedList<Faq>(ind.faqs), draft);
  const crumbs = [
    { label: "Industries", href: "/industries" },
    { label: ind.title, href: path },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs, path)} />

      <Section bordered={false} className="pt-[104px]">
        <LogLabel items={["Industry", ind.title]} />
        <Heading size="h1" className="mt-5 max-w-[20ch]">
          {ind.headline}
        </Heading>
        <Lede className="mt-6">{ind.summary}</Lede>
      </Section>

      {ind.painPoints?.length ? (
        <Section>
          <SectionHead label="LOG / CONTEXT" title="What slows teams down" />
          <HairlineGrid items={ind.painPoints} />
        </Section>
      ) : null}

      {compliance.length ? (
        <Section>
          <div className="grid grid-cols-[200px_1fr] gap-8 max-[860px]:grid-cols-1 max-[860px]:gap-3">
            <h2 className="m-0 font-mono text-sm font-normal text-brand">Compliance we design for</h2>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0" data-reveal="up" data-reveal-delay={150}>
              {compliance.map((c) => (
                <li key={c}>
                  <Pill tone="muted">{c}</Pill>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      ) : null}

      {caseStudies.length ? (
        <Section>
          <SectionHead label="LOG / WORK" title={`${ind.title} work`} />
          <div className="grid grid-cols-2 gap-5 max-[860px]:grid-cols-1">
            {caseStudies.map((cs) => (
              <CaseCard key={cs.id} {...caseStudyCard(cs)} />
            ))}
          </div>
        </Section>
      ) : null}

      {services.length ? (
        <Section>
          <SectionHead label="LOG / SERVICES" title="How we help" />
          <div className="border-t border-line">
            {services.map((s) => (
              <ServiceRow key={s.id} {...serviceRow(s)} />
            ))}
          </div>
        </Section>
      ) : null}

      <RenderBlocks blocks={ind.layout} />
      <FaqSection faqs={faqs} />
      <DefaultCta />
    </>
  );
}
