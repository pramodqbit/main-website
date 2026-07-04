"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
	Calendar,
	Layers,
	Users,
	ExternalLink,
	Github,
	ArrowRight,
} from "lucide-react";
import { Iphone } from "@/components/ui/iphone";
import { Macbook } from "@/components/ui/macbook";
import { Button } from "@/components/ui/button";
import type { CaseStudy } from "../_data/types";

interface Props {
	study: CaseStudy;
}

export function CaseStudyHero({ study }: Props) {
	const liveUrl = study.liveUrl || study.demoUrl;
	const techNames = study.technologies.slice(0, 4).map((t) => t.name);
	const techExtra = study.technologies.length - techNames.length;
	const meta = [
		{ icon: Calendar, label: "Duration", value: study.duration },
		{
			icon: Layers,
			label: "Technologies",
			value:
				techExtra > 0
					? `${techNames.join(", ")} +${techExtra}`
					: techNames.join(", "),
		},
		{ icon: Users, label: "Client", value: study.client },
	];

	return (
		<section className='relative'>
			<div className='grid grid-cols-1 items-center gap-10 lg:grid-cols-[47fr_53fr] lg:gap-12'>
				{/* Left */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease: "easeOut" }}
					className='flex flex-col gap-5'>
					{study.categories && study.categories.length > 0 && (
						<div className='flex flex-wrap gap-3'>
							{study.categories.map((c) => (
								<span
									key={c}
									className='rounded-full bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary'>
									{c}
								</span>
							))}
						</div>
					)}

					<h1 className='text-3xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-4xl lg:text-[42px]'>
						{study.title}
					</h1>

					<p className='max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base'>
						{study.description || study.excerpt}
					</p>

					{/* Meta — inline items, no boxes */}
					<div className='mt-1 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6'>
						{meta.map(({ icon: Icon, label, value }) => (
							<div key={label} className='flex items-start gap-2.5'>
								<Icon className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
								<div className='min-w-0'>
									<p className='text-sm font-semibold text-foreground'>
										{label}
									</p>
									<p className='mt-0.5 text-xs leading-relaxed text-muted-foreground'>
										{value}
									</p>
								</div>
							</div>
						))}
					</div>

					{/* Buttons — flat corners, icon after label */}
					<div className='mt-2 flex flex-col gap-3 sm:flex-row'>
						{liveUrl && (
							<Button asChild className='w-full rounded-lg px-6 sm:w-auto'>
								<a href={liveUrl} target='_blank' rel='noopener noreferrer'>
									Visit Live Project
									<ExternalLink className='h-4 w-4' />
								</a>
							</Button>
						)}

						{study.sourceUrl && (
							<Button
								asChild
								variant='outline'
								className='w-full rounded-lg px-6 sm:w-auto'>
								<a
									href={study.sourceUrl}
									target='_blank'
									rel='noopener noreferrer'>
									View on GitHub
									<Github className='h-4 w-4' />
								</a>
							</Button>
						)}

						{!liveUrl && !study.sourceUrl && (
							<Button asChild className='w-full rounded-lg px-6 sm:w-auto'>
								<Link href='/contact-us'>
									Discuss a Similar Project
									<ArrowRight className='h-4 w-4' />
								</Link>
							</Button>
						)}
					</div>
				</motion.div>

				{/* Right — mockups */}
				<motion.div
					initial={{ opacity: 0, scale: 0.96 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
					className='relative flex items-center justify-center'>
					{/* soft peach blob behind top-right */}
					<div className='pointer-events-none absolute -right-8 -top-14 -z-10 h-72 w-72 rounded-full bg-gradient-to-br from-rose-100 via-orange-50 to-rose-50 blur-xl' />

					{/* dot-grid accents */}
					<div className='pointer-events-none absolute -left-2 top-4 -z-10 h-14 w-24 [background-image:radial-gradient(circle,rgb(196_181_253)_1.5px,transparent_1.5px)] [background-size:13px_13px]' />
					<div className='pointer-events-none absolute bottom-2 right-0 -z-10 h-14 w-24 [background-image:radial-gradient(circle,rgb(196_181_253)_1.5px,transparent_1.5px)] [background-size:13px_13px]' />

					<div className='relative mx-auto w-full max-w-2xl pr-[12%]'>
						{/* laptop skin */}
						<Macbook src={study.heroImage} alt={`${study.title} preview`} />

						{/* phone skin overlap */}
						{study.mobileImage && (
							<div className='absolute -bottom-8 right-0 w-[24%] max-w-[140px]'>
								<Iphone src={study.mobileImage} className='drop-shadow-2xl' />
							</div>
						)}
					</div>
				</motion.div>
			</div>
		</section>
	);
}

export default CaseStudyHero;
