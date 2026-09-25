import type { Metadata } from "next";
import { logStreamEntries } from "@/components/blocks/InsightsBlock";
import { LogStream } from "@/components/ds/LogStream";
import { Pagination } from "@/components/ds/Pagination";
import { PostRow } from "@/components/ds/PostRow";
import { Section } from "@/components/ds/Section";
import { SectionHead } from "@/components/ds/SectionHead";
import { TextLink } from "@/components/ds/TextLink";
import { FilterChips } from "@/components/site/FilterChips";
import { populated } from "@/lib/content";
import { listLogEntries } from "@/lib/queries/log";
import { listCategories, listPosts } from "@/lib/queries/posts";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

type Props = { searchParams: Promise<{ category?: string; page?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category, page } = await searchParams;
  return buildMetadata({
    path: "/insights",
    fallbackTitle: "Insights",
    fallbackDescription: "Practical notes on AI, web architecture and platform engineering, written by the engineers at Qbitlog.",
    noindex: Boolean(category) || Number(page) > 1,
    generatedImage: true,
  });
}

export default async function InsightsPage({ searchParams }: Props) {
  const params = await searchParams;
  const category = params.category || null;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const [posts, categories, log] = await Promise.all([
    listPosts({ page, limit: 12, category }),
    listCategories(),
    listLogEntries({ limit: 6 }),
  ]);
  const chips = [
    { href: "/insights", label: "All", active: !category },
    ...categories.map((c) => ({ href: `/insights?category=${c.slug}`, label: c.title, active: category === c.slug })),
  ];

  return (
    <Section bordered={false} className="pt-[104px]">
      <SectionHead
        as="h1"
        label="LOG / INSIGHTS"
        title="Written by the people doing the work"
        intro="Practical notes on AI, web architecture and platform engineering from our engineers."
      />
      <FilterChips chips={chips} label="Filter by category" />
      <div className="grid grid-cols-[1.6fr_1fr] gap-12 max-[980px]:grid-cols-1">
        <div>
          {posts.docs.length ? (
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
          ) : (
            <p className="text-muted">
              No insights in this category yet. <TextLink href="/insights">See all insights</TextLink>
            </p>
          )}
          <Pagination page={page} totalPages={posts.totalPages} basePath="/insights" query={{ category: category ?? undefined }} />
        </div>
        {log.docs.length ? (
          <div className="flex flex-col items-start gap-4 max-[980px]:hidden">
            <LogStream entries={logStreamEntries(log.docs)} meta="Latest" className="w-full" />
            <TextLink href="/log" arrow className="font-mono text-sm">
              Full studio log
            </TextLink>
          </div>
        ) : null}
      </div>
    </Section>
  );
}
