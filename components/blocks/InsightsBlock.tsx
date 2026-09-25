import { LogStream } from "@/components/ds/LogStream";
import { PostRow } from "@/components/ds/PostRow";
import { Section } from "@/components/ds/Section";
import { populated } from "@/lib/content";
import { resolveLink } from "@/lib/links";
import { listLogEntries } from "@/lib/queries/log";
import { listPosts } from "@/lib/queries/posts";
import type { InsightsBlock as InsightsData, LogEntry } from "@/payload-types";
import { SectionHeader } from "./SectionHeader";

export function logStreamEntries(entries: LogEntry[]) {
  return entries.map((e) => ({
    date: e.date,
    type: e.type,
    text: `${e.subject}: ${e.text}`,
    href: resolveLink(e.link, "Read")?.href ?? null,
  }));
}

/** Latest insights with the studio log beside them. */
export async function InsightsBlock({ block }: { block: InsightsData }) {
  const category = populated(block.category) ? block.category.slug : null;
  const [posts, log] = await Promise.all([
    listPosts({ limit: block.limit ?? 4, category }),
    block.showStudioLog !== false ? listLogEntries({ limit: 4 }) : null,
  ]);
  if (!posts.docs.length && !log?.docs.length) return null;
  return (
    <Section id="insights">
      <SectionHeader data={block} />
      <div className="grid grid-cols-[1.6fr_1fr] gap-12 max-[980px]:grid-cols-1">
        <div className="border-t border-line">
          {posts.docs.map((p) => (
            <PostRow
              key={p.id}
              href={`/insights/${p.slug}`}
              date={(p.publishedAt ?? p.createdAt).slice(0, 10)}
              category={populated(p.category) ? p.category.title : null}
              title={p.title}
            />
          ))}
        </div>
        {log?.docs.length ? <LogStream entries={logStreamEntries(log.docs)} meta="Latest" /> : null}
      </div>
    </Section>
  );
}

export default InsightsBlock;
