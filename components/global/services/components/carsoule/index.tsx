"use client";
import { useRef, useState, useLayoutEffect, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ServicesData } from "../../types";
import HexRing from "../hexlayout";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code2 } from "lucide-react";
import { Globe } from "@/components/ui/globe";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/global/section-layout";
import { cn } from "@/lib/utils";

// Register GSAP ScrollTrigger plugin
if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

export default function Carsoule({ data }: { data: ServicesData }) {
	const [current, setCurrent] = useState(0);

	const [containerHeight, setContainerHeight] = useState(0);
	const [iconSize, setIconSize] = useState(150);

	const containerRef = useRef<HTMLDivElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);

	// Track screen size and calculate dynamic height
	useEffect(() => {
		const updateDimensions = () => {
			const width = window.innerWidth;

		

			// Dynamic height calculation based on screen size
			let multiplier;
			// Mobile-first approach: start with mobile defaults
			multiplier = 40;
			setIconSize(45);
			if (width >= 1536) {
				// Desktop and larger
				multiplier = 44;
				setIconSize(165);
			} else if (width >= 1208) {
				// Desktop and larger
				multiplier = 46;
				setIconSize(155);
			} else if (width >= 1024) {
				// Large tablets
				multiplier = 35;
				setIconSize(135);
			} else if (width >= 768) {
				// Tablets
				multiplier = 35;
				setIconSize(95);
			} else if (width >= 640) {
				// Small tablets
				multiplier = 30;
				setIconSize(125);
			} else {
				setIconSize(90);
				multiplier = 30;
			}

			setContainerHeight(data.length * multiplier);
		};

		updateDimensions();
		window.addEventListener("resize", updateDimensions);
		return () => window.removeEventListener("resize", updateDimensions);
	}, [data.length]);

	// GSAP ScrollTrigger setup
	useLayoutEffect(() => {
		if (!containerRef.current || !contentRef.current) return;

		const mm = gsap.matchMedia();

		mm.add("(max-width: 600px)", () => {
			// Get responsive start/end values based on screen size
			const startValue = "top 5%";
			const endValue = "40% 0%";

			ScrollTrigger.create({
				trigger: containerRef.current,
				start: startValue,
				end: endValue,
				pin: contentRef.current,
				pinSpacing: false,

				onUpdate: (self) => {
					const progress = self.progress;

					const index = Math.min(
						Math.floor(progress * data.length),
						data.length - 1,
					);
					setCurrent(index);
				},
			});
		});

		mm.add(
			"(min-width: 640px)",
			() => {
				// Get responsive start/end values based on screen size
				const startValue = "top 10%";
				const endValue = "60% 0%";

				ScrollTrigger.create({
					trigger: containerRef.current,
					start: startValue,
					end: endValue,
					pin: contentRef.current,
					pinSpacing: false,

					onUpdate: (self) => {
						const progress = self.progress;

						const index = Math.min(
							Math.floor(progress * data.length),
							data.length - 1,
						);
						setCurrent(index);
					},
				});
			},
			containerRef,
		);
		/*
		mm.add(
			"(min-width: 1024px)",
			() => {
				// Get responsive start/end values based on screen size
				const startValue = "top 14%";
				const endValue = "60% 0%";

				ScrollTrigger.create({
					trigger: containerRef.current,
					start: startValue,
					end: endValue,
					pin: contentRef.current,
					pinSpacing: false,
					markers: true,

					onUpdate: (self) => {
						const progress = self.progress;

						const index = Math.min(
							Math.floor(progress * data.length),
							data.length - 1,
						);
						setCurrent(index);
					},
				});
			},
			containerRef,
		);
		
		mm.add(
			"(max-width: 1280px)",
			() => {
				// Get responsive start/end values based on screen size
				const startValue = "top top";
				const endValue = "bottom bottom";

				ScrollTrigger.create({
					trigger: containerRef.current,
					start: startValue,
					end: endValue,
					pin: contentRef.current,
					pinSpacing: false,

					onUpdate: (self) => {
						const progress = self.progress;

						const index = Math.min(
							Math.floor(progress * data.length),
							data.length - 1,
						);
						setCurrent(index);
					},
				});
			},
			containerRef,
		);

		mm.add(
			"(min-width: 1536px)",
			() => {
				// Get responsive start/end values based on screen size
				const startValue = "top top";
				const endValue = "bottom bottom";

				ScrollTrigger.create({
					trigger: containerRef.current,
					start: startValue,
					end: endValue,
					pin: contentRef.current,
					pinSpacing: false,

					onUpdate: (self) => {
						const progress = self.progress;

						const index = Math.min(
							Math.floor(progress * data.length),
							data.length - 1,
						);
						setCurrent(index);
					},
				});
			},
			containerRef,
		);
*/
		return () => {
			mm.revert();
		};
	}, [data.length]);

	// Refresh ScrollTrigger when needed
	useEffect(() => {
		ScrollTrigger.refresh();
	}, [data]);

	const item = data[current];
	const images = item.images;
	const center = images[0];
	const ring = images.slice(1, 7);

	return (
		<div
			ref={containerRef}
			className={cn("relative overflow-hidden")}
			style={{ height: `${containerHeight}vh` }}>
			<div ref={contentRef} className='relative min-h-screen overflow-hidden'>
				<div className='container mx-auto pt-2 md:pt-4 lg:pt-6 xl:pt-8 2xl:pt-10'>
					<SectionHeader
						badgeLabel='Services'
						badgeIcon={<Code2 size={24} className='text-primary' />}
						title='Comprehensive AI Powered Digital Solutions Tailored to Your Business'
						description='From custom web,AI powered applications and mobile development to strategic marketing, SEO, and graphic design, we deliver end-to-end digital solutions that empower your brand and drive measurable results.'
					/>
				</div>
				<div className='w-full px-0 md:px-8 relative'>
					<AnimatePresence mode='wait'>
						<motion.div
							key={item.title}
							className={cn(
								"w-full grid  items-center justify-between ",
								"grid-cols-1 md:grid-cols-2",
							)}
							initial={{ opacity: 0, y: 40 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -40 }}
							transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
							<motion.div
								initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
								animate={{ opacity: 1, scale: 1, rotate: 0 }}
								transition={{
									duration: 0.8,
									ease: [0.21, 0.47, 0.32, 0.98],
									scale: {
										type: "spring",
										damping: 15,
										stiffness: 100,
									},
								}}
								className={cn("  ")}>
								<HexRing center={center} ring={ring} iconSize={iconSize} />
							</motion.div>

							<div className=' flex flex-col lg:gap-4 gap-2'>
								<motion.h1
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: 0.1 }}
									className={cn(
										" font-semibold  mb-0 text-center md:text-left",
										"text-[16px]  md:text-[24px] lg:text-[28px]",
									)}>
									{item.title}
								</motion.h1>
								<motion.p
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: 0.3 }}
									className={cn(
										" md:mb-3 mb-1 text-muted-foreground text-center md:text-left",
										"text-[10px]  md:text-[16px] lg:text-[20px]",
									)}>
									{item.description}
								</motion.p>
								<motion.div className='flex justify-center md:justify-start  md:gap-2 gap-1 md:mb-3 mb-2  flex-wrap'>
									{item.tags.map((tag, idx) => (
										<motion.div
											key={idx}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.5, delay: 0.2 * idx }}
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.95 }}>
											<Badge
												variant='outline'
												className={cn(
													"text-primary   bg-primary/10 rounded-full transition-all duration-200 hover:bg-primary/20 cursor-default",
													"text-[10px] md:text-[12px] lg:text-[14px]",
													"px-2 md:px-4 lg:px-6 ",
													"py-0.5 md:py-1 lg:py-2 ",
												)}>
												{tag}
											</Badge>
										</motion.div>
									))}
								</motion.div>
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.5, delay: 0.3 }}
									className='flex justify-center md:justify-start'
									whileHover='hover'
									variants={{
										hover: {
											x: 5,
										},
									}}>
									<Link
										href={item.learn_more}
										className='text-primary font-medium text-center lg:text-left text-[12px] md:text-[16px] inline-flex items-center gap-2 group'>
										Learn More
										<motion.span
											variants={{
												hover: { x: 5 },
											}}
											transition={{
												type: "spring",
												stiffness: 400,
												damping: 10,
											}}
											className='inline-block'>
											→
										</motion.span>
									</Link>
								</motion.div>
							</div>
						</motion.div>
					</AnimatePresence>

					{/* Progress indicator */}
					<div
						className={cn(
							"hidden md:flex flex-col items-center justify-center absolute   right-2",
							" md:top-[0%] lg:top-[10%]",
						)}>
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
					<div className='md:hidden flex items-center justify-center absolute bottom-[-40px] mx-auto left-0 right-0'>
						<motion.p
							key={`current-${current}`}
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
							className='text-[10px] mr-2'>
							{current + 1}
						</motion.p>
						<div className='w-[180px] h-[4px] rounded-full  relative overflow-hidden bg-gray-200'>
							<motion.div
								className=' h-[4px] bg-gradient-to-l from-primary to-secondary absolute'
								transition={{ duration: 0.5, ease: "easeInOut" }}
								style={{
									width: `${180 / data.length}px`,
								}}
								animate={{
									left: `${(180 / data.length) * current}px`,
								}}
							/>
						</div>
						<p className='text-[10px] ml-2'>{data.length}</p>
					</div>
				</div>
				<div
					aria-hidden='true'
					className='pointer-events-none absolute inset-0 z-[-2]'
					style={{
						background:
							"linear-gradient(135deg, rgba(251,100,21,0.08) 0%, rgba(0,212,255,0.10) 100%)",
					}}
				/>
				<Globe className='[--duration: 0.5s] z-[-1] max-w-[1600px] left-[100px] top-[350px]' />
			</div>
		</div>
	);
}
