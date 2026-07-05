"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

// Shared reveal animation for text elements
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

export default function LifeAtQbitlog() {
	return (
		<div className='relative w-full overflow-hidden rounded-3xl shadow-xl min-h-[420px] md:min-h-[520px] flex bg-[#0a0a1f]'>
			{/* Team photo — right side only, undimmed */}
			<div className='absolute inset-y-0 right-0 w-full md:w-[65%]'>
				<Image
					src='/images/life-at-qbitlog.png'
					alt='The QBITLOG team celebrating together over a meal'
					fill
					priority
					quality={90}
					sizes='(max-width: 768px) 100vw, 65vw'
					className='object-cover object-center'
				/>
				{/* Soft blend from the dark panel into the photo */}
				<div className='absolute inset-y-0 left-0 w-3/4 md:w-1/2 bg-gradient-to-r from-[#0a0a1f] to-transparent' />
				{/* Extra darkening on mobile only, where text sits over the photo */}
				<div className='absolute inset-0 bg-[#0a0a1f]/60 md:hidden' />
			</div>

			{/* Content */}
			<div className='relative z-10 flex flex-col justify-center p-8 md:p-12 lg:p-14 max-w-xl'>
				<motion.span
					{...reveal(0)}
					className='text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-primary mb-5'>
					Life at Qbitlog
				</motion.span>

				<motion.h2
					{...reveal(0.12)}
					className='text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] text-white'>
					Great People.
					<br />
					Great Culture.
					<br />
					Better Together.
				</motion.h2>

				<motion.p
					{...reveal(0.24)}
					className='mt-6 text-base md:text-lg text-white/80 leading-relaxed max-w-md'>
					We believe amazing products come from a happy, motivated team.
					Here&apos;s us unwinding and celebrating together.
				</motion.p>

				<motion.div {...reveal(0.36)} className='mt-8'>
					<Link
						href='/careers'
						className='group inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg transition-transform hover:scale-[1.03]'>
						Join Our Team
						<ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
					</Link>
				</motion.div>
			</div>
		</div>
	);
}
