import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
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

export const metadata: Metadata = {
	title: "QBIT",
	description: "QBIT",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<SpeedInsights />
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${sevenSegment.variable} antialiased`}>
				<SmoothScrolling />
				{children}
			</body>
		</html>
	);
}
