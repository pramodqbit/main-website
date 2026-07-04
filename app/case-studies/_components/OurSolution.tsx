"use client";

import { motion } from "motion/react";
import { getIcon } from "./icon-map";
import type { CaseStudyFeature } from "../_data/types";

const TILES = [
	"bg-violet-100 text-violet-600",
	"bg-green-100 text-green-600",
	"bg-orange-100 text-orange-500",
	"bg-blue-100 text-blue-600",
	"bg-violet-100 text-violet-600",
	"bg-green-100 text-green-600",
];

export function OurSolution({
	intro,
	features,
}: {
	intro?: string;
	features?: CaseStudyFeature[];
}) {
	if (!intro && (!features || features.length === 0)) return null;

	// Single balanced row for up to 5 features (as in the design);
	// longer lists fall back to a tidy 3-column grid.
	const count = features?.length ?? 0;
	const lgCols =
		count === 4 ? "lg:grid-cols-4" : count === 5 ? "lg:grid-cols-5" : "lg:grid-cols-3";

	return (
		<section className='rounded-2xl border border-border/60 bg-white p-6 shadow-sm md:p-8'>
			<h2 className='text-lg font-bold text-foreground md:text-xl'>
				Our Solution
			</h2>
			{intro && (
				<p className='mt-3 max-w-5xl text-sm leading-relaxed text-muted-foreground'>
					{intro}
				</p>
			)}

			{features && features.length > 0 && (
				<div
					className={`mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 ${lgCols}`}>
					{features.map((f, i) => {
						const Icon = getIcon(f.icon);
						return (
							<motion.div
								key={f.title}
								initial={{ opacity: 0, y: 16 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.2 }}
								transition={{ duration: 0.4, delay: i * 0.06 }}
								className='flex items-start gap-3'>
								<div
									className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${TILES[i % TILES.length]}`}>
									<Icon className='h-5 w-5' />
								</div>
								<div className='min-w-0'>
									<p className='text-sm font-bold text-foreground'>{f.title}</p>
									<p className='mt-1 text-xs leading-relaxed text-muted-foreground'>
										{f.description}
									</p>
								</div>
							</motion.div>
						);
					})}
				</div>
			)}
		</section>
	);
}

export default OurSolution;
