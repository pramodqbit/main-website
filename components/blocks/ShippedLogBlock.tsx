import { LogStream } from "@/components/ds/LogStream";
import { Section } from "@/components/ds/Section";
import { SectionHead } from "@/components/ds/SectionHead";
import { listLogEntries } from "@/lib/queries/log";
import type { ShippedLogBlock as ShippedLogData } from "@/payload-types";
import { logStreamEntries } from "./InsightsBlock";

/** The latest log entries of the chosen types, with a link to the full log. */
export async function ShippedLogBlock({ block }: { block: ShippedLogData }) {
  const log = await listLogEntries({ limit: block.limit ?? 6, types: block.types });
  if (!log.docs.length) return null;
  return (
    <Section id="recent">
      {block.title ? (
        <SectionHead
          label={block.label}
          title={block.title}
          emphasis={block.emphasis}
          intro={block.intro}
          more={{ href: "/log", label: "Full log" }}
        />
      ) : null}
      <LogStream title="Studio log" meta="Recent" entries={logStreamEntries(log.docs)} className="w-full" />
    </Section>
  );
}

export default ShippedLogBlock;
