import type { CollectionConfig } from "payload";
import { hiddenUnlessAdminOrEditor, isAdmin, isAdminOrEditor, nobody } from "../access";

export const Resumes: CollectionConfig = {
  slug: "resumes",
  labels: { singular: "Résumé", plural: "Résumés" },
  admin: {
    useAsTitle: "filename",
    defaultColumns: ["filename", "createdAt"],
    group: "Media",
    description: "Private files uploaded with job applications. Never share these links publicly.",
    hidden: hiddenUnlessAdminOrEditor,
  },
  access: {
    read: isAdminOrEditor,
    create: nobody,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  upload: {
    staticDir: "media/resumes",
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },
  fields: [],
};
