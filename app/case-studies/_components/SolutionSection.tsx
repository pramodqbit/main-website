import { SectionHeading } from "./SectionHeading";
import { FeatureGrid } from "./FeatureGrid";
import type { CaseStudy } from "../_data/types";
import { Card, CardContent } from "@/components/ui/card";

export function SolutionSection({ study }: { study: CaseStudy }) {
	const intro = study.solutionIntro || study.solution;
	if (!intro && (!study.solutionFeatures || study.solutionFeatures.length === 0))
		return null;

	return (
		<Card className="bg-white">
			<CardContent>

				<SectionHeading title='Our Solution' subtitle={intro} />
				<FeatureGrid features={study.solutionFeatures} />
			</CardContent>
		</Card>
	);
}

export default SolutionSection;
