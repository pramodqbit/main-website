import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "./SectionHeading";

/** Turns the comma-separated `results` sentence into impact bullet cards. */
function toImpacts(results?: string): string[] {
	if (!results) return [];
	return results
		.split(",")
		.map((s) =>
			s
				.replace(/\.$/, "")
				.replace(/^\s*and\s+/i, "")
				.trim(),
		)
		.filter(Boolean)
		.map((s) => s.charAt(0).toUpperCase() + s.slice(1));
}

export function BusinessImpact({ results }: { results?: string }) {
	const impacts = toImpacts(results);
	if (impacts.length === 0) return null;

	return (
		<Card className='rounded-3xl bg-white'>
			<CardContent>
				<SectionHeading
					title='Business Impact'
					subtitle='The measurable outcomes this project delivered for the business.'
				/>
				<div className='grid gap-4 sm:grid-cols-2'>
					{impacts.map((impact) => (
						<div
							key={impact}
							className='flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/20 p-5'>
							<span className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600'>
								<TrendingUp className='h-4 w-4' />
							</span>
							<p className='text-sm font-medium leading-relaxed text-foreground'>
								{impact}
							</p>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export default BusinessImpact;
