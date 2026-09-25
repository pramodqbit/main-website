import type { CollectionConfig } from "payload";
import { isAdmin, isAdminOrEditor, isAdminEditorOrAuthor } from "../access";

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Media", plural: "Media" },
  admin: {
    useAsTitle: "alt",
    defaultColumns: ["filename", "alt", "updatedAt"],
    group: "Media",
    description: "Images and videos used on the public site.",
  },
  access: {
    read: () => true,
    create: isAdminEditorOrAuthor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  upload: {
    staticDir: "media/public",
    mimeTypes: ["image/*", "video/mp4"],
    focalPoint: true,
    imageSizes: [
      { name: "thumb", width: 480 },
      { name: "card", width: 960 },
      { name: "feature", width: 1600 },
      { name: "og", width: 1200, height: 630, position: "centre" },
    ],
    adminThumbnail: "thumb",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: { description: "Describe the image for screen readers and Google." },
    },
    { name: "caption", type: "text" },
    { name: "credit", type: "text", admin: { description: 'e.g. "Image: Freepik". Required for stock images.' } },
  ],
};
