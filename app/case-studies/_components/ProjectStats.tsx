"use client";

import { motion } from "motion/react";
import { AnimatedCounter } from "@/components/animation/animated-counter";
import { getIcon } from "./icon-map";
import type { CaseStudyMetric } from "../_data/types";

/** Icon tile colors cycle through the design's palette. */
const TILES = [
	"bg-violet-100 text-violet-600",
	"bg-green-100 text-green-600",
	"bg-blue-100 text-blue-600",
	"bg-orange-100 text-orange-500",
];

export function ProjectStats({ metrics }: { metrics?: CaseStudyMetric[] }) {
	if (!metrics || metrics.length === 0) return null;

	return (
		<section className='rounded-2xl border border-border/60 bg-white px-6 py-7 shadow-sm md:px-10'>
			<div className='grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4'>
				{metrics.map((m, i) => {
					const Icon = getIcon(m.icon);
					return (
						<motion.div
							key={m.label}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.3 }}
							transition={{ duration: 0.5, delay: i * 0.1 }}
							className='flex items-center gap-4'>
							<div
								className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${TILES[i % TILES.length]}`}>
								<Icon className='h-5 w-5' />
							</div>
							<div className='min-w-0'>
								<div className='text-2xl font-bold leading-none text-foreground md:text-[28px]'>
									<AnimatedCounter value={m.value} />
								</div>
								<p className='mt-1.5 text-xs leading-snug text-muted-foreground md:text-sm'>
									{m.label}
								</p>
							</div>
						</motion.div>
					);
				})}
			</div>
		</section>
	);
}

export default ProjectStats;
