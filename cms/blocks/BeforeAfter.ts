import type { Block } from "payload";
import { blockHelp } from "../fields/blockHelp";
import { rowLabel } from "../fields/rowLabel";
import { sectionHeadFields } from "../fields/sectionHead";

export const BeforeAfter: Block = {
  slug: "beforeAfter",
  interfaceName: "BeforeAfterBlock",
  labels: { singular: "Before / after (what gets easier)", plural: "Before / after sections" },
  admin: { group: "Studio" },
  fields: [
    blockHelp("Everyday problems a client has today, and what changes once we’ve built for them. Keep each side to one sentence."),
    ...sectionHeadFields(),
    {
      name: "rows",
      type: "array",
      minRows: 2,
      maxRows: 6,
      labels: { singular: "Row", plural: "Rows" },
      admin: { initCollapsed: true, components: { RowLabel: rowLabel("aspect", "Row") } },
      fields: [
        { name: "aspect", type: "text", required: true, admin: { description: 'The area of work, e.g. "Reporting"' } },
        { name: "before", type: "textarea", required: true, admin: { description: "How it works today (the pain)." } },
        { name: "after", type: "textarea", required: true, admin: { description: "How it works after (no numbers unless measured)." } },
      ],
    },
  ],
};
