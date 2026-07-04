"use client";

import { motion } from "motion/react";
import { Code2 } from "lucide-react";
import type { TechItem } from "../_data/types";

export function TechStack({ technologies }: { technologies?: TechItem[] }) {
	if (!technologies || technologies.length === 0) return null;

	return (
		<div className='h-full rounded-2xl border border-border/60 bg-white p-6 shadow-sm md:p-8'>
			<h2 className='text-lg font-bold text-foreground md:text-xl'>
				Tech Stack
			</h2>
			<div className='mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3'>
				{technologies.map((tech, i) => (
					<motion.div
						key={tech.name}
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.2 }}
						transition={{ duration: 0.3, delay: i * 0.04 }}
						className='flex items-center gap-3 rounded-xl border border-border/60 bg-white px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md hover:shadow-primary/10'>
						{tech.icon ? (
							/* eslint-disable-next-line @next/next/no-img-element */
							<img
								src={tech.icon}
								alt=''
								aria-hidden='true'
								className='h-6 w-6 flex-shrink-0 object-contain'
							/>
						) : (
							<Code2 className='h-6 w-6 flex-shrink-0 text-muted-foreground' />
						)}
						<span className='min-w-0 text-sm font-medium leading-tight text-foreground'>
							{tech.name}
						</span>
					</motion.div>
				))}
			</div>
		</div>
	);
}

export default TechStack;
