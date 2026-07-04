"use client";

import { motion } from "motion/react";
import posts from "../_data/posts.json";
import { BlogCard } from "../_components/BlogCard";

export default function BlogList() {
	return (
		<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
			{posts.slice(0, 3).map((post, index) => (
				<motion.div
					key={post.slug}
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{
						duration: 0.5,
						delay: index * 0.15,
						ease: "easeOut",
					}}
					className='h-full'>
					<BlogCard post={post} />
				</motion.div>
			))}
		</div>
	);
}
