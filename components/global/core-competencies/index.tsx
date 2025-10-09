import { cn } from "@/lib/utils";
import SectionLayout from "../section-layout";
import { Award, Code2, Brain, Users, Smartphone } from "lucide-react";

const ICON_SIZE = 32;

export default function CoreCompetencies({
	className,
}: {
	className?: string;
}) {
	return (
		<SectionLayout
			id='expertise'
			badgeIcon={<Award size={ICON_SIZE} className='text-primary' />}
			badgeLabel='Expertise'
			title='Our Core Competencies'
			description='We combine technical expertise with creative vision to deliver cutting-edge solutions that drive business growth and user engagement.'
			className={cn(className)}>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				<div className='text-center p-6 rounded-lg border bg-card'>
					<Brain className='w-12 h-12 mx-auto mb-4 text-primary' />
					<h3 className='text-lg font-semibold mb-2'>AI & Machine Learning</h3>
					<p className='text-sm text-muted-foreground'>
						Intelligent automation, predictive analytics, and AI-powered solutions
					</p>
				</div>
				<div className='text-center p-6 rounded-lg border bg-card'>
					<Code2 className='w-12 h-12 mx-auto mb-4 text-primary' />
					<h3 className='text-lg font-semibold mb-2'>Web Development</h3>
					<p className='text-sm text-muted-foreground'>
						Modern frameworks, responsive design, and scalable architectures
					</p>
				</div>
				<div className='text-center p-6 rounded-lg border bg-card'>
					<Smartphone className='w-12 h-12 mx-auto mb-4 text-primary' />
					<h3 className='text-lg font-semibold mb-2'>Mobile Development</h3>
					<p className='text-sm text-muted-foreground'>
						Cross-platform and native mobile applications
					</p>
				</div>
				<div className='text-center p-6 rounded-lg border bg-card'>
					<Users className='w-12 h-12 mx-auto mb-4 text-primary' />
					<h3 className='text-lg font-semibold mb-2'>UI/UX Design</h3>
					<p className='text-sm text-muted-foreground'>
						User-centered design and intuitive interfaces
					</p>
				</div>
			</div>
		</SectionLayout>
	);
}
