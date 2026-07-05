"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Rocket, ShieldCheck, Users, Bot, ArrowRight } from "lucide-react";

// Image
const image = {
	url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
	alt: "Professional development team collaborating on a project",
};

// Middle-column features
const features = [
	{
		icon: Rocket,
		title: "Innovation-Driven Solutions",
		description:
			"We leverage cutting-edge technologies to build scalable, future-proof applications that drive your business.",
	},
	{
		icon: ShieldCheck,
		title: "Transparent & Trusted",
		description:
			"Every project is handled with clear communication, honest timelines, and real progress updates you can count on.",
	},
	{
		icon: Users,
		title: "Client-Focused Approach",
		description:
			"Your success is our priority. We work closely with you to understand goals and deliver solutions that create real impact.",
	},
	{
		icon: Bot,
		title: "50+ Projects Delivered",
		description:
			"We have successfully delivered 50+ projects across industries with 98% client satisfaction.",
	},
];

// Animation variants
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.12,
			delayChildren: 0.1,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 24 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: [0.21, 0.47, 0.32, 0.98] as const,
		},
	},
};

export default function AboutV3() {
	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			whileInView='visible'
			viewport={{ once: true, amount: 0.2 }}
			className='w-full'>
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-center'>
				{/* ========== COLUMN 1 — Intro ========== */}
				<motion.div variants={itemVariants} className='flex flex-col'>
					<span className='text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-primary mb-5'>
						Why Clients Choose Us
					</span>
					<h2 className='text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-[1.1] text-foreground'>
						Partnerships Built on Trust &amp; Results
					</h2>
					<div className='w-12 h-1 rounded-full bg-primary/40 my-6' />
					<p className='text-base md:text-lg text-muted-foreground leading-relaxed max-w-md'>
						We believe great software comes from strong collaboration, clear
						communication, and a shared commitment to your success.
					</p>
					<Link
						href='/aboutus'
						className='group inline-flex items-center gap-2 mt-8 text-base font-semibold text-primary'>
						About Qbitlog
						<ArrowRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
					</Link>
				</motion.div>

				{/* ========== COLUMN 2 — Features ========== */}
				<div className='flex flex-col gap-7'>
					{features.map((feature) => {
						const Icon = feature.icon;
						return (
							<motion.div
								key={feature.title}
								variants={itemVariants}
								className='flex items-start gap-4'>
								<motion.div
									whileHover={{ scale: 1.05 }}
									transition={{ type: "spring", stiffness: 400 }}
									className='shrink-0 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center'>
									<Icon className='w-6 h-6 text-primary' />
								</motion.div>
								<div>
									<h3 className='text-lg md:text-xl font-bold text-foreground mb-1.5'>
										{feature.title}
									</h3>
									<p className='text-sm md:text-base text-muted-foreground leading-relaxed'>
										{feature.description}
									</p>
								</div>
							</motion.div>
						);
					})}
				</div>

				{/* ========== COLUMN 3 — Image ========== */}
				<motion.div
					variants={itemVariants}
					className='relative rounded-3xl overflow-hidden aspect-[3/4] w-full shadow-xl'>
					<Image
						src={image.url}
						alt={image.alt}
						fill
						className='object-cover'
						quality={90}
						sizes='(max-width: 1024px) 100vw, 33vw'
					/>
					<div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent' />

				</motion.div>
			</div>
		</motion.div>
	);
}
