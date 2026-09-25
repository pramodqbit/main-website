import type { Block } from "payload";
import { blockHelp } from "../fields/blockHelp";
import { rowLabel } from "../fields/rowLabel";
import { sectionHeadFields } from "../fields/sectionHead";

export const RemoteWorking: Block = {
  slug: "remoteWorking",
  interfaceName: "RemoteWorkingBlock",
  labels: { singular: "Working across time zones", plural: "Working across time zones" },
  admin: { group: "Studio" },
  fields: [
    blockHelp("How we work with clients in other time zones. The time-zone note from Site Settings is shown above the grid."),
    ...sectionHeadFields(),
    {
      name: "items",
      type: "array",
      minRows: 3,
      maxRows: 8,
      labels: { singular: "Item", plural: "Items" },
      admin: { initCollapsed: true, components: { RowLabel: rowLabel("title", "Item") } },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "text", type: "textarea", required: true },
      ],
    },
  ],
};
