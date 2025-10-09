import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Home, Briefcase, Calendar, Users, Clock, TrendingUp, Target, Lightbulb, CheckCircle } from "lucide-react";
import caseStudies from "../_data/case-studies.json";
import { notFound } from "next/navigation";

type CaseStudy = typeof caseStudies[number];

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
	if (!study) return { title: "Case Study | Qbitlog" };
	return {
		title: `${study.title} | Qbitlog`,
		description: study.excerpt,
		keywords: study.tags.join(", "),
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

	return (
		<div className=''>
			<main className='container'>
				<Navbar />
				
				{/* Breadcrumb Navigation */}
				<nav className='flex items-center space-x-2 text-sm text-muted-foreground py-4'>
					<Link href='/' className='flex items-center hover:text-primary transition-colors'>
						<Home className='w-4 h-4 mr-1' />
						Home
					</Link>
					<ChevronRight className='w-4 h-4' />
					<Link href='/case-studies' className='hover:text-primary transition-colors'>
						Case Studies
					</Link>
					<ChevronRight className='w-4 h-4' />
					<span className='text-foreground font-medium'>{study.title}</span>
				</nav>

				<article className='mx-auto max-w-4xl py-10'>
					{/* Hero Section */}
					<div className='mb-8'>
						<div className='flex items-center gap-3 mb-4'>
							<Image src={study.iconImage} alt={`${study.title} icon`} width={40} height={40} className='w-10 h-10 object-contain rounded' />
							<div>
								<p className='text-sm text-muted-foreground'>{study.industry}</p>
								<p className='text-sm text-muted-foreground'>{new Date(study.date).toLocaleDateString()}</p>
							</div>
						</div>
						
						<h1 className='text-3xl md:text-4xl font-bold mb-4'>{study.title}</h1>
						<p className='text-lg text-muted-foreground mb-6'>{study.excerpt}</p>
						
						<div className='flex flex-wrap gap-2 mb-6'>
							{study.tags.map((tag) => (
								<span key={tag} className='text-sm px-3 py-1 rounded-full border'>#{tag}</span>
							))}
						</div>
					</div>

					{/* Hero Image */}
					<div className='relative h-64 w-full rounded-xl overflow-hidden border mb-8'>
						<Image src={study.heroImage} alt={study.title} fill className='object-cover' />
					</div>

					{/* Project Overview */}
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
						<div className='flex items-center gap-3 p-4 rounded-lg border bg-card'>
							<Briefcase className='w-5 h-5 text-primary' />
							<div>
								<p className='text-sm text-muted-foreground'>Client</p>
								<p className='font-medium'>{study.client}</p>
							</div>
						</div>
						<div className='flex items-center gap-3 p-4 rounded-lg border bg-card'>
							<Clock className='w-5 h-5 text-primary' />
							<div>
								<p className='text-sm text-muted-foreground'>Duration</p>
								<p className='font-medium'>{study.duration}</p>
							</div>
						</div>
						<div className='flex items-center gap-3 p-4 rounded-lg border bg-card'>
							<Users className='w-5 h-5 text-primary' />
							<div>
								<p className='text-sm text-muted-foreground'>Team Size</p>
								<p className='font-medium'>{study.teamSize}</p>
							</div>
						</div>
						<div className='flex items-center gap-3 p-4 rounded-lg border bg-card'>
							<TrendingUp className='w-5 h-5 text-primary' />
							<div>
								<p className='text-sm text-muted-foreground'>Key Result</p>
								<p className='font-medium text-green-600'>{study.results.split(',')[0]}</p>
							</div>
						</div>
					</div>

					{/* Challenge & Solution */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
						<div className='p-6 rounded-lg border bg-red-50 dark:bg-red-950/20'>
							<div className='flex items-center gap-3 mb-4'>
								<Target className='w-5 h-5 text-red-600' />
								<h3 className='text-lg font-semibold text-red-900 dark:text-red-100'>The Challenge</h3>
							</div>
							<p className='text-red-800 dark:text-red-200'>{study.challenge}</p>
						</div>
						
						<div className='p-6 rounded-lg border bg-green-50 dark:bg-green-950/20'>
							<div className='flex items-center gap-3 mb-4'>
								<Lightbulb className='w-5 h-5 text-green-600' />
								<h3 className='text-lg font-semibold text-green-900 dark:text-green-100'>Our Solution</h3>
							</div>
							<p className='text-green-800 dark:text-green-200'>{study.solution}</p>
						</div>
					</div>

					{/* Results */}
					<div className='p-6 rounded-lg border bg-blue-50 dark:bg-blue-950/20 mb-8'>
						<div className='flex items-center gap-3 mb-4'>
							<CheckCircle className='w-5 h-5 text-blue-600' />
							<h3 className='text-lg font-semibold text-blue-900 dark:text-blue-100'>Key Results</h3>
						</div>
						<p className='text-blue-800 dark:text-blue-200'>{study.results}</p>
					</div>

					{/* Technologies Used */}
					<div className='mb-8'>
						<h3 className='text-xl font-semibold mb-4'>Technologies Used</h3>
						<div className='flex flex-wrap gap-2'>
							{study.technologies.map((tech) => (
								<span key={tech} className='px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium'>
									{tech}
								</span>
							))}
						</div>
					</div>

					{/* Detailed Content */}
					<div className='prose dark:prose-invert max-w-none prose-headings:scroll-mt-24'>
						<div dangerouslySetInnerHTML={{ __html: study.contentHtml }} />
					</div>
				</article>
			</main>
			<Footer />
		</div>
	);
}
