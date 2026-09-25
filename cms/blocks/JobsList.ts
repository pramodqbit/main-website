import type { Block } from "payload";
import { blockHelp } from "../fields/blockHelp";
import { sectionHeadFields } from "../fields/sectionHead";

export const JobsList: Block = {
  slug: "jobsList",
  interfaceName: "JobsListBlock",
  labels: { singular: "Open jobs list", plural: "Open jobs lists" },
  admin: { group: "Studio" },
  fields: [blockHelp("Lists every published job with status “Open”."), ...sectionHeadFields()],
};
