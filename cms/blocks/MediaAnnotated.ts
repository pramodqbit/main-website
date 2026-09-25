import type { Block } from "payload";
import { annotationsField } from "../fields/annotations";
import { blockHelp } from "../fields/blockHelp";

export const MediaAnnotated: Block = {
  slug: "mediaAnnotated",
  interfaceName: "MediaAnnotatedBlock",
  labels: { singular: "Annotated image", plural: "Annotated images" },
  admin: { group: "Content" },
  fields: [
    blockHelp("An image or screenshot with lettered pins and notes."),
    { name: "image", type: "upload", relationTo: "media", required: true },
    {
      name: "chromeLabel",
      type: "text",
      admin: { description: "Optional text in a browser-style bar above the image." },
    },
    annotationsField(),
    { name: "caption", type: "text" },
  ],
};
