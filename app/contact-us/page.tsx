import { Metadata } from "next";
import { SectionHeader } from "@/components/global/section-layout";
import { Mail } from "lucide-react";
import ContactForm from "./_components/contact-form";
import ContactInfo from "./_components/contact-info";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qbitlog.com";

export const metadata: Metadata = {
	title: "Contact Us - Get in Touch with QBITLOG",
	description: "Ready to transform your business with innovative digital solutions? Contact QBITLOG today. Our expert team is here to help you with web development, mobile apps, AI/ML, cloud solutions, and UI/UX design.",
	keywords: [
		"contact QBITLOG",
		"get in touch",
		"software development inquiry",
		"project consultation",
		"free quote",
		"contact form",
		"business inquiry"
	],
	openGraph: {
		title: "Contact QBITLOG - Let's Build Something Great",
		description: "Get in touch with our expert team. Ready to transform your business with innovative digital solutions.",
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
		title: "Contact QBITLOG - Let's Build Something Great",
		description: "Get in touch with our expert team for innovative digital solutions.",
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
				title='Contact Us'
				description='Contact with us for any questions or inquiries.'
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
