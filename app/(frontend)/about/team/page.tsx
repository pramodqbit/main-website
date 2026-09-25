import type { Metadata } from "next";
import { TeamGrid } from "@/components/blocks/TeamGridBlock";
import { Section } from "@/components/ds/Section";
import { SectionHead } from "@/components/ds/SectionHead";
import { listTeam } from "@/lib/queries/team";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/about/team",
    fallbackTitle: "Team",
    fallbackDescription: "The engineers, designers and leads behind Qbitlog’s work.",
    generatedImage: true,
  });
}

export default async function TeamPage() {
  const people = await listTeam();
  return (
    <Section bordered={false} className="pt-[104px]">
      <SectionHead as="h1" label="LOG / TEAM" title="The people doing the work" />
      {people.length ? <TeamGrid people={people} /> : <p className="text-muted">Team profiles are coming soon.</p>}
    </Section>
  );
}
