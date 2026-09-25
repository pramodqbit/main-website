import { BlocksFeature, HeadingFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { postContentBlocks } from "../blocks/lexical";

/** Default rich text: Payload's default features with headings limited to h2–h4 (the page owns h1). */
export const defaultEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures.filter((feature) => feature.key !== "heading"),
    HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }),
  ],
});

/** Insight body: default features + the article blocks (code, callout, annotated image, decision, metrics). */
export const postEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures.filter((feature) => feature.key !== "heading"),
    HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }),
    BlocksFeature({ blocks: postContentBlocks }),
  ],
});
