import type { Block } from "payload";
import { blockHelp } from "../fields/blockHelp";
import { metricsField } from "../fields/metrics";

export const ProofStrip: Block = {
  slug: "proofStrip",
  interfaceName: "ProofStripBlock",
  labels: { singular: "Proof strip", plural: "Proof strips" },
  admin: { group: "Proof" },
  fields: [
    blockHelp("A row of 2–4 headline numbers, usually right under the hero. Each number needs a source."),
    metricsField("items", { minRows: 2, maxRows: 4, label: "Metrics" }),
  ],
};
