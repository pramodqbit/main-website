import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "./SectionHeading";
import { FeatureGrid } from "./FeatureGrid";
import type { CaseStudyFeature } from "../_data/types";

export function ProductivityImprovements({
	features,
}: {
	features?: CaseStudyFeature[];
}) {
	if (!features || features.length === 0) return null;
	return (
		<Card className='rounded-3xl bg-white'>
			<CardContent>
				<SectionHeading
					title='Productivity Improvements'
					subtitle='How the solution made day-to-day work faster and more reliable.'
				/>
				<FeatureGrid features={features} />
			</CardContent>
		</Card>
	);
}

export default ProductivityImprovements;
