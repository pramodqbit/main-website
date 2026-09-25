import type { Block } from "payload";
import { LOG_ENTRY_TYPES } from "../collections/LogEntries";
import { blockHelp } from "../fields/blockHelp";
import { sectionHeadFields } from "../fields/sectionHead";

export const ShippedLog: Block = {
  slug: "shippedLog",
  interfaceName: "ShippedLogBlock",
  labels: { singular: "Recently shipped", plural: "Recently shipped" },
  admin: { group: "Studio" },
  fields: [
    blockHelp("The latest studio log entries of the chosen types, with a link to the full log."),
    ...sectionHeadFields({ withMore: false }),
    {
      type: "row",
      fields: [
        {
          name: "types",
          type: "select",
          hasMany: true,
          options: [...LOG_ENTRY_TYPES],
          admin: { width: "67%", description: "Leave empty for every type." },
        },
        { name: "limit", type: "number", defaultValue: 6, min: 1, max: 20, admin: { width: "33%" } },
      ],
    },
  ],
};
