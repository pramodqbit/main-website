import type { Block } from "payload";
import { blockHelp } from "../fields/blockHelp";
import { sectionHeadFields } from "../fields/sectionHead";

type GridSibling = { mode?: "featured" | "manual" | "latest" };

export const CaseStudyGrid: Block = {
  slug: "caseStudyGrid",
  interfaceName: "CaseStudyGridBlock",
  labels: { singular: "Case study grid", plural: "Case study grids" },
  admin: { group: "Work" },
  fields: [
    blockHelp("A grid of case studies. The first one can be shown large as a feature."),
    ...sectionHeadFields(),
    {
      name: "mode",
      type: "select",
      defaultValue: "featured",
      options: [
        { label: "Featured case studies", value: "featured" },
        { label: "Pick them manually", value: "manual" },
        { label: "Latest", value: "latest" },
      ],
    },
    {
      name: "items",
      type: "relationship",
      relationTo: "case-studies",
      hasMany: true,
      admin: {
        condition: (_, sibling: GridSibling) => sibling?.mode === "manual",
        description: "Drag to reorder.",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "limit",
          type: "number",
          defaultValue: 3,
          min: 1,
          max: 12,
          admin: { width: "50%", condition: (_, sibling: GridSibling) => sibling?.mode !== "manual" },
        },
        {
          name: "firstAsFeature",
          type: "checkbox",
          defaultValue: true,
          admin: { width: "50%", description: "Show the first case study as a large feature card." },
        },
      ],
    },
  ],
};
