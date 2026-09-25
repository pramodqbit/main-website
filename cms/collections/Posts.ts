import type { CollectionConfig } from "payload";
import { isAdmin, isAdminEditorOrAuthor, publishedOrLoggedIn } from "../access";
import { postEditor } from "../fields/editor";
import { publishedAtField } from "../fields/publishedAt";
import { slugField } from "../fields/slug";
import { preventAuthorPublish } from "../hooks/preventAuthorPublish";
import { setReadingTime } from "../hooks/readingTime";
import { contentDefaults } from "./shared";

const d = contentDefaults("posts");

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Insight", plural: "Insights" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "_status", "publishedAt"],
    group: "Content",
    description: "Articles, shown at /insights. Authors can write drafts; an editor publishes them.",
    preview: d.preview,
    livePreview: { url: d.livePreviewUrl },
  },
  defaultSort: "-publishedAt",
  access: {
    read: publishedOrLoggedIn,
    create: isAdminEditorOrAuthor,
    update: isAdminEditorOrAuthor,
    delete: isAdmin,
  },
  versions: d.versions,
  hooks: {
    ...d.hooks,
    beforeChange: [preventAuthorPublish, setReadingTime],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            { name: "title", type: "text", required: true },
            {
              name: "excerpt",
              type: "textarea",
              required: true,
              maxLength: 200,
              admin: { description: "Shown on cards and in Google. Max 200 characters." },
            },
            { name: "heroImage", type: "upload", relationTo: "media" },
            {
              name: "content",
              type: "richText",
              required: true,
              editor: postEditor,
              admin: {
                description: "Use headings (H2–H4), lists and links. Type “/” to insert code, callouts, annotated images, decisions or metrics.",
              },
            },
          ],
        },
      ],
    },
    slugField(),
    publishedAtField,
    {
      name: "authors",
      type: "relationship",
      relationTo: "team",
      hasMany: true,
      required: true,
      admin: { position: "sidebar", description: "Who wrote it. Use “Qbitlog Engineering” for team posts." },
    },
    { name: "category", type: "relationship", relationTo: "categories", required: true, admin: { position: "sidebar" } },
    {
      name: "tags",
      type: "text",
      hasMany: true,
      admin: { position: "sidebar", description: "Free-form keywords. Press Enter after each." },
    },
    {
      name: "readingTime",
      type: "number",
      admin: { position: "sidebar", readOnly: true, description: "Minutes. Calculated automatically." },
    },
    {
      name: "related",
      type: "relationship",
      relationTo: "posts",
      hasMany: true,
      maxRows: 3,
      admin: { position: "sidebar", description: "Up to 3 insights shown at the end." },
      filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
    },
  ],
};
