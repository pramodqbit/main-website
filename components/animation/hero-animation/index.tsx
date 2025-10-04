"use client";
import { motion } from "motion/react";

export function Span({
	children,
	className,
	delay = 0,
}: {
	children: React.ReactNode;
	className?: string;
	delay?: number;
}) {
	return (
		<motion.span
			className={className}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.8, ease: "easeOut", delay }}>
			{children}
		</motion.span>
	);
}
