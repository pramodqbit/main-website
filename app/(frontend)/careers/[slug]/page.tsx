import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ds/Breadcrumbs";
import { Heading } from "@/components/ds/Heading";
import { Lede } from "@/components/ds/Lede";
import { LogLabel } from "@/components/ds/LogLabel";
import { MonoLabel } from "@/components/ds/MonoLabel";
import { Pill } from "@/components/ds/Pill";
import { Section } from "@/components/ds/Section";
import { ApplyForm } from "@/components/forms/ApplyForm";
import { RichText } from "@/components/richtext/RichText";
import { JsonLd } from "@/components/site/JsonLd";
import { breadcrumbLd, jobLd } from "@/lib/jsonld";
import { hasContent } from "@/lib/lexical";
import { getSiteSettings } from "@/lib/queries/globals";
import { getJob, jobSlugs } from "@/lib/queries/jobs";
import { redirectOrNotFound } from "@/lib/redirects";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await jobSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) return {};
  return buildMetadata({
    doc: { ...job, title: job.meta?.title || job.title, excerpt: job.summary },
    path: `/careers/${slug}`,
    noindex: job.status === "closed",
    generatedImage: true,
  });
}

function BulletList({ title, items }: { title: string; items: { item: string; id?: string | null }[] | null | undefined }) {
  if (!items?.length) return null;
  return (
    <div className="mt-12">
      <MonoLabel as="h2" tone="brand" className="mb-4">
        {title}
      </MonoLabel>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {items.map((it, i) => (
          <li key={it.id ?? i} className="flex gap-3">
            <span aria-hidden="true" className="font-mono text-brand">
              —
            </span>
            <span>{it.item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params;
  const [job, settings] = await Promise.all([getJob(slug), getSiteSettings()]);
  if (!job) return redirectOrNotFound(`/careers/${slug}`);

  const path = `/careers/${job.slug}`;
  const open = job.status === "open";
  const crumbs = [
    { label: "Careers", href: "/careers" },
    { label: job.title, href: path },
  ];

  return (
    <>
      <JsonLd data={[open ? jobLd(job, path, settings) : null, breadcrumbLd(crumbs, path)]} />
      <Section bordered={false} className="pt-[104px]">
        <div className="measure">
          <Breadcrumbs items={crumbs} className="mb-8" />
          <LogLabel items={[job.department, job.location, job.employmentType]} />
          <Heading size="h1" className="mt-5">
            {job.title}
          </Heading>
          {job.salary ? <p className="mt-4 font-mono text-sm text-muted">{job.salary}</p> : null}
          {!open ? (
            <div className="mt-4">
              <Pill tone="muted">This role is closed</Pill>
            </div>
          ) : null}
          <Lede className="mt-6">{job.summary}</Lede>

          {hasContent(job.description) ? <RichText data={job.description} className="mt-10" /> : null}
          <BulletList title="Responsibilities" items={job.responsibilities} />
          <BulletList title="Requirements" items={job.requirements} />
          <BulletList title="Benefits" items={job.benefits} />
        </div>
      </Section>

      {open ? (
        <Section id="apply">
          <div className="measure">
            <Heading as="h2" size="h2" className="mb-8">
              Apply for this role
            </Heading>
            <ApplyForm jobId={job.id} jobSlug={job.slug} />
          </div>
        </Section>
      ) : null}
    </>
  );
}
