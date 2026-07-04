import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "./SectionHeading";
import type { CaseStudy } from "../_data/types";

export function ClientOverview({ study }: { study: CaseStudy }) {
	const about = study.overviewAbout || study.description || study.excerpt;
	const facts = [
		{ label: "Client", value: study.client },
		{ label: "Industry", value: study.industry },
		{ label: "Project Type", value: study.projectType },
		{ label: "Duration", value: study.duration },
		{ label: "Team Size", value: study.teamSize },
	].filter((f) => f.value);

	return (
		<Card className='rounded-3xl bg-white'>
			<CardContent>
				<SectionHeading title='Client Overview' />
				<p className='max-w-4xl text-base leading-relaxed text-muted-foreground md:text-lg'>
					{about}
				</p>
				<div className='mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5'>
					{facts.map((f) => (
						<div
							key={f.label}
							className='rounded-2xl border border-border/60 bg-muted/20 px-4 py-3'>
							<p className='text-xs font-medium text-muted-foreground'>
								{f.label}
							</p>
							<p className='mt-1 text-sm font-semibold text-foreground'>
								{f.value}
							</p>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export default ClientOverview;
