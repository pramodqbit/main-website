import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";
import SectionLayout from "@/components/global/section-layout";
import CompanyStory from "./_components/company-story";
import OurValues from "./_components/our-values";
import CompanyStats from "./_components/company-stats";
import { Building2, Target, TrendingUp, Users, Award, Lightbulb } from "lucide-react";

const ICON_SIZE = 32;

export default function AboutUsPage() {
	return (
		<div className=''>
			<main className='container'>
				<Navbar />
				
				<SectionLayout
					id='company-story'
					badgeIcon={<Building2 size={ICON_SIZE} className='text-primary' />}
					badgeLabel='Our Story'
					title='Building the Future of Digital Innovation'
					description='Founded with a vision to transform businesses through cutting-edge technology, QBITLOG has grown from a small startup to a leading digital solutions provider, helping companies worldwide achieve their digital transformation goals.'>
					<CompanyStory />
				</SectionLayout>

				<SectionLayout
					id='our-values'
					badgeIcon={<Target size={ICON_SIZE} className='text-primary' />}
					badgeLabel='Our Values'
					title='What Drives Us Forward'
					description='Our core values shape every project we undertake and every relationship we build. These principles guide our decisions and ensure we deliver exceptional results.'>
					<OurValues />
				</SectionLayout>

				<SectionLayout
					id='company-stats'
					badgeIcon={<TrendingUp size={ICON_SIZE} className='text-primary' />}
					badgeLabel='Our Impact'
					title='Numbers That Speak'
					description='Our track record of success is reflected in the numbers. We measure our success by the success of our clients.'>
					<CompanyStats />
				</SectionLayout>

				<SectionLayout
					id='why-choose-us'
					badgeIcon={<Award size={ICON_SIZE} className='text-primary' />}
					badgeLabel='Why Choose Us'
					title='What Sets Us Apart'
					description='We combine technical expertise with creative vision to deliver cutting-edge solutions that drive business growth and user engagement.'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						<div className='text-center p-6 rounded-lg border bg-card'>
							<Users className='w-12 h-12 mx-auto mb-4 text-primary' />
							<h3 className='text-lg font-semibold mb-2'>Expert Team</h3>
							<p className='text-sm text-muted-foreground'>Dedicated professionals with years of experience in cutting-edge technologies</p>
						</div>
						<div className='text-center p-6 rounded-lg border bg-card'>
							<Lightbulb className='w-12 h-12 mx-auto mb-4 text-primary' />
							<h3 className='text-lg font-semibold mb-2'>Innovation First</h3>
							<p className='text-sm text-muted-foreground'>We stay ahead of the curve with the latest technologies and methodologies</p>
						</div>
						<div className='text-center p-6 rounded-lg border bg-card'>
							<Award className='w-12 h-12 mx-auto mb-4 text-primary' />
							<h3 className='text-lg font-semibold mb-2'>Proven Results</h3>
							<p className='text-sm text-muted-foreground'>Track record of delivering successful projects that exceed client expectations</p>
						</div>
					</div>
				</SectionLayout>
			</main>
			<Footer />
		</div>
	);
}
