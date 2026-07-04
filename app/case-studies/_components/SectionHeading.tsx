import { cn } from "@/lib/utils";

/**
 * Single, consistent, left-aligned section heading for the case-study page.
 * Keeps the page reading as one cohesive story — no centered/gradient eyebrows.
 */
export function SectionHeading({
	title,
	subtitle,
	action,
	className,
}: {
	title: string;
	subtitle?: string;
	action?: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"mb-8 flex items-end justify-between gap-4",
				className,
			)}>
			<div className=''>
				<h2 className='text-2xl font-bold tracking-tight text-foreground md:text-3xl'>
					{title}
				</h2>
				{subtitle && (
					<p className='mt-3 text-base leading-relaxed text-muted-foreground'>
						{subtitle}
					</p>
				)}
			</div>
			{action && <div className='flex-shrink-0'>{action}</div>}
		</div>
	);
}

export default SectionHeading;
