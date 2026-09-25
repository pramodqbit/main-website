import { DecisionRecord } from "@/components/ds/DecisionRecord";
import { LogLabel } from "@/components/ds/LogLabel";
import { Section } from "@/components/ds/Section";
import { populated } from "@/lib/content";
import { isDraft } from "@/lib/draft";
import type { WriteupExplainerBlock as WriteupExplainerData } from "@/payload-types";
import { SectionHeader } from "./SectionHeader";

/** How a case study is written up: the numbered parts, next to one real decision record. */
export async function WriteupExplainerBlock({ block }: { block: WriteupExplainerData }) {
  const draft = await isDraft();
  const parts = block.parts ?? [];
  const cs = populated(block.sampleCaseStudy) ? block.sampleCaseStudy : null;
  const visible = cs && (draft || cs._status === "published") ? cs : null;
  const decision = visible?.decisions?.[block.sampleDecisionIndex ?? 0] ?? null;
  if (!parts.length && !decision) return null;
  return (
    <Section id="format">
      <SectionHeader data={block} />
      <div className={decision ? "grid grid-cols-[1fr_1.2fr] gap-12 max-[980px]:grid-cols-1" : undefined}>
        {parts.length ? (
          <ol className="m-0 flex list-none flex-col p-0">
            {parts.map((p, i) => (
              <li key={p.id ?? i} className="grid grid-cols-[48px_1fr] gap-4 border-b border-line py-5 first:border-t">
                <span aria-hidden="true" className="font-mono text-sm text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="m-0 font-serif text-xl">{p.name}</h3>
                  {p.text ? <p className="mb-0 mt-1.5 text-muted">{p.text}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        ) : null}
        {decision && visible ? (
          <figure className="m-0 self-start border border-line bg-surface p-7">
            <figcaption className="mb-5 flex flex-col gap-3">
              <LogLabel items={["Example", visible.client]} />
              <span className="font-serif text-2xl leading-[1.2]">{decision.title}</span>
            </figcaption>
            <DecisionRecord
              problem={decision.problem}
              options={(decision.options ?? []).map((o) => ({ label: o.label, chosen: o.chosen }))}
              decision={decision.decision}
              why={decision.why}
            />
          </figure>
        ) : null}
      </div>
    </Section>
  );
}

export default WriteupExplainerBlock;
