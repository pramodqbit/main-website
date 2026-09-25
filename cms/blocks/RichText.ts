import type { Block } from "payload";
import { blockHelp } from "../fields/blockHelp";

export const RichText: Block = {
  slug: "richText",
  interfaceName: "RichTextBlock",
  labels: { singular: "Text", plural: "Text sections" },
  admin: { group: "Content" },
  fields: [
    blockHelp("Free-form text with headings, lists and links."),
    { name: "content", type: "richText", required: true },
    {
      name: "width",
      type: "select",
      defaultValue: "measure",
      options: [
        { label: "Reading width", value: "measure" },
        { label: "Wide", value: "wide" },
      ],
    },
  ],
};
