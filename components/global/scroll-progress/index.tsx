"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";

export default function ScrollProgress() {
	const [isMounted, setIsMounted] = useState(false);
	const { scrollYProgress } = useScroll();
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<>
			{/* Top scroll progress bar */}
			<motion.div
				className='fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary z-50 origin-left'
				style={{ scaleX }}
			/>

			{/* Scroll to top button */}
			<motion.button
				className='fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg flex items-center justify-center z-50 hover:shadow-xl transition-shadow'
				initial={{ opacity: 0, scale: 0 }}
				animate={{
					opacity: scrollYProgress.get() > 0.1 ? 1 : 0,
					scale: scrollYProgress.get() > 0.1 ? 1 : 0,
				}}
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.9 }}
				onClick={() => {
					window.scrollTo({ top: 0, behavior: "smooth" });
				}}
				aria-label='Scroll to top'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					strokeWidth={2}
					stroke='currentColor'
					className='w-6 h-6'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M4.5 15.75l7.5-7.5 7.5 7.5'
					/>
				</svg>
			</motion.button>
		</>
	);
}

