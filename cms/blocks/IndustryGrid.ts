import type { Block } from "payload";
import { blockHelp } from "../fields/blockHelp";
import { sectionHeadFields } from "../fields/sectionHead";

export const IndustryGrid: Block = {
  slug: "industryGrid",
  interfaceName: "IndustryGridBlock",
  labels: { singular: "Industry grid", plural: "Industry grids" },
  admin: { group: "Studio" },
  fields: [
    blockHelp("Tiles linking to the industry landing pages."),
    ...sectionHeadFields(),
    {
      name: "industries",
      type: "relationship",
      relationTo: "industries",
      hasMany: true,
      admin: { description: "Leave empty to show all industries." },
    },
  ],
};
