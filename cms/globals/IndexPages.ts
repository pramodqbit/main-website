import type { GlobalConfig } from "payload";
import { anyone, isAdminOrEditor } from "../access";
import { indexPageSections } from "../blocks";
import { metricsField } from "../fields/metrics";
import { revalidateGlobalPath } from "../hooks/revalidate";
import { previewUrl } from "../utilities/previewPath";

const proof = metricsField("proof", { maxRows: 4 });

/** Hero, optional proof strip and extra sections for a code-owned index page (`/services`, `/work`). */
const indexPage = ({ slug, label, path }: { slug: string; label: string; path: string }): GlobalConfig => ({
  slug,
  label,
  admin: {
    group: "Settings",
    description: `The hero and extra sections on ${path}. Sections stay hidden until “Show on the site” is ticked; use Preview to review hidden ones.`,
    preview: () => previewUrl(slug, null),
  },
  access: { read: anyone, update: isAdminOrEditor },
  hooks: { afterChange: [revalidateGlobalPath(path)] },
  fields: [
    {
      name: "hero",
      type: "group",
      admin: { description: "The heading at the top of the page." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "label", type: "text", admin: { width: "40%", description: 'Mono eyebrow, e.g. "LOG / SERVICES".' } },
            { name: "title", type: "text", required: true, admin: { width: "60%" } },
          ],
        },
        { name: "emphasis", type: "text", admin: { description: "Shown in violet italic after the title." } },
        { name: "intro", type: "textarea" },
      ],
    },
    {
      ...proof,
      admin: { ...proof.admin, description: "Optional results strip under the hero. Leave empty to hide." },
    },
    {
      name: "sections",
      type: "blocks",
      blocks: indexPageSections,
      admin: { initCollapsed: true, description: "Shown after the main list, in this order." },
    },
  ],
});

export const ServicesPage = indexPage({ slug: "services-page", label: "Services Page", path: "/services" });
export const WorkPage = indexPage({ slug: "work-page", label: "Work Page", path: "/work" });
