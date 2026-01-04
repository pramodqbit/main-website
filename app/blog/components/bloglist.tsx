"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import posts from "../_data/posts.json";

export default function BlogList() {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
			{posts.slice(0, 3).map((post, index) => (
				<motion.div
					key={post.slug}
					initial={{ opacity: 0, y: 60 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{
						duration: 0.5,
						delay: index * 0.35,
						ease: "easeOut",
					}}>
					<Link href={`/blog/${post.slug}`} className='group'>
						<Card className='h-full bg-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/20 p-0'>
							<motion.div
								className='relative h-[200px] w-full overflow-hidden'
								initial={{ opacity: 0, scale: 1.1 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ amount: 0.5 }}
								transition={{
									duration: 0.6,
									delay: index * 0.35 + 0.1,
									ease: "easeIn",
								}}>
								<Image
									src={post.heroImage}
									alt={post.title}
									fill
									className='object-cover'
									priority={false}
								/>
							</motion.div>
							<CardContent className='p-0 px-4 pb-5'>
								<motion.div
									className='flex items-center gap-3 mb-3'
									initial={{ opacity: 0, x: -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ amount: 0.5 }}
									transition={{
										duration: 0.4,
										delay: index * 0.35 + 0.2,
										ease: "easeIn",
									}}>
									<Image
										src={post.iconImage}
										alt={`${post.title} icon`}
										width={28}
										height={28}
										className='w-7 h-7 object-contain rounded'
									/>
									<p className='text-xs text-muted-foreground'>
										{new Date(post.date).toLocaleDateString()}
									</p>
								</motion.div>
								<motion.h3
									className='text-lg font-semibold leading-snug mb-2'
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ amount: 0.5 }}
									transition={{
										duration: 0.4,
										delay: index * 0.35 + 0.25,
										ease: "easeIn",
									}}>
									{post.title}
								</motion.h3>
								<motion.p
									className='text-sm text-muted-foreground line-clamp-3'
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ amount: 0.5 }}
									transition={{
										duration: 0.4,
										delay: index * 0.35 + 0.3,
										ease: "easeIn",
									}}>
									{post.excerpt}
								</motion.p>
								<motion.div
									className='mt-3 flex flex-wrap gap-2'
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ amount: 0.5 }}
									transition={{
										duration: 0.4,
										delay: index * 0.35 + 0.35,
										ease: "easeIn",
									}}>
									{post.tags.slice(0, 3).map((tag) => (
										<span
											key={tag}
											className='text-xs px-2 py-1 rounded-full border'>
											# {tag}
										</span>
									))}
								</motion.div>
							</CardContent>
						</Card>
					</Link>
				</motion.div>
			))}
		</div>
	);
}
