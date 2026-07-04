"use client";

import { motion } from "motion/react";
import { getIcon } from "./icon-map";
import type { CaseStudyFeature } from "../_data/types";

export function FeatureGrid({ features }: { features?: CaseStudyFeature[] }) {
	if (!features || features.length === 0) return null;

	return (
		<div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
			{features.map((f, i) => {
				const Icon = getIcon(f.icon);
				return (
					<motion.div
						key={f.title}
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.2 }}
						transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
						className='group flex items-start gap-4 rounded-2xl border border-border/60 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10'>
						<div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary transition-colors group-hover:from-primary group-hover:to-primary group-hover:text-white'>
							<Icon className='h-6 w-6' />
						</div>
						<div className='min-w-0'>
							<h4 className='mb-2 text-lg font-semibold text-foreground'>
								{f.title}
							</h4>
							<p className='text-sm leading-relaxed text-muted-foreground'>
								{f.description}
							</p>
						</div>
					</motion.div>
				);
			})}
		</div>
	);
}

export default FeatureGrid;
