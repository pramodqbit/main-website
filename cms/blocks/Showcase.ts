import type { Block } from "payload";
import { annotationsField } from "../fields/annotations";
import { blockHelp } from "../fields/blockHelp";
import { sectionHeadFields } from "../fields/sectionHead";

export const Showcase: Block = {
  slug: "showcase",
  interfaceName: "ShowcaseBlock",
  labels: { singular: "Showcase screenshot", plural: "Showcase screenshots" },
  admin: { group: "Proof" },
  fields: [
    blockHelp("One large product screenshot in a browser frame, with lettered pins explaining what matters."),
    ...sectionHeadFields({ withMore: false }),
    { name: "image", type: "upload", relationTo: "media", required: true },
    {
      name: "chromeLabel",
      type: "text",
      admin: { description: 'Text in the fake browser bar, e.g. "app.restaurantos.com/orders".' },
    },
    annotationsField(),
    {
      name: "tilt",
      type: "checkbox",
      defaultValue: true,
      admin: { description: "Slight 3D tilt that follows the cursor on desktop." },
    },
    {
      name: "caseStudy",
      type: "relationship",
      relationTo: "case-studies",
      admin: { description: "Optional: link the screenshot to its case study." },
    },
  ],
};
