const mono = "var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)";

const square = {
  display: "inline-block",
  background: "var(--qbit-brand, currentColor)",
} as const;

/** Login / nav logo: violet square + "QBITLOG" in mono. */
export function Logo() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 12, color: "var(--theme-text)" }}>
      <span aria-hidden style={{ ...square, width: 22, height: 22 }} />
      <span style={{ fontFamily: mono, fontSize: 22, fontWeight: 600, letterSpacing: "0.18em" }}>QBITLOG</span>
    </span>
  );
}

/** Small nav icon: the brand square. */
export function Icon() {
  return <span aria-label="Qbitlog" role="img" style={{ ...square, width: 18, height: 18 }} />;
}
