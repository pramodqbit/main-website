"use client";
import { useRef, useState, useLayoutEffect, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ServicesData } from "../../types";
import HexRing from "../hexlayout";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP ScrollTrigger plugin
if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

const DEBUG = false;

export default function Carsoule({ data }: { data: ServicesData }) {
	const [current, setCurrent] = useState(0);
	const [isMobile, setIsMobile] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	// Track screen size
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// GSAP ScrollTrigger setup
	useLayoutEffect(() => {
		if (!containerRef.current || !contentRef.current) return;

		const ctx = gsap.context(() => {
			// Get responsive start/end values based on screen size
			const startValue = isMobile ? "top 10%" : "top 25%";
			const endValue = isMobile ? "60% 5%" : "60% 20%";

			ScrollTrigger.create({
				trigger: containerRef.current,
				start: startValue,
				end: endValue,
				pin: contentRef.current,
				pinSpacing: false,
				markers: DEBUG,
				onUpdate: (self) => {
					const progress = self.progress;

					const index = Math.min(
						Math.floor(progress * data.length),
						data.length - 1,
					);
					setCurrent(index);
				},
			});
		}, containerRef);

		return () => {
			ctx.revert();
		};
	}, [data.length, isMobile]);

	// Refresh ScrollTrigger when needed
	useEffect(() => {
		ScrollTrigger.refresh();
	}, [data]);

	const item = data[current];
	const images = item.images;
	const center = images[0];
	const ring = images.slice(1, 7);
	const iconSize = 150;

	return (
		<div
			ref={containerRef}
			className='relative  '
			style={{ height: `${data.length * (isMobile ? 32 : 25)}vh` }}>
			<h1
				className={`text-[16px] lg:text-[32px] font-bold text-primary text-right w-full  ${
					current < data.length - 1 ? "sticky top-0 left-0" : ""
				}`}>
				Services
			</h1>
			<div ref={contentRef} className='flex  w-full p-2 '>
				<div className='w-full mr-2'>
					<AnimatePresence mode='wait'>
						<motion.div
							key={item.title}
							className='flex w-full flex-col lg:flex-row items-center justify-between gap-10'
							initial={{ opacity: 0, y: 40 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -40 }}
							transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.6, ease: "easeOut" }}
								className='lg:w-[440px] w-[220px]'>
								<HexRing center={center} ring={ring} iconSize={iconSize} />
							</motion.div>

							<div className='max-w-[520px]'>
								<motion.h1
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: 0.1 }}
									className='text-2xl font-semibold mb-2 text-center lg:text-left text-[16px] lg:text-[24px]'>
									{item.title}
								</motion.h1>
								<motion.p
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: 0.2 }}
									className='mb-3 text-muted-foreground text-center lg:text-left text-[12px] lg:text-[16px]'>
									{item.description}
								</motion.p>
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.5, delay: 0.3 }}
									className='flex justify-center lg:justify-start'>
									<Link
										href={item.learn_more}
										className='text-primary  font-medium text-center lg:text-left text-[12px] lg:text-[16px]'>
										Learn More
									</Link>
								</motion.div>
							</div>
						</motion.div>
					</AnimatePresence>
				</div>

				{/* Progress indicator */}
				<div className='hidden lg:flex flex-col items-center justify-center absolute top-[10px] right-0'>
					<motion.p
						key={`current-${current}`}
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}>
						{current + 1}
					</motion.p>
					<div className='w-[4px] h-[300px] rounded-full relative overflow-hidden bg-gray-200'>
						<motion.div
							className='absolute left-0 w-[4px] bg-gradient-to-b from-primary to-secondary'
							style={{
								height: `${300 / data.length}px`,
							}}
							animate={{
								top: `${(300 / data.length) * current}px`,
							}}
							transition={{ duration: 0.5, ease: "easeInOut" }}
						/>
					</div>
					<p>{data.length}</p>
				</div>
				<div className='md:hidden flex items-center justify-center absolute bottom-[-15px] mx-auto left-0 right-0'>
					<motion.p
						key={`current-${current}`}
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}>
						{current + 1}
					</motion.p>
					<div className='w-[300px] h-[4px] rounded-full  relative overflow-hidden bg-gray-200'>
						<motion.div
							className=' h-[4px] bg-gradient-to-l from-primary to-secondary absolute'
							transition={{ duration: 0.5, ease: "easeInOut" }}
							style={{
								width: `${300 / data.length}px`,
							}}
							animate={{
								left: `${(300 / data.length) * current}px`,
							}}
						/>
					</div>
					<p>{data.length}</p>
				</div>
			</div>
		</div>
	);
}
