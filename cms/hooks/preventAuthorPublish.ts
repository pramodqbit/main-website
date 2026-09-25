import { APIError, type CollectionBeforeChangeHook } from "payload";
import { roleOf } from "../access";

export const preventAuthorPublish: CollectionBeforeChangeHook = ({ data, req }) => {
  if (roleOf(req) === "author" && (data as { _status?: unknown } | undefined)?._status === "published") {
    throw new APIError(
      "Authors can save drafts but cannot publish. Save as a draft and ask an editor to review and publish it.",
      403,
      undefined,
      true,
    );
  }
  return data;
};
