"use client";

import dynamic from "next/dynamic";
import type { BitFieldProps } from "./BitField";

const BitFieldClient = dynamic(() => import("./BitField").then((m) => m.BitField), { ssr: false });

/** `BitField` loaded after hydration (ssr:false). Pair it with a static `dotgrid` fallback. */
export function LazyBitField(props: BitFieldProps) {
  return <BitFieldClient {...props} />;
}

export default LazyBitField;
