import { Section } from "@/components/ds/Section";
import { getSiteSettings } from "@/lib/queries/globals";
import type { RemoteWorkingBlock as RemoteWorkingData } from "@/payload-types";
import { SectionHeader } from "./SectionHeader";

/** How we work across time zones: the site's time-zone note, then a 3-column hairline grid. */
export async function RemoteWorkingBlock({ block }: { block: RemoteWorkingData }) {
  const items = block.items ?? [];
  if (!items.length) return null;
  const note = (await getSiteSettings())?.contact?.timezoneNote;
  return (
    <Section id="working-together">
      <SectionHeader data={block} />
      {note ? <p className="mb-10 font-mono text-[clamp(20px,2.4vw,28px)] text-ink">{note}</p> : null}
      <ul className="m-0 grid list-none grid-cols-3 gap-px border border-line bg-line p-0 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
        {items.map((it, i) => (
          <li key={it.id ?? i} className="bg-surface p-6">
            <h3 className="m-0 font-mono text-label font-normal uppercase text-brand">{it.title}</h3>
            <p className="mb-0 mt-3">{it.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export default RemoteWorkingBlock;
