import { Metadata } from "next";
import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";
import SectionLayout from "@/components/global/section-layout";
import TeamMembers from "./_components/team-members";
import { Users } from "lucide-react";
import CoreCompetencies from "@/components/global/core-competencies";

const ICON_SIZE = 32;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qbitlog.com";

export const metadata: Metadata = {
	title: "Our Team - Meet the Experts Behind QBITLOG",
	description: "Our diverse team of skilled professionals brings together years of experience in web development, mobile applications, AI/ML, cloud computing, and digital innovation to deliver exceptional results for our clients.",
	keywords: [
		"QBITLOG team",
		"expert developers",
		"software engineers",
		"tech team",
		"development team",
		"experienced professionals",
		"Fortune 500 engineers",
		"technology experts"
	],
	openGraph: {
		title: "QBITLOG Team - Meet the Experts",
		description: "Skilled professionals with years of experience in web, mobile, AI/ML, and cloud development.",
		url: `${siteUrl}/teams`,
		type: "website",
		images: [
			{
				url: `${siteUrl}/og-image-team.jpg`,
				width: 1200,
				height: 630,
				alt: "QBITLOG Team"
			}
		]
	},
	twitter: {
		card: "summary_large_image",
		title: "QBITLOG Team - Meet the Experts",
		description: "Skilled professionals with years of experience in web, mobile, AI/ML, and cloud development.",
		images: [`${siteUrl}/twitter-image-team.jpg`]
	},
	alternates: {
		canonical: `${siteUrl}/teams`,
	}
};

export default function TeamsPage() {
	return (
		<div className=''>
			<main className='container'>
				<Navbar />

				<SectionLayout
					id='teams'
					badgeIcon={<Users size={ICON_SIZE} className='text-primary' />}
					badgeLabel='Our Team'
					title='Meet the Experts Behind QBITLOG'
					description='Our diverse team of skilled professionals brings together years of experience in web development, mobile applications, and digital innovation to deliver exceptional results for our clients.'>
					<TeamMembers />
				</SectionLayout>

				<CoreCompetencies />
			</main>
			<Footer />
		</div>
	);
}

