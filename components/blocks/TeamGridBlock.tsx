import { Section } from "@/components/ds/Section";
import { TeamCard } from "@/components/ds/TeamCard";
import { teamLinks, teamPhoto } from "@/lib/content";
import { listTeam } from "@/lib/queries/team";
import type { Team, TeamGridBlock as TeamGridData } from "@/payload-types";
import { SectionHeader } from "./SectionHeader";

export function TeamGrid({ people }: { people: Team[] }) {
  return (
    <div className="grid grid-cols-3 gap-5 max-[980px]:grid-cols-2 max-[560px]:grid-cols-1">
      {people.map((t) => (
        <TeamCard key={t.id} id={t.slug ?? undefined} name={t.name} role={t.role} bio={t.bio} photo={teamPhoto(t)} links={teamLinks(t)} />
      ))}
    </div>
  );
}

export async function TeamGridBlock({ block }: { block: TeamGridData }) {
  const people = await listTeam({ leadership: block.filter === "leadership" });
  if (!people.length) return null;
  return (
    <Section>
      <SectionHeader data={block} />
      <TeamGrid people={people} />
    </Section>
  );
}

export default TeamGridBlock;
