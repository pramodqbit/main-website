import bundleAnalyzer from "@next/bundle-analyzer";
import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

const BLOB_HOST = "https://*.public.blob.vercel-storage.com";

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${BLOB_HOST}`,
  "font-src 'self' data:",
  "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "frame-src 'self'",
  "frame-ancestors 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "report-uri /csp-report",
].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Content-Security-Policy-Report-Only", value: csp },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
    localPatterns: [{ pathname: "/api/media/file/**" }, { pathname: "/**" }],
  },
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/aboutus", destination: "/about", permanent: true },
      { source: "/teams", destination: "/about/team", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/case-studies", destination: "/work", permanent: true },
      { source: "/case-studies/:slug", destination: "/work/:slug", permanent: true },
      { source: "/blog", destination: "/insights", permanent: true },
      { source: "/blog/:slug", destination: "/insights/:slug", permanent: true },
      { source: "/construction", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default withBundleAnalyzer(withPayload(nextConfig, { devBundleServerPackages: false }));
