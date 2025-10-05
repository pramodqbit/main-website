"use client";

import React, {
	ComponentPropsWithoutRef,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { AnimatePresence, motion, MotionProps } from "motion/react";

import { cn } from "@/lib/utils";

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
	const animations: MotionProps = {
		initial: { scale: 0, opacity: 0 },
		animate: { scale: 1, opacity: 1, originY: 0 },
		whileInView: { scale: 1, opacity: 1, originY: 0 },
		exit: { scale: 0, opacity: 0 },
		transition: { type: "spring", stiffness: 350, damping: 40 },
	};

	return (
		<motion.div {...animations} layout className='mx-auto w-full'>
			{children}
		</motion.div>
	);
}

export interface AnimatedListProps extends ComponentPropsWithoutRef<"div"> {
	children: React.ReactNode;
	delay?: number;
}

export const AnimatedList = React.memo(
	({ children, className, delay = 1000, ...props }: AnimatedListProps) => {
		const [index, setIndex] = useState(0);
		const [isInView, setIsInView] = useState(false);
		const containerRef = useRef<HTMLDivElement>(null);

		const childrenArray = useMemo(
			() => React.Children.toArray(children),
			[children],
		);

		// Intersection Observer to detect when component is in viewport
		useEffect(() => {
			const currentRef = containerRef.current;
			const observer = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) {
						setIsInView(true);
					}
				},
				{
					threshold: 0.1, // Trigger when 10% of the component is visible
				},
			);

			if (currentRef) {
				observer.observe(currentRef);
			}

			return () => {
				if (currentRef) {
					observer.unobserve(currentRef);
				}
			};
		}, []);

		// Only start animation when in viewport
		useEffect(() => {
			if (isInView && index < childrenArray.length - 1) {
				const timeout = setTimeout(() => {
					setIndex((prevIndex) => (prevIndex + 1) % childrenArray.length);
				}, delay);

				return () => clearTimeout(timeout);
			}
		}, [index, delay, childrenArray.length, isInView]);

		const itemsToShow = useMemo(() => {
			const result = childrenArray.slice(0, index + 1).reverse();
			return result;
		}, [index, childrenArray]);

		return (
			<div
				ref={containerRef}
				className={cn(`flex flex-col items-center gap-4`, className)}
				{...props}>
				<AnimatePresence mode='wait'>
					{itemsToShow.map((item) => (
						<AnimatedListItem key={(item as React.ReactElement).key}>
							{item}
						</AnimatedListItem>
					))}
				</AnimatePresence>
			</div>
		);
	},
);

AnimatedList.displayName = "AnimatedList";
