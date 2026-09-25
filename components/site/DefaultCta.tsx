import { CtaSection } from "@/components/blocks/CtaBlock";
import { getPage } from "@/lib/queries/pages";
import type { CtaBlock } from "@/payload-types";

/**
 * The site-wide closing CTA: the first `cta` block on the home page, so marketing edits it in one place.
 * `title` replaces the heading (and its emphasis) for a page-specific prompt.
 */
export async function DefaultCta({ title }: { title?: string } = {}) {
  const home = await getPage("home");
  const cta = home?.layout?.find((b): b is CtaBlock => b.blockType === "cta");
  const content = cta ?? { title: "Book a scoping call" };
  return <CtaSection content={title ? { ...content, title, emphasis: null } : content} />;
}

export default DefaultCta;
