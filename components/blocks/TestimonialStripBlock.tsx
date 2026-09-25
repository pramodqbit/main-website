import { Quote } from "@/components/ds/Quote";
import { Section } from "@/components/ds/Section";
import { TextLink } from "@/components/ds/TextLink";
import { populated } from "@/lib/content";
import { listApprovedTestimonials } from "@/lib/queries/testimonials";
import type { TestimonialStripBlock as TestimonialStripData } from "@/payload-types";
import { SectionHeader } from "./SectionHeader";

/** Approved client quotes only, each linking to its case study. Renders nothing when none are approved. */
export async function TestimonialStripBlock({ block }: { block: TestimonialStripData }) {
  const quotes = await listApprovedTestimonials(block.limit ?? 3);
  if (!quotes.length) return null;
  const cols = quotes.length >= 3 ? "grid-cols-3" : quotes.length === 2 ? "grid-cols-2" : "grid-cols-1";
  return (
    <Section id="clients">
      <SectionHeader data={block} />
      <div className={`grid gap-12 max-[980px]:grid-cols-1 ${cols}`}>
        {quotes.map((t) => {
          const cs = populated(t.caseStudy) && t.caseStudy._status === "published" ? t.caseStudy : null;
          return (
            <div key={t.id} className="flex flex-col gap-5">
              <Quote size="sm" quote={t.quote} name={t.name} role={t.role} company={t.company} />
              {cs ? (
                <TextLink href={`/work/${cs.slug}`} arrow className="font-mono text-sm">
                  Read the {cs.client} case study
                </TextLink>
              ) : null}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

export default TestimonialStripBlock;
