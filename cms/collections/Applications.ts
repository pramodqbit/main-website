import type { CollectionConfig } from "payload";
import { hiddenUnlessAdminOrEditor, isAdmin, isAdminOrEditor, nobody } from "../access";
import { notifyApplication } from "../hooks/notifyApplication";

export const Applications: CollectionConfig = {
  slug: "applications",
  labels: { singular: "Application", plural: "Applications" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "job", "status", "createdAt"],
    group: "Inbox",
    description: "Job applications from /careers. Résumés are private files.",
    hidden: hiddenUnlessAdminOrEditor,
  },
  defaultSort: "-createdAt",
  access: {
    create: nobody,
    read: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: { afterChange: [notifyApplication] },
  fields: [
    { name: "job", type: "relationship", relationTo: "jobs", required: true },
    {
      type: "row",
      fields: [
        { name: "name", type: "text", required: true, admin: { width: "34%" } },
        { name: "email", type: "email", required: true, admin: { width: "33%" } },
        { name: "phone", type: "text", admin: { width: "33%" } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "linkedin", type: "text", label: "LinkedIn", admin: { width: "50%" } },
        { name: "portfolio", type: "text", admin: { width: "50%" } },
      ],
    },
    { name: "coverLetter", type: "textarea" },
    { name: "resume", type: "upload", relationTo: "resumes", required: true },
    {
      name: "consent",
      type: "checkbox",
      required: true,
      admin: { description: "The applicant agreed to us storing their data for this application." },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Screening", value: "screening" },
        { label: "Interview", value: "interview" },
        { label: "Offer", value: "offer" },
        { label: "Rejected", value: "rejected" },
      ],
      admin: { position: "sidebar" },
    },
  ],
};
