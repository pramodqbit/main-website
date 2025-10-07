import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";
import SectionLayout from "@/components/global/section-layout";
import TeamMembers from "./_components/team-members";
import { Users } from "lucide-react";
import CoreCompetencies from "@/components/global/core-competencies";

const ICON_SIZE = 32;

export default function TeamsPage() {
	return (
		<div className=''>
			<main className='container'>
				<Navbar />

				<SectionLayout
					id='teams'
					badgeIcon={<Users size={ICON_SIZE} className='text-primary' />}
					badgeLabel='Our Team'
					title='Meet the Experts Behind QBITLOG'
					description='Our diverse team of skilled professionals brings together years of experience in web development, mobile applications, and digital innovation to deliver exceptional results for our clients.'>
					<TeamMembers />
				</SectionLayout>

				<CoreCompetencies />
			</main>
			<Footer />
		</div>
	);
}
