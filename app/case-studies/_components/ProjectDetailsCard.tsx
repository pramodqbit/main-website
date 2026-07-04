import type { CaseStudy } from "../_data/types";

export function ProjectDetailsCard({ study }: { study: CaseStudy }) {
	const rows: { label: string; value?: string }[] = [
		{ label: "Industry", value: study.industry },
		{ label: "Project Type", value: study.projectType },
		{ label: "Duration", value: study.duration },
		{ label: "Team Size", value: study.teamSize },
		{
			label: "Technologies",
			value: study.technologies.map((t) => t.name).join(", "),
		},
	];
	const visible = rows.filter((r) => r.value);

	return (
		<div className='h-full rounded-2xl border border-border/60 bg-white p-6 shadow-sm md:p-8'>
			<h2 className='text-lg font-bold text-foreground md:text-xl'>
				Project Details
			</h2>
			<dl className='mt-5 space-y-4'>
				{visible.map((r) => (
					<div
						key={r.label}
						className='grid grid-cols-[110px_1fr] items-baseline gap-3'>
						<dt className='text-sm text-muted-foreground'>{r.label}</dt>
						<dd className='text-sm font-semibold leading-relaxed text-foreground'>
							{r.value}
						</dd>
					</div>
				))}
			</dl>
		</div>
	);
}

export default ProjectDetailsCard;
