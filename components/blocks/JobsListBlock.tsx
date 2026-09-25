import { JobRow } from "@/components/ds/JobRow";
import { Section } from "@/components/ds/Section";
import { listOpenJobs } from "@/lib/queries/jobs";
import type { Job, JobsListBlock as JobsListData } from "@/payload-types";
import { SectionHeader } from "./SectionHeader";

export function JobList({ jobs }: { jobs: Job[] }) {
  return (
    <div>
      {jobs.map((j) => (
        <JobRow key={j.id} href={`/careers/${j.slug}`} title={j.title} department={j.department} location={j.location} type={j.employmentType} />
      ))}
    </div>
  );
}

export async function JobsListBlock({ block }: { block: JobsListData }) {
  const jobs = await listOpenJobs();
  if (!jobs.length) return null;
  return (
    <Section>
      <SectionHeader data={block} />
      <JobList jobs={jobs} />
    </Section>
  );
}

export default JobsListBlock;
