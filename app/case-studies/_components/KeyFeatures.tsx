"use client";

import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

export function KeyFeatures({
	features,
	title = "Key Features",
}: {
	features?: string[];
	title?: string;
}) {
	if (!features || features.length === 0) return null;

	return (
		<div className='h-full rounded-2xl border border-border/60 bg-white p-6 shadow-sm md:p-8'>
			<h2 className='text-lg font-bold text-foreground md:text-xl'>{title}</h2>
			<ul className='mt-5 space-y-3.5'>
				{features.map((f, i) => (
					<motion.li
						key={f}
						initial={{ opacity: 0, x: -12 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, amount: 0.2 }}
						transition={{ duration: 0.4, delay: i * 0.05 }}
						className='flex items-start gap-2.5'>
						<CheckCircle2 className='mt-0.5 h-[18px] w-[18px] flex-shrink-0 text-green-500' />
						<span className='text-sm text-muted-foreground'>{f}</span>
					</motion.li>
				))}
			</ul>
		</div>
	);
}

export default KeyFeatures;
