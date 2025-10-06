import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";
import SectionLayout from "@/components/global/section-layout";
import TeamMembers from "./_components/team-members";
import { Users, Award, Code2, Brain } from "lucide-react";

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

				<SectionLayout
					id='expertise'
					badgeIcon={<Award size={ICON_SIZE} className='text-primary' />}
					badgeLabel='Expertise'
					title='Our Core Competencies'
					description='We combine technical expertise with creative vision to deliver cutting-edge solutions that drive business growth and user engagement.'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
						<div className='text-center p-6 rounded-lg border bg-card'>
							<Code2 className='w-12 h-12 mx-auto mb-4 text-primary' />
							<h3 className='text-lg font-semibold mb-2'>Web Development</h3>
							<p className='text-sm text-muted-foreground'>Modern frameworks, responsive design, and scalable architectures</p>
						</div>
						<div className='text-center p-6 rounded-lg border bg-card'>
							<Brain className='w-12 h-12 mx-auto mb-4 text-primary' />
							<h3 className='text-lg font-semibold mb-2'>Mobile Development</h3>
							<p className='text-sm text-muted-foreground'>Cross-platform and native mobile applications</p>
						</div>
						<div className='text-center p-6 rounded-lg border bg-card'>
							<Users className='w-12 h-12 mx-auto mb-4 text-primary' />
							<h3 className='text-lg font-semibold mb-2'>UI/UX Design</h3>
							<p className='text-sm text-muted-foreground'>User-centered design and intuitive interfaces</p>
						</div>
						<div className='text-center p-6 rounded-lg border bg-card'>
							<Award className='w-12 h-12 mx-auto mb-4 text-primary' />
							<h3 className='text-lg font-semibold mb-2'>Digital Strategy</h3>
							<p className='text-sm text-muted-foreground'>Data-driven solutions and business optimization</p>
						</div>
					</div>
				</SectionLayout>
			</main>
			<Footer />
		</div>
	);
}
