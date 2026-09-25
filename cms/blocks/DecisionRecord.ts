import type { Block, Field } from "payload";
import { blockHelp } from "../fields/blockHelp";
import { rowLabel } from "../fields/rowLabel";

/** Problem / Options / Decision / Why. Shared by the page block and the inline Lexical block. */
export const decisionRecordFields = ({ required = false }: { required?: boolean } = {}): Field[] => [
  { name: "problem", type: "textarea", required, admin: { description: "What we had to solve." } },
  {
    name: "options",
    type: "array",
    labels: { singular: "Option", plural: "Options" },
    admin: {
      initCollapsed: true,
      description: "The options we weighed. Tick the one we chose.",
      components: { RowLabel: rowLabel("label", "Option") },
    },
    fields: [
      {
        type: "row",
        fields: [
          { name: "label", type: "text", required: true, admin: { width: "75%" } },
          { name: "chosen", type: "checkbox", admin: { width: "25%" } },
        ],
      },
    ],
  },
  { name: "decision", type: "textarea", required, admin: { description: "What we decided." } },
  { name: "why", type: "textarea", required, admin: { description: "Why, in one or two sentences." } },
];

export const DecisionRecord: Block = {
  slug: "decisionRecord",
  interfaceName: "DecisionRecordBlock",
  labels: { singular: "Decision record", plural: "Decision records" },
  admin: { group: "Proof" },
  fields: [blockHelp("One decision: the problem, the options, what we chose and why."), ...decisionRecordFields()],
};
