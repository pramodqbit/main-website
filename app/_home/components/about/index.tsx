"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion } from "motion/react";

const about_data = [
	{
		url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
		alt: "Professional development team collaborating on web development project with modern laptops and multiple monitors",
	},
	{
		url: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
		alt: "Software development workspace with code on screen, showcasing modern web development technologies and programming",
	},
	{
		url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80",
		alt: "Business analytics dashboard and data visualization representing our IT consulting and digital transformation services",
	},
];

export default function About() {
	return (
		<div className='flex lg:flex-row  gap-1 lg:gap-4 items-center justify-center '>
			{about_data.map((item, index) => (
				<motion.div
					key={index}
					initial={{ opacity: 0, y: 50, scale: 0.9 }}
					whileInView={{ opacity: 1, y: 0, scale: 1 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{
						duration: 0.6,
						delay: index * 0.2,
						ease: [0.21, 0.47, 0.32, 0.98],
					}}>
					<Card
						className={cn(
							"p-0 overflow-hidden group",
							"rounded-sm md:rounded-md",
							"hover:shadow-2xl transition-shadow duration-300",
						)}>
						<CardContent className='p-0 relative'>
							<motion.div
								whileHover={{ scale: 1.05 }}
								transition={{ duration: 0.4, ease: "easeOut" }}>
								<Image
									src={item.url}
									alt={item.alt}
									className={cn(
										"object-cover transition-all duration-500",
										" w-[100px] sm:w-[150px] md:w-[220px] lg:w-[370px]",
										" h-[100px] sm:h-[150px] md:h-[220px] lg:h-[370px]",
									)}
									width={370}
									height={370}
									loading='lazy'
									quality={100}
								/>
							</motion.div>
							{/* Gradient overlay on hover */}
							<div className='absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
						</CardContent>
					</Card>
				</motion.div>
			))}
		</div>
	);
}
