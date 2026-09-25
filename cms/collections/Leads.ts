import type { CollectionConfig } from "payload";
import { hiddenUnlessAdminOrEditor, isAdmin, isAdminOrEditor, nobody } from "../access";
import { notifyLead } from "../hooks/notifyLead";

export const leadServiceOptions = [
  { label: "Web", value: "web" },
  { label: "Mobile", value: "mobile" },
  { label: "AI & ML", value: "ai" },
  { label: "UI/UX design", value: "design" },
  { label: "Cloud & DevOps", value: "cloud" },
  { label: "Not sure yet", value: "other" },
];

export const Leads: CollectionConfig = {
  slug: "leads",
  labels: { singular: "Lead", plural: "Leads" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "company", "budget", "status", "createdAt"],
    group: "Inbox",
    description: "Contact form submissions. Update the status as you follow up. IP addresses are never stored.",
    hidden: hiddenUnlessAdminOrEditor,
  },
  defaultSort: "-createdAt",
  access: {
    create: nobody,
    read: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: { afterChange: [notifyLead] },
  fields: [
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true, admin: { width: "50%" } },
        { name: "email", type: "email", required: true, admin: { width: "50%" } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "company", type: "text", admin: { width: "34%" } },
        { name: "role", type: "text", admin: { width: "33%" } },
        { name: "website", type: "text", admin: { width: "33%" } },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "budget",
          type: "select",
          options: [
            { label: "< $25k", value: "<25k" },
            { label: "$25–50k", value: "25-50k" },
            { label: "$50–100k", value: "50-100k" },
            { label: "$100k+", value: "100k+" },
            { label: "Not sure", value: "unsure" },
          ],
          admin: { width: "50%" },
        },
        {
          name: "timeline",
          type: "select",
          options: [
            { label: "As soon as possible", value: "asap" },
            { label: "1–3 months", value: "1-3m" },
            { label: "3–6 months", value: "3-6m" },
            { label: "Just exploring", value: "exploring" },
          ],
          admin: { width: "50%" },
        },
      ],
    },
    { name: "services", type: "select", hasMany: true, options: leadServiceOptions },
    { name: "message", type: "textarea", required: true },
    {
      name: "consent",
      type: "checkbox",
      required: true,
      admin: { description: "The visitor agreed to be contacted." },
    },
    {
      type: "collapsible",
      label: "Attribution",
      admin: { initCollapsed: true },
      fields: [
        { name: "sourcePath", type: "text", admin: { description: "Page the form was sent from." } },
        {
          name: "utm",
          type: "group",
          label: "UTM",
          fields: [
            {
              type: "row",
              fields: [
                { name: "source", type: "text", admin: { width: "33%" } },
                { name: "medium", type: "text", admin: { width: "33%" } },
                { name: "campaign", type: "text", admin: { width: "34%" } },
              ],
            },
            {
              type: "row",
              fields: [
                { name: "term", type: "text", admin: { width: "50%" } },
                { name: "content", type: "text", admin: { width: "50%" } },
              ],
            },
          ],
        },
        { name: "referrer", type: "text" },
      ],
    },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Contacted", value: "contacted" },
        { label: "Qualified", value: "qualified" },
        { label: "Won", value: "won" },
        { label: "Lost", value: "lost" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "internalNotes",
      type: "textarea",
      admin: { position: "sidebar", description: "Only visible in the CMS." },
    },
  ],
};
