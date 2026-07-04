import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "./SectionHeading";

/** Generic narrative section: a heading plus a paragraph, in a card. */
export function ProseSection({
	title,
	text,
}: {
	title: string;
	text?: string;
}) {
	if (!text) return null;
	return (
		<Card className='h-full rounded-3xl bg-white'>
			<CardContent>
				<SectionHeading title={title} />
				<p className='max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg'>
					{text}
				</p>
			</CardContent>
		</Card>
	);
}

export default ProseSection;
