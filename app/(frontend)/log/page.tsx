import type { Metadata } from "next";
import { logStreamEntries } from "@/components/blocks/InsightsBlock";
import { LogStream } from "@/components/ds/LogStream";
import { Pagination } from "@/components/ds/Pagination";
import { Section } from "@/components/ds/Section";
import { SectionHead } from "@/components/ds/SectionHead";
import { listLogEntries, type LogEntry } from "@/lib/queries/log";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

type Props = { searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { page } = await searchParams;
  return buildMetadata({
    path: "/log",
    fallbackTitle: "Studio log",
    fallbackDescription: "What Qbitlog has been doing: shipped projects, measured results and new writing, in date order.",
    noindex: Number(page) > 1,
    generatedImage: true,
  });
}

function byMonth(entries: LogEntry[]) {
  const groups = new Map<string, LogEntry[]>();
  for (const e of entries) {
    const key = new Date(e.date).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
    groups.set(key, [...(groups.get(key) ?? []), e]);
  }
  return [...groups.entries()];
}

export default async function LogPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const log = await listLogEntries({ limit: 50, page });
  const groups = byMonth(log.docs);

  return (
    <Section bordered={false} className="pt-[104px]">
      <SectionHead as="h1" label="LOG / STUDIO" title="What we’ve been doing" />
      {groups.length ? (
        <div className="measure flex flex-col gap-12">
          {groups.map(([month, entries]) => (
            <section key={month} aria-labelledby={`m-${month.replace(/\s+/g, "-")}`}>
              <h2 id={`m-${month.replace(/\s+/g, "-")}`} className="mb-4 font-mono text-sm font-normal uppercase text-muted">
                {month}
              </h2>
              <LogStream as="div" title={month} entries={logStreamEntries(entries)} />
            </section>
          ))}
          <Pagination page={page} totalPages={log.totalPages} basePath="/log" />
        </div>
      ) : (
        <p className="text-muted">No entries yet.</p>
      )}
    </Section>
  );
}
