import { SectionHead } from "@/components/ds/SectionHead";
import { resolveLink, type LinkValue } from "@/lib/links";

export type SectionHeadData = {
  label?: string | null;
  title?: string | null;
  emphasis?: string | null;
  intro?: string | null;
  more?: LinkValue;
};

/** `SectionHead` from a block's shared section-head fields. Renders nothing without a title. */
export function SectionHeader({ data, as }: { data: SectionHeadData; as?: "h1" | "h2" }) {
  if (!data.title) return null;
  const more = resolveLink(data.more ?? null);
  return (
    <SectionHead
      as={as}
      label={data.label}
      title={data.title}
      emphasis={data.emphasis}
      intro={data.intro}
      more={more ? { href: more.href, label: more.label } : null}
    />
  );
}

export default SectionHeader;
