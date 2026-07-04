import { FileText, Target } from "lucide-react";

const TONES = {
	about: { icon: FileText, tile: "bg-violet-100 text-violet-600" },
	challenge: { icon: Target, tile: "bg-orange-100 text-orange-500" },
} as const;

/** Icon-headed narrative card, e.g. "About the Project" / "The Challenge". */
export function InfoCard({
	tone,
	title,
	text,
}: {
	tone: keyof typeof TONES;
	title: string;
	text?: string;
}) {
	if (!text) return null;
	const { icon: Icon, tile } = TONES[tone];

	return (
		<div className='h-full rounded-2xl border border-border/60 bg-white p-6 shadow-sm md:p-8'>
			<div className='flex items-start gap-4'>
				<div
					className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${tile}`}>
					<Icon className='h-5 w-5' />
				</div>
				<div className='min-w-0'>
					<h2 className='pt-0.5 text-lg font-bold text-foreground md:text-xl'>
						{title}
					</h2>
					<p className='mt-3 text-sm leading-relaxed text-muted-foreground'>
						{text}
					</p>
				</div>
			</div>
		</div>
	);
}

export default InfoCard;
