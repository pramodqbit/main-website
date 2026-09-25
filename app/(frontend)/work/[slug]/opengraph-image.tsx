import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from "@/app/(frontend)/_og/render";
import { featuredMetrics, industryOf } from "@/lib/content";
import { getCaseStudy } from "@/lib/queries/caseStudies";

export const revalidate = 3600;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Qbitlog case study";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = await getCaseStudy(slug);
  const metric = cs ? featuredMetrics(cs, 1)[0] : undefined;
  return renderOg({
    label: [
      "Case study",
      cs?.status === "prototype" ? "PROTOTYPE" : null,
      cs ? industryOf(cs)?.title : null,
      cs?.durationWeeks ? `${cs.durationWeeks} weeks` : null,
    ],
    title: cs?.title ?? "Case study",
    metric: metric ? `${metric.value}${metric.unit ?? ""} ${metric.label}` : null,
    metaImage: cs?.meta?.image,
  });
}
