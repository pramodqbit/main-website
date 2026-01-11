import { Metadata } from "next";
import Navbar from "@/components/global/navbar";
import Hero5 from "@/app/_home/components/hero_5";
import OurMarque from "@/components/global/our-marque";
import AboutV2 from "@/app/_home/components/about/about-v2";
import Services from "@/components/global/services";
import {
	Star,
	Sparkles,
	Shield,
	DollarSign,
	Award,
	HelpCircle,
	Book,
} from "lucide-react";
import HowItWorks from "@/components/global/how-it-works";
import ContactUs from "@/components/global/contact-us";
import Footer from "@/components/global/footer";
import FAQ from "@/components/global/faq";
import SectionLayout from "@/components/global/section-layout";
import BlogList from "./blog/components/bloglist";
import CtaBanner from "@/components/global/cta-banner";

const ICON_SIZE = 32;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qbitlog.com";

export const metadata: Metadata = {
	title: "Home",
	description:
		"QBITLOG delivers innovative digital solutions with elite professionals from Fortune 500 companies. Expert web development, mobile apps, AI/ML, cloud solutions, and UI/UX design services. Transform your business with enterprise-grade technology and proven expertise.",
	openGraph: {
		title: "QBITLOG - Empowering Your Vision with Innovative Digital Solutions",
		description:
			"Transform your business with cutting-edge digital solutions. Expert teams specializing in web, mobile, AI, cloud, and design.",
		url: siteUrl,
		type: "website",
		images: [
			{
				url: `${siteUrl}/og-image.jpg`,
				width: 1200,
				height: 630,
				alt: "QBITLOG - Digital Solutions",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "QBITLOG - Empowering Your Vision with Innovative Digital Solutions",
		description:
			"Transform your business with cutting-edge digital solutions from expert teams.",
		images: [`${siteUrl}/twitter-image.jpg`],
	},
	alternates: {
		canonical: siteUrl,
	},
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
		name: "QBITLOG",
		alternateName: "Qbitlog",
		url: siteUrl,
		logo: `${siteUrl}/icons/logo.png`,
		description:
			"Future-forward software design agency where innovation meets intelligence. We specialize in creating innovative web and mobile applications that transform businesses and delight users with AI-enhanced solutions.",
		slogan: "Crafting Digital Experiences That Drive Results",
		foundingDate: "2020",
		address: {
			"@type": "PostalAddress",
			addressCountry: "US",
		},
		contactPoint: {
			"@type": "ContactPoint",
			contactType: "Customer Service",
			url: `${siteUrl}/contact-us`,
			availableLanguage: ["English"],
		},
		sameAs: [
			"https://twitter.com/qbitlog",
			"https://linkedin.com/company/qbitlog",
		],
		knowsAbout: [
			"Web Development",
			"Mobile App Development",
			"Artificial Intelligence",
			"Machine Learning",
			"UI/UX Design",
			"Cloud Solutions",
			"Software Architecture",
		],
	};

	const servicesStructuredData = {
		"@context": "https://schema.org",
		"@type": "Service",
		serviceType: "Software Development",
		provider: {
			"@type": "Organization",
			name: "QBITLOG",
		},
		areaServed: "Worldwide",
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: "Digital Services",
			itemListElement: [
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: "Web Development",
						description:
							"Custom web applications built with modern technologies",
					},
				},
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: "Mobile App Development",
						description: "Native and cross-platform mobile applications",
					},
				},
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: "UI/UX Design",
						description:
							"User-centered design that combines aesthetics with functionality",
					},
				},
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: "Cloud Solutions",
						description: "Scalable cloud infrastructure and DevOps solutions",
					},
				},
				{
					"@type": "Offer",
					itemOffered: {
						"@type": "Service",
						name: "AI & Machine Learning",
						description: "Intelligent automation and AI-powered solutions",
					},
				},
			],
		},
	};

	const faqStructuredData = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: [
			{
				"@type": "Question",
				name: "What services does Qbitlog offer?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Qbitlog specializes in comprehensive digital solutions including web development, mobile app development, UI/UX design, cloud solutions, and custom software development. We leverage cutting-edge technologies to deliver innovative solutions tailored to your business needs.",
				},
			},
			{
				"@type": "Question",
				name: "How long does a typical project take?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Project timelines vary based on scope and complexity. A simple website might take 2-4 weeks, while a complex web application could take 3-6 months. We provide detailed project timelines during our initial consultation and keep you updated throughout the development process.",
				},
			},
			{
				"@type": "Question",
				name: "What is your development process?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Our development process follows an agile methodology with five key phases: Discovery & Planning, Design & Prototyping, Development, Testing & QA, and Deployment & Support. We maintain transparent communication throughout, providing regular updates and incorporating your feedback at each stage.",
				},
			},
			{
				"@type": "Question",
				name: "Do you provide ongoing support after project completion?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Yes! We offer comprehensive post-launch support and maintenance packages. This includes bug fixes, security updates, performance monitoring, and feature enhancements. We believe in building long-term partnerships with our clients.",
				},
			},
			{
				"@type": "Question",
				name: "What technologies do you work with?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "We work with a wide range of modern technologies including React, Next.js, Angular, Vue.js for frontend; Node.js, Python, PHP for backend; and various databases and cloud platforms. We select the best technology stack based on your project requirements and scalability needs.",
				},
			},
			{
				"@type": "Question",
				name: "How do you ensure project quality?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "Quality is our top priority. We implement rigorous testing procedures including unit testing, integration testing, and user acceptance testing. Our code goes through peer reviews, we follow industry best practices, and we use automated testing tools to ensure reliability and performance.",
				},
			},
			{
				"@type": "Question",
				name: "What are your pricing models?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "We offer flexible pricing models to suit different needs: fixed-price projects for well-defined scopes, time & material for evolving requirements, and dedicated team arrangements for long-term partnerships. We provide transparent, detailed quotes with no hidden costs.",
				},
			},
			{
				"@type": "Question",
				name: "Can you help with existing projects or only new ones?",
				acceptedAnswer: {
					"@type": "Answer",
					text: "We can definitely help with existing projects! Whether you need to modernize legacy code, add new features, fix bugs, improve performance, or take over maintenance, our team can assess your current situation and provide the support you need.",
				},
			},
		],
	};

	const websiteStructuredData = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "QBITLOG",
		url: siteUrl,
		description: "Crafting Digital Experiences That Drive Results",
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${siteUrl}/search?q={search_term_string}`,
			},
			"query-input": "required name=search_term_string",
		},
	};

	return (
		<div className=''>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(organizationStructuredData),
				}}
			/>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(servicesStructuredData),
				}}
			/>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
			/>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(websiteStructuredData),
				}}
			/>
			<main>
				<Navbar />
				<Hero5
					description='From robust web and mobile applications enhanced with AI to help you automate tasks and make smarter decisions.'
					button='Upgrade Your Business'
				/>
				<OurMarque Items={Items} />
				{/* <SectionLayout
					id='about'
					badgeIcon={<Award size={ICON_SIZE} className='text-primary' />}
					badgeLabel=''
					title=''
					description=''>
				</SectionLayout> */}
				<section id='about' className=' my-5 mx-4'>
					<AboutV2 />
				</section>

				<Services />
				<section id='how-it-works' className='container px-2'>
					<HowItWorks />
				</section>

				<CtaBanner />

				<SectionLayout
					id='blog'
					badgeIcon={<Book size={ICON_SIZE} className='text-primary' />}
					badgeLabel='Blog'
					title='Latest Insights in AI, Web Development, and IT'
					description="Deep dives and practical guides on AI, machine learning, web development, platform engineering, and modern software architecture. Expert insights from QBITLOG's engineering team.">
					<BlogList />
				</SectionLayout>

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
