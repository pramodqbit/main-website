"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
	ArrowRight,
	CheckCircle2,
	Quote,
	Heart,
	HeartHandshake,
	Coffee,
} from "lucide-react";

const collage = {
	main: {
		url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
		alt: "QBITLOG team collaborating around a table in the office",
	},
	left: {
		url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
		alt: "Developers pairing on a project at their desks",
	},
	right: {
		url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
		alt: "Team members discussing ideas in a meeting",
	},
};

const points = [
	"Client-first mindset in everything we do",
	"Strong focus on quality and innovation",
	"Long-term partnerships, not just projects",
	"Transparent communication and honest processes",
];

const quoteStats = [
	{
		icon: Heart,
		value: "98%",
		label: "Client Retention",
		iconClass: "text-rose-500 bg-rose-100 dark:bg-rose-500/15",
	},
	{
		icon: HeartHandshake,
		value: "2.8+",
		label: "Average Partnership",
		iconClass: "text-purple-500 bg-purple-100 dark:bg-purple-500/15",
	},
	{
		icon: Coffee,
		value: "1,000+",
		label: "Cups of Coffee",
		iconClass: "text-amber-500 bg-amber-100 dark:bg-amber-500/15",
	},
];

const reveal = (delay: number) => ({
	initial: { opacity: 0, y: 24 },
	whileInView: { opacity: 1, y: 0 },
	viewport: { once: true },
	transition: {
		duration: 0.5,
		delay,
		ease: [0.21, 0.47, 0.32, 0.98] as const,
	},
});

export default function OurStory() {
	return (
		<div className='grid grid-cols-1 lg:grid-cols-[38fr_37fr_25fr] gap-8 lg:gap-6 items-start'>
			{/* ========== COLUMN 1 — Copy ========== */}
			<motion.div {...reveal(0)} className='flex flex-col lg:pr-6'>
				<span className='text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-primary mb-4'>
					Our Story
				</span>

				<h2 className='text-3xl md:text-4xl font-bold leading-[1.15] text-foreground'>
					Building a better tomorrow through{" "}
					<span className='text-primary'>technology</span> &amp;{" "}
					<span className='bg-gradient-to-r from-[#8A38F5] to-[#25D0FF] bg-clip-text text-transparent'>
						trust
					</span>
					.
				</h2>

				<p className='mt-5 text-sm md:text-base text-muted-foreground leading-relaxed'>
					QbitLog was founded with a simple belief — technology should solve
					real problems and create real impact. Over the years, we&apos;ve
					grown into a team of passionate professionals who love what they do
					and are committed to delivering exceptional results.
				</p>

				<ul className='mt-7 space-y-3.5'>
					{points.map((point) => (
						<li key={point} className='flex items-center gap-3'>
							<CheckCircle2 className='w-5 h-5 shrink-0 text-primary' />
							<span className='text-sm md:text-base text-foreground/80'>
								{point}
							</span>
						</li>
					))}
				</ul>

				<Link
					href='/careers'
					className='group inline-flex items-center gap-2 mt-8 text-base font-semibold text-primary'>
					More About Us
					<ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
				</Link>
			</motion.div>

			{/* ========== COLUMN 2 — Image collage ========== */}
			<motion.div {...reveal(0.15)} className='grid grid-cols-2 gap-4'>
				<div className='relative col-span-2 rounded-2xl overflow-hidden  h-[220px]'>
					<Image
						src={collage.main.url}
						alt={collage.main.alt}
						fill
						quality={85}
						sizes='(max-width: 1024px) 100vw, 37vw '
						className='object-cover aspect-[16/9] w-full h-full '
					/>
				</div>
				<div className='relative rounded-2xl overflow-hidden  h-[200px]'>
					<Image
						src={collage.left.url}
						alt={collage.left.alt}
						fill
						quality={85}
						sizes='(max-width: 1024px) 50vw, 18vw'
						className='object-cover'
					/>
				</div>
				<div className='relative rounded-2xl overflow-hidden  h-[200px]'>
					<Image
						src={collage.right.url}
						alt={collage.right.alt}
						fill
						quality={85}
						sizes='(max-width: 1024px) 50vw, 18vw'
						className='object-cover'
					/>
				</div>
			</motion.div>

			{/* ========== COLUMN 3 — Quote & stats card ========== */}
			<motion.div
				{...reveal(0.3)}
				className='rounded-2xl border border-border/50 bg-card shadow-sm p-6 md:p-7 flex flex-col h-full'>
				<div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-5'>
					<Quote className='w-5 h-5 text-primary fill-current' />
				</div>

				<p className='text-base md:text-lg font-bold text-foreground leading-snug'>
					We don&apos;t just build software, we build relationships.
				</p>

				<div className='mt-7 space-y-6'>
					{quoteStats.map((stat) => {
						const Icon = stat.icon;
						return (
							<div key={stat.label} className='flex items-center gap-4'>
								<div
									className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${stat.iconClass}`}>
									<Icon className='w-5 h-5' />
								</div>
								<div>
									<span className='block text-lg font-extrabold text-foreground leading-none'>
										{stat.value}
									</span>
									<span className='mt-1 block text-sm text-muted-foreground'>
										{stat.label}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			</motion.div>
		</div>
	);
}
