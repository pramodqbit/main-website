"use client";

import { ServicesData } from "./types";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
	CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import SectionLayout from "@/components/global/section-layout";
import { Code2 } from "lucide-react";
import Link from "next/link";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MotionTooltip from "@/components/ui/motion-tooltip";

const services_data: ServicesData = [
	{
		title: "Web Development",
		description:
			"Custom web development solutions using React, Angular, WordPress, and modern frameworks. Build responsive, high-performance websites with seamless user experiences that drive conversions and business growth.",
		learn_more: "/services/web-development",
		tags: ["Web Development", "React", "Angular", "WordPress", "Shopify"],
		image: "/images/webdev.png",
		icons: [
			"/icons/react.webp",
			"/icons/angular.webp",
			"/icons/python.webp",
			"/icons/js.webp",
			"/icons/wordpress.webp",
			"/icons/php.webp",
			"/icons/shopify.webp",
		],
	},
	{
		title: "Mobile Development",
		description:
			"Native and cross-platform mobile app development for iOS and Android. Create intuitive, feature-rich mobile applications that engage users and deliver exceptional performance on all devices.",
		learn_more: "/services/mobile-development",
		tags: ["Mobile Development", "React Native", "Flutter", "Swift", "Kotlin"],
		image: "/images/app-dev.png",
		icons: [
			"/icons/andriod.png",
			"/icons/react.webp",
			"/icons/expo.png",
			"/icons/swift.png",
			"/icons/flutter.png",
			"/icons/ionic.webp",
			"/icons/android-studio-icon.png",
		],
	},
	// {
	// 	title: "Marketing",
	// 	description:
	// 		"Data-driven digital marketing strategies that boost brand visibility and ROI. From social media campaigns to content marketing, we help you reach your target audience and achieve measurable results.",
	// 	learn_more: "/services/marketing",
	// 	tags: ["Marketing", "Social Media", "Content Marketing", "SEO", "SEM"],
	// 	images: [
	// 		"/icons/seo-market.png",
	// 		"/icons/target.png",
	// 		"/icons/website.png",
	// 		"/icons/marketing.png",
	// 		"/icons/social.png",
	// 		"/icons/email.png",
	// 		"/icons/analytics.png",
	// 	],
	// },
	{
		title: "SEO",
		description:
			"Expert SEO optimization services to improve search rankings and organic traffic. Technical SEO audits, keyword research, on-page optimization, and link building strategies that get your website found.",
		learn_more: "/services/seo",
		tags: ["Keyword Research", "On-Page Optimization", "Link Building"],
		image: "/images/seo.png",
		icons: [
			"/icons/seo.png",
			"/icons/chat.png",
			"/icons/web-speed.png",
			"/icons/web-search.png",
			"/icons/announcement.png",
			"/icons/digital-campaign.png",
			"/icons/web-data.png",
		],
	},
	{
		title: "UI/UX Design",
		description:
			"Professional graphic design services for branding, UI/UX, and visual identity. Create stunning visuals that capture attention, communicate your message effectively, and strengthen your brand presence.",
		learn_more: "/services/graphics-design",
		tags: ["Graphics Design", "Branding", "UI/UX", "Visual Identity"],
		image: "/images/design.png",
		icons: [
			"/icons/photoshop.png",
			"/icons/illustrator.png",
			"/icons/figma.png",
			"/icons/indesign.png",
			"/icons/adobe.png",
			"/icons/canva.png",
			"/icons/corel-draw.png",
		],
	},
];

// Register GSAP plugins
if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

export default function Services() {
	const containerRef = useRef<HTMLDivElement>(null);
	const cardsRef = useRef<HTMLDivElement[]>([]);

	useEffect(() => {
		if (!containerRef.current) return;

		const ctx = gsap.context(() => {
			const cards = cardsRef.current.filter(Boolean);
			const totalCards = cards.length;

			// Set initial states for all cards
			cards.forEach((card, index) => {
				gsap.set(card, {
					position: "sticky",
					top: `calc(15vh + ${index * 30}px)`,
					zIndex: index + 1,
					scale: 1 - (totalCards - 1 - index) * 0.03,
					transformOrigin: "center top",
				});
			});

			// Create scroll-triggered animations for each card
			cards.forEach((card, index) => {
				if (index === totalCards - 1) return; // Skip last card

				ScrollTrigger.create({
					trigger: card,
					start: () => `top ${15 + index * 3}%`,
					end: () => `+=${window.innerHeight * 0.5}`,
					scrub: 0.5,
					onUpdate: (self) => {
						const progress = self.progress;
						// Scale down and add slight rotation as card scrolls up
						gsap.to(card, {
							scale: 1 - progress * 0.08,
							// filter: `brightness(${1 - progress * 0.15})`,
							duration: 0.1,
							overwrite: "auto",
						});
					},
				});
			});

			// Animate cards in on first appearance
			cards.forEach((card, index) => {
				gsap.fromTo(
					card,
					{
						opacity: 0,
						y: 100,
						rotateX: -15,
					},
					{
						opacity: 1,
						y: 0,
						rotateX: 0,
						duration: 0.8,
						delay: index * 0.1,
						ease: "power3.out",
						scrollTrigger: {
							trigger: card,
							start: "top 85%",
							toggleActions: "play none none reverse",
						},
					},
				);
			});
		}, containerRef);

		return () => ctx.revert();
	}, []);

	const setCardRef = (el: HTMLDivElement | null, index: number) => {
		if (el) cardsRef.current[index] = el;
	};

	return (
		<section id='services' className='relative overflow-hidden bg-blue-50'>
			<SectionLayout
				badgeLabel='Services'
				badgeIcon={<Code2 />}
				title='Our Services for Your Business'
				description='From custom web, AI powered applications and mobile development to strategic marketing, SEO, and graphic design, we deliver end-to-end digital solutions that empower your brand and drive measurable results.'>
				<div ref={containerRef} className='mx-auto max-w-7xl'>
					<div
						className='flex flex-col'
						style={{
							paddingBottom: `${services_data.length * 30}px`,
						}}>
						{services_data.map((service, index) => (
							<MotionTooltip key={index} toolTip={<div>Learn More</div>}>
								<div
									key={index}
									ref={(el) => setCardRef(el, index)}
									className='w-full mb-6 lg:mb-8'
									style={{ perspective: "1000px" }}>
									<Link href={service.learn_more} className='block group'>
										<Card
											className={cn(
												"relative overflow-hidden",
												"bg-white rounded-3xl",
												"border border-border",
												"shadow-lg shadow-black/5",
												"hover:shadow-2xl hover:shadow-primary/15",
												"transition-shadow duration-500",
												"p-4 md:p-6",
												"will-change-transform",
											)}>
											<div
												className={cn(
													"flex flex-col gap-6",
													index % 2 === 0
														? "md:flex-row-reverse"
														: "md:flex-row",
												)}>
												{/* Image Section */}
												<div className='relative w-full md:w-1/2 h-[200px] md:h-[400px] rounded-2xl overflow-hidden bg-[#0a0a0a] flex-shrink-0 group-hover:scale-[1.02] transition-transform duration-500'>
													<Image
														src={service.image}
														alt={`${service.title} preview`}
														fill
														className='object-cover transition-transform duration-700 group-hover:scale-110'
														sizes='(max-width: 768px) 100vw, 50vw'
													/>
													{/* Overlay gradient on hover */}
													<div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
												</div>

												{/* Content Section */}
												<div className='w-full md:w-1/2 flex flex-col justify-between py-2'>
													<div>
														<CardHeader className='p-0 mb-4'>
															{/* Header with Icon and Title */}
															<div className='flex items-center gap-3 mb-4'>
																{service.icons[0] && (
																	<div className='relative md:w-12 w-10 md:h-12 h-10 p-1.5 flex-shrink-0 md:rounded-xl rounded-md bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500'>
																		<Image
																			src={service.icons[0]}
																			alt={`${service.title} icon`}
																			fill
																			className='object-contain p-1'
																			sizes='48px'
																		/>
																	</div>
																)}
																<CardTitle className='text-xl md:text-3xl font-bold group-hover:text-primary transition-colors duration-300'>
																	{service.title}
																</CardTitle>
															</div>

															{/* Description */}
															<CardDescription className='text-sm md:text-lg leading-relaxed font-medium text-muted-foreground'>
																{service.description}
															</CardDescription>
														</CardHeader>

														<CardContent className='p-0'>
															{/* Tags */}
															<div className='flex flex-wrap gap-2'>
																{service.tags.map((tag, tagIndex) => (
																	<span
																		key={tagIndex}
																		className={cn(
																			"text-xs px-3 py-1.5 rounded-full",
																			"bg-gradient-to-r from-muted/80 to-muted/50",
																			"text-foreground border border-border/50",
																			"font-medium",
																			"hover:border-primary/40 hover:bg-primary/5",
																			"transition-all duration-300",
																			"cursor-default",
																		)}
																		style={{
																			transitionDelay: `${tagIndex * 30}ms`,
																		}}>
																		{tag}
																	</span>
																))}
															</div>
														</CardContent>
													</div>

													{/* Footer Summary */}
													<CardFooter className='p-0 pt-2 md:pt-6  md:mt-6 mt-4 border-t-1 md:border-t border-border/50'>
														<div className='flex flex-col gap-2 '>
															<div className='flex items-baseline gap-2'>
																<span className='text-2xl md:text-4xl font-bold text-foreground group-hover:text-primary transition-colors duration-300'>
																	{service.tags.length}+
																</span>
																<span className='text-base md:text-lg text-muted-foreground'>
																	technologies
																</span>
															</div>
															<div className='flex items-center gap-2 flex-wrap text-sm text-muted-foreground'>
																<span>{service.tags[0]}</span>
																<span className='text-primary'>•</span>
																<span>{service.tags[1]}</span>
																{service.tags[2] && (
																	<>
																		<span className='text-primary'>•</span>
																		<span>{service.tags[2]}</span>
																	</>
																)}
															</div>
														</div>
													</CardFooter>
												</div>
											</div>
										</Card>
									</Link>
								</div>
							</MotionTooltip>
						))}
					</div>
				</div>
			</SectionLayout>
		</section>
	);
}
