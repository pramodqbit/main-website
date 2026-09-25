import type { Block } from "payload";
import { annotationsField } from "../fields/annotations";
import { metricsField } from "../fields/metrics";
import { decisionRecordFields } from "./DecisionRecord";

/** Blocks editors can insert inside an Insight's rich text (Lexical `BlocksFeature`). */

export const CodeInline: Block = {
  slug: "code",
  interfaceName: "CodeInlineBlock",
  labels: { singular: "Code", plural: "Code snippets" },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "language",
          type: "select",
          defaultValue: "ts",
          options: [
            { label: "TypeScript", value: "ts" },
            { label: "TSX", value: "tsx" },
            { label: "JavaScript", value: "js" },
            { label: "JSON", value: "json" },
            { label: "Bash / shell", value: "bash" },
            { label: "Python", value: "python" },
            { label: "SQL", value: "sql" },
            { label: "HTML", value: "html" },
            { label: "CSS", value: "css" },
            { label: "YAML", value: "yaml" },
            { label: "Plain text", value: "text" },
          ],
          admin: { width: "50%" },
        },
        { name: "filename", type: "text", admin: { width: "50%", description: 'Optional, e.g. "payload.config.ts".' } },
      ],
    },
    { name: "code", type: "code", required: true },
  ],
};

export const CalloutInline: Block = {
  slug: "callout",
  interfaceName: "CalloutInlineBlock",
  labels: { singular: "Callout", plural: "Callouts" },
  fields: [
    {
      name: "tone",
      type: "select",
      defaultValue: "note",
      options: [
        { label: "Note", value: "note" },
        { label: "Tip", value: "tip" },
        { label: "Warning", value: "warning" },
        { label: "Result (amber)", value: "result" },
      ],
    },
    { name: "title", type: "text" },
    { name: "body", type: "textarea", required: true },
  ],
};

export const MediaAnnotatedInline: Block = {
  slug: "mediaAnnotatedInline",
  interfaceName: "MediaAnnotatedInlineBlock",
  labels: { singular: "Annotated image", plural: "Annotated images" },
  fields: [
    { name: "image", type: "upload", relationTo: "media", required: true },
    { name: "chromeLabel", type: "text", admin: { description: "Optional text in a browser-style bar above the image." } },
    annotationsField(),
    { name: "caption", type: "text" },
  ],
};

export const DecisionRecordInline: Block = {
  slug: "decisionRecordInline",
  interfaceName: "DecisionRecordInlineBlock",
  labels: { singular: "Decision record", plural: "Decision records" },
  fields: [
    { name: "title", type: "text", admin: { description: 'Optional heading, e.g. "Why we chose Postgres".' } },
    ...decisionRecordFields({ required: true }),
  ],
};

export const MetricsInline: Block = {
  slug: "metricsInline",
  interfaceName: "MetricsInlineBlock",
  labels: { singular: "Metrics", plural: "Metrics" },
  fields: [metricsField("items", { minRows: 1, label: "Metrics" })],
};

export const postContentBlocks: Block[] = [
  CodeInline,
  CalloutInline,
  MediaAnnotatedInline,
  DecisionRecordInline,
  MetricsInline,
];
