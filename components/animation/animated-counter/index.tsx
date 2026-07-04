"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Counts up to a numeric target when scrolled into view.
 * Accepts plain numbers or strings with a prefix/suffix around the number,
 * e.g. "50%", "3X", "99.9%", "253K+", "3-5s", "$1.2M". The numeric part is
 * animated; any prefix/suffix is preserved. Values with no number render as-is.
 */
export function AnimatedCounter({
	value,
	suffix = "",
	duration = 2,
	className,
}: {
	value: string | number;
	suffix?: string;
	duration?: number;
	className?: string;
}) {
	const ref = useRef<HTMLSpanElement>(null);
	const isInView = useInView(ref, { once: true });

	const raw = String(value);
	const match = raw.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);

	const hasNumber = !!match;
	const prefix = match ? match[1] : "";
	const target = match ? parseFloat(match[2]) : 0;
	const decimals = match && match[2].includes(".") ? match[2].split(".")[1].length : 0;
	const tail = (match ? match[3] : raw) + suffix;

	const [count, setCount] = useState(0);

	// Depend only on stable primitives — `match` is a fresh object each render,
	// so including it here would restart the animation on every frame (flicker).
	useEffect(() => {
		if (!hasNumber || !isInView) return;
		let startTime: number;
		let frame: number;

		const animate = (timestamp: number) => {
			if (!startTime) startTime = timestamp;
			const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
			const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
			setCount(eased * target);
			if (progress < 1) frame = requestAnimationFrame(animate);
		};

		frame = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(frame);
	}, [isInView, target, duration, hasNumber]);

	// No number to animate — render the original string untouched.
	if (!hasNumber) {
		return (
			<span ref={ref} className={className}>
				{raw}
			</span>
		);
	}

	return (
		<span ref={ref} className={`tabular-nums ${className ?? ""}`}>
			{prefix}
			{count.toFixed(decimals)}
			{tail}
		</span>
	);
}

export default AnimatedCounter;
