import { slugifyText } from "@/lib/site";

type LexNode = {
  type?: string;
  tag?: string;
  text?: string;
  listType?: string;
  children?: LexNode[];
};

export type LexicalState = { root?: LexNode } | null | undefined;

function asRoot(state: unknown): LexNode | null {
  if (!state || typeof state !== "object") return null;
  const root = (state as { root?: LexNode }).root;
  return root && typeof root === "object" ? root : null;
}

export function nodeText(node: LexNode): string {
  if (typeof node.text === "string") return node.text;
  return (node.children ?? []).map(nodeText).join(node.type === "root" ? "\n" : "");
}

export function lexicalPlainText(state: unknown): string {
  const root = asRoot(state);
  if (!root) return "";
  return (root.children ?? []).map(nodeText).join("\n").trim();
}

export function hasContent(state: unknown): boolean {
  return lexicalPlainText(state).length > 0;
}

export function headingId(text: string): string {
  return slugifyText(text);
}

/** Table of contents from h2 headings. Ids match the RichText heading converter. */
export function extractToc(state: unknown): { id: string; text: string }[] {
  const root = asRoot(state);
  if (!root) return [];
  return (root.children ?? [])
    .filter((n) => n.type === "heading" && n.tag === "h2")
    .map((n) => {
      const text = nodeText(n).trim();
      return { id: headingId(text), text };
    })
    .filter((t) => t.text);
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function toHtml(node: LexNode): string {
  const inner = () => (node.children ?? []).map(toHtml).join("");
  switch (node.type) {
    case "text":
      return esc(node.text ?? "");
    case "linebreak":
      return "<br>";
    case "paragraph":
      return `<p>${inner()}</p>`;
    case "heading":
      return `<${node.tag ?? "h3"}>${inner()}</${node.tag ?? "h3"}>`;
    case "list":
      return node.listType === "number" ? `<ol>${inner()}</ol>` : `<ul>${inner()}</ul>`;
    case "listitem":
      return `<li>${inner()}</li>`;
    case "quote":
      return `<blockquote>${inner()}</blockquote>`;
    default:
      return inner();
  }
}

/** Minimal HTML (paragraphs, headings, lists) for structured data such as JobPosting descriptions. */
export function lexicalToPlainHtml(state: unknown): string {
  const root = asRoot(state);
  if (!root) return "";
  return (root.children ?? []).map(toHtml).join("");
}
