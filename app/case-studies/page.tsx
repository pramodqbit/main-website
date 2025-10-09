import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";
import SectionLayout from "@/components/global/section-layout";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import caseStudies from "./_data/case-studies.json";
import { Briefcase, Users, Clock, TrendingUp } from "lucide-react";

const ICON_SIZE = 32;

export default function CaseStudiesPage() {
	return (
		<div className=''>
			<main className='container'>
				<Navbar />

				<SectionLayout
					id='case-studies'
					badgeIcon={<Briefcase size={ICON_SIZE} className='text-primary' />}
					badgeLabel='Case Studies'
					title='Real-World Success Stories'
					description='Explore how we have helped businesses across industries achieve their digital transformation goals.'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{caseStudies.map((study) => (
							<Link key={study.slug} href={`/case-studies/${study.slug}`} className='group'>
								<Card className='h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/20'>
									<div className='relative h-48 w-full'>
										<Image
											src={study.heroImage}
											alt={study.title}
											fill
											className='object-cover'
											priority={false}
										/>
									</div>
									<CardContent className='p-6'>
										<div className='flex items-center gap-3 mb-3'>
											<Image
												src={study.iconImage}
												alt={`${study.title} icon`}
												width={32}
												height={32}
												className='w-8 h-8 object-contain rounded'
											/>
											<div className='flex-1'>
												<p className='text-xs text-muted-foreground'>{study.industry}</p>
												<p className='text-xs text-muted-foreground'>{new Date(study.date).toLocaleDateString()}</p>
											</div>
										</div>
										
										<h3 className='text-lg font-semibold leading-snug mb-2'>{study.title}</h3>
										<p className='text-sm text-muted-foreground line-clamp-3 mb-4'>{study.excerpt}</p>
										
										{/* Case Study Stats */}
										<div className='grid grid-cols-2 gap-3 mb-4'>
											<div className='flex items-center gap-2 text-xs'>
												<Clock className='w-3 h-3 text-primary' />
												<span>{study.duration}</span>
											</div>
											<div className='flex items-center gap-2 text-xs'>
												<Users className='w-3 h-3 text-primary' />
												<span>{study.teamSize}</span>
											</div>
										</div>
										
										{/* Key Results */}
										<div className='flex items-center gap-2 text-xs text-green-600 font-medium'>
											<TrendingUp className='w-3 h-3' />
											<span>{study.results.split(',')[0]}</span>
										</div>
										
										<div className='mt-3 flex flex-wrap gap-2'>
											{study.tags.slice(0, 3).map((tag) => (
												<span key={tag} className='text-xs px-2 py-1 rounded-full border'>#{tag}</span>
											))}
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				</SectionLayout>

			</main>
			<Footer />
		</div>
	);
}