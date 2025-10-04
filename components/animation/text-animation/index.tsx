"use client";
import { motion } from "motion/react";

export function TextFadeIn({
	children,
	delay = 0,
	className,
}: {
	children: React.ReactNode;
	delay?: number;
	className?: string;
}) {
	return (
		<motion.p
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.8, ease: "easeOut", delay }}
			className={className}>
			{children}
		</motion.p>
	);
}
