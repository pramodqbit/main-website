import { Lightbulb } from "lucide-react";
import { Reveal } from "./Reveal";
import { ChallengeCard } from "./ChallengeCard";
import type { CaseStudy } from "../_data/types";

export function ProjectOverview({ study }: { study: CaseStudy }) {
	const about = study.overviewAbout || study.excerpt;
	if (!about && !study.challenge) return null;

	return (
		<section className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
			<Reveal className='h-full'>
				<div className='flex h-full flex-col rounded-3xl border border-border/60 bg-white p-7 shadow-sm md:p-8'>
					<div className='mb-4 flex items-center gap-3'>
						<div className='flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary'>
							<Lightbulb className='h-5 w-5' />
						</div>
						<h3 className='text-xl font-bold text-foreground'>
							About the Project
						</h3>
					</div>
					<p className='text-base leading-relaxed text-muted-foreground'>
						{about}
					</p>
				</div>
			</Reveal>
			<Reveal delay={0.1} className='h-full'>
				<ChallengeCard challenge={study.challenge} />
			</Reveal>
		</section>
	);
}

export default ProjectOverview;
