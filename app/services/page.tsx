import Navbar from "@/components/global/navbar";

import { Code2, Smartphone, Palette, Cloud } from "lucide-react";

import { TextFadeIn } from "@/components/animation/text-animation";
import { TextAnimate } from "@/components/ui/text-animate";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

import { cn } from "@/lib/utils";

import WebDevBg from "./_components/web-dev-bg";
import CtaBanner from "@/components/global/cta-banner";
import CloudBg from "./_components/cloud-bg";

const services = [
	{
		Icon: Code2,
		name: "Web Development",
		description:
			"Custom web applications built with modern technologies. From responsive websites to complex enterprise solutions.",
		href: "/services/web-development",
		cta: "Learn more",
		className: "col-span-3 lg:col-span-2",
		background: <WebDevBg />,
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
				<div className='scale-75'></div>
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
		background: <CloudBg />,
	},
];

export default function ServicesPage() {
	return (
		<div className='relative'>
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
			<CtaBanner />
		</div>
	);
}
