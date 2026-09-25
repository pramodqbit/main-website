import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RenderBlocks } from "@/components/blocks/RenderBlocks";
import { getPage } from "@/lib/queries/pages";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ doc: await getPage("about"), path: "/about", fallbackTitle: "About", generatedImage: true });
}

export default async function AboutPage() {
  const page = await getPage("about");
  if (!page) notFound();
  return <RenderBlocks blocks={page.layout} pageTitle={page.title} />;
}
