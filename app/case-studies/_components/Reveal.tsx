"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/** Fade-up wrapper that animates once when scrolled into view. */
export function Reveal({
	children,
	delay = 0,
	className,
	as = "div",
}: {
	children: React.ReactNode;
	delay?: number;
	className?: string;
	as?: "div" | "section" | "li" | "span";
}) {
	const MotionTag = motion[as] as React.ElementType;
	return (
		<MotionTag
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.2 }}
			transition={{ duration: 0.6, ease: "easeOut", delay }}
			className={cn(className)}>
			{children}
		</MotionTag>
	);
}

export default Reveal;
