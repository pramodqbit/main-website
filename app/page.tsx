import { Metadata } from "next";
import Navbar from "@/components/global/navbar";
import Hero from "@/app/_home/components/hero";
import OurMarque from "@/components/global/our-marque";
import About from "@/app/_home/components/about";
import Services from "@/components/global/services";
import {
	Star,
	Sparkles,
	Shield,
	DollarSign,
	Award,
	HelpCircle,
} from "lucide-react";
import HowItWorks from "@/components/global/how-it-works";
import ContactUs from "@/components/global/contact-us";
import Footer from "@/components/global/footer";
import FAQ from "@/components/global/faq";
import SectionLayout from "@/components/global/section-layout";

const ICON_SIZE = 32;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qbitlog.com";

export const metadata: Metadata = {
	title: "Home",
	description: "QBITLOG delivers innovative digital solutions with elite professionals from Fortune 500 companies. Expert web development, mobile apps, AI/ML, cloud solutions, and UI/UX design services. Transform your business with enterprise-grade technology and proven expertise.",
	openGraph: {
		title: "QBITLOG - Empowering Your Vision with Innovative Digital Solutions",
		description: "Transform your business with cutting-edge digital solutions. Expert teams specializing in web, mobile, AI, cloud, and design.",
		url: siteUrl,
		type: "website",
		images: [
			{
				url: `${siteUrl}/og-image.jpg`,
				width: 1200,
				height: 630,
				alt: "QBITLOG - Digital Solutions"
			}
		]
	},
	twitter: {
		card: "summary_large_image",
		title: "QBITLOG - Empowering Your Vision with Innovative Digital Solutions",
		description: "Transform your business with cutting-edge digital solutions from expert teams.",
		images: [`${siteUrl}/twitter-image.jpg`]
	},
	alternates: {
		canonical: siteUrl,
	}
};

export default function Home() {
	const Items = [
		{
			icon: <Sparkles size={ICON_SIZE} className='text-primary' />,
			label: "Deliver On Time",
		},
		{
			icon: <Shield size={ICON_SIZE} className='text-primary' />,
			label: "Security",
		},
		{
			icon: <DollarSign size={ICON_SIZE} className='text-primary' />,
			label: "Pricing",
		},
		{
			icon: <Star size={ICON_SIZE} className='text-primary' />,
			label: "Quality",
		},
	];

	// Structured Data for Organization
	const organizationStructuredData = {
		"@context": "https://schema.org",
		"@type": "Organization",
		"name": "QBITLOG",
		"url": siteUrl,
		"logo": `${siteUrl}/icons/logo.svg`,
		"description": "Enterprise-grade digital solutions powered by elite professionals. Specializing in web development, mobile apps, AI/ML, cloud solutions, and UI/UX design.",
		"address": {
			"@type": "PostalAddress",
			"addressCountry": "US"
		},
		"contactPoint": {
			"@type": "ContactPoint",
			"contactType": "Customer Service",
			"url": `${siteUrl}/contact-us`
		},
		"sameAs": [
			"https://twitter.com/qbitlog",
			"https://linkedin.com/company/qbitlog"
		]
	};

	const servicesStructuredData = {
		"@context": "https://schema.org",
		"@type": "Service",
		"serviceType": "Software Development",
		"provider": {
			"@type": "Organization",
			"name": "QBITLOG"
		},
		"areaServed": "Worldwide",
		"hasOfferCatalog": {
			"@type": "OfferCatalog",
			"name": "Digital Services",
			"itemListElement": [
				{
					"@type": "Offer",
					"itemOffered": {
						"@type": "Service",
						"name": "Web Development",
						"description": "Custom web applications built with modern technologies"
					}
				},
				{
					"@type": "Offer",
					"itemOffered": {
						"@type": "Service",
						"name": "Mobile App Development",
						"description": "Native and cross-platform mobile applications"
					}
				},
				{
					"@type": "Offer",
					"itemOffered": {
						"@type": "Service",
						"name": "UI/UX Design",
						"description": "User-centered design that combines aesthetics with functionality"
					}
				},
				{
					"@type": "Offer",
					"itemOffered": {
						"@type": "Service",
						"name": "Cloud Solutions",
						"description": "Scalable cloud infrastructure and DevOps solutions"
					}
				},
				{
					"@type": "Offer",
					"itemOffered": {
						"@type": "Service",
						"name": "AI & Machine Learning",
						"description": "Intelligent automation and AI-powered solutions"
					}
				}
			]
		}
	};

	return (
		<div className=''>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesStructuredData) }}
			/>
			<main className='container'>
				<Navbar />
				<Hero
					title={["Q", "B", "I", "T", "L", "O", "G"]}
					subtitle="Crafting Digital Experiences That Drive Results"
					description="We're a leading software design agency specializing in creating innovative web and mobile applications that transform businesses and delight users."
					button="Hire Us"/>
				<OurMarque Items={Items} />
				<SectionLayout
					id='about'
					badgeIcon={<Award size={ICON_SIZE} className='text-primary' />}
					badgeLabel='About Us'
					title='Empowering Your Vision with Innovative Digital Solutions'
					description='We are a team of experienced developers and designers who are passionate about creating innovative solutions for our clients.'>
					<About />
				</SectionLayout>

				<Services />
				<section id='how-it-works'>
					<HowItWorks />
				</section>

				<SectionLayout
					id='faq'
					badgeIcon={<HelpCircle size={ICON_SIZE} className='text-primary' />}
					badgeLabel='FAQ'
					title='Frequently Asked Questions'
					description='Answers to common questions about our services and solutions.'>
					<FAQ />
				</SectionLayout>
				<section id='contact-us'>
					<ContactUs />
				</section>
			</main>
			<Footer />
		</div>
	);
}
