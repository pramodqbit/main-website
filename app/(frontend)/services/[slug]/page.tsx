import type { Metadata } from "next";
import { bookingButton } from "@/components/blocks/CtaBlock";
import { FeatureCaseFor } from "@/components/blocks/CaseStudyGridBlock";
import { FaqSection, visibleFaqs } from "@/components/blocks/FaqBlock";
import { industryTileProps } from "@/components/blocks/IndustryGridBlock";
import { RenderBlocks } from "@/components/blocks/RenderBlocks";
import { Button } from "@/components/ds/Button";
import { CaseCard } from "@/components/ds/CaseCard";
import { DecisionRecord } from "@/components/ds/DecisionRecord";
import { Heading } from "@/components/ds/Heading";
import { IndustryTile } from "@/components/ds/IndustryTile";
import { Lede } from "@/components/ds/Lede";
import { LogLabel } from "@/components/ds/LogLabel";
import { PostRow } from "@/components/ds/PostRow";
import { Section } from "@/components/ds/Section";
import { SectionHead } from "@/components/ds/SectionHead";
import { Steps } from "@/components/ds/Steps";
import { TechByCategory } from "@/components/ds/TechByCategory";
import { TileGrid } from "@/components/ds/TileGrid";
import { TypicalProjectRow } from "@/components/ds/TypicalProjectRow";
import { DefaultCta } from "@/components/site/DefaultCta";
import { HairlineGrid } from "@/components/site/HairlineGrid";
import { JsonLd } from "@/components/site/JsonLd";
import { caseStudyCard, populatedList, technologiesByCategory } from "@/lib/content";
import { isDraft } from "@/lib/draft";
import { breadcrumbLd, serviceLd } from "@/lib/jsonld";
import { listCaseStudies } from "@/lib/queries/caseStudies";
import { postsForService } from "@/lib/queries/posts";
import { getService, serviceSlugs } from "@/lib/queries/services";
import { redirectOrNotFound } from "@/lib/redirects";
import { buildMetadata } from "@/lib/seo";
import type { CaseStudy, Faq, Industry, Technology } from "@/payload-types";

export const revalidate = 3600;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await serviceSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = await getService(slug);
  if (!s) return {};
  return buildMetadata({ doc: { ...s, title: s.meta?.title || s.title }, path: `/services/${slug}`, generatedImage: true });
}

function MonoSection({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <Section>
      <SectionHead label={label} title={title} />
      {children}
    </Section>
  );
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const [s, draft] = await Promise.all([getService(slug), isDraft()]);
  if (!s) return redirectOrNotFound(`/services/${slug}`);

  const path = `/services/${s.slug}`;
  const picked = populatedList<CaseStudy>(s.caseStudies).slice(0, 6);
  const caseStudies = picked.length ? picked : await listCaseStudies({ service: s.id, limit: 6 });
  const [featured, ...moreCases] = caseStudies;
  const firstDecision = featured?.decisions?.[0] ?? null;
  const industries = populatedList<Industry>(s.industries);
  const techGroups = technologiesByCategory(populatedList<Technology>(s.technologies));
  const deliverables = (s.deliverables ?? []).map((d) => d.item).filter((x): x is string => Boolean(x));
  const steps = (s.process ?? [])
    .filter((p) => p.name)
    .map((p) => ({ name: p.name as string, description: p.description, deliverable: p.deliverable }));
  const typicalProjects = (s.typicalProjects ?? []).filter((p) => p.name);
  const relatedPosts = await postsForService(s, 3);
  const faqs = visibleFaqs(populatedList<Faq>(s.faqs), draft);
  const booking = await bookingButton();
  const crumbs = [
    { label: "Services", href: "/services" },
    { label: s.title, href: path },
  ];

  return (
    <>
      <JsonLd data={[serviceLd(s, path), breadcrumbLd(crumbs, path)]} />

      <Section bordered={false} className="pt-[104px]">
        <LogLabel items={["Service", s.category]} />
        <Heading size="h1" className="mt-5 max-w-[20ch]">
          {s.outcomeHeadline || s.title}
        </Heading>
        <Lede className="mt-6">{s.summary}</Lede>
        <div className="mt-8" data-reveal="up" data-reveal-delay={450}>
          <Button href={booking.href} newTab={booking.newTab} arrow data-cta="service_hero">
            {booking.label}
          </Button>
        </div>
      </Section>

      {s.problems?.length ? (
        <MonoSection label="LOG / PROBLEMS" title="Problems we solve">
          <HairlineGrid items={s.problems} />
        </MonoSection>
      ) : null}

      {typicalProjects.length ? (
        <MonoSection label="LOG / TYPICAL" title="Typical projects">
          <ul className="m-0 list-none p-0">
            {typicalProjects.map((p, i) => (
              <TypicalProjectRow key={p.id ?? i} name={p.name} duration={p.duration} description={p.description} />
            ))}
          </ul>
        </MonoSection>
      ) : null}

      {steps.length ? (
        <Section tone="inverted">
          <SectionHead label="LOG / METHOD" title="How we run it" />
          <Steps steps={steps} tone="inverted" />
        </Section>
      ) : null}

      {deliverables.length ? (
        <MonoSection label="LOG / DELIVERABLES" title="What you get">
          <ul className="m-0 grid list-none grid-cols-2 gap-x-8 gap-y-3 p-0 font-mono text-sm max-[760px]:grid-cols-1">
            {deliverables.map((d) => (
              <li key={d} className="flex gap-3 border-b border-dashed border-line pb-3" data-reveal="up" data-reveal-stagger={70}>
                <span aria-hidden="true" className="text-brand">
                  ✓
                </span>
                {d}
              </li>
            ))}
          </ul>
        </MonoSection>
      ) : null}

      {featured ? (
        <MonoSection label="LOG / WORK" title="Where we’ve done it">
          <FeatureCaseFor cs={featured} />
          {firstDecision ? (
            <div className="mt-12" data-reveal="up" data-reveal-delay={150}>
              <LogLabel items={["How we decided"]} />
              <div className="mt-5 measure">
                <Heading as="h3" size="h3" className="mb-6">
                  {firstDecision.title}
                </Heading>
                <DecisionRecord
                  problem={firstDecision.problem}
                  options={(firstDecision.options ?? []).map((o) => ({ label: o.label, chosen: o.chosen }))}
                  decision={firstDecision.decision}
                  why={firstDecision.why}
                />
              </div>
            </div>
          ) : null}
          {moreCases.length ? (
            <div className="mt-12 grid grid-cols-3 gap-5 max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1">
              {moreCases.map((cs) => (
                <CaseCard key={cs.id} {...caseStudyCard(cs)} />
              ))}
            </div>
          ) : null}
        </MonoSection>
      ) : null}

      {industries.length ? (
        <MonoSection label="LOG / INDUSTRIES" title="Industries">
          <TileGrid>
            {industries.map((ind) => (
              <IndustryTile key={ind.id} {...industryTileProps(ind)} />
            ))}
          </TileGrid>
        </MonoSection>
      ) : null}

      {techGroups.length ? (
        <Section>
          <SectionHead label="LOG / STACK" title="Technologies" />
          <TechByCategory groups={techGroups} />
        </Section>
      ) : null}

      {relatedPosts.length ? (
        <MonoSection label="LOG / INSIGHTS" title="Related insights">
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
        </MonoSection>
      ) : null}

      <RenderBlocks blocks={s.layout} />
      <FaqSection faqs={faqs} />
      <DefaultCta />
    </>
  );
}
