import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from "@/app/(frontend)/_og/render";
import { getPage } from "@/lib/queries/pages";

export const revalidate = 3600;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Qbitlog: Software, on the record";

export default async function Image() {
  const page = await getPage("home");
  return renderOg({
    label: ["Software studio", "Web · Mobile · AI"],
    title: "We build the software. And we show our working.",
    metaImage: page?.meta?.image,
  });
}
