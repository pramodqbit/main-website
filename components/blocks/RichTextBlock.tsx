import { Section } from "@/components/ds/Section";
import { RichText } from "@/components/richtext/RichText";
import type { RichTextBlock as RichTextData } from "@/payload-types";

export function RichTextBlock({ block }: { block: RichTextData }) {
  if (!block.content) return null;
  return (
    <Section>
      <RichText data={block.content} wide={block.width === "wide"} />
    </Section>
  );
}

export default RichTextBlock;
