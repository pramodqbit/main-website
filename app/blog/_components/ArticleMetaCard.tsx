import { Clock, BookOpen, Calendar } from "lucide-react";
import { ShareButtons } from "./ShareButtons";

export function ArticleMetaCard({
	readingTime,
	category,
	lastUpdated,
	title,
}: {
	readingTime: number;
	category: string;
	lastUpdated: string;
	title: string;
}) {
	const rows = [
		{ icon: Clock, label: "Reading Time", value: `${readingTime} Minutes` },
		{ icon: BookOpen, label: "Category", value: category },
		{ icon: Calendar, label: "Last Updated", value: lastUpdated },
	];

	return (
		<div className='rounded-2xl border border-border/60 bg-white p-6 shadow-sm'>
			<div className='space-y-4'>
				{rows.map(({ icon: Icon, label, value }) => (
					<div
						key={label}
						className='flex items-center gap-3 border-b border-border/40 pb-4 last:border-0 last:pb-0'>
						<div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary'>
							<Icon className='h-4 w-4' />
						</div>
						<div className='min-w-0'>
							<p className='text-xs text-muted-foreground'>{label}</p>
							<p className='mt-0.5 text-sm font-semibold text-foreground'>
								{value}
							</p>
						</div>
					</div>
				))}
			</div>
			<div className='mt-5 border-t border-border/40 pt-5'>
				<p className='mb-3 text-sm font-semibold text-foreground'>Share</p>
				<ShareButtons title={title} />
			</div>
		</div>
	);
}

export default ArticleMetaCard;
