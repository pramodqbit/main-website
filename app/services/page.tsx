"use client";

import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";
import { Button } from "@/components/ui/button";
import { Code2, Smartphone, Palette, Cloud, ArrowRight } from "lucide-react";
import Link from "next/link";
import { TextFadeIn } from "@/components/animation/text-animation";
import { TextAnimate } from "@/components/ui/text-animate";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { Marquee } from "@/components/ui/marquee";
import { Iphone } from "@/components/ui/iphone";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { AnimatedList } from "@/components/ui/animated-list";

const services = [
	{
		Icon: Code2,
		name: "Web Development",
		description:
			"Custom web applications built with modern technologies. From responsive websites to complex enterprise solutions.",
		href: "/services/web-development",
		cta: "Learn more",
		className: "col-span-3 lg:col-span-2",
		background: (
			<div className='absolute bottom-[-400px] inset-0 flex items-center justify-center overflow-hidden'>
				<OrbitingCircles radius={360} duration={40} delay={0}>
					<div className='h-10 w-10  flex items-center justify-center'>
						<Image
							src='/icons/react.webp'
							alt='React'
							width={24}
							height={24}
							className='rounded-full object-cover'
						/>
					</div>
					<div className='h-10 w-10  flex items-center justify-center'>
						<Image
							src='/icons/react.webp'
							alt='React'
							width={24}
							height={24}
							className='rounded-full object-cover'
						/>
					</div>
				</OrbitingCircles>
				<OrbitingCircles radius={290} duration={30} delay={5}>
					<div className='h-10 w-10 rounded-full  flex items-center justify-center'>
						<Image
							src='/icons/js.webp'
							alt='JavaScript'
							width={24}
							height={24}
							className='rounded-full'
						/>
					</div>
				</OrbitingCircles>
				<OrbitingCircles radius={210} duration={20} delay={10}>
					<div className='h-10 w-10 rounded-full  flex items-center justify-center'>
						<Image
							src='/icons/python.webp'
							alt='Python'
							width={24}
							height={24}
							className='rounded-full'
						/>
					</div>
				</OrbitingCircles>
				<OrbitingCircles radius={60} duration={20} delay={15}>
					<div className='h-10 w-10 rounded-full  flex items-center justify-center'>
						<Image
							src='/icons/wordpress.webp'
							alt='WordPress'
							width={24}
							height={24}
							className='rounded-full'
						/>
					</div>
				</OrbitingCircles>

				<OrbitingCircles radius={120} duration={25} reverse>
					<div className='h-10 w-10 rounded-full  flex items-center justify-center'>
						<Image
							src='/icons/angular.webp'
							alt='Angular'
							width={24}
							height={24}
							className='rounded-full'
						/>
					</div>
				</OrbitingCircles>
				<OrbitingCircles radius={120} duration={25} delay={8} reverse>
					<div className='h-10 w-10 rounded-full  flex items-center justify-center'>
						<Image
							src='/icons/php.webp'
							alt='PHP'
							width={24}
							height={24}
							className='rounded-full'
						/>
					</div>
				</OrbitingCircles>
			</div>
		),
	},
	{
		Icon: Smartphone,
		name: "Mobile Apps",
		description:
			"Native and cross-platform mobile applications for iOS and Android. Deliver exceptional user experiences.",
		href: "/services/mobile-apps",
		cta: "Learn more",
		className: "col-span-3 lg:col-span-1",
		background: (
			<div className='absolute right-4 top-10 opacity-30'>
				<div className='scale-75'>
					<Iphone src='https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400' />
				</div>
			</div>
		),
	},
	{
		Icon: Palette,
		name: "UI/UX Design",
		description:
			"User-centered design that combines aesthetics with functionality. Create interfaces that engage and convert.",
		href: "/services/ui-ux-design",
		cta: "Learn more",
		className: "col-span-3 lg:col-span-1",
		background: (
			<div className='absolute inset-0 opacity-20'>
				<div className='grid grid-cols-3 gap-2 p-4'>
					{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
						<div
							key={i}
							className={cn(
								"h-16 rounded-lg transition-all duration-500",
								i % 3 === 0
									? "bg-orange-200 dark:bg-orange-900"
									: i % 2 === 0
									? "bg-pink-200 dark:bg-pink-900"
									: "bg-purple-200 dark:bg-purple-900",
							)}
							style={{
								animationDelay: `${i * 100}ms`,
							}}
						/>
					))}
				</div>
			</div>
		),
	},
	{
		Icon: Cloud,
		name: "Cloud Solutions",
		description:
			"Scalable cloud infrastructure and DevOps solutions. Deploy, manage, and scale your applications with confidence.",
		href: "/services/cloud-solutions",
		cta: "Learn more",
		className: "col-span-3 lg:col-span-2",
		background: (
			<AnimatedList className='absolute top-0 w-[400px] right-0 [mask-image:linear-gradient(to_top,transparent_10%,#000_80%)]'>
				{[
					{ name: "AWS" },
					{ name: "Azure" },
					{ name: "Google Cloud" },
					{ name: "Vercel" },
					{ name: "Netlify" },
					{ name: "DigitalOcean" },
				].map((provider, idx) => (
					<div
						key={idx}
						className={cn(
							"mx-3 flex h-14 w-full items-center justify-center rounded-lg text-white dark:text-black text-xs font-bold shadow-lg",
						)}>
						{provider.name}
					</div>
				))}
			</AnimatedList>
		),
	},
];

export default function ServicesPage() {
	return (
		<div className='relative'>
			<main className='container'>
				<Navbar />

				{/* Hero Section */}
				<section className='py-16 md:py-24'>
					<div className='max-w-4xl mx-auto text-center space-y-6'>
						<TextFadeIn
							delay={0.1}
							className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary'>
							Our Services
						</TextFadeIn>

						<TextAnimate className='text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight'>
							Comprehensive Digital Solutions
						</TextAnimate>
						<TextAnimate className='text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight block mt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
							for Your Business
						</TextAnimate>

						<TextAnimate
							delay={0.2}
							className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto'>
							From concept to launch, we deliver tailored solutions that drive
							growth and innovation.
						</TextAnimate>
					</div>
				</section>

				{/* Services Bento Grid */}
				<section className='pb-16 md:pb-24'>
					<BentoGrid className='lg:grid-cols-3'>
						{services.map((service, idx) => (
							<BentoCard key={idx} {...service} />
						))}
					</BentoGrid>
				</section>

				{/* CTA Section */}
				<section className='pb-16 md:pb-24'>
					<div className='relative bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 rounded-2xl p-12 md:p-16 text-center border border-primary/10'>
						<div className='max-w-2xl mx-auto space-y-6'>
							<h2 className='text-3xl md:text-4xl font-bold'>
								Ready to Get Started?
							</h2>
							<p className='text-lg text-muted-foreground'>
								Let&apos;s discuss your project and how we can help you achieve
								your goals. Get in touch with our team today.
							</p>
							<div className='flex flex-col sm:flex-row gap-4 justify-center items-center pt-4'>
								<Link href='/#contact'>
									<Button size='lg' className='px-8'>
										Start Your Project
										<ArrowRight className='w-4 h-4 ml-2' />
									</Button>
								</Link>
								<Link href='/#faq'>
									<Button variant='outline' size='lg' className='px-8'>
										Learn More
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}
