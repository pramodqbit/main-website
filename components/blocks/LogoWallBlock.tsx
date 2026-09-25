import { Media } from "@/components/ds/Media";
import { Section } from "@/components/ds/Section";
import { getPayloadClient } from "@/lib/payload";
import type { LogoWallBlock as LogoWallData } from "@/payload-types";
import { SectionHeader } from "./SectionHeader";

/** Client logos, only for clients with written permission (`showLogo`). */
export async function LogoWallBlock({ block }: { block: LogoWallData }) {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({ collection: "clients", where: { showLogo: { equals: true } }, limit: 24, depth: 1 });
  const clients = docs.filter((c) => typeof c.logo === "object" && c.logo);
  if (!clients.length) return null;
  return (
    <Section>
      <SectionHeader data={block} />
      <ul className="m-0 grid list-none grid-cols-4 gap-px border border-line bg-line p-0 max-[860px]:grid-cols-2">
        {clients.map((c) => (
          <li key={c.id} className="flex items-center justify-center bg-paper p-8">
            <Media media={c.logo} size="thumb" sizes="200px" className="max-h-12 w-auto object-contain" />
            <span className="sr-only">{c.name}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export default LogoWallBlock;
