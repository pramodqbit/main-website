import type {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedHeadingNode,
  SerializedLinkNode,
} from "@payloadcms/richtext-lexical";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { RichText as LexicalRichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import Link from "next/link";
import { publicUrlFor } from "@/cms/utilities/paths";
import { AnnotatedMedia } from "@/components/ds/AnnotatedMedia";
import { DecisionRecord } from "@/components/ds/DecisionRecord";
import { Media, mediaSource } from "@/components/ds/Media";
import { Metric } from "@/components/ds/Metric";
import { Prose } from "@/components/ds/Prose";
import { toMetric } from "@/lib/content";
import { headingId, nodeText } from "@/lib/lexical";
import { cn } from "@/lib/utils";
import type {
  CalloutInlineBlock,
  CodeInlineBlock,
  DecisionRecordInlineBlock,
  Media as MediaDoc,
  MediaAnnotatedInlineBlock,
  MetricsInlineBlock,
} from "@/payload-types";

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<CodeInlineBlock>
  | SerializedBlockNode<CalloutInlineBlock>
  | SerializedBlockNode<MediaAnnotatedInlineBlock>
  | SerializedBlockNode<DecisionRecordInlineBlock>
  | SerializedBlockNode<MetricsInlineBlock>;

function linkHref(node: SerializedLinkNode): { href: string; external: boolean } {
  const f = node.fields;
  if (f.linkType === "internal" && f.doc) {
    const value = f.doc.value;
    const slug = typeof value === "object" && value !== null && "slug" in value ? String(value.slug ?? "") : "";
    return { href: publicUrlFor(f.doc.relationTo, slug), external: false };
  }
  const url = f.url ?? "#";
  return { href: url, external: /^https?:\/\//.test(url) };
}

const calloutTone: Record<string, string> = {
  note: "border-brand",
  tip: "border-ok",
  warning: "border-danger",
  result: "border-signal",
};

const converters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  heading: ({ node, nodesToJSX }) => {
    const Tag = node.tag;
    const children = nodesToJSX({ nodes: node.children });
    if (Tag === "h2") {
      const id = headingId(nodeText(node as SerializedHeadingNode & Parameters<typeof nodeText>[0]));
      return (
        <h2 id={id} className="scroll-mt-24">
          {children}
        </h2>
      );
    }
    return <Tag>{children}</Tag>;
  },
  link: ({ node, nodesToJSX }) => {
    const { href, external } = linkHref(node);
    const children = nodesToJSX({ nodes: node.children });
    if (external || node.fields.newTab) {
      return (
        <a href={href} target="_blank" rel="noopener">
          {children}
        </a>
      );
    }
    if (/^(mailto|tel):/.test(href)) return <a href={href}>{children}</a>;
    return <Link href={href}>{children}</Link>;
  },
  autolink: ({ node, nodesToJSX }) => {
    const href = node.fields.url ?? "#";
    return (
      <a href={href} target="_blank" rel="noopener">
        {nodesToJSX({ nodes: node.children })}
      </a>
    );
  },
  upload: ({ node }) => {
    const doc = node.value as MediaDoc | string | number;
    if (typeof doc !== "object" || !doc?.mimeType?.startsWith("image/")) return null;
    return (
      <figure>
        <Media media={doc} size="feature" sizes="(min-width: 768px) 720px, 100vw" />
        {doc.caption ? <figcaption>{doc.caption}</figcaption> : null}
      </figure>
    );
  },
  blocks: {
    code: ({ node }) => (
      <figure className="not-prose my-8 border border-line bg-surface">
        {node.fields.filename ? (
          <figcaption className="border-b border-line px-4 py-2 font-mono text-label uppercase text-muted">
            {node.fields.filename}
          </figcaption>
        ) : null}
        <pre className="m-0 overflow-x-auto p-4 font-mono text-[13.5px] leading-relaxed text-ink">
          <code>{node.fields.code}</code>
        </pre>
      </figure>
    ),
    callout: ({ node }) => (
      <aside className={cn("not-prose my-8 border-l-2 bg-surface p-5", calloutTone[node.fields.tone ?? "note"] ?? "border-brand")}>
        {node.fields.title ? <p className="m-0 mb-2 font-sans font-medium">{node.fields.title}</p> : null}
        <p className="m-0 whitespace-pre-line">{node.fields.body}</p>
      </aside>
    ),
    mediaAnnotatedInline: ({ node }) => {
      const src = mediaSource(node.fields.image as MediaDoc | null, "feature");
      if (!src) return null;
      return (
        <div className="not-prose my-10">
          <AnnotatedMedia
            image={{ src: src.src, width: src.width, height: src.height, alt: src.alt }}
            chromeLabel={node.fields.chromeLabel}
            annotations={(node.fields.annotations ?? []).map((a) => ({ x: a.x, y: a.y, title: a.title, note: a.note }))}
            variant="inline"
            caption={node.fields.caption}
            sizes="(min-width: 768px) 720px, 100vw"
          />
        </div>
      );
    },
    decisionRecordInline: ({ node }) => (
      <div className="not-prose my-10">
        {node.fields.title ? <h3 className="mb-4 font-serif text-2xl">{node.fields.title}</h3> : null}
        <DecisionRecord
          problem={node.fields.problem}
          options={(node.fields.options ?? []).map((o) => ({ label: o.label, chosen: o.chosen }))}
          decision={node.fields.decision}
          why={node.fields.why}
        />
      </div>
    ),
    metricsInline: ({ node }) => (
      <div className="not-prose my-10 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2">
        {(node.fields.items ?? []).map((m, i) => (
          <div key={m.id ?? i} className="bg-paper p-5">
            <Metric {...toMetric(m)} accent size="md" />
          </div>
        ))}
      </div>
    ),
  },
});

export type RichTextProps = {
  data: SerializedEditorState | Record<string, unknown> | null | undefined;
  wide?: boolean;
  className?: string;
  /** Render without the Prose wrapper (when the caller already provides one). */
  bare?: boolean;
};

/** Payload Lexical rich text rendered inside `Prose`, with the site's link, heading and inline-block converters. */
export function RichText({ data, wide, className, bare }: RichTextProps) {
  if (!data || typeof data !== "object" || !("root" in data)) return null;
  const content = <LexicalRichText data={data as SerializedEditorState} converters={converters} disableContainer />;
  if (bare) return content;
  return (
    <Prose wide={wide} className={className}>
      {content}
    </Prose>
  );
}

export default RichText;
