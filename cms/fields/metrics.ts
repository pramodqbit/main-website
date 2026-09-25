import type { ArrayField } from "payload";
import { rowLabel } from "./rowLabel";

type MetricsOptions = { minRows?: number; maxRows?: number; label?: string };

export const metricsField = (name = "metrics", { minRows, maxRows = 6, label }: MetricsOptions = {}): ArrayField => ({
  name,
  type: "array",
  label,
  minRows,
  maxRows,
  interfaceName: "MetricItems",
  labels: { singular: "Metric", plural: "Metrics" },
  admin: {
    initCollapsed: true,
    description: "Every number needs a source. Only publish numbers the client has approved.",
    components: { RowLabel: rowLabel("label", "Metric") },
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "value",
          type: "text",
          required: true,
          admin: { width: "33%", description: 'The number, e.g. "99" or "3–5".' },
        },
        {
          name: "unit",
          type: "text",
          admin: { width: "33%", description: 'e.g. "%", "s", "x".' },
        },
        {
          name: "featured",
          type: "checkbox",
          defaultValue: true,
          admin: { width: "33%", description: "Show this metric in cards and summaries." },
        },
      ],
    },
    {
      name: "label",
      type: "text",
      required: true,
      admin: { description: 'What was measured, e.g. "claim approval rate".' },
    },
    {
      name: "source",
      type: "text",
      required: true,
      admin: { description: 'Who measured it and when, e.g. "Batra Hospital, 2024".' },
    },
  ],
});
