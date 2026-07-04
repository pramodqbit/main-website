import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BlogCTA() {
	return (
		<section className='relative overflow-hidden rounded-2xl bg-[#12082b] p-8 md:p-10'>
			{/* glow accents */}
			<div className='pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/30 blur-3xl' />
			<div className='pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-secondary/20 blur-3xl' />

			<div className='relative grid grid-cols-1 items-center gap-8 md:grid-cols-[1.5fr_1fr]'>
				<div>
					<h2 className='text-xl font-bold text-white md:text-2xl'>
						Ready to Bring Your Ideas to Life?
					</h2>
					<p className='mt-2 max-w-xl text-sm leading-relaxed text-white/70'>
						We help startups and enterprises build AI-powered applications,
						automation systems, and modern digital products.
					</p>
				</div>
				<div className='flex flex-col gap-3'>
					<Button asChild className='rounded-lg'>
						<Link href='/contact-us'>
							Schedule Consultation
							<ArrowRight className='h-4 w-4' />
						</Link>
					</Button>
					<Button
						asChild
						variant='outline'
						className='rounded-lg border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white'>
						<Link href='/case-studies'>
							View Our Work
							<ArrowRight className='h-4 w-4' />
						</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}

export default BlogCTA;
