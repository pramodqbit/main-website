"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Lightbulb, Users, Target, Zap } from "lucide-react";
import { motion } from "motion/react";

const valuesData = [
	{
		title: "Client-Centric Approach",
		description: "We put our clients at the heart of everything we do. Their success is our success, and we're committed to understanding their unique needs and challenges.",
		icon: <Heart className="w-8 h-8" />,
		color: "text-red-500"
	},
	{
		title: "Quality & Reliability",
		description: "We maintain the highest standards of quality in every project. Our commitment to excellence ensures reliable, scalable, and maintainable solutions.",
		icon: <Shield className="w-8 h-8" />,
		color: "text-blue-500"
	},
	{
		title: "Innovation & Creativity",
		description: "We embrace new technologies and creative solutions. Our team constantly explores innovative approaches to solve complex problems.",
		icon: <Lightbulb className="w-8 h-8" />,
		color: "text-yellow-500"
	},
	{
		title: "Collaboration & Teamwork",
		description: "We believe in the power of collaboration. Our diverse team works together seamlessly to deliver exceptional results for our clients.",
		icon: <Users className="w-8 h-8" />,
		color: "text-green-500"
	},
	{
		title: "Transparency & Integrity",
		description: "We maintain complete transparency in our processes and communications. Honesty and integrity form the foundation of all our relationships.",
		icon: <Target className="w-8 h-8" />,
		color: "text-purple-500"
	},
	{
		title: "Continuous Learning",
		description: "We're passionate about learning and growing. Our team continuously updates their skills to stay ahead of technological advancements.",
		icon: <Zap className="w-8 h-8" />,
		color: "text-orange-500"
	}
];

export default function OurValues() {
	return (
		<div className='space-y-8'>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{valuesData.map((value, index) => (
					<motion.div
						key={index}
						className='group'
						initial={{ opacity: 0, y: 50, rotateY: -15 }}
						whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{
							duration: 0.6,
							delay: index * 0.1,
							ease: [0.21, 0.47, 0.32, 0.98],
						}}
						whileHover={{ y: -10, scale: 1.02 }}>
						<Card className='h-full shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden'>
							<CardContent className='p-6 relative'>
								{/* Animated background gradient on hover */}
								<motion.div
									className='absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100'
									transition={{ duration: 0.3 }}
								/>

								<div className='flex flex-col items-center text-center space-y-4 relative z-10'>
									{/* Icon */}
									<motion.div
										className={`p-4 rounded-full bg-gray-100 dark:bg-gray-800 ${value.color}`}
										initial={{ scale: 0, rotate: -180 }}
										whileInView={{ scale: 1, rotate: 0 }}
										viewport={{ once: true }}
										transition={{
											delay: index * 0.1 + 0.2,
											type: "spring",
											stiffness: 200,
											damping: 15,
										}}
										whileHover={{ scale: 1.2, rotate: 360 }}
										>
										{value.icon}
									</motion.div>

									{/* Title */}
									<motion.h3
										className='text-xl font-semibold text-foreground group-hover:text-primary transition-colors'
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ delay: index * 0.1 + 0.3 }}>
										{value.title}
									</motion.h3>

									{/* Description */}
									<motion.p
										className='text-sm text-muted-foreground leading-relaxed'
										initial={{ opacity: 0 }}
										whileInView={{ opacity: 1 }}
										viewport={{ once: true }}
										transition={{ delay: index * 0.1 + 0.4 }}>
										{value.description}
									</motion.p>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				))}
			</div>
		</div>
	);
}
