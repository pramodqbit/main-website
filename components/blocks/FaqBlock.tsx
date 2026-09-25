import { FAQList } from "@/components/ds/FAQList";
import { Heading } from "@/components/ds/Heading";
import { Section } from "@/components/ds/Section";
import { JsonLd } from "@/components/site/JsonLd";
import { populatedList } from "@/lib/content";
import { isDraft } from "@/lib/draft";
import { faqLd } from "@/lib/jsonld";
import { getPayloadClient } from "@/lib/payload";
import type { Faq, FaqBlock as FaqData } from "@/payload-types";

async function faqsFor(block: FaqData): Promise<Faq[]> {
  const picked = populatedList(block.faqs);
  if (picked.length || !block.topic) return picked;
  const payload = await getPayloadClient();
  const res = await payload.find({ collection: "faqs", where: { topic: { equals: block.topic } }, sort: "order", limit: 20, depth: 0 });
  return res.docs;
}

/** Shared FAQ section: label column + accordion, with FAQPage JSON-LD for the visible questions. */
export function FaqSection({ label, title, faqs }: { label?: string | null; title?: string | null; faqs: Faq[] }) {
  if (!faqs.length) return null;
  return (
    <Section id="faq">
      <div className="grid grid-cols-[200px_1fr] gap-8 max-[860px]:grid-cols-1 max-[860px]:gap-4">
        <span
          className="pt-[26px] font-mono text-sm text-brand max-[860px]:pt-0"
          data-chapter={label || "LOG / FAQ"}
          data-reveal="fade"
        >
          {label || "LOG / FAQ"}
        </span>
        <div>
          {title ? (
            <Heading as="h2" size="h2" className="mb-8">
              {title}
            </Heading>
          ) : (
            <h2 className="sr-only">Frequently asked questions</h2>
          )}
          <FAQList items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} defaultOpen={0} />
        </div>
      </div>
      <JsonLd data={faqLd(faqs)} />
    </Section>
  );
}

/** Drops unreviewed `[REVIEW]` questions outside preview mode. */
export function visibleFaqs(faqs: Faq[], draft: boolean): Faq[] {
  return draft ? faqs : faqs.filter((f) => !f.question.startsWith("[REVIEW]"));
}

export async function FaqBlock({ block }: { block: FaqData }) {
  const [faqs, draft] = await Promise.all([faqsFor(block), isDraft()]);
  return <FaqSection label={block.label} title={block.title} faqs={visibleFaqs(faqs, draft)} />;
}

export default FaqBlock;
