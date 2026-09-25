import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ds/Breadcrumbs";
import { Heading } from "@/components/ds/Heading";
import { Lede } from "@/components/ds/Lede";
import { LogLabel } from "@/components/ds/LogLabel";
import { Media } from "@/components/ds/Media";
import { MonoLabel } from "@/components/ds/MonoLabel";
import { PostRow } from "@/components/ds/PostRow";
import { Section } from "@/components/ds/Section";
import { CopyLink } from "@/components/forms/CopyLink";
import { RichText } from "@/components/richtext/RichText";
import { DefaultCta } from "@/components/site/DefaultCta";
import { JsonLd } from "@/components/site/JsonLd";
import { populated, populatedList } from "@/lib/content";
import { breadcrumbLd, postLd } from "@/lib/jsonld";
import { extractToc } from "@/lib/lexical";
import { getPost, postSlugs, relatedPosts } from "@/lib/queries/posts";
import { redirectOrNotFound } from "@/lib/redirects";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl, formatDate } from "@/lib/site";
import type { Team } from "@/payload-types";

export const revalidate = 3600;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await postSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return buildMetadata({
    doc: post,
    path: `/insights/${slug}`,
    type: "article",
    authors: populatedList<Team>(post.authors).map((a) => a.name),
    generatedImage: true,
  });
}

function authorHref(a: Team): string | null {
  return a.kind === "team" || a.showOnSite === false ? null : `/about/team#${a.slug}`;
}

function AuthorName({ author }: { author: Team }) {
  const href = authorHref(author);
  return href ? (
    <Link href={href} className="text-ink underline-offset-[3px] hover:text-brand hover:underline">
      {author.name}
    </Link>
  ) : (
    <span className="text-ink">{author.name}</span>
  );
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return redirectOrNotFound(`/insights/${slug}`);

  const path = `/insights/${post.slug}`;
  const url = absoluteUrl(path);
  const category = populated(post.category) ? post.category : null;
  const authors = populatedList<Team>(post.authors);
  const date = post.publishedAt ?? post.createdAt;
  const toc = extractToc(post.content);
  const related = await relatedPosts(post);
  const crumbs = [
    { label: "Insights", href: "/insights" },
    { label: post.title, href: path },
  ];
  const share = [
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { label: "X", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}` },
  ];

  return (
    <>
      <JsonLd data={[postLd(post, path), breadcrumbLd(crumbs, path)]} />

      <Section bordered={false} className="pt-[104px]">
        <div className="grid gap-16 min-[1100px]:grid-cols-[minmax(0,1fr)_240px]">
          <article className="min-w-0">
            <Breadcrumbs items={crumbs} className="mb-8" />
            <LogLabel
              items={[category?.title, post.readingTime ? `${post.readingTime} min read` : null, formatDate(date)]}
            />
            <Heading size="h1" className="mt-5 max-w-[22ch]">
              {post.title}
            </Heading>
            <Lede className="mt-6">{post.excerpt}</Lede>
            {authors.length ? (
              <p className="mt-6 text-sm text-muted" data-reveal="up" data-reveal-delay={420}>
                By{" "}
                {authors.map((a, i) => (
                  <span key={a.id}>
                    {i > 0 ? (i === authors.length - 1 ? " and " : ", ") : null}
                    <AuthorName author={a} />
                    {a.kind !== "team" ? `, ${a.role}` : null}
                  </span>
                ))}
                {" · "}
                <time dateTime={date}>{formatDate(date)}</time>
              </p>
            ) : (
              <p className="mt-6 text-sm text-muted" data-reveal="up" data-reveal-delay={420}>
                <time dateTime={date}>{formatDate(date)}</time>
              </p>
            )}

            {post.heroImage ? (
              <div className="mt-12 overflow-hidden border border-line bg-surface">
                <Media media={post.heroImage} size="feature" sizes="(min-width: 1100px) 800px, 100vw" priority />
              </div>
            ) : null}

            <RichText data={post.content} className="mt-12" />

            <div className="mt-12 flex flex-wrap items-center gap-5 border-t border-line pt-5" data-reveal="up">
              <MonoLabel>Share</MonoLabel>
              {share.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener"
                  className="font-mono text-label uppercase text-muted hover:text-ink"
                >
                  {s.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
              <CopyLink url={url} />
            </div>

            {authors.length ? (
              <div className="mt-12 flex flex-col gap-6">
                {authors.map((a) => (
                  <div key={a.id} className="border border-line bg-surface p-6" data-reveal="up">
                    <MonoLabel>{a.kind === "team" ? "Written by" : a.role}</MonoLabel>
                    <p className="m-0 mt-2 font-serif text-xl">
                      <AuthorName author={a} />
                    </p>
                    {a.bio ? <p className="mb-0 mt-2 text-sm text-muted">{a.bio}</p> : null}
                  </div>
                ))}
              </div>
            ) : null}
          </article>

          {toc.length > 1 ? (
            <nav aria-label="On this page" className="max-[1099px]:hidden">
              <div className="sticky top-24" data-reveal="fade" data-reveal-delay={600}>
                <MonoLabel as="p" className="mb-4">
                  On this page
                </MonoLabel>
                <ol className="m-0 flex list-none flex-col gap-2.5 border-l border-line p-0 pl-4 text-sm">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="text-muted no-underline hover:text-ink">
                        {t.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>
          ) : null}
        </div>
      </Section>

      {related.length ? (
        <Section>
          <MonoLabel as="h2" tone="brand" className="mb-6">
            Related insights
          </MonoLabel>
          <div className="border-t border-line">
            {related.map((p) => (
              <PostRow
                key={p.id}
                href={`/insights/${p.slug}`}
                date={(p.publishedAt ?? p.createdAt).slice(0, 10)}
                category={populated(p.category) ? p.category.title : null}
                title={p.title}
              />
            ))}
          </div>
        </Section>
      ) : null}

      <DefaultCta />
    </>
  );
}
