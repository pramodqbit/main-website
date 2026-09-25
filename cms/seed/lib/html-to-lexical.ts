import { JSDOM } from "jsdom";
import type { SanitizedConfig } from "payload";
import { convertHTMLToLexical, editorConfigFactory, type SanitizedServerEditorConfig } from "@payloadcms/richtext-lexical";
import type { SerializedEditorState, SerializedLexicalNode } from "@payloadcms/richtext-lexical/lexical";
import type { Post } from "../../../payload-types";
import { escapeHtml } from "./context";

let editorConfig: SanitizedServerEditorConfig | null = null;

/** Strip inline styles, demote h1 → h2 and h5/h6 → h4, drop empty paragraphs. Keeps <pre><code>. */
export function cleanHtml(html: string): string {
  const dom = new JSDOM(`<body>${html}</body>`);
  const doc = dom.window.document;
  doc.querySelectorAll("[style]").forEach((el) => el.removeAttribute("style"));
  const rename = (from: string, to: string) =>
    doc.querySelectorAll(from).forEach((el) => {
      const n = doc.createElement(to);
      n.innerHTML = el.innerHTML;
      el.replaceWith(n);
    });
  rename("h1", "h2");
  rename("h5", "h4");
  rename("h6", "h4");
  doc.querySelectorAll("p").forEach((p) => {
    if (!p.textContent?.trim() && !p.querySelector("img")) p.remove();
  });
  return doc.body.innerHTML;
}

/** Lexical state in the shape Payload's generated rich-text field types expect. */
export type RichTextState = NonNullable<Post["content"]>;

export async function convertHtml(html: string, config: SanitizedConfig): Promise<RichTextState> {
  editorConfig ??= await editorConfigFactory.default({ config });
  const state = convertHTMLToLexical({ editorConfig, html: cleanHtml(html), JSDOM });
  return { ...state } as RichTextState;
}

/** Plain paragraphs (and optional headings / bullet lists) → Lexical, via HTML. */
export async function blocksToLexical(
  parts: Array<{ h2: string } | { p: string } | { ul: string[] }>,
  config: SanitizedConfig,
): Promise<RichTextState> {
  const html = parts
    .map((part) => {
      if ("h2" in part) return `<h2>${escapeHtml(part.h2)}</h2>`;
      if ("p" in part) return part.p.trim() ? `<p>${escapeHtml(part.p)}</p>` : "";
      return `<ul>${part.ul.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`;
    })
    .join("");
  return convertHtml(html, config);
}

export function htmlWordCount(html: string): number {
  const text = new JSDOM(`<body>${html}</body>`).window.document.body.textContent ?? "";
  return text.split(/\s+/).filter(Boolean).length;
}

/** Concatenated text of all Lexical text nodes. */
export function lexicalText(state: SerializedEditorState | null | undefined): string {
  const out: string[] = [];
  const walk = (node: SerializedLexicalNode & { text?: string; children?: SerializedLexicalNode[] }) => {
    if (typeof node.text === "string") out.push(node.text);
    node.children?.forEach((c) => walk(c));
    if (node.type === "paragraph" || node.type === "heading" || node.type === "listitem") out.push(" ");
  };
  if (state?.root) walk(state.root as SerializedLexicalNode & { children?: SerializedLexicalNode[] });
  return out.join("");
}

export function lexicalWordCount(state: SerializedEditorState | null | undefined): number {
  return lexicalText(state).split(/\s+/).filter(Boolean).length;
}

export function nodeTypeCounts(state: SerializedEditorState): Record<string, number> {
  const counts: Record<string, number> = {};
  const walk = (node: SerializedLexicalNode & { children?: SerializedLexicalNode[] }) => {
    counts[node.type] = (counts[node.type] ?? 0) + 1;
    node.children?.forEach((c) => walk(c));
  };
  walk(state.root as SerializedLexicalNode & { children?: SerializedLexicalNode[] });
  return counts;
}
