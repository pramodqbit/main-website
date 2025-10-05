"use client";
import { useRef, useState, useLayoutEffect, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ServicesData } from "../../types";
import HexRing from "../hexlayout";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/global/section-layout";

// Register GSAP ScrollTrigger plugin
if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

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
			const startValue = isMobile ? "top 5%" : "top 10%";
			const endValue = isMobile ? "60% 0%" : "60% 5%";

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
			className='relative  overflow-hidden'
			style={{ height: `${data.length * (isMobile ? 35 : 37)}vh` }}>
			<div ref={contentRef} className='relative min-h-screen'>
				<div className='container mx-auto '>
					<SectionHeader
						badgeLabel='Services'
						badgeIcon={<Code2 size={24} className='text-primary' />}
						title='Comprehensive Digital Solutions Tailored to Your Business'
						description='From custom web and mobile development to strategic marketing, SEO, and graphic design, we deliver end-to-end digital solutions that empower your brand and drive measurable results.'
					/>
				</div>
				<div className='w-full px-4 md:px-8'>
					<AnimatePresence mode='wait'>
						<motion.div
							key={item.title}
							className='flex w-full flex-col lg:flex-row items-center justify-between '
							initial={{ opacity: 0, y: 40 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -40 }}
							transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.6, ease: "easeOut" }}
								className='lg:w-[440px] w-[220px] md:ml-10 ml-5 mx-auto md:mx-0'>
								<HexRing center={center} ring={ring} iconSize={iconSize} />
							</motion.div>

							<div className='max-w-[520px] flex flex-col md:gap-4 gap-2'>
								<motion.h1
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: 0.1 }}
									className=' font-semibold md:mb-2 mb-0 text-center lg:text-left text-[16px] lg:text-[24px]'>
									{item.title}
								</motion.h1>
								<motion.p
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: 0.3 }}
									className=' md:mb-3 mb-1 text-muted-foreground text-center lg:text-left text-[10px] lg:text-[16px]'>
									{item.description}
								</motion.p>
								<motion.div className='flex justify-center lg:justify-start  md:gap-2 gap-1 md:mb-3 mb-2  flex-wrap'>
									{item.tags.map((tag, idx) => (
										<motion.div
											key={idx}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.5, delay: 0.2 * idx }}>
											<Badge
												key={idx}
												variant='outline'
												className='text-primary text-[10px] md:text-[12px]  bg-primary/10 rounded-full  md:px-4 px-2 md:py-1 py-0.5'>
												{tag}
											</Badge>
										</motion.div>
									))}
								</motion.div>
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

					{/* Progress indicator */}
					<div className='hidden lg:flex flex-col items-center justify-center absolute top-[30%] right-2'>
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
					<div className='md:hidden flex items-center justify-center absolute top-[18.5%] mx-auto left-0 right-0'>
						<motion.p
							key={`current-${current}`}
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
							className='text-[10px] mr-2'>
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
						<p className='text-[10px] ml-2'>{data.length}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
