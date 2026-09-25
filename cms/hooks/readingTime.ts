import type { CollectionBeforeChangeHook } from "payload";

const WORDS_PER_MINUTE = 220;

type LexicalNode = { text?: unknown; children?: unknown; root?: unknown };

export function countWords(node: unknown): number {
  if (!node || typeof node !== "object") return 0;
  const n = node as LexicalNode;
  let words = 0;
  if (typeof n.text === "string") words += n.text.split(/\s+/).filter(Boolean).length;
  if (Array.isArray(n.children)) for (const child of n.children) words += countWords(child);
  if (n.root) words += countWords(n.root);
  return words;
}

export const readingTimeFromLexical = (content: unknown): number =>
  Math.max(2, Math.ceil(countWords(content) / WORDS_PER_MINUTE));

export const setReadingTime: CollectionBeforeChangeHook = ({ data }) => {
  if (data && "content" in data) data.readingTime = readingTimeFromLexical(data.content);
  return data;
};
