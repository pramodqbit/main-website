import { Ticker } from "@/components/ds/Ticker";
import { listLogEntries } from "@/lib/queries/log";
import type { LogTickerBlock as LogTickerData } from "@/payload-types";

/** Scrolling strip of recent studio log entries flagged `showInTicker`. */
export async function LogTickerBlock({ block }: { block: LogTickerData }) {
  const { docs } = await listLogEntries({ tickerOnly: true, limit: block.limit ?? 8 });
  if (!docs.length) return null;
  return (
    <Ticker
      items={docs.map((e) => ({ type: e.type, subject: e.subject, text: e.text, highlight: e.highlight }))}
      className="relative z-[1]"
    />
  );
}

export default LogTickerBlock;
