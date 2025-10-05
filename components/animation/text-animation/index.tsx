"use client";
import { motion } from "motion/react";
import React from "react";

export function TextFadeIn({
	children,
	delay = 0,
	className,
	as = "p",
	once = true,
}: {
	children: React.ReactNode;
	delay?: number;
	className?: string;
	as?: keyof typeof motion;
	once?: boolean;
}) {
	const MotionComponent = motion[
		as as keyof typeof motion
	] as React.ElementType;

	return (
		<MotionComponent
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			viewport={{ once, amount: 0.3 }}
			transition={{ duration: 0.8, ease: "easeOut", delay }}
			className={className}>
			{children}
		</MotionComponent>
	);
}
