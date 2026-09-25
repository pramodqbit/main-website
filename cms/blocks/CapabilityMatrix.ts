import type { Block } from "payload";
import { blockHelp } from "../fields/blockHelp";
import { sectionHeadFields } from "../fields/sectionHead";

export const CapabilityMatrix: Block = {
  slug: "capabilityMatrix",
  interfaceName: "CapabilityMatrixBlock",
  labels: { singular: "Capability matrix", plural: "Capability matrices" },
  admin: { group: "Work" },
  fields: [
    blockHelp(
      "A table of industries × services, built automatically from published content. Each cell links to a matching case study, or to the contact page when there isn't one yet.",
    ),
    ...sectionHeadFields(),
    {
      name: "emptyCellLabel",
      type: "text",
      defaultValue: "Ask us",
      admin: { description: "Shown in cells with no case study. Links to /contact." },
    },
  ],
};
