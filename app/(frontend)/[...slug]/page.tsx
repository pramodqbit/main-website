import type { Metadata } from "next";
import { RenderBlocks } from "@/components/blocks/RenderBlocks";
import { getPage, pageSlugs } from "@/lib/queries/pages";
import { redirectOrNotFound } from "@/lib/redirects";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;
export const dynamicParams = true;

/** Slugs with their own route files (or reserved by the app) never render through the generic page route. */
const RESERVED = new Set([
  "home", "work", "services", "industries", "insights", "about", "careers", "contact", "log", "styleguide", "next", "admin", "api",
]);

type Props = { params: Promise<{ slug: string[] }> };

function pageSlug(parts: string[]): string | null {
  const slug = parts.map(decodeURIComponent).join("/");
  return RESERVED.has(parts[0] ?? "") ? null : slug;
}

export async function generateStaticParams() {
  const slugs = await pageSlugs();
  return slugs.filter((s) => !RESERVED.has(s.split("/")[0])).map((s) => ({ slug: s.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = pageSlug((await params).slug);
  const page = slug ? await getPage(slug) : null;
  if (!page) return {};
  return buildMetadata({ doc: page, path: `/${slug}`, generatedImage: true });
}

export default async function CmsPage({ params }: Props) {
  const parts = (await params).slug;
  const slug = pageSlug(parts);
  const page = slug ? await getPage(slug) : null;
  if (!page) return redirectOrNotFound(`/${parts.join("/")}`);
  return <RenderBlocks blocks={page.layout} pageTitle={page.title} />;
}
