import { revalidatePath } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from "payload";
import { publicUrlFor } from "../utilities/paths";

/** Plain paths, or `[route, type]` pairs: `"page"` revalidates every page of a dynamic route, `"layout"` everything below it. */
type Target = string | [string, "page" | "layout"];

const relatedPaths: Record<string, Target[]> = {
  pages: [],
  "case-studies": ["/work", "/", "/services", ["/work/[slug]", "page"], ["/industries/[slug]", "page"], ["/services/[slug]", "page"]],
  posts: ["/insights", "/", "/log", ["/work/[slug]", "page"], ["/services/[slug]", "page"]],
  services: ["/services", "/", "/work", ["/work/[slug]", "page"], ["/industries/[slug]", "page"]],
  industries: ["/", "/industries", "/work", ["/services/[slug]", "page"]],
  jobs: ["/careers"],
  "log-entries": ["/log", "/", "/insights", "/work", "/services"],
  team: ["/about/team", "/about", ["/insights/[slug]", "page"]],
  faqs: ["/", "/contact", "/services", ["/services/[slug]", "page"], ["/industries/[slug]", "page"]],
  testimonials: ["/", "/work", "/services", ["/work/[slug]", "page"]],
  categories: ["/insights"],
  clients: ["/"],
};

/** Collections without a public detail page only revalidate their index paths. */
const hasDetailPage = new Set(["pages", "case-studies", "services", "industries", "posts", "jobs", "team"]);

type Revalidatable = { slug?: unknown; _status?: unknown } | null | undefined;

const safeRevalidate = (req: PayloadRequest, path: string, type?: "layout" | "page") => {
  try {
    revalidatePath(path, type);
  } catch {
    // revalidatePath throws outside a Next.js request (seed scripts, CLI); nothing to revalidate there.
    req.payload.logger.debug(`revalidate skipped for ${path}`);
  }
};

const pathsFor = (collection: string, doc: Revalidatable): Target[] => {
  const slug = typeof doc?.slug === "string" ? doc.slug : null;
  // The home page's CTA block is the closing CTA on every detail page.
  if (collection === "pages" && (!slug || slug === "home")) return [["/", "layout"]];
  const detail =
    hasDetailPage.has(collection) && (collection === "pages" || slug) ? [publicUrlFor(collection, slug).split("#")[0]] : [];
  return [...detail, ...(relatedPaths[collection] ?? [])];
};

const run = (req: PayloadRequest, target: Target) =>
  typeof target === "string" ? safeRevalidate(req, target) : safeRevalidate(req, target[0], target[1]);

export const revalidateDoc: CollectionAfterChangeHook = ({ collection, doc, previousDoc, req, context }) => {
  if (context.disableRevalidate) return doc;
  const hasDrafts = Boolean(collection.versions?.drafts);
  const current = doc as Revalidatable;
  const previous = previousDoc as Revalidatable;
  const isPublished = !hasDrafts || current?._status === "published";
  const wasPublished = hasDrafts && previous?._status === "published";

  const targets = new Map<string, Target>();
  const add = (t: Target) => targets.set(JSON.stringify(t), t);
  if (isPublished) pathsFor(collection.slug, current).forEach(add);
  if (wasPublished || (isPublished && previous?.slug && previous.slug !== current?.slug)) {
    pathsFor(collection.slug, previous).forEach(add);
  }
  targets.forEach((t) => run(req, t));
  return doc;
};

export const revalidateDelete: CollectionAfterDeleteHook = ({ collection, doc, req, context }) => {
  if (context.disableRevalidate) return doc;
  pathsFor(collection.slug, doc as Revalidatable).forEach((t) => run(req, t));
  return doc;
};

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, req, context }) => {
  if (context.disableRevalidate) return doc;
  safeRevalidate(req, "/", "layout");
  return doc;
};

/** For globals that feed a single page, e.g. `services-page` → `/services`. */
export const revalidateGlobalPath =
  (path: string): GlobalAfterChangeHook =>
  ({ doc, req, context }) => {
    if (context.disableRevalidate) return doc;
    safeRevalidate(req, path);
    return doc;
  };
