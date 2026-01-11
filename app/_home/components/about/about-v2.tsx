"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Rocket, Shield, Users } from "lucide-react";

// Images
const images = {
	main: {
		url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
		alt: "Professional development team collaborating on web development project",
	},
	secondary: {
		url: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
		alt: "Software development workspace showcasing modern technologies",
	},
};

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

export default function AboutV2() {
	return (
		<motion.div
			variants={containerVariants}
			initial='hidden'
			whileInView='visible'
			viewport={{ once: true, amount: 0.2 }}
			className='w-full'>
			{/* Main 3-Column Grid */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5'>
				{/* ========== COLUMN 1 ========== */}
				<div className='flex flex-col gap-4 md:gap-5 relative'>
					{/* Image Card */}
					<motion.div
						variants={itemVariants}
						className='relative rounded-2xl overflow-hidden aspect-[4/3]'>
						<Image
							src={images.main.url}
							alt={images.main.alt}
							fill
							className='object-cover'
							quality={90}
						/>
						<div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent' />
						<div className='absolute bottom-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/95 dark:bg-background/95 backdrop-blur-sm shadow-md'>
							<div className='w-6 h-6 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center'>
								<span className='text-white font-bold text-xs'>Q</span>
							</div>
							<span className='font-semibold text-sm text-foreground'>
								QBITLOG
							</span>
						</div>
					</motion.div>

					{/* Feature Card - Client Focus */}
					<motion.div
						variants={itemVariants}
						className='flex-1 bg-muted/50 dark:bg-muted/30 rounded-2xl p-5 md:p-6 border border-border/30'>
						<motion.div
							whileHover={{ scale: 1.05 }}
							transition={{ type: "spring", stiffness: 400 }}
							className='w-12 h-12 md:w-14 md:h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-5'>
							<Users className='w-6 h-6 md:w-7 md:h-7 text-secondary' />
						</motion.div>
						<h3 className='text-lg md:text-xl font-bold text-foreground mb-2'>
							Client-Focused Approach
						</h3>
						<p className='text-sm md:text-base text-muted-foreground leading-relaxed'>
							Your success is our priority. We work closely with you to
							understand your goals and deliver tailored solutions.
						</p>
					</motion.div>
				</div>

				{/* ========== COLUMN 2 ========== */}
				<div className='flex flex-col gap-4 md:gap-5'>
					{/* Feature Card - Innovation */}
					<motion.div
						variants={itemVariants}
						className='flex-1 bg-muted/50 dark:bg-muted/30 rounded-2xl p-5 md:p-6 border border-border/30 relative pb-32'>
						<motion.div
							whileHover={{ scale: 1.05 }}
							transition={{ type: "spring", stiffness: 400 }}
							className='w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5'>
							<Rocket className='w-6 h-6 md:w-7 md:h-7 text-primary' />
						</motion.div>
						<h3 className='text-lg md:text-xl font-bold text-foreground mb-2'>
							Innovation-Driven Solutions
						</h3>
						<p className='text-sm md:text-base text-muted-foreground leading-relaxed'>
							We leverage cutting-edge technologies to build scalable,
							future-proof applications that drive your business forward.
						</p>

						{/* Stats Card - Overlapping */}
						<motion.div
							variants={itemVariants}
							className=' dark:bg-card rounded-2xl p-5 md:p-6   absolute bottom-4 left-4 right-4'>
							<motion.span
								initial={{ opacity: 0, scale: 0.5 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ delay: 0.3, duration: 0.5 }}
								className='block text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1'>
								150+
							</motion.span>
							<span className='text-sm md:text-base text-muted-foreground'>
								Projects Delivered
							</span>
						</motion.div>
					</motion.div>
				</div>

				{/* ========== COLUMN 3 ========== */}
				<div className='flex flex-col gap-4 md:gap-5'>
					{/* Feature Card - Trust */}
					<motion.div
						variants={itemVariants}
						className='flex-1 bg-muted/50 dark:bg-muted/30 rounded-2xl p-5 md:p-6 border border-border/30'>
						<motion.div
							whileHover={{ scale: 1.05 }}
							transition={{ type: "spring", stiffness: 400 }}
							className='w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5'>
							<Shield className='w-6 h-6 md:w-7 md:h-7 text-primary' />
						</motion.div>
						<h3 className='text-lg md:text-xl font-bold text-foreground mb-2'>
							Transparent & Trusted
						</h3>
						<p className='text-sm md:text-base text-muted-foreground leading-relaxed'>
							Every project is handled with clear communication, honest
							timelines, and real progress updates you can count on.
						</p>
					</motion.div>

					{/* Image Card */}
					<motion.div
						variants={itemVariants}
						className='relative rounded-2xl overflow-hidden aspect-[4/3]'>
						<Image
							src={images.secondary.url}
							alt={images.secondary.alt}
							fill
							className='object-cover'
							quality={90}
						/>
						<div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent' />
						{/* Stats Badge */}
						<div className='absolute bottom-3 left-3 right-3 flex items-center justify-between px-4 py-3 rounded-xl '>
							<div>
								<span className='block text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
									50+
								</span>
								<span className='text-xs md:text-sm text-white'>
									Happy Clients
								</span>
							</div>
							<div className='w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center'>
								<span className='text-white font-bold text-lg'>Q</span>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</motion.div>
	);
}
