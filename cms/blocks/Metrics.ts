import type { Block } from "payload";
import { blockHelp } from "../fields/blockHelp";
import { metricsField } from "../fields/metrics";
import { sectionHeadFields } from "../fields/sectionHead";

export const Metrics: Block = {
  slug: "metrics",
  interfaceName: "MetricsBlock",
  labels: { singular: "Metrics grid", plural: "Metrics grids" },
  admin: { group: "Proof" },
  fields: [
    blockHelp("A grid of measured results. Each number needs a source."),
    ...sectionHeadFields(),
    metricsField("items", { label: "Metrics" }),
  ],
};
