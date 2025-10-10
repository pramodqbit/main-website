import { Metadata } from "next";
import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";
import SectionLayout from "@/components/global/section-layout";
import CompanyStory from "./_components/company-story";
import OurValues from "./_components/our-values";
import CompanyStats from "./_components/company-stats";
import { Building2, Target, TrendingUp, Users, Award, Lightbulb } from "lucide-react";

const ICON_SIZE = 32;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qbitlog.com";

export const metadata: Metadata = {
	title: "About Us - Powered by Expertise, Driven by Excellence",
	description: "QBITLOG assembles elite professionals with extensive experience from leading tech companies and Fortune 500 enterprises. Our expert-driven approach combines decades of collective knowledge with cutting-edge innovation to deliver transformative digital solutions.",
	keywords: [
		"about QBITLOG",
		"technology company",
		"expert developers",
		"Fortune 500 experience",
		"enterprise software experts",
		"digital transformation company",
		"innovation team",
		"technology consulting"
	],
	openGraph: {
		title: "About QBITLOG - Elite Professionals Driving Digital Excellence",
		description: "Meet the expert team behind QBITLOG. Battle-tested professionals from Fortune 500 companies delivering enterprise-grade digital solutions.",
		url: `${siteUrl}/aboutus`,
		type: "website",
		images: [
			{
				url: `${siteUrl}/og-image-about.jpg`,
				width: 1200,
				height: 630,
				alt: "About QBITLOG"
			}
		]
	},
	twitter: {
		card: "summary_large_image",
		title: "About QBITLOG - Elite Professionals Driving Digital Excellence",
		description: "Battle-tested professionals from Fortune 500 companies delivering enterprise-grade digital solutions.",
		images: [`${siteUrl}/twitter-image-about.jpg`]
	},
	alternates: {
		canonical: `${siteUrl}/aboutus`,
	}
};

export default function AboutUsPage() {
	return (
		<div className=''>
			<main className='container'>
				<Navbar />
				
				<SectionLayout
					id='company-story'
					badgeIcon={<Building2 size={ICON_SIZE} className='text-primary' />}
					badgeLabel='Who We Are'
					title='Powered by Expertise, Driven by Excellence'
					description='QBITLOG assembles elite professionals with extensive experience from leading tech companies and Fortune 500 enterprises. Our expert-driven approach combines decades of collective knowledge with cutting-edge innovation to deliver transformative digital solutions that drive measurable business results.'>
					<CompanyStory />
				</SectionLayout>

				<SectionLayout
					id='our-values'
					badgeIcon={<Target size={ICON_SIZE} className='text-primary' />}
					badgeLabel='Our Values'
					title='What Drives Us Forward'
					description='Our core values shape every project we undertake and every relationship we build. These principles guide our decisions and ensure we deliver exceptional results.'>
					<OurValues />
				</SectionLayout>

				<SectionLayout
					id='company-stats'
					badgeIcon={<TrendingUp size={ICON_SIZE} className='text-primary' />}
					badgeLabel='Our Capabilities'
					title='Excellence Measured in Expertise'
					description='Our strength lies in our team collective experience and technical mastery. These metrics showcase the depth of knowledge and professional excellence we bring to every project, ensuring world-class solutions for our clients.'>
					<CompanyStats />
				</SectionLayout>

				<SectionLayout
					id='why-choose-us'
					badgeIcon={<Award size={ICON_SIZE} className='text-primary' />}
					badgeLabel='Why Choose Us'
					title='What Sets Us Apart'
					description='We combine technical expertise with creative vision to deliver cutting-edge solutions that drive business growth and user engagement.'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						<div className='text-center p-6 rounded-lg border bg-card'>
							<Users className='w-12 h-12 mx-auto mb-4 text-primary' />
							<h3 className='text-lg font-semibold mb-2'>Battle-Tested Professionals</h3>
							<p className='text-sm text-muted-foreground'>C-level executives and senior engineers with proven expertise from industry-leading organizations</p>
						</div>
						<div className='text-center p-6 rounded-lg border bg-card'>
							<Lightbulb className='w-12 h-12 mx-auto mb-4 text-primary' />
							<h3 className='text-lg font-semibold mb-2'>Enterprise-Grade Innovation</h3>
							<p className='text-sm text-muted-foreground'>Leveraging advanced technologies and architectural patterns proven at scale in global enterprises</p>
						</div>
						<div className='text-center p-6 rounded-lg border bg-card'>
							<Award className='w-12 h-12 mx-auto mb-4 text-primary' />
							<h3 className='text-lg font-semibold mb-2'>Precision Execution</h3>
							<p className='text-sm text-muted-foreground'>Applying lessons from hundreds of enterprise deployments to ensure flawless delivery and performance</p>
						</div>
					</div>
				</SectionLayout>
			</main>
			<Footer />
		</div>
	);
}
