type Props = { text: string };

export function BlockHelp({ text }: Props) {
  return (
    <p
      style={{
        margin: "0 0 var(--base, 20px)",
        color: "var(--theme-elevation-600)",
        fontSize: "var(--base-body-size, 13px)",
        lineHeight: 1.5,
      }}
    >
      {text}
    </p>
  );
}
