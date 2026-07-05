"use client";

import { Heart, Shield, Lightbulb, Users, Target, Zap } from "lucide-react";
import { motion } from "motion/react";

const valuesData = [
	{
		title: "Client-Centric Approach",
		description: "Our clients' success is our success. We listen, we care, and we deliver.",
		icon: <Heart className='w-8 h-8' />,
		iconClass: "text-rose-500 bg-rose-100 dark:bg-rose-500/15",
	},
	{
		title: "Quality & Reliability",
		description: "We follow the highest standards to deliver products you can trust.",
		icon: <Shield className='w-8 h-8' />,
		iconClass: "text-indigo-500 bg-indigo-100 dark:bg-indigo-500/15",
	},
	{
		title: "Innovation & Creativity",
		description: "We embrace new ideas and technologies to solve complex problems.",
		icon: <Lightbulb className='w-8 h-8' />,
		iconClass: "text-amber-500 bg-amber-100 dark:bg-amber-500/15",
	},
	{
		title: "Collaboration & Teamwork",
		description: "Great results come from great teamwork and open communication.",
		icon: <Users className='w-8 h-8' />,
		iconClass: "text-emerald-500 bg-emerald-100 dark:bg-emerald-500/15",
	},
	{
		title: "Transparency & Integrity",
		description: "Honesty and transparency are the foundation of every relationship.",
		icon: <Target className='w-8 h-8' />,
		iconClass: "text-purple-500 bg-purple-100 dark:bg-purple-500/15",
	},
	{
		title: "Continuous Learning",
		description: "We learn, adapt, and evolve to stay ahead in a fast-changing world.",
		icon: <Zap className='w-8 h-8' />,
		iconClass: "text-orange-500 bg-orange-100 dark:bg-orange-500/15",
	},
];

export default function OurValues() {
	return (
		<div className='flex flex-wrap lg:flex-nowrap justify-center gap-y-10'>
			{valuesData.map((value, index) => (
				<motion.div
					key={index}
					className='relative flex w-1/2 sm:w-1/3 lg:flex-1 flex-col items-center px-4 text-center'
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{
						duration: 0.5,
						delay: index * 0.1,
						ease: [0.21, 0.47, 0.32, 0.98],
					}}>
					{/* Dashed connector to the previous icon (desktop single-row only) */}
					{index > 0 && (
						<span className='hidden lg:block absolute top-10 -left-1/2 w-full border-t border-dashed border-border z-0'>
							<span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/50' />
						</span>
					)}

					{/* Icon badge */}
					<div
						className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center ${value.iconClass}`}>
						{value.icon}
					</div>

					{/* Title */}
					<h3 className='mt-5 text-base md:text-lg font-bold text-foreground'>
						{value.title}
					</h3>

					{/* Description */}
					<p className='mt-3 text-sm text-muted-foreground leading-relaxed max-w-[220px]'>
						{value.description}
					</p>
				</motion.div>
			))}
		</div>
	);
}
