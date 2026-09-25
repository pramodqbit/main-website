import type { Metadata } from "next";
import { JobList } from "@/components/blocks/JobsListBlock";
import { Section } from "@/components/ds/Section";
import { SectionHead } from "@/components/ds/SectionHead";
import { getSiteSettings } from "@/lib/queries/globals";
import { listOpenJobs } from "@/lib/queries/jobs";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/careers",
    fallbackTitle: "Careers",
    fallbackDescription: "Open roles at Qbitlog, a software studio that designs and builds web, mobile and AI products.",
    generatedImage: true,
  });
}

export default async function CareersPage() {
  const [jobs, settings] = await Promise.all([listOpenJobs(), getSiteSettings()]);
  const email = settings?.contact?.email;
  return (
    <Section bordered={false} className="pt-[104px]">
      <SectionHead
        as="h1"
        label="LOG / CAREERS"
        title="Open roles"
        intro="We’re a small studio. Everyone ships, everyone writes down what they decided and why."
      />
      {jobs.length ? (
        <div className="border-t border-line">
          <JobList jobs={jobs} />
        </div>
      ) : (
        <p className="text-muted">
          No open roles right now.
          {email ? (
            <>
              {" "}
              Send your CV to <span className="font-mono text-ink">{email}</span>.
            </>
          ) : null}
        </p>
      )}
    </Section>
  );
}
