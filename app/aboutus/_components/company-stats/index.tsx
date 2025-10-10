"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Code, Globe, Award, Clock, TrendingUp } from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useState } from "react";

const statsData = [
	{
		number: "100+",
		label: "Technologies Mastered",
		description: "Expert proficiency across modern frameworks, languages, and platforms",
		icon: <Code className="w-8 h-8" />,
		color: "text-blue-500"
	},
	{
		number: "50+",
		label: "Combined Years Experience",
		description: "Decades of collective expertise from industry-leading professionals",
		icon: <Award className="w-8 h-8" />,
		color: "text-yellow-500"
	},
	{
		number: "Global",
		label: "Industry Standards",
		description: "Following international best practices and enterprise-grade methodologies",
		icon: <Globe className="w-8 h-8" />,
		color: "text-purple-500"
	},
	{
		number: "8",
		label: "C-Level Experts",
		description: "Leadership team with proven track records from Fortune 500 companies",
		icon: <Users className="w-8 h-8" />,
		color: "text-green-500"
	},
	{
		number: "100%",
		label: "Quality Commitment",
		description: "Enterprise-grade code quality, security, and performance optimization",
		icon: <TrendingUp className="w-8 h-8" />,
		color: "text-red-500"
	},
	{
		number: "24/7",
		label: "Dedicated Support",
		description: "Round-the-clock expert assistance and rapid response times",
		icon: <Clock className="w-8 h-8" />,
		color: "text-orange-500"
	}
];

function AnimatedStat({ stat, index }: { stat: typeof statsData[0]; index: number }) {
	const [inView, setInView] = useState(false);

	return (
		<motion.div
			className='group'
			initial={{ opacity: 0, scale: 0.8 }}
			whileInView={{ opacity: 1, scale: 1 }}
			viewport={{ once: true, amount: 0.3 }}
			onViewportEnter={() => setInView(true)}
			transition={{
				duration: 0.5,
				delay: index * 0.1,
				type: "spring",
				stiffness: 100,
				damping: 15,
			}}
			whileHover={{ y: -10, scale: 1.05 }}>
			<Card className='h-full shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden relative'>
				<CardContent className='p-6 relative'>
					{/* Animated corner accent */}
					<motion.div
						className='absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent'
						initial={{ scale: 0, opacity: 0 }}
						animate={inView ? { scale: 1, opacity: 1 } : {}}
						transition={{ delay: index * 0.1 + 0.3 }}
					/>

					<div className='flex flex-col items-center text-center space-y-4 relative z-10'>
						{/* Icon */}
						<motion.div
							className={`p-4 rounded-full bg-gray-100 dark:bg-gray-800 ${stat.color}`}
							initial={{ scale: 0, rotate: -180 }}
							animate={inView ? { scale: 1, rotate: 0 } : {}}
							transition={{
								delay: index * 0.1 + 0.2,
								type: "spring",
								stiffness: 200,
								damping: 15,
							}}
							whileHover={{ scale: 1.2, rotate: 360 }}
							>
							{stat.icon}
						</motion.div>

						{/* Number with counting animation */}
						<motion.div
							className='text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'
							initial={{ opacity: 0, scale: 0.5 }}
							animate={inView ? { opacity: 1, scale: 1 } : {}}
							transition={{
								delay: index * 0.1 + 0.3,
								type: "spring",
								stiffness: 100,
							}}>
							{stat.number}
						</motion.div>

						{/* Label */}
						<motion.h3
							className='text-lg font-semibold text-foreground group-hover:text-primary transition-colors'
							initial={{ opacity: 0, y: 20 }}
							animate={inView ? { opacity: 1, y: 0 } : {}}
							transition={{ delay: index * 0.1 + 0.4 }}>
							{stat.label}
						</motion.h3>

						{/* Description */}
						<motion.p
							className='text-sm text-muted-foreground leading-relaxed'
							initial={{ opacity: 0 }}
							animate={inView ? { opacity: 1 } : {}}
							transition={{ delay: index * 0.1 + 0.5 }}>
							{stat.description}
						</motion.p>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}

export default function CompanyStats() {
	return (
		<div className='space-y-8'>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{statsData.map((stat, index) => (
					<AnimatedStat key={index} stat={stat} index={index} />
				))}
			</div>
		</div>
	);
}
