import type { Block } from "payload";
import { blockHelp } from "../fields/blockHelp";
import { sectionHeadFields } from "../fields/sectionHead";

export const TestimonialStrip: Block = {
  slug: "testimonialStrip",
  interfaceName: "TestimonialStripBlock",
  labels: { singular: "Testimonial strip", plural: "Testimonial strips" },
  admin: { group: "Proof" },
  fields: [
    blockHelp("Client quotes with Approved ticked, each linking to its case study. Shows nothing if none are approved."),
    ...sectionHeadFields(),
    { name: "limit", type: "number", defaultValue: 3, min: 1, max: 6 },
  ],
};
