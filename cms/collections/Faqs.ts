import type { CollectionConfig } from "payload";
import { revalidateDelete, revalidateDoc } from "../hooks/revalidate";
import { orderField, studioAccess } from "./shared";

export const faqTopicOptions = [
  { label: "General", value: "general" },
  { label: "Process", value: "process" },
  { label: "Pricing", value: "pricing" },
  { label: "Engagement", value: "engagement" },
  { label: "Technical", value: "technical" },
];

export const Faqs: CollectionConfig = {
  slug: "faqs",
  labels: { singular: "FAQ", plural: "FAQs" },
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "topic", "order"],
    group: "Studio",
    description: "Questions and answers used in FAQ sections and Google's FAQ results.",
  },
  defaultSort: "order",
  access: studioAccess,
  hooks: { afterChange: [revalidateDoc], afterDelete: [revalidateDelete] },
  fields: [
    { name: "question", type: "text", required: true },
    {
      name: "answer",
      type: "textarea",
      required: true,
      admin: { description: "Plain text only (no formatting); this keeps Google's FAQ results clean." },
    },
    { name: "topic", type: "select", options: faqTopicOptions, admin: { position: "sidebar" } },
    orderField,
  ],
};
