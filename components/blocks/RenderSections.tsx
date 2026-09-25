import { Pill } from "@/components/ds/Pill";
import { isDraft } from "@/lib/draft";
import { type LayoutBlock, renderBlock } from "./RenderBlocks";

export type IndexSection = LayoutBlock & { enabled?: boolean | null };

/** Which index sections should render for the current request. */
export function visibleIndexSections(
  sections: IndexSection[] | null | undefined,
  draft: boolean,
  /** Local dev: show disabled CMS sections (with a Hidden pill) so Phase 8 blocks are visible before editors enable them. */
  previewDisabled = process.env.NODE_ENV === "development",
): IndexSection[] {
  return (sections ?? []).filter((s) => s.enabled || draft || previewDisabled);
}

/**
 * Sections from a global (`services-page`, `work-page`). Globals have no drafts, so each section has an
 * `enabled` flag: disabled sections are skipped on the live site and shown with a "Hidden" pill in preview.
 */
export async function RenderSections({ sections }: { sections: IndexSection[] | null | undefined }) {
  const draft = await isDraft();
  const visible = visibleIndexSections(sections, draft);
  if (!visible.length) return null;
  return (
    <>
      {visible.map((s, i) => {
        const node = renderBlock(s, i, visible);
        if (s.enabled) return node;
        return (
          <div key={s.id ?? `${s.blockType}-${i}`} data-hidden-section={s.blockType} className="relative">
            <div className="wrap absolute left-0 top-6 z-10">
              <Pill tone="muted" className="bg-paper">
                Hidden
              </Pill>
            </div>
            {node}
          </div>
        );
      })}
    </>
  );
}

export default RenderSections;
