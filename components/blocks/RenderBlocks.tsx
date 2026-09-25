import type { ReactNode } from "react";
import { Heading } from "@/components/ds/Heading";
import { LogLabel } from "@/components/ds/LogLabel";
import { Section } from "@/components/ds/Section";
import type { Page } from "@/payload-types";
import { CapabilityMatrixBlock } from "./CapabilityMatrixBlock";
import { CaseStudyGridBlock } from "./CaseStudyGridBlock";
import { ContactFormBlock } from "./ContactFormBlock";
import { CtaBlock } from "./CtaBlock";
import { DecisionRecordBlock } from "./DecisionRecordBlock";
import { EngagementModelsBlock } from "./EngagementModelsBlock";
import { FaqBlock } from "./FaqBlock";
import { HeroLogBlock } from "./HeroLogBlock";
import { IndustryGridBlock } from "./IndustryGridBlock";
import { InsightsBlock } from "./InsightsBlock";
import { JobsListBlock } from "./JobsListBlock";
import { LogoWallBlock } from "./LogoWallBlock";
import { LogTickerBlock } from "./LogTickerBlock";
import { MediaAnnotatedBlock } from "./MediaAnnotatedBlock";
import { MethodBlock } from "./MethodBlock";
import { MetricsBlock } from "./MetricsBlock";
import { ProofStripBlock } from "./ProofStripBlock";
import { RemoteWorkingBlock } from "./RemoteWorkingBlock";
import { RichTextBlock } from "./RichTextBlock";
import { ServiceListBlock } from "./ServiceListBlock";
import { ShippedLogBlock } from "./ShippedLogBlock";
import { ShowcaseBlock } from "./ShowcaseBlock";
import { TeamGridBlock } from "./TeamGridBlock";
import { TestimonialStripBlock } from "./TestimonialStripBlock";
import { WriteupExplainerBlock } from "./WriteupExplainerBlock";

export type LayoutBlock = NonNullable<Page["layout"]>[number];

/** Blocks that render the page's `h1`. */
const H1_BLOCKS = new Set<LayoutBlock["blockType"]>(["heroLog", "contactForm"]);

/** One block. `blocks` and `i` give the neighbours (a hero absorbs the proof strip after it). */
export function renderBlock(block: LayoutBlock, i: number, blocks: LayoutBlock[]): ReactNode {
  const key = block.id ?? `${block.blockType}-${i}`;
  const next = blocks[i + 1];
  switch (block.blockType) {
    case "heroLog":
      return <HeroLogBlock key={key} block={block} proofStrip={next?.blockType === "proofStrip" ? next : null} />;
    case "proofStrip":
      return blocks[i - 1]?.blockType === "heroLog" ? null : <ProofStripBlock key={key} block={block} />;
    case "logTicker":
      return <LogTickerBlock key={key} block={block} />;
    case "showcase":
      return <ShowcaseBlock key={key} block={block} priority={i === 0} />;
    case "caseStudyGrid":
      return <CaseStudyGridBlock key={key} block={block} />;
    case "method":
      return <MethodBlock key={key} block={block} />;
    case "serviceList":
      return <ServiceListBlock key={key} block={block} />;
    case "industryGrid":
      return <IndustryGridBlock key={key} block={block} />;
    case "insights":
      return <InsightsBlock key={key} block={block} />;
    case "faq":
      return <FaqBlock key={key} block={block} />;
    case "cta":
      return <CtaBlock key={key} block={block} />;
    case "richText":
      return <RichTextBlock key={key} block={block} />;
    case "mediaAnnotated":
      return <MediaAnnotatedBlock key={key} block={block} />;
    case "metrics":
      return <MetricsBlock key={key} block={block} />;
    case "decisionRecord":
      return <DecisionRecordBlock key={key} block={block} />;
    case "teamGrid":
      return <TeamGridBlock key={key} block={block} />;
    case "jobsList":
      return <JobsListBlock key={key} block={block} />;
    case "contactForm":
      return <ContactFormBlock key={key} block={block} />;
    case "logoWall":
      return <LogoWallBlock key={key} block={block} />;
    case "engagementModels":
      return <EngagementModelsBlock key={key} block={block} />;
    case "remoteWorking":
      return <RemoteWorkingBlock key={key} block={block} />;
    case "capabilityMatrix":
      return <CapabilityMatrixBlock key={key} block={block} />;
    case "writeupExplainer":
      return <WriteupExplainerBlock key={key} block={block} />;
    case "testimonialStrip":
      return <TestimonialStripBlock key={key} block={block} />;
    case "shippedLog":
      return <ShippedLogBlock key={key} block={block} />;
    default: {
      if (process.env.NODE_ENV === "production") return null;
      const type = (block as { blockType?: string }).blockType;
      return (
        <div key={key} role="alert" className="wrap my-6 border-2 border-danger p-4 font-mono text-sm text-danger">
          Unknown block type: {type}
        </div>
      );
    }
  }
}

/**
 * Renders a Payload blocks field. Unknown block types render nothing in production and a warning in development.
 * Pass `pageTitle` for top-level pages: it becomes the `h1` when no block provides one.
 */
export function RenderBlocks({ blocks, pageTitle }: { blocks: LayoutBlock[] | null | undefined; pageTitle?: string }) {
  if (!blocks?.length) return null;
  const title = blocks.some((b) => H1_BLOCKS.has(b.blockType)) ? null : pageTitle;
  return (
    <>
      {title ? (
        <Section bordered={false} className="pb-0 pt-[104px]">
          <LogLabel items={["LOG", title]} />
          <Heading as="h1" size="h1" className="mt-5">
            {title}
          </Heading>
        </Section>
      ) : null}
      {blocks.map((block, i) => renderBlock(block, i, blocks))}
    </>
  );
}

export default RenderBlocks;
