import { Section } from "@/components/ds/Section";
import { ServiceRow } from "@/components/ds/ServiceRow";
import { populatedList, serviceRow } from "@/lib/content";
import { listServices } from "@/lib/queries/services";
import type { ServiceListBlock as ServiceListData } from "@/payload-types";
import { SectionHeader } from "./SectionHeader";

/** Services described by outcome. Empty selection = all services by `order`. */
export async function ServiceListBlock({ block }: { block: ServiceListData }) {
  const picked = populatedList(block.services);
  const services = picked.length ? picked : await listServices();
  if (!services.length) return null;
  return (
    <Section id="services">
      <SectionHeader data={block} />
      <div className="border-t border-line">
        {services.map((s) => (
          <ServiceRow key={s.id} {...serviceRow(s)} />
        ))}
      </div>
    </Section>
  );
}

export default ServiceListBlock;
