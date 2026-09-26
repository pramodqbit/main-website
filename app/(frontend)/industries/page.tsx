import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IndustryGridBlock } from "@/components/blocks/IndustryGridBlock";
import { RenderBlocks } from "@/components/blocks/RenderBlocks";
import { DefaultCta } from "@/components/site/DefaultCta";
import { listIndustries } from "@/lib/queries/industries";
import { getPage } from "@/lib/queries/pages";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

const DESCRIPTION = "The industries Qbitlog has shipped software in, and what we learned about their rules and quirks.";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    doc: await getPage("industries"),
    path: "/industries",
    fallbackTitle: "Industries",
    fallbackDescription: DESCRIPTION,
    generatedImage: true,
  });
}

/** Payload page with slug "industries". Until it's published, a default grid of every industry + the closing CTA. */
export default async function IndustriesPage() {
  const page = await getPage("industries");
  if (page?.layout?.length) return <RenderBlocks blocks={page.layout} pageTitle={page.title} />;

  if (!(await listIndustries()).length) notFound();
  return (
    <>
      <IndustryGridBlock
        lead
        block={{
          blockType: "industryGrid",
          label: "LOG / INDUSTRIES",
          title: "Where we’ve done it before",
          intro: "We’ve worked through the regulations and quirks of these industries on real projects.",
        }}
      />
      <DefaultCta />
    </>
  );
}
