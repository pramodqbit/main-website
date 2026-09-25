import type { Block } from "payload";
import { blockHelp } from "../fields/blockHelp";
import { sectionHeadFields } from "../fields/sectionHead";

export const Insights: Block = {
  slug: "insights",
  interfaceName: "InsightsBlock",
  labels: { singular: "Latest insights", plural: "Latest insights" },
  admin: { group: "Content" },
  fields: [
    blockHelp("The latest published insights (articles), optionally next to the studio log."),
    ...sectionHeadFields(),
    {
      type: "row",
      fields: [
        { name: "limit", type: "number", defaultValue: 4, min: 1, max: 12, admin: { width: "33%" } },
        {
          name: "category",
          type: "relationship",
          relationTo: "categories",
          admin: { width: "33%", description: "Optional: only this category." },
        },
        {
          name: "showStudioLog",
          type: "checkbox",
          defaultValue: true,
          admin: { width: "33%", description: "Show recent log entries beside the articles." },
        },
      ],
    },
  ],
};
