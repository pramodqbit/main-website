import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";
import { AlertTriangle } from "lucide-react";
import { notFound } from "next/navigation";
import caseStudiesData from "../_data/case-studies.json";
import type { CaseStudy } from "../_data/types";
import { BackToCaseStudies } from "../_components/BackToCaseStudies";
import { CaseStudyHero } from "../_components/CaseStudyHero";
import { InfoCard } from "../_components/InfoCard";
import { OurSolution } from "../_components/OurSolution";
import { KeyFeatures } from "../_components/KeyFeatures";
import { ProjectStats } from "../_components/ProjectStats";
import { TechStack } from "../_components/TechStack";
import { ScreenshotCarousel } from "../_components/ScreenshotCarousel";
import { TestimonialCard } from "../_components/TestimonialCard";
import { ProjectDetailsCard } from "../_components/ProjectDetailsCard";
import { CaseStudyCTA } from "../_components/CaseStudyCTA";

const caseStudies = caseStudiesData as CaseStudy[];

function getCaseStudy(slug: string): CaseStudy | undefined {
	return caseStudies.find((s) => s.slug === slug);
}

export async function generateStaticParams() {
	return caseStudies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const study = getCaseStudy(slug);
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qbitlog.com";

	if (!study)
		return {
			title: "Case Study Not Found",
			description: "The requested case study could not be found.",
		};

	return {
		title: study.title,
		description: study.excerpt,
		keywords: study.tags,
		authors: [{ name: "QBITLOG Team" }],
		openGraph: {
			type: "article",
			title: study.title,
			description: study.excerpt,
			url: `${siteUrl}/case-studies/${slug}`,
			publishedTime: study.date,
			tags: study.tags,
			images: [
				{
					url: study.heroImage,
					width: 1200,
					height: 630,
					alt: study.title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: study.title,
			description: study.excerpt,
			images: [study.heroImage],
			creator: "@qbitlog",
		},
		alternates: {
			canonical: `${siteUrl}/case-studies/${slug}`,
		},
	};
}

export default async function CaseStudyPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const study = getCaseStudy(slug);
	if (!study) notFound();

	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qbitlog.com";

	const caseStudyStructuredData = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: study.title,
		description: study.excerpt,
		image: study.heroImage,
		datePublished: study.date,
		dateModified: study.date,
		author: { "@type": "Organization", name: "QBITLOG", url: siteUrl },
		publisher: {
			"@type": "Organization",
			name: "QBITLOG",
			logo: { "@type": "ImageObject", url: `${siteUrl}/icons/logo.png` },
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${siteUrl}/case-studies/${slug}`,
		},
		keywords: study.tags.join(", "),
		about: {
			"@type": "Project",
			name: study.title,
			description: study.excerpt,
			client: study.client,
			duration: study.duration,
		},
	};

	const breadcrumbStructuredData = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
			{
				"@type": "ListItem",
				position: 2,
				name: "Case Studies",
				item: `${siteUrl}/case-studies`,
			},
			{
				"@type": "ListItem",
				position: 3,
				name: study.title,
				item: `${siteUrl}/case-studies/${slug}`,
			},
		],
	};

	return (
		<>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(caseStudyStructuredData),
				}}
			/>
			<script
				type='application/ld+json'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(breadcrumbStructuredData),
				}}
			/>
			<main className='container px-4'>
				<Navbar />

				<div className='mx-auto mt-8 max-w-[92%] space-y-6 pb-10'>
					{/* Back link + prototype notice */}
					<div className='flex flex-col gap-4'>
						<BackToCaseStudies />
						{study.isPrototype && (
							<div className='flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4'>
								<AlertTriangle className='mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600' />
								<div>
									<p className='font-semibold text-amber-900'>
										Prototype / Demo Product
									</p>
									<p className='text-sm text-amber-800'>
										This is a demonstration project built with synthetic data.
										Not intended for production use without proper compliance and
										validation.
									</p>
								</div>
							</div>
						)}
					</div>

					{/* 1. Hero */}
					<div className='pb-6 pt-2'>
						<CaseStudyHero study={study} />
					</div>

					{/* 2. Metrics strip */}
					<ProjectStats metrics={study.metrics} />

					{/* 3. About + Challenge */}
					<div className='grid gap-6 md:grid-cols-2'>
						<InfoCard
							tone='about'
							title='About the Project'
							text={study.overviewAbout || study.description || study.excerpt}
						/>
						<InfoCard
							tone='challenge'
							title='The Challenge'
							text={study.challenge}
						/>
					</div>

					{/* 4. Our Solution */}
					<OurSolution
						intro={study.solutionIntro || study.solution}
						features={study.solutionFeatures}
					/>

					{/* 5. Key Features + Tech Stack */}
					<div className='grid gap-6 lg:grid-cols-[1fr_1.35fr]'>
						<KeyFeatures features={study.features} />
						<TechStack technologies={study.technologies} />
					</div>

					{/* 6. Screenshots */}
					<ScreenshotCarousel
						screenshots={study.screenshots}
						viewMoreUrl={study.liveUrl || study.demoUrl}
					/>

					{/* 7. Testimonial + Project Details */}
					<div className='grid gap-6 lg:grid-cols-[1.5fr_1fr]'>
						{study.testimonial && (
							<TestimonialCard testimonial={study.testimonial} />
						)}
						<ProjectDetailsCard study={study} />
					</div>

					{/* 8. Detailed HTML Content */}
					{study.contentHtml && (
						<div className='rounded-2xl border border-border/60 bg-white p-6 shadow-sm md:p-8 display-none'>
							<h2 className='mb-6 text-lg font-bold text-foreground md:text-xl'>
								Detailed Overview
							</h2>
							<div
								className='prose prose-neutral max-w-none prose-headings:scroll-mt-24 prose-a:text-primary'
								dangerouslySetInnerHTML={{ __html: study.contentHtml }}
							/>
						</div>
					)}

					{/* 9. Call To Action */}
					<CaseStudyCTA cta={study.cta} />
				</div>
			</main>
			<Footer />
		</>
	);
}
