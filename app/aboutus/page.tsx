import { Metadata } from "next";
import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";
import SectionLayout from "@/components/global/section-layout";
import CompanyStory from "./_components/company-story";
import OurValues from "./_components/our-values";
import AboutHeroV2 from "./_components/hero-v2";
import OurStory from "./_components/our-story";
import { Compass, Target, Users, Award, Lightbulb } from "lucide-react";
import CtaBanner from "@/components/global/cta-banner";
import ContactUs from "@/components/global/contact-us";
const ICON_SIZE = 32;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qbitlog.com";

export const metadata: Metadata = {
	title: "About Us - Architecting Tomorrow's Digital Landscape",
	description:
		"Qbitlog is a future-forward software design agency where innovation meets intelligence. We specialize in crafting adaptive web and mobile applications with machine learning and cutting-edge animations, delivering intuitively engaging and transformative digital experiences.",
	keywords: [
		"about QBITLOG",
		"future-forward agency",
		"AI software design",
		"machine learning applications",
		"adaptive web applications",
		"innovative mobile apps",
		"digital transformation",
		"intelligent software solutions",
		"cutting-edge technology",
	],
	openGraph: {
		title: "About QBITLOG - Architecting Tomorrow's Digital Landscape",
		description:
			"Future-forward software design agency where innovation meets intelligence. Crafting adaptive web and mobile applications with AI and ML.",
		url: `${siteUrl}/aboutus`,
		type: "website",
		images: [
			{
				url: `${siteUrl}/og-image-about.jpg`,
				width: 1200,
				height: 630,
				alt: "About QBITLOG - Future-Forward Software Agency",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "About QBITLOG - Architecting Tomorrow's Digital Landscape",
		description:
			"Future-forward software design agency specializing in AI-enhanced, adaptive digital experiences.",
		images: [`${siteUrl}/twitter-image-about.jpg`],
	},
	alternates: {
		canonical: `${siteUrl}/aboutus`,
	},
};

export default function AboutUsPage() {
	return (
		<div className=''>
			<Navbar />

			<AboutHeroV2 />
			<main className='container'>
				<section
					id='our-story'
					className='mx-auto w-full  px-4 py-12 md:py-16'>
					<OurStory />
				</section>

				<CompanyStory />

				{/* <SectionLayout
					id='company-story'
					badgeIcon={<Compass size={ICON_SIZE} className='text-primary' />}
					badgeLabel='Our Purpose'
					title='Purpose That Drives Everything We Do'
					description='Our purpose is the foundation of our culture, decisions, and long-term relationships.'>
					
				</SectionLayout> */}

				<SectionLayout
					id='our-values'
					badgeIcon={<Target size={ICON_SIZE} className='text-primary hidden md:block' />}
					badgeLabel='Our Core Values'
					title='What Drives Us Forward'
					description='Our core values shape every project we undertake and every relationship we build.'>
					<OurValues />
				</SectionLayout>
				<div className='-mb-25'>
					<CtaBanner />
				</div>




				<ContactUs />
			</main>
			<Footer />
		</div>
	);
}
