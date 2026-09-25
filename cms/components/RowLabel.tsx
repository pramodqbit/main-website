"use client";

import { useRowLabel } from "@payloadcms/ui";

type Props = {
  /** Field (or dot path inside the row) whose value is shown as the row title. */
  fieldName: string;
  fallback: string;
};

function readPath(data: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) return (acc as Record<string, unknown>)[key];
    return undefined;
  }, data);
}

export function RowLabel({ fieldName, fallback }: Props) {
  const { data, rowNumber } = useRowLabel<Record<string, unknown>>();
  const value = readPath(data, fieldName);
  const index = String((rowNumber ?? 0) + 1).padStart(2, "0");
  const text = typeof value === "string" && value.trim() ? value.trim() : fallback;
  return (
    <span>
      <span style={{ fontFamily: "var(--font-mono, monospace)", opacity: 0.6 }}>{index}</span> {text}
    </span>
  );
}
