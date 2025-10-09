import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import posts from "../_data/posts.json";
import { notFound } from "next/navigation";

type Post = typeof posts[number];

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
	if (!post) return { title: "Blog | Qbitlog" };
	return {
		title: `${post.title} | Qbitlog`,
		description: post.excerpt,
		keywords: post.tags.join(", "),
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

	return (
		<div className=''>
			<main className='container'>
				<Navbar />
				
				{/* Breadcrumb Navigation */}
				<nav className='flex items-center space-x-2 text-sm text-muted-foreground py-4'>
					<Link href='/' className='flex items-center hover:text-primary transition-colors'>
						<Home className='w-4 h-4 mr-1' />
						Home
					</Link>
					<ChevronRight className='w-4 h-4' />
					<Link href='/blog' className='hover:text-primary transition-colors'>
						Blog
					</Link>
					<ChevronRight className='w-4 h-4' />
					<span className='text-foreground font-medium'>{post.title}</span>
				</nav>

				<article className='mx-auto max-w-3xl py-10'>
					<div className='mb-6'>
						<p className='text-xs text-muted-foreground'>{new Date(post.date).toLocaleDateString()}</p>
						<h1 className='text-3xl md:text-4xl font-bold mt-2'>{post.title}</h1>
						<div className='mt-3 flex items-center gap-3'>
							<Image src={post.iconImage} alt={`${post.title} icon`} width={28} height={28} className='w-7 h-7 object-contain rounded' />
							<div className='flex flex-wrap gap-2'>
								{post.tags.map((tag) => (
									<span key={tag} className='text-xs px-2 py-1 rounded-full border'>#{tag}</span>
								))}
							</div>
						</div>
					</div>
					<div className='relative h-64 w-full rounded-xl overflow-hidden border'>
						<Image src={post.heroImage} alt={post.title} fill className='object-cover' />
					</div>
					<div className='prose dark:prose-invert max-w-none mt-8 prose-headings:scroll-mt-24'>
						{/* Content is trusted local HTML */}
						<div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
					</div>
				</article>
			</main>
			<Footer />
		</div>
	);
}


