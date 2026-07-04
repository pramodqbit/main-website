import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CaseStudyCTA as CTAData } from "../_data/types";

export function CaseStudyCTA({ cta }: { cta?: CTAData }) {
	const heading = cta?.heading || "Have a similar project in mind?";
	const description =
		cta?.description || "Let's build something amazing together.";

	return (
		<section className='mb-2'>
			<div className='relative overflow-hidden rounded-2xl bg-primary/5 p-8 md:p-12'>
				<div className='grid grid-cols-1 items-center gap-8 md:grid-cols-[1.3fr_1fr]'>
					<div>
						<h2 className='text-2xl font-bold tracking-tight text-foreground md:text-3xl'>
							{heading}
						</h2>
						<p className='mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base'>
							{description}
						</p>
						<Button asChild size='lg' className='mt-6 rounded-lg px-7'>
							<Link href='/contact-us'>
								Let&apos;s Discuss Your Project
								<ArrowRight className='h-4 w-4' />
							</Link>
						</Button>
					</div>

					{/* Chat-bubble illustration */}
					<div className='relative hidden h-44 md:block'>
						{/* dot-grid accents */}
						<div className='pointer-events-none absolute right-0 top-2 h-12 w-20 [background-image:radial-gradient(circle,rgb(196_181_253)_1.5px,transparent_1.5px)] [background-size:13px_13px]' />
						<div className='pointer-events-none absolute bottom-0 left-4 h-12 w-20 [background-image:radial-gradient(circle,rgb(251_207_232)_1.5px,transparent_1.5px)] [background-size:13px_13px]' />

						{/* purple bubble */}
						<div className='absolute left-1/4 top-8 flex h-16 w-36 items-center justify-center gap-2.5 rounded-3xl rounded-bl-md bg-primary shadow-lg shadow-primary/25'>
							<span className='h-3 w-3 rounded-full bg-white/90' />
							<span className='h-3 w-3 rounded-full bg-white/90' />
							<span className='h-3 w-3 rounded-full bg-white/90' />
						</div>

						{/* pink bubble */}
						<div className='absolute bottom-6 left-1/2 flex h-12 w-28 items-center justify-center gap-2 rounded-3xl rounded-br-md bg-rose-300 shadow-lg shadow-rose-200'>
							<span className='h-2.5 w-2.5 rounded-full bg-white/90' />
							<span className='h-2.5 w-2.5 rounded-full bg-white/90' />
						</div>

						{/* sparkle strokes */}
						<span className='absolute left-[16%] top-2 h-4 w-[3px] -rotate-[30deg] rounded-full bg-primary/60' />
						<span className='absolute left-[21%] top-0 h-4 w-[3px] rotate-0 rounded-full bg-primary/60' />
						<span className='absolute left-[26%] top-2 h-4 w-[3px] rotate-[30deg] rounded-full bg-primary/60' />
					</div>
				</div>
			</div>
		</section>
	);
}

export default CaseStudyCTA;
