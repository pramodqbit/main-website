type JsonLdValue = Record<string, unknown> | null | undefined | false;

/** Renders one `<script type="application/ld+json">` per schema object. */
export function JsonLd({ data }: { data: JsonLdValue | JsonLdValue[] }) {
  const items = (Array.isArray(data) ? data : [data]).filter((d): d is Record<string, unknown> => Boolean(d));
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}

export default JsonLd;
