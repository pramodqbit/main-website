type Item = { id?: string | null; title?: string | null; description?: string | null };

/** 2-column grid of title + description items with 1px hairline dividers. Renders nothing when empty. */
export function HairlineGrid({ items }: { items: Item[] | null | undefined }) {
  const rows = (items ?? []).filter((i) => i.title || i.description);
  if (!rows.length) return null;
  return (
    <ul className="m-0 grid list-none grid-cols-2 gap-px border border-line bg-line p-0 max-[760px]:grid-cols-1">
      {rows.map((r, i) => (
        <li key={r.id ?? i} className="bg-paper p-6" data-reveal="up">
          {r.title ? <h3 className="m-0 font-serif text-xl">{r.title}</h3> : null}
          {r.description ? <p className="mb-0 mt-2 text-muted">{r.description}</p> : null}
        </li>
      ))}
    </ul>
  );
}

export default HairlineGrid;
