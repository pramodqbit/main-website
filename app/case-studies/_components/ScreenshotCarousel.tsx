"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { CaseStudyScreenshot } from "../_data/types";
import Image from "next/image";

export function ScreenshotCarousel({
	screenshots,
	viewMoreUrl,
}: {
	screenshots?: CaseStudyScreenshot[];
	viewMoreUrl?: string;
}) {
	const trackRef = useRef<HTMLDivElement>(null);

	if (!screenshots || screenshots.length === 0) return null;

	const scrollBy = (dir: 1 | -1) => {
		const track = trackRef.current;
		if (!track) return;
		track.scrollBy({ left: dir * track.clientWidth * 0.9, behavior: "smooth" });
	};

	return (
		<section className='relative'>
			<div className='rounded-2xl border border-border/60 bg-white p-6 shadow-sm md:p-8'>
				<div className='mb-6 flex items-center justify-between gap-4'>
					<h2 className='text-lg font-bold text-foreground md:text-xl'>
						Screenshots
					</h2>
					{viewMoreUrl && (
						<a
							href={viewMoreUrl}
							target='_blank'
							rel='noopener noreferrer'
							className='inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline'>
							View More <ArrowRight className='h-4 w-4' />
						</a>
					)}
				</div>

				<div
					ref={trackRef}
					className='flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
					{screenshots.map((s) => (
						<figure
							key={s.image}
							className='group w-[80%] flex-shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-3.75rem)/4)]'>
							<div className='overflow-hidden rounded-xl border border-border/60 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-primary/10'>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<Image
									width={1000}
									height={1000}
									src={s.image}
									alt={s.caption}
									className='w-full aspect-[16/9] object-cover transition-transform duration-500 group-hover:scale-105'
								/>
							</div>
							<figcaption className='mt-3 text-center text-sm font-medium text-foreground'>
								{s.caption}
							</figcaption>
						</figure>
					))}
				</div>
			</div>

			{/* side arrows, vertically centered on the card */}
			<button
				type='button'
				aria-label='Previous screenshots'
				onClick={() => scrollBy(-1)}
				className='absolute -left-4 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-white text-muted-foreground shadow-md transition-all hover:border-primary/40 hover:text-primary md:flex'>
				<ChevronLeft className='h-5 w-5' />
			</button>
			<button
				type='button'
				aria-label='Next screenshots'
				onClick={() => scrollBy(1)}
				className='absolute -right-4 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/60 bg-white text-muted-foreground shadow-md transition-all hover:border-primary/40 hover:text-primary md:flex'>
				<ChevronRight className='h-5 w-5' />
			</button>
		</section>
	);
}

export default ScreenshotCarousel;
