import { Metadata } from "next";
import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";
import SectionLayout from "@/components/global/section-layout";
import posts from "./_data/posts.json";
import { Book } from "lucide-react";
import ContactUs from "@/components/global/contact-us";
import { BlogCard } from "./_components/BlogCard";

const ICON_SIZE = 32;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qbitlog.com";

export const metadata: Metadata = {
	title: "Blog - Latest Insights in AI, Web Development, and IT",
	description:
		"Deep dives and practical guides on AI, machine learning, web development, platform engineering, and modern software architecture. Expert insights from QBITLOG's engineering team.",
	keywords: [
		"AI blog",
		"machine learning articles",
		"web development blog",
		"RAG architecture",
		"platform engineering",
		"Next.js tutorials",
		"DevOps best practices",
		"software engineering blog",
		"tech insights",
	],
	openGraph: {
		title: "QBITLOG Blog - Latest Insights in AI and IT",
		description:
			"Deep dives and practical guides on AI, web development, and platform engineering from expert engineers.",
		url: `${siteUrl}/blog`,
		type: "website",
		images: [
			{
				url: `${siteUrl}/og-image-blog.jpg`,
				width: 1200,
				height: 630,
				alt: "QBITLOG Blog",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "QBITLOG Blog - Latest Insights in AI and IT",
		description:
			"Deep dives and practical guides on AI, web development, and platform engineering.",
		images: [`${siteUrl}/twitter-image-blog.jpg`],
	},
	alternates: {
		canonical: `${siteUrl}/blog`,
	},
};

export default function BlogIndexPage() {
	return (
		<div className=''>
			<main className='container'>
				<Navbar />

				<SectionLayout
					id='blog'
					badgeIcon={<Book size={ICON_SIZE} className='text-primary' />}
					badgeLabel='Blog'
					title='Latest Insights in AI and IT'
					description='Deep dives and practical guides on AI, web, and platform engineering.'>
					<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
						{posts.map((post) => (
							<BlogCard key={post.slug} post={post} />
						))}
					</div>
				</SectionLayout>
				<ContactUs />
			</main>
			<Footer />
		</div>
	);
}
