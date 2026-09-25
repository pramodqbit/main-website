import type { Block } from "payload";
import { blockHelp } from "../fields/blockHelp";
import { linkField } from "../fields/link";
import { rowLabel } from "../fields/rowLabel";

export const Cta: Block = {
  slug: "cta",
  interfaceName: "CtaBlock",
  labels: { singular: "Call to action", plural: "Calls to action" },
  admin: { group: "Content" },
  fields: [
    blockHelp("The “Book a scoping call” box. Usually the last section on a page."),
    { name: "label", type: "text", admin: { description: 'Mono eyebrow, e.g. "NEXT STEP".' } },
    { name: "title", type: "text", required: true },
    { name: "emphasis", type: "text", admin: { description: "Shown in violet italic after the title." } },
    { name: "body", type: "textarea" },
    linkField("button", {
      label: "Button",
      description: "Leave empty to use the booking link from Site Settings.",
    }),
    {
      name: "details",
      type: "array",
      maxRows: 4,
      labels: { singular: "Detail", plural: "Details" },
      admin: {
        initCollapsed: true,
        description: 'Small facts beside the button, e.g. "Reply time" → "1 business day".',
        components: { RowLabel: rowLabel("label", "Detail") },
      },
      fields: [
        {
          type: "row",
          fields: [
            { name: "label", type: "text", required: true, admin: { width: "50%" } },
            { name: "value", type: "text", required: true, admin: { width: "50%" } },
          ],
        },
      ],
    },
  ],
};
