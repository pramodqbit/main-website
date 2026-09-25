import type { Block } from "payload";
import { blockHelp } from "../fields/blockHelp";
import { rowLabel } from "../fields/rowLabel";
import { sectionHeadFields } from "../fields/sectionHead";

export const WriteupExplainer: Block = {
  slug: "writeupExplainer",
  interfaceName: "WriteupExplainerBlock",
  labels: { singular: "Write-up explainer", plural: "Write-up explainers" },
  admin: { group: "Work" },
  fields: [
    blockHelp("Explains how a case study is structured, next to one real decision record as an example."),
    ...sectionHeadFields(),
    {
      name: "parts",
      type: "array",
      labels: { singular: "Part", plural: "Parts" },
      admin: {
        initCollapsed: true,
        description: "In the order they appear in a case study.",
        components: { RowLabel: rowLabel("name", "Part") },
      },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "text", type: "text" },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "sampleCaseStudy",
          type: "relationship",
          relationTo: "case-studies",
          admin: { width: "60%", description: "The case study whose decision is shown as the example." },
        },
        {
          name: "sampleDecisionIndex",
          type: "number",
          min: 0,
          defaultValue: 0,
          admin: { width: "40%", description: "Which decision to show: 0 is the first, 1 the second…" },
        },
      ],
    },
  ],
};
