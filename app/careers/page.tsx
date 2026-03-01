import Footer from "@/components/global/footer";
import Navbar from "@/components/global/navbar";
import SectionLayout from "@/components/global/section-layout";
import { Briefcase } from "lucide-react";
import JobsCard from "./__components/jobs-card";
import { getCareers } from "./__utils";

const ICON_SIZE = 32;

export default function Careers() {
	const careers = getCareers();
	return (
		<div className="">
			<main className="container">
				<Navbar />

				<SectionLayout
					id="careers"
					badgeIcon={<Briefcase size={ICON_SIZE} className="text-primary" />}
					badgeLabel="Careers"
					title="Join Our Team"
					description="We are always looking for talented professionals to join our team. If you are interested in working with us, please send us your resume."
				>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{careers.map((career) => (
							<JobsCard key={career.title} career={career} />
						))}
					</div>
				</SectionLayout>
			</main>
			<Footer />
		</div>
	);
}