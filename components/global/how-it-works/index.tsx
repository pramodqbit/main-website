"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { TextFadeIn } from "@/components/animation/text-animation";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardAction,
} from "@/components/ui/card";
import { Brain } from "lucide-react";
import { SectionHeader } from "../section-layout";

gsap.registerPlugin(ScrollTrigger);

interface Step {
	number: string;
	title: string;
	description: string;
	details: string[];
}

const steps: Step[] = [
	{
		number: "01",
		title: "Discovery & Planning",
		description:
			"We begin by understanding your vision, goals, and challenges to create a strategic roadmap.",
		details: [
			"Requirement gathering & analysis",
			"Market research & competitor analysis",
			"Technical feasibility assessment",
			"Project timeline & milestone planning",
		],
	},
	{
		number: "02",
		title: "Design & Prototyping",
		description:
			"Our design team crafts intuitive interfaces and engaging user experiences tailored to your brand.",
		details: [
			"Wireframing & user flow mapping",
			"UI/UX design with modern aesthetics",
			"Interactive prototypes for validation",
			"Design system & style guide creation",
		],
	},
	{
		number: "03",
		title: "Development & Testing",
		description:
			"We build scalable, secure solutions using cutting-edge technologies and best practices.",
		details: [
			"Agile development methodology",
			"Clean, maintainable code architecture",
			"Rigorous quality assurance testing",
			"Performance optimization & security",
		],
	},
	{
		number: "04",
		title: "Deployment & Support",
		description:
			"We ensure smooth launch and provide ongoing maintenance to keep your software running flawlessly.",
		details: [
			"Seamless deployment to production",
			"Post-launch monitoring & analytics",
			"Continuous maintenance & updates",
			"Dedicated technical support team",
		],
	},
];

export default function HowItWorks() {
	const sectionRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const horizontalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			if (!horizontalRef.current || !containerRef.current) return;

			const sections = gsap.utils.toArray(".step-card");
			if (sections.length === 0) return;

			// Calculate total width needed to scroll
			const totalWidth = horizontalRef.current.scrollWidth;
			const windowWidth = window.innerWidth;
			const scrollDistance = totalWidth - windowWidth;

			// Create main horizontal scroll animation
			const horizontalScroll = gsap.to(horizontalRef.current, {
				x: () => -scrollDistance,
				ease: "none",
				scrollTrigger: {
					trigger: containerRef.current,
					pin: true,
					scrub: 1,
					start: "top top",
					end: () => `+=${scrollDistance * 1.5}`,
					invalidateOnRefresh: true,
				},
			});

			// Animate each card on entry
			sections.forEach((section) => {
				const element = section as HTMLElement;

				gsap.from(element, {
					opacity: 0,
					scale: 0.8,
					duration: 0.5,
					scrollTrigger: {
						trigger: element,
						containerAnimation: horizontalScroll,
						start: "left 80%",
						end: "left 50%",
						scrub: 1,
					},
				});
			});
		}, sectionRef);

		return () => ctx.revert();
	}, []);

	return (
		<div
			ref={sectionRef}
			className='relative border-l border-r overflow-hidden'>
			{/* Header Section with SectionLayout styling */}

			{/* Horizontal Scrolling Section */}
			<div ref={containerRef} className='relative min-h-screen'>
				{/* Background gradient */}
				<div className='absolute inset-0 pointer-events-none' />
				<div className='container mx-auto px-4 py-16 '>
					<SectionHeader
						badgeLabel='How It Works'
						badgeIcon={<Brain size={24} className='text-primary' />}
						title='Our Proven Process for Success'
						description='From idea to implementation, we follow a structured approach to deliver results. Our process ensures clear communication, transparency, and collaboration at every stage—so you always know what to expect and can see your vision come to life step by step.'
					/>
				</div>

				{/* Horizontal scrolling container */}
				<div
					ref={horizontalRef}
					className='absolute md:top-5 top-8 left-0 h-screen flex items-center gap-8 px-10 md:px-20'
					style={{ paddingLeft: "40vw", paddingRight: "40vw" }}>
					{steps.map((step, index) => (
						<div
							key={index}
							className='step-card flex-shrink-0 w-[85vw] md:w-[600px] h-[50vh] md:h-[450px]'>
							<Card className='relative h-full bg-card/50 backdrop-blur-sm rounded-3xl p-0 border-border hover:border-primary/50 transition-all duration-300 shadow-2xl overflow-hidden group'>
								{/* Gradient overlay on hover */}
								<div className='absolute inset-0 bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/10 group-hover:to-secondary/10 transition-all duration-500 rounded-3xl' />

								{/* Content */}
								<div className='relative z-10 h-full flex flex-col p-8 md:p-10'>
									<CardHeader className='p-0 mb-6'>
										<div className=' w-10 h-10 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-[16px] md:text-3xl font-bold text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300'>
											{step.number}
										</div>

										{/* Connecting arrow (except for last item) */}
										{index < steps.length - 1 && (
											<CardAction className='p-0'>
												<div className='hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 group-hover:scale-110 transition-transform duration-300'>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														fill='none'
														viewBox='0 0 24 24'
														strokeWidth={2}
														stroke='currentColor'
														className='w-6 h-6 text-primary'>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															d='M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3'
														/>
													</svg>
												</div>
											</CardAction>
										)}

										<CardTitle className='text-[16px] md:text-3xl font-semibold  md:mb-4 mb-1 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
											{step.title}
										</CardTitle>

										<CardDescription className='text-[12px] md:text-[16px] text-foreground/80 md:mb-2 mb-1'>
											{step.description}
										</CardDescription>
									</CardHeader>

									<CardContent className='p-0 space-y-3 flex-1 overflow-hidden'>
										{step.details.map((detail, detailIndex) => (
											<div
												key={detailIndex}
												className='flex items-start gap-3 transform translate-x-0 hover:translate-x-2 transition-transform duration-200'>
												<div className='flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary mt-2' />
												<p className='text-[12px] md:text-[16px] text-muted-foreground'>
													{detail}
												</p>
											</div>
										))}
									</CardContent>
								</div>
							</Card>
						</div>
					))}

					{/* Final CTA Card */}
					<div className='step-card flex-shrink-0 w-[85vw] md:w-[600px] h-[50vh] md:h-[450px]'>
						<Card className='h-full bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm rounded-3xl p-8 md:p-10 border-primary/30 flex flex-col items-center justify-center text-center shadow-2xl'>
							<div className='flex flex-col items-center justify-center h-full'>
								<div className='w-12 h-12 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 md:mb-6 shadow-lg'>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										fill='none'
										viewBox='0 0 24 24'
										strokeWidth={2}
										stroke='currentColor'
										className='w-6 h-6 md:w-10 md:h-10 text-white'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											d='M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
										/>
									</svg>
								</div>

								<h3 className='text-xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
									Ready to Start?
								</h3>

								<p className='text-sm md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-sm px-4'>
									Let&apos;s transform your vision into reality with our proven
									process
								</p>

								<Button className='rounded-full bg-gradient-to-r from-primary to-secondary text-white border-0 shadow-lg hover:from-secondary hover:to-primary transition-colors duration-200'>
									Get Started Today
								</Button>
							</div>
						</Card>
					</div>
				</div>

				{/* Scroll indicator */}
				<div className='absolute bottom-10 right-10 flex items-center gap-2 text-muted-foreground animate-pulse'>
					<span className='text-sm hidden md:inline'>Scroll to explore</span>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={2}
						stroke='currentColor'
						className='w-5 h-5'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3'
						/>
					</svg>
				</div>
			</div>
		</div>
	);
}
