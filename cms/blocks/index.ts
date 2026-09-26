import type { Block } from "payload";
import { BeforeAfter } from "./BeforeAfter";
import { CapabilityMatrix } from "./CapabilityMatrix";
import { CaseStudyGrid } from "./CaseStudyGrid";
import { ContactForm } from "./ContactForm";
import { Cta } from "./Cta";
import { DecisionRecord } from "./DecisionRecord";
import { EngagementModels } from "./EngagementModels";
import { Faq } from "./Faq";
import { HeroLog } from "./HeroLog";
import { IndustryGrid } from "./IndustryGrid";
import { Insights } from "./Insights";
import { JobsList } from "./JobsList";
import { LogoWall } from "./LogoWall";
import { LogTicker } from "./LogTicker";
import { Manifesto } from "./Manifesto";
import { MediaAnnotated } from "./MediaAnnotated";
import { Method } from "./Method";
import { Metrics } from "./Metrics";
import { ProofStrip } from "./ProofStrip";
import { RemoteWorking } from "./RemoteWorking";
import { RichText } from "./RichText";
import { ServiceList } from "./ServiceList";
import { ShippedLog } from "./ShippedLog";
import { Showcase } from "./Showcase";
import { TeamGrid } from "./TeamGrid";
import { TestimonialStrip } from "./TestimonialStrip";
import { WriteupExplainer } from "./WriteupExplainer";

export { postContentBlocks } from "./lexical";

export const pageBlocks: Block[] = [
  HeroLog,
  Manifesto,
  ProofStrip,
  LogTicker,
  Showcase,
  CaseStudyGrid,
  Method,
  BeforeAfter,
  ServiceList,
  IndustryGrid,
  Insights,
  Faq,
  Cta,
  RichText,
  MediaAnnotated,
  Metrics,
  DecisionRecord,
  TeamGrid,
  JobsList,
  ContactForm,
  LogoWall,
  EngagementModels,
  RemoteWorking,
  CapabilityMatrix,
  WriteupExplainer,
  TestimonialStrip,
  ShippedLog,
];

/**
 * A copy of `block` with an `enabled` checkbox first, for sections on globals (which have no drafts).
 * The page-builder block itself is left unchanged.
 */
export function withEnabled(block: Block): Block {
  return {
    ...block,
    interfaceName: block.interfaceName ? block.interfaceName.replace(/Block$/, "Section") : undefined,
    fields: [
      {
        name: "enabled",
        type: "checkbox",
        defaultValue: false,
        label: "Show on the site",
        admin: { description: "Leave unticked until the section has been reviewed. Unticked sections only appear in preview." },
      },
      ...block.fields,
    ],
  };
}

/** Sections for the `/services` and `/work` index pages. */
export const indexPageSections: Block[] = [
  EngagementModels,
  RemoteWorking,
  CapabilityMatrix,
  WriteupExplainer,
  TestimonialStrip,
  ShippedLog,
  Method,
  IndustryGrid,
  CaseStudyGrid,
  Faq,
  Cta,
  RichText,
].map(withEnabled);
