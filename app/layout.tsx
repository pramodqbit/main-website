import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import SmoothScrolling from "@/components/animation/smooth-scrolling";


const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const sevenSegment = localFont({
	src: "../public/fonts/Seven_Segment.ttf",
	variable: "--font-seven-segment",
	display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qbitlog.com";

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: "QBITLOG - Expert Digital Solutions | Web, Mobile, AI & Cloud Services",
		template: "%s | QBITLOG"
	},
	description: "QBITLOG delivers enterprise-grade digital solutions with expert teams from Fortune 500 companies. Specializing in web development, mobile apps, AI/ML, cloud solutions, and UI/UX design. Transform your business with cutting-edge technology and proven expertise.",
	keywords: [
		"web development",
		"mobile app development",
		"AI machine learning",
		"cloud solutions",
		"UI/UX design",
		"digital transformation",
		"enterprise software",
		"React",
		"Next.js",
		"React Native",
		"AWS",
		"DevOps",
		"software consulting",
		"custom software development",
		"technology consulting"
	],
	authors: [{ name: "QBITLOG Team" }],
	creator: "QBITLOG",
	publisher: "QBITLOG",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: siteUrl,
		siteName: "QBITLOG",
		title: "QBITLOG - Expert Digital Solutions | Web, Mobile, AI & Cloud Services",
		description: "Enterprise-grade digital solutions powered by elite professionals. Transform your business with web development, mobile apps, AI/ML, and cloud services.",
		images: [
			{
				url: `${siteUrl}/og-image.jpg`,
				width: 1200,
				height: 630,
				alt: "QBITLOG - Expert Digital Solutions"
			}
		]
	},
	twitter: {
		card: "summary_large_image",
		title: "QBITLOG - Expert Digital Solutions | Web, Mobile, AI & Cloud Services",
		description: "Enterprise-grade digital solutions powered by elite professionals. Transform your business with cutting-edge technology.",
		images: [`${siteUrl}/twitter-image.jpg`],
		creator: "@qbitlog"
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	alternates: {
		canonical: siteUrl,
	},
	verification: {
		google: "sjK98A76LzMwXaZmTO1dNeZjbQPckDpM2uKNvkpraI8",
		yandex: "your-yandex-verification-code",
	},
	other: {
		"msvalidate.01": "your-bing-verification-code",
	},
	category: "technology",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<SpeedInsights />
			<Analytics />
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${sevenSegment.variable} antialiased`}>
				<SmoothScrolling />
				{children}
			</body>
		</html>
	);
}
