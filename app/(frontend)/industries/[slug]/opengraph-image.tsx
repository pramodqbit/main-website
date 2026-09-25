import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from "@/app/(frontend)/_og/render";
import { getIndustry } from "@/lib/queries/industries";

export const revalidate = 3600;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Qbitlog industry";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = await getIndustry(slug);
  return renderOg({
    label: ["Industry", industry?.title],
    title: industry?.headline || industry?.title || "Industries",
    metaImage: industry?.meta?.image,
  });
}
