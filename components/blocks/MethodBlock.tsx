import { Pill } from "@/components/ds/Pill";
import { Quote } from "@/components/ds/Quote";
import { Section } from "@/components/ds/Section";
import { Steps } from "@/components/ds/Steps";
import { populated } from "@/lib/content";
import { isDraft } from "@/lib/draft";
import type { MethodBlock as MethodData } from "@/payload-types";
import { SectionHeader } from "./SectionHeader";

/** "How we work" steps with the progress rail, plus an optional approved client quote. */
export async function MethodBlock({ block }: { block: MethodData }) {
  const draft = await isDraft();
  const inverted = block.inverted !== false;
  const t = populated(block.testimonial) ? block.testimonial : null;
  const showQuote = t && (t.approved || draft);
  return (
    <Section id="method" tone={inverted ? "inverted" : "paper"}>
      <SectionHeader data={block} />
      {block.steps?.length ? (
        <Steps
          tone={inverted ? "inverted" : "paper"}
          steps={block.steps.map((s) => ({ name: s.name, description: s.description, deliverable: s.deliverable }))}
        />
      ) : null}
      {showQuote && t ? (
        <Quote
          className="mt-16"
          label="Client note"
          quote={t.quote}
          name={t.name}
          role={t.role}
          company={t.company}
          badge={t.approved ? null : <Pill tone="signal">Not approved</Pill>}
        />
      ) : null}
    </Section>
  );
}

export default MethodBlock;
