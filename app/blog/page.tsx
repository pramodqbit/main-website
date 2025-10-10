import { Metadata } from "next";
import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";
import SectionLayout from "@/components/global/section-layout";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import posts from "./_data/posts.json";
import { Book } from "lucide-react";

const ICON_SIZE = 32;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qbitlog.com";

export const metadata: Metadata = {
	title: "Blog - Latest Insights in AI, Web Development, and IT",
	description: "Deep dives and practical guides on AI, machine learning, web development, platform engineering, and modern software architecture. Expert insights from QBITLOG's engineering team.",
	keywords: [
		"AI blog",
		"machine learning articles",
		"web development blog",
		"RAG architecture",
		"platform engineering",
		"Next.js tutorials",
		"DevOps best practices",
		"software engineering blog",
		"tech insights"
	],
	openGraph: {
		title: "QBITLOG Blog - Latest Insights in AI and IT",
		description: "Deep dives and practical guides on AI, web development, and platform engineering from expert engineers.",
		url: `${siteUrl}/blog`,
		type: "website",
		images: [
			{
				url: `${siteUrl}/og-image-blog.jpg`,
				width: 1200,
				height: 630,
				alt: "QBITLOG Blog"
			}
		]
	},
	twitter: {
		card: "summary_large_image",
		title: "QBITLOG Blog - Latest Insights in AI and IT",
		description: "Deep dives and practical guides on AI, web development, and platform engineering.",
		images: [`${siteUrl}/twitter-image-blog.jpg`]
	},
	alternates: {
		canonical: `${siteUrl}/blog`,
	}
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
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{posts.map((post) => (
							<Link key={post.slug} href={`/blog/${post.slug}`} className='group'>
								<Card className='h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/20'>
									<div className='relative h-40 w-full'>
										<Image
											src={post.heroImage}
											alt={post.title}
											fill
											className='object-cover'
											priority={false}
										/>
									</div>
									<CardContent className='py-4'>
										<div className='flex items-center gap-3 mb-3'>
											<Image
												src={post.iconImage}
												alt={`${post.title} icon`}
												width={28}
												height={28}
												className='w-7 h-7 object-contain rounded'
											/>
											<p className='text-xs text-muted-foreground'>{new Date(post.date).toLocaleDateString()}</p>
										</div>
										<h3 className='text-lg font-semibold leading-snug mb-2'>{post.title}</h3>
										<p className='text-sm text-muted-foreground line-clamp-3'>{post.excerpt}</p>
										<div className='mt-3 flex flex-wrap gap-2'>
											{post.tags.slice(0, 3).map((tag) => (
												<span key={tag} className='text-xs px-2 py-1 rounded-full border'>#{tag}</span>
											))}
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				</SectionLayout>

			</main>
			<Footer />
		</div>
	);
}


