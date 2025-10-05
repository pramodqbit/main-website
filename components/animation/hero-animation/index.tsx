"use client";
import { motion } from "motion/react";

export function Span({
	children,
	className,
	delay = 0,
	as = "p",
}: {
	children: React.ReactNode;
	className?: string;
	delay?: number;
	as?: keyof typeof motion;
}) {
	const Component = motion[as as keyof typeof motion] as React.ElementType;
	return (
		<Component
			className={className}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.8, ease: "easeOut", delay }}>
			{children}
		</Component>
	);
}
