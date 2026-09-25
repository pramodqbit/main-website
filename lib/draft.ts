import "server-only";
import { draftMode } from "next/headers";

/** True when the request is in Payload preview (draft) mode. */
export async function isDraft(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false;
  }
}
