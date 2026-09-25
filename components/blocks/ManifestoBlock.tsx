import type { ReactNode } from "react";
import { Section } from "@/components/ds/Section";
import { ManifestoMotion } from "@/components/motion/ManifestoMotion";
import type { ManifestoBlock as ManifestoData } from "@/payload-types";

type Word = { text: string; em: boolean };

/** Splits a line into words; `*like this*` marks violet italic. Punctuation right after an emphasis sticks to it. */
function toWords(line: string): Word[] {
  const out: Word[] = [];
  line.split(/(\*[^*]+\*)/).forEach((seg) => {
    if (!seg) return;
    const em = seg.startsWith("*") && seg.endsWith("*") && seg.length > 2;
    const text = em ? seg.slice(1, -1) : seg;
    const tokens = text.split(/\s+/).filter(Boolean);
    if (!em && !/^\s/.test(text) && out.length && tokens.length) out[out.length - 1].text += tokens.shift();
    tokens.forEach((t) => out.push({ text: t, em }));
  });
  return out;
}

function renderLine(line: string, key: number): ReactNode {
  const words = toWords(line);
  const nodes: ReactNode[] = [];
  let i = 0;
  while (i < words.length) {
    if (words[i].em) {
      const group: ReactNode[] = [];
      while (i < words.length && words[i].em) {
        group.push(
          <span key={i} className="mw">
            {words[i].text}
          </span>,
          " ",
        );
        i++;
      }
      group.pop();
      nodes.push(
        <em key={`em-${i}`} className="italic text-brand">
          {group}
        </em>,
        " ",
      );
    } else {
      nodes.push(
        <span key={i} className="mw">
          {words[i].text}
        </span>,
        " ",
      );
      i++;
    }
  }
  return (
    <p
      key={key}
      className="mb-[.55em] mt-0 max-w-[24ch] font-serif text-[clamp(28px,3.5vw,50px)] leading-[1.18] tracking-[-0.02em] [text-wrap:pretty]"
    >
      {nodes}
    </p>
  );
}

/** "Why we exist": the founding story in large serif lines that fill in as you read. */
export function ManifestoBlock({ block }: { block: ManifestoData }) {
  const lines = (block.lines ?? []).map((l) => l.text).filter(Boolean);
  if (!lines.length) return null;
  return (
    <Section className="py-32 max-md:py-20">
      <div className="grid grid-cols-[200px_minmax(0,1fr)_180px] items-start gap-8 max-[1000px]:grid-cols-1">
        {block.label ? (
          <span className="pt-3.5 font-mono text-sm text-brand max-[1000px]:pt-0" data-chapter={block.label} data-reveal="fade">
            {block.label}
          </span>
        ) : (
          <span />
        )}
        <ManifestoMotion>
          {lines.map((l, i) => renderLine(l, i))}
          {block.signature ? (
            <p
              className="mt-10 flex items-center gap-3.5 font-mono text-xs uppercase tracking-[.08em] text-muted before:h-px before:w-10 before:bg-ink before:content-['']"
              data-reveal="up"
              data-reveal-delay={200}
            >
              {block.signature}
            </p>
          ) : null}
        </ManifestoMotion>
      </div>
    </Section>
  );
}

export default ManifestoBlock;
