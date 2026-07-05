"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
	ArrowRight,
	Play,
	Briefcase,
	HeartHandshake,
	Sparkles,
	Users2,
} from "lucide-react";

const stats = [
	{ icon: Briefcase, value: "20+", label: "Projects Delivered" },
	{ icon: HeartHandshake, value: "98%", label: "Client Satisfaction" },
	{ icon: Sparkles, value: "5+", label: "Years of Experience" },
	{ icon: Users2, value: "20+", label: "Expert Professionals" },
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

export default function AboutHeroV2() {
	return (
		// -mt pulls the dark panel up behind the floating navbar pill so no
		// light gap shows above the banner.
		<section className='relative overflow-hidden bg-[#0a0a1f] text-white -mt-16 pt-16'>
			{/* Soft ambient glow */}
			<div className='pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/20 blur-[120px]' />
			<div className='pointer-events-none absolute bottom-0 right-0 w-96 h-96 rounded-full bg-secondary/15 blur-[120px]' />

			{/* Top: full-bleed text + image */}
			<div className='relative grid grid-cols-1 lg:grid-cols-[40%_60%]'>
				{/* Left — copy */}
				<div className='flex flex-col justify-center py-16 lg:py-24 pl-6 md:pl-12 xl:pl-20 pr-6 lg:pr-0'>
					<motion.span
						{...reveal(0)}
						className='text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-primary mb-5'>
						About Qbitlog
					</motion.span>

					<motion.h1
						{...reveal(0.1)}
						className='text-4xl md:text-5xl xl:text-6xl font-bold leading-[1.12]'>
						Great People.
						<br />
						Great Culture.
						<br />
						<span className='whitespace-nowrap'>
							Better{" "}
							<span className='bg-gradient-to-r from-[#8A38F5] to-[#25D0FF] bg-clip-text text-transparent'>
								Solutions.
							</span>
						</span>
					</motion.h1>

					<motion.p
						{...reveal(0.2)}
						className='mt-6 text-base md:text-lg text-white/70 leading-relaxed max-w-md'>
						At QbitLog, we combine technology, creativity, and collaboration
						to build software that helps businesses grow and succeed.
					</motion.p>

					<motion.div
						{...reveal(0.3)}
						className='mt-9 flex flex-wrap items-center gap-5'>
						<Link
							href='/contact-us'
							className='group inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary font-semibold shadow-lg transition-transform hover:scale-[1.03]'>
							Let&apos;s Work Together
							<ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
						</Link>

						<Link
							href='#our-story'
							className='group inline-flex items-center gap-3 font-medium text-white/90'>
							<span className='flex items-center justify-center w-11 h-11 rounded-full border border-white/25 transition-colors group-hover:border-primary group-hover:bg-primary/10'>
								<Play className='w-4 h-4 fill-current' />
							</span>
							Our Story
						</Link>
					</motion.div>
				</div>

				{/* Right — immersive image bleeding to the viewport edge */}
				<motion.div
					{...reveal(0.15)}
					className='relative min-h-[300px] sm:min-h-[380px] lg:min-h-0'>
					<Image
						src='/images/life-at-qbitlog.png'
						alt='The QBITLOG team celebrating together'
						fill
						priority
						quality={90}
						sizes='(max-width: 1024px) 100vw, 60vw'
						className='object-cover'
					/>
					{/* Edge fades into the dark panel */}
					<div className='absolute inset-y-0 left-0 w-[22%] bg-gradient-to-r from-[#0a0a1f] to-transparent' />
					<div className='absolute inset-y-0 right-0 w-[10%] bg-gradient-to-l from-[#0a0a1f] to-transparent' />
					<div className='absolute inset-x-0 top-0 h-[22%] bg-gradient-to-b from-[#0a0a1f] to-transparent' />
					<div className='absolute inset-x-0 bottom-0 h-[25%] bg-gradient-to-t from-[#0a0a1f] to-transparent' />
				</motion.div>
			</div>

			{/* Bottom: stats bar */}
			<div className='relative px-6 md:px-12 xl:px-20 pb-12 md:pb-16 pt-4'>
				<motion.div
					{...reveal(0.35)}
					className='rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm'>
					<div className='grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10'>
						{stats.map((stat) => {
							const Icon = stat.icon;
							return (
								<div
									key={stat.label}
									className='flex items-center gap-4 px-6 py-7 md:px-8'>
									<div className='shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center'>
										<Icon className='w-5 h-5 text-primary' />
									</div>
									<div>
										<span className='block text-2xl md:text-3xl font-extrabold leading-none'>
											{stat.value}
										</span>
										<span className='mt-1.5 block text-sm text-white/60'>
											{stat.label}
										</span>
									</div>
								</div>
							);
						})}
					</div>
				</motion.div>
			</div>
		</section>
	);
}
