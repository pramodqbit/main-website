import type { Block } from "payload";
import { blockHelp } from "../fields/blockHelp";
import { faqTopicOptions } from "../collections/Faqs";

export const Faq: Block = {
  slug: "faq",
  interfaceName: "FaqBlock",
  labels: { singular: "FAQ", plural: "FAQs" },
  admin: { group: "Content" },
  fields: [
    blockHelp("Questions and answers. These also appear in Google as FAQ results."),
    {
      type: "row",
      fields: [
        { name: "label", type: "text", admin: { width: "40%", description: 'Mono eyebrow, e.g. "FAQ".' } },
        { name: "title", type: "text", admin: { width: "60%" } },
      ],
    },
    {
      name: "faqs",
      type: "relationship",
      relationTo: "faqs",
      hasMany: true,
      admin: { description: "Pick specific questions, or leave empty and choose a topic below." },
    },
    {
      name: "topic",
      type: "select",
      options: faqTopicOptions,
      admin: { description: "Used only when no questions are picked above." },
    },
  ],
};
