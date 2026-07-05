"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Eye, Target, Rocket, Globe, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

const storyData = [
	{
		label: "Our Vision",
		title: "Expertise-Driven Excellence",
		description:
			"To be a global digital partner known for technical excellence, innovation, and unwavering commitment to client success.",
		icon: <Eye className='w-6 h-6' />,
		highlight: "Expert Team",
	},
	{
		label: "Our Mission",
		title: "Client Success Through Innovation",
		description:
			"To deliver cutting-edge digital solutions that solve real business challenges and create measurable impact.",
		icon: <Target className='w-6 h-6' />,
		highlight: "Excellence",
	},
	{
		label: "Our Approach",
		title: "Agile & Scalable Solutions",
		description:
			"We combine agile methodologies, modern technologies, and industry best practices to build scalable, future-ready products.",
		icon: <Rocket className='w-6 h-6' />,
		highlight: "Proven Methods",
	},

];

export default function CompanyStory() {
	return (
		<div className='flex flex-wrap justify-center gap-6'>
			{storyData.map((item, index) => (
				<motion.div
					key={index}
					className='group w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]'
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{
						duration: 0.5,
						delay: index * 0.1,
						ease: [0.21, 0.47, 0.32, 0.98],
					}}
					whileHover={{ y: -6 }}>
					<Card className='h-full border-border/50 shadow-sm hover:shadow-xl transition-shadow duration-300'>
						<CardContent className='flex h-full flex-col p-6 md:p-7'>
							{/* Icon badge */}
							<div className='w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6'>
								{item.icon}
							</div>

							{/* Label */}
							<span className='text-sm font-semibold text-primary'>
								{item.label}
							</span>

							{/* Title */}
							<h3 className='mt-1 text-lg md:text-xl font-bold text-foreground'>
								{item.title}
							</h3>

							{/* Description */}
							<p className='mt-4 text-sm text-muted-foreground leading-relaxed'>
								{item.description}
							</p>

							{/* Highlight pill */}
							<div className='mt-6'>
								<span className='inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full'>
									{item.highlight}
								</span>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			))}
		</div>
	);
}
