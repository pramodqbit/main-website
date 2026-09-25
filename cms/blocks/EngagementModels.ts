import type { Block } from "payload";
import { blockHelp } from "../fields/blockHelp";
import { rowLabel } from "../fields/rowLabel";
import { sectionHeadFields } from "../fields/sectionHead";

export const EngagementModels: Block = {
  slug: "engagementModels",
  interfaceName: "EngagementModelsBlock",
  labels: { singular: "Engagement models", plural: "Engagement models" },
  admin: { group: "Studio" },
  fields: [
    blockHelp("2–4 ways to work with us, side by side: who each is for, how long, the team and the pricing."),
    ...sectionHeadFields(),
    {
      name: "models",
      type: "array",
      minRows: 2,
      maxRows: 4,
      labels: { singular: "Model", plural: "Models" },
      admin: { initCollapsed: true, components: { RowLabel: rowLabel("name", "Model") } },
      fields: [
        { name: "name", type: "text", required: true, admin: { description: 'e.g. "Fixed-scope project".' } },
        { name: "bestFor", type: "text", required: true, admin: { description: "One sentence: who this suits." } },
        {
          type: "row",
          fields: [
            { name: "duration", type: "text", admin: { width: "33%" } },
            { name: "team", type: "text", admin: { width: "33%" } },
            { name: "pricing", type: "text", admin: { width: "34%" } },
          ],
        },
        {
          name: "includes",
          type: "array",
          labels: { singular: "Item", plural: "Includes" },
          admin: { initCollapsed: true, components: { RowLabel: rowLabel("item", "Item") } },
          fields: [{ name: "item", type: "text", required: true }],
        },
      ],
    },
  ],
};
