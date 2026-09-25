import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from "@/app/(frontend)/_og/render";
import { getService } from "@/lib/queries/services";

export const revalidate = 3600;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Qbitlog service";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService(slug);
  return renderOg({
    label: ["Service", service?.category],
    title: service?.outcomeHeadline || service?.title || "Services",
    metaImage: service?.meta?.image,
  });
}
