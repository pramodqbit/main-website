"use client";

import { motion } from "motion/react";
import { Briefcase, HeartHandshake, Sparkles, Users2 } from "lucide-react";

const stats = [
	{
		icon: Briefcase,
		value: "20+",
		label: "Projects Delivered",
	},
	{
		icon: HeartHandshake,
		value: "98%",
		label: "Client Satisfaction",
	},
	{
		icon: Sparkles,
		value: "5+",
		label: "Years of Experience",
	},
	{
		icon: Users2,
		value: "20+",
		label: "Expert Professionals",
	},
];

export default function StatsBar() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
			className='rounded-3xl bg-muted/40 dark:bg-muted/20 border border-border/40 shadow-sm'>
			<div className='grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border/40'>
				{stats.map((stat) => {
					const Icon = stat.icon;
					return (
						<div
							key={stat.label}
							className='flex items-center gap-4 px-6 py-8 md:px-8'>
							<div className='shrink-0 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center'>
								<Icon className='w-6 h-6 text-primary' />
							</div>
							<div>
								<span className='block text-3xl md:text-4xl font-extrabold text-primary leading-none'>
									{stat.value}
								</span>
								<span className='mt-1.5 block text-sm md:text-base text-muted-foreground'>
									{stat.label}
								</span>
							</div>
						</div>
					);
				})}
			</div>
		</motion.div>
	);
}
