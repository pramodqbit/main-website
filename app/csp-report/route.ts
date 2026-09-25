type LegacyReport = { "csp-report"?: { "violated-directive"?: string; "effective-directive"?: string; "blocked-uri"?: string } };

/** Collects Content-Security-Policy-Report-Only violations. Logs only the directive and the blocked origin. */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LegacyReport;
    const r = body["csp-report"];
    if (r) {
      const directive = r["effective-directive"] || r["violated-directive"] || "unknown";
      let blocked = r["blocked-uri"] || "unknown";
      try {
        blocked = new URL(blocked).origin;
      } catch {
        /* keywords such as "inline" or "eval" are not URLs */
      }
      console.warn(`[csp] ${directive} blocked ${blocked}`);
    }
  } catch {
    /* malformed report */
  }
  return new Response(null, { status: 204 });
}
