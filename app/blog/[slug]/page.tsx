import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import posts from "../_data/posts.json";
import { notFound } from "next/navigation";
import {
	extractToc,
	readTime,
	formatDate,
	formatMonthYear,
} from "../_lib/utils";
import { TableOfContents } from "../_components/TableOfContents";
import { ShareButtons } from "../_components/ShareButtons";
import { ArticleMetaCard } from "../_components/ArticleMetaCard";
import { BlogCard } from "../_components/BlogCard";
import { BlogCTA } from "../_components/BlogCTA";
import { AuthorCard } from "../_components/AuthorCard";

type Post = (typeof posts)[number];

function getPost(slug: string): Post | undefined {
	return posts.find((p) => p.slug === slug);
}

export async function generateStaticParams() {
	return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const post = getPost(slug);
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qbitlog.com";

	if (!post)
		return {
			title: "Blog Post Not Found",
			description: "The requested blog post could not be found.",
		};

	return {
		title: post.title,
		description: post.excerpt,
		keywords: post.tags,
		authors: [{ name: "QBITLOG Team" }],
		openGraph: {
			type: "article",
			title: post.title,
			description: post.excerpt,
			url: `${siteUrl}/blog/${slug}`,
			publishedTime: post.date,
			authors: ["QBITLOG Team"],
			tags: post.tags,
			images: [
				{
					url: post.heroImage,
					width: 1200,
					height: 630,
					alt: post.title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: post.title,
			description: post.excerpt,
			images: [post.heroImage],
			creator: "@qbitlog",
		},
		alternates: {
			canonical: `${siteUrl}/blog/${slug}`,
		},
	};
}

export default async function BlogPostPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const post = getPost(slug);
	if (!post) notFound();

	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qbitlog.com";
	const { html: contentHtml, toc } = extractToc(post.contentHtml);
	const minutes = readTime(post.contentHtml);
	const category = post.tags[0];
	const related = posts.filter((p) => p.slug !== slug).slice(0, 3);

	const articleStructuredData = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: post.title,
		description: post.excerpt,
		image: post.heroImage,
		datePublished: post.date,
		dateModified: post.date,
		author: { "@type": "Organization", name: "QBITLOG", url: siteUrl },
		publisher: {
			"@type": "Organization",
			name: "QBITLOG",
			logo: { "@type": "ImageObject", url: `${siteUrl}/icons/logo.png` },
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${siteUrl}/blog/${slug}`,
		},
		keywords: post.tags.join(", "),
	};

	const breadcrumbStructuredData = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
			{
				"@type": "ListItem",
				position: 2,
				name: "Blog",
				item: `${siteUrl}/blog`,
			},
			{
				"@type": "ListItem",
				position: 3,
				name: post.title,
				item: `${siteUrl}/blog/${slug}`,
			},
		],
	};

	return (
		<div >
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(articleStructuredData),
				}}
			/>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(breadcrumbStructuredData),
				}}
			/>
			<main className='container px-4'>
				<Navbar />

				<div className='mx-auto mt-8 max-w-[95%] pb-10'>
					{/* Breadcrumb */}
					<nav className='flex items-center gap-2 py-2 text-sm text-muted-foreground'>
						<Link
							href='/'
							className='flex items-center transition-colors hover:text-primary'>
							<Home className='mr-1 h-4 w-4' />
							Home
						</Link>
						<ChevronRight className='h-4 w-4 flex-shrink-0' />
						<Link
							href='/blog'
							className='transition-colors hover:text-primary'>
							Blog
						</Link>
						<ChevronRight className='h-4 w-4 flex-shrink-0' />
						<span className='line-clamp-1 font-medium text-foreground'>
							{post.title}
						</span>
					</nav>

					<div className='mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)_280px]'>
						{/* Left — On this page */}
						<aside className='hidden lg:block'>
							<div className='sticky top-24 space-y-5'>
								<TableOfContents items={toc} />
								<div className='rounded-2xl border border-border/60 bg-white p-5 shadow-sm'>
									<p className='text-sm font-semibold text-foreground'>
										Enjoying the read?
									</p>
									<p className='mt-1 text-xs leading-relaxed text-muted-foreground'>
										Share this article with your network.
									</p>
									<ShareButtons title={post.title} className='mt-4' />
								</div>
							</div>
						</aside>

						{/* Center — article */}
						<div className='min-w-0 space-y-8'>
							{/* Hero */}
							<section className='relative overflow-hidden rounded-2xl bg-[#0d0628]'>
								<Image
									src={post.heroImage}
									alt={post.title}
									fill
									priority
									className='object-cover opacity-70'
								/>
								<div className='absolute inset-0 bg-gradient-to-r from-[#0d0628] via-[#0d0628]/85 to-[#0d0628]/30' />
								<div className='relative p-7 md:p-10'>
									<span className='inline-block rounded-md bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white'>
										Blog
									</span>
									<h1 className='mt-5 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl'>
										{post.title}
									</h1>
									<p className='mt-4 max-w-xl text-sm leading-relaxed text-white/80 md:text-base'>
										{post.excerpt}
									</p>
									<div className='mt-8 flex flex-wrap items-center gap-x-2 gap-y-2 text-xs text-white/70'>
										<span className='flex items-center gap-2'>
											<span className='flex h-7 w-7 items-center justify-center rounded-full bg-white/10 p-1'>
												<Image
													src='/icons/logo.png'
													alt='QbitLog'
													width={18}
													height={18}
													className='h-[18px] w-[18px] object-contain'
												/>
											</span>
											By QbitLog Editorial Team
										</span>
										<span aria-hidden='true'>&bull;</span>
										<span>{formatDate(post.date)}</span>
										<span aria-hidden='true'>&bull;</span>
										<span>{minutes} min read</span>
									</div>
								</div>
							</section>

							{/* Compact meta for small screens */}
							<div className='flex flex-wrap items-center gap-2 xl:hidden'>
								{post.tags.map((tag) => (
									<span
										key={tag}
										className='rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary'>
										{tag}
									</span>
								))}
							</div>

							{/* Content */}
							<article
								className='prose prose-neutral max-w-none prose-headings:scroll-mt-28 prose-headings:font-bold prose-headings:text-foreground prose-h2:text-2xl prose-a:text-primary prose-strong:text-foreground prose-p:leading-relaxed prose-p:text-muted-foreground prose-li:text-muted-foreground'
								/* Content is trusted local HTML */
								dangerouslySetInnerHTML={{ __html: contentHtml }}
							/>

							{/* CTA */}
							<BlogCTA />

							{/* Related articles */}
							{related.length > 0 && (
								<section>
									<div className='mb-5 flex items-center justify-between gap-4'>
										<h2 className='text-lg font-bold text-foreground md:text-xl'>
											Related Articles
										</h2>
										<Link
											href='/blog'
											className='text-sm font-semibold text-primary hover:underline'>
											View all articles
										</Link>
									</div>
									<div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
										{related.map((p) => (
											<BlogCard key={p.slug} post={p} />
										))}
									</div>
								</section>
							)}

							{/* Author */}
							<AuthorCard title={post.title} />
						</div>

						{/* Right — meta card */}
						<aside className='hidden xl:block'>
							<div className='sticky top-24'>
								<ArticleMetaCard
									readingTime={minutes}
									category={category}
									lastUpdated={formatMonthYear(post.date)}
									title={post.title}
								/>
							</div>
						</aside>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
