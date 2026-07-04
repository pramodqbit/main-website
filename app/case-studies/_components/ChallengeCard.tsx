import { AlertTriangle } from "lucide-react";

export function ChallengeCard({ challenge }: { challenge?: string }) {
	if (!challenge) return null;
	return (
		<div className='flex h-full flex-col rounded-3xl border border-border/60 bg-white p-7 shadow-sm md:p-8'>
			<div className='mb-4 flex items-center gap-3'>
				<div className='flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600'>
					<AlertTriangle className='h-5 w-5' />
				</div>
				<h3 className='text-xl font-bold text-foreground'>The Challenge</h3>
			</div>
			<p className='text-base leading-relaxed text-muted-foreground'>
				{challenge}
			</p>
		</div>
	);
}

export default ChallengeCard;
