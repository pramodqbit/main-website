"use client";

import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";

/** Refreshes the route whenever a document is saved in the admin (draft mode only). */
export function LivePreviewListener() {
  const router = useRouter();
  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={process.env.NEXT_PUBLIC_SITE_URL ?? ""} />;
}

export default LivePreviewListener;
