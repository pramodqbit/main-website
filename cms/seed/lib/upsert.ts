import type { CollectionSlug, Payload, RequiredDataFromCollectionSlug, Where } from "payload";
import { flags, seedContext } from "./context";
import { report } from "./report";

type WriteArgs = {
  collection: CollectionSlug;
  data: Record<string, unknown>;
  draft?: boolean;
  overrideAccess: boolean;
  context: typeof seedContext;
  depth: number;
};

type LooseLocalApi = {
  create(args: WriteArgs): Promise<{ id: string | number }>;
  update(args: WriteArgs & { id: string }): Promise<unknown>;
};

type Opts = {
  /** Create/update as a draft instead of publishing (collections with drafts only). */
  draft?: boolean;
  /** Collection has versions/drafts enabled. */
  versioned?: boolean;
};

/** Find one doc (draft-aware) by an arbitrary where clause. */
export async function findOne(payload: Payload, collection: CollectionSlug, where: Where): Promise<{ id: string } | null> {
  const res = await payload.find({ collection, where, limit: 1, depth: 0, draft: true, overrideAccess: true, pagination: false });
  const doc = res.docs[0] as { id: string | number } | undefined;
  return doc ? { id: String(doc.id) } : null;
}

export async function idBySlug(payload: Payload, collection: CollectionSlug, slug: string): Promise<string | null> {
  return (await findOne(payload, collection, { slug: { equals: slug } }))?.id ?? null;
}

/**
 * Idempotent create-or-update. Returns the doc id.
 * Published content passes `_status: "published"`; drafts use `draft: true`.
 */
export async function upsert<S extends CollectionSlug>(
  payload: Payload,
  collection: S,
  key: string,
  where: Where,
  data: RequiredDataFromCollectionSlug<S>,
  opts: Opts = {},
): Promise<string | null> {
  const existing = await findOne(payload, collection, where);
  const statusData = opts.versioned ? { _status: opts.draft ? "draft" : "published" } : {};
  const payloadData: Record<string, unknown> = { ...data, ...statusData };
  // Payload's generic Local API overloads can't be satisfied for an arbitrary collection slug `S`;
  // `data` is already type-checked against `S` at the call site.
  const api = payload as unknown as LooseLocalApi;

  if (flags.dryRun) {
    report.log(collection, key, existing ? "updated" : "created", "dry-run");
    return existing?.id ?? null;
  }
  try {
    if (existing) {
      await api.update({
        collection,
        id: existing.id,
        data: payloadData,
        draft: opts.versioned ? Boolean(opts.draft) : undefined,
        overrideAccess: true,
        context: seedContext,
        depth: 0,
      });
      report.log(collection, key, "updated");
      return existing.id;
    }
    const created = await api.create({
      collection,
      data: payloadData,
      draft: opts.versioned ? Boolean(opts.draft) : undefined,
      overrideAccess: true,
      context: seedContext,
      depth: 0,
    });
    report.log(collection, key, "created");
    return String(created.id);
  } catch (err) {
    report.log(collection, key, "failed", err instanceof Error ? err.message : String(err));
    return existing?.id ?? null;
  }
}
