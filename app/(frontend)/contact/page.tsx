import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RenderBlocks } from "@/components/blocks/RenderBlocks";
import { getPage } from "@/lib/queries/pages";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ doc: await getPage("contact"), path: "/contact", fallbackTitle: "Contact", generatedImage: true });
}

export default async function ContactPage() {
  const page = await getPage("contact");
  if (!page) notFound();
  return <RenderBlocks blocks={page.layout} pageTitle={page.title} />;
}
