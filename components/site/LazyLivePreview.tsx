"use client";

import dynamic from "next/dynamic";

/** Live-preview listener as its own chunk: only editors in draft mode download it. */
export const LazyLivePreview = dynamic(() => import("./LivePreviewListener").then((m) => m.LivePreviewListener), { ssr: false });

export default LazyLivePreview;
