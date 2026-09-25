import { notFound, redirect } from "next/navigation";
import { listIndustries } from "@/lib/queries/industries";

export const revalidate = 3600;

/** There is no industries index: send visitors to the first industry by `order`. */
export default async function IndustriesIndex() {
  const [first] = await listIndustries();
  if (!first?.slug) notFound();
  redirect(`/industries/${first.slug}`);
}
