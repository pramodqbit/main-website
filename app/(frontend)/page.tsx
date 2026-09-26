import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RenderBlocks } from "@/components/blocks/RenderBlocks";
import { JsonLd } from "@/components/site/JsonLd";
import { websiteLd } from "@/lib/jsonld";
import { getSiteSettings } from "@/lib/queries/globals";
import { getPage } from "@/lib/queries/pages";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPage("home"), getSiteSettings()]);
  const title = page?.meta?.title || settings?.defaultSeo?.title || "Qbitlog: Software, on the record";
  const meta = await buildMetadata({ doc: page ? { ...page, title } : null, path: "/", generatedImage: true });
  return { ...meta, title: { absolute: title } };
}

export default async function HomePage() {
  const [page, settings] = await Promise.all([getPage("home"), getSiteSettings()]);
  if (!page) notFound();
  return (
    <>
      <JsonLd data={websiteLd(settings)} />
      <RenderBlocks blocks={page.layout} />
      <p>TESTING</p>
    </>
  );
}
