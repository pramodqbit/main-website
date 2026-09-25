export function publicUrlFor(collection: string, slug?: string | null): string {
  switch (collection) {
    case "pages": return !slug || slug === "home" ? "/" : `/${slug}`;
    case "case-studies": return `/work/${slug}`;
    case "services": return `/services/${slug}`;
    case "industries": return `/industries/${slug}`;
    case "posts": return `/insights/${slug}`;
    case "jobs": return `/careers/${slug}`;
    case "team": return `/about/team#${slug}`;
    case "services-page": return "/services";
    case "work-page": return "/work";
    default: return "/";
  }
}
