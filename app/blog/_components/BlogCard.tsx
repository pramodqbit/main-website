import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { readTime } from "../_lib/utils";

export interface BlogCardPost {
	slug: string;
	title: string;
	excerpt: string;
	date: string;
	tags: string[];
	heroImage: string;
	contentHtml: string;
}

export function BlogCard({ post }: { post: BlogCardPost }) {
	return (
		<Link href={`/blog/${post.slug}`} className='group block h-full'>
			<article className='flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-lg group-hover:shadow-primary/10'>
				<div className='relative aspect-[16/9] w-full overflow-hidden'>
					<Image
						src={post.heroImage}
						alt={post.title}
						fill
						className='object-cover transition-transform duration-500 group-hover:scale-105'
					/>
				</div>
				<div className='flex flex-1 flex-col p-5'>
					<div className='flex items-center justify-between gap-3'>
						<span className='rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary'>
							{post.tags[0]}
						</span>
						<span className='text-xs text-muted-foreground'>
							{readTime(post.contentHtml)} min read
						</span>
					</div>
					<h3 className='mt-3 line-clamp-2 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary'>
						{post.title}
					</h3>
					<p className='mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground'>
						{post.excerpt}
					</p>
					<span className='mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary'>
						Read Article
						<ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
					</span>
				</div>
			</article>
		</Link>
	);
}

export default BlogCard;
