"use client";

import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";

/** Refreshes the route whenever a document is saved in the admin (draft mode only). */
export function LivePreviewListener() {
  const router = useRouter();
  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={typeof window === "undefined" ? "" : window.location.origin} />;
}

export default LivePreviewListener;
