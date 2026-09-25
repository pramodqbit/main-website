import type { Block } from "payload";
import { blockHelp } from "../fields/blockHelp";
import { sectionHeadFields } from "../fields/sectionHead";

export const TeamGrid: Block = {
  slug: "teamGrid",
  interfaceName: "TeamGridBlock",
  labels: { singular: "Team grid", plural: "Team grids" },
  admin: { group: "Studio" },
  fields: [
    blockHelp("Team members that have “Show on site” ticked."),
    ...sectionHeadFields(),
    {
      name: "filter",
      type: "select",
      defaultValue: "all",
      options: [
        { label: "Everyone", value: "all" },
        { label: "Leadership only", value: "leadership" },
      ],
    },
  ],
};
