import type { Block } from "payload";
import { blockHelp } from "../fields/blockHelp";
import { rowLabel } from "../fields/rowLabel";
import { sectionHeadFields } from "../fields/sectionHead";

export const Method: Block = {
  slug: "method",
  interfaceName: "MethodBlock",
  labels: { singular: "Method (how we work)", plural: "Method sections" },
  admin: { group: "Studio" },
  fields: [
    blockHelp("Our process in 3–5 steps, each with what the client receives. Optionally add a client quote."),
    ...sectionHeadFields(),
    {
      name: "steps",
      type: "array",
      minRows: 3,
      maxRows: 5,
      labels: { singular: "Step", plural: "Steps" },
      admin: { initCollapsed: true, components: { RowLabel: rowLabel("name", "Step") } },
      fields: [
        { name: "name", type: "text", required: true, admin: { description: 'e.g. "Discover"' } },
        { name: "description", type: "textarea" },
        { name: "deliverable", type: "text", admin: { description: 'What the client gets, e.g. "Scope document"' } },
      ],
    },
    { name: "testimonial", type: "relationship", relationTo: "testimonials" },
    {
      name: "inverted",
      type: "checkbox",
      defaultValue: true,
      label: "Highlight",
      admin: { description: "Show the section on the lighter surface colour so it stands out from the page." },
    },
  ],
};
