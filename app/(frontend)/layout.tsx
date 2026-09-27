import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeScript } from "@/components/ds/ThemeScript";
import { CtaTracker } from "@/components/forms/CtaTracker";
import { UtmCapture } from "@/components/forms/UtmCapture";
import { MotionRuntime } from "@/components/motion/MotionRuntime";
import { MotionScript } from "@/components/motion/MotionScript";
import { Narrator } from "@/components/motion/Narrator";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { DraftBanner } from "@/components/site/DraftBanner";
import { LazyLivePreview } from "@/components/site/LazyLivePreview";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { JsonLd } from "@/components/site/JsonLd";
import { isDraft } from "@/lib/draft";
import { organizationLd } from "@/lib/jsonld";
import { brandLogoPath, siteUrl } from "@/lib/site";
import { getSiteSettings } from "@/lib/queries/globals";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans-src", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono-src", display: "swap" });
const serif = Source_Serif_4({
  subsets: ["latin"], variable: "--font-serif-src", display: "swap",
  style: ["normal", "italic"], axes: ["opsz"],
});


export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Qbitlog: Software, on the record", template: "%s · Qbitlog" },
  description: "Qbitlog designs and builds web, mobile and AI products for teams in the US and Europe, with every decision documented and every result measured.",
  icons: {
    icon: [{ url: brandLogoPath, type: "image/webp" }],
    apple: [{ url: brandLogoPath, type: "image/webp" }],
  },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || "sjK98A76LzMwXaZmTO1dNeZjbQPckDpM2uKNvkpraI8" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F1F2EE" },
    { media: "(prefers-color-scheme: dark)", color: "#0D0F12" },
  ],
};

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [draft, settings] = await Promise.all([isDraft(), getSiteSettings()]);
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${serif.variable}`}
      data-draft={draft ? "" : undefined}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <MotionScript />
        <JsonLd data={organizationLd(settings)} />
      </head>
      <body>
        <a
          href="#main"
          className="fixed left-4 top-4 z-50 -translate-y-24 bg-ink px-4 py-2.5 font-mono text-label uppercase text-paper focus:translate-y-0"
        >
          Skip to content
        </a>
        <AnnouncementBar />
        <SiteHeader />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
        <UtmCapture />
        <SmoothScroll />
        <MotionRuntime />
        <Narrator />
        <CtaTracker />
        {draft ? (
          <>
            <LazyLivePreview />
            <DraftBanner />
          </>
        ) : null}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
