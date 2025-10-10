import { Metadata } from "next";
import { SectionHeader } from "@/components/global/section-layout";
import { Mail } from "lucide-react";
import ContactForm from "./_components/contact-form";
import ContactInfo from "./_components/contact-info";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qbitlog.com";

export const metadata: Metadata = {
	title: "Contact Us - Connect with us on a journey to build faster",
	description: "Ready to bring your ideas to life? Reach out to our team with your questions, project ideas, or partnership inquiries. Let's build something amazing together with cutting-edge web, mobile, AI/ML, and cloud solutions.",
	keywords: [
		"contact QBITLOG",
		"get in touch",
		"software development inquiry",
		"project consultation",
		"partnership inquiries",
		"build faster",
		"contact form",
		"project ideas",
		"business inquiry"
	],
	openGraph: {
		title: "Contact QBITLOG - Connect on a journey to build faster",
		description: "Ready to bring your ideas to life? Reach out with your questions, project ideas, or partnership inquiries.",
		url: `${siteUrl}/contact-us`,
		type: "website",
		images: [
			{
				url: `${siteUrl}/og-image-contact.jpg`,
				width: 1200,
				height: 630,
				alt: "Contact QBITLOG"
			}
		]
	},
	twitter: {
		card: "summary_large_image",
		title: "Contact QBITLOG - Let's build something amazing together",
		description: "Reach out with your project ideas and partnership inquiries. Let's build faster.",
		images: [`${siteUrl}/twitter-image-contact.jpg`]
	},
	alternates: {
		canonical: `${siteUrl}/contact-us`,
	}
};

export default function Page() {
	return (
		<div className='-mt-20 pt-24 border-l border-r'>
			<SectionHeader
				badgeLabel='Contact Us'
				badgeIcon={<Mail />}
				title='Connect with us on a journey to build faster'
				description="Ready to bring your ideas to life? Reach out to our team with your questions, project ideas, or partnership inquiries. Let's build something amazing together!"
			/>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-10   p-10 border-t border-b'>
				<div>
					<ContactInfo />
				</div>
				<div>
					<ContactForm />
				</div>
			</div>
		</div>
	);
}
