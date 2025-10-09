import Navbar from "@/components/global/navbar";
import Hero from "@/app/_home/components/hero";
import OurMarque from "@/components/global/our-marque";
import About from "@/app/_home/components/about";
import Services from "@/components/global/services";
import {
	Star,
	Sparkles,
	Shield,
	DollarSign,
	Award,
	HelpCircle,
} from "lucide-react";
import HowItWorks from "@/components/global/how-it-works";
import ContactUs from "@/components/global/contact-us";
import Footer from "@/components/global/footer";
import FAQ from "@/components/global/faq";
import SectionLayout from "@/components/global/section-layout";
const ICON_SIZE = 32;

export default function Home() {
	const Items = [
		{
			icon: <Sparkles size={ICON_SIZE} className='text-primary' />,
			label: "Deliver On Time",
		},
		{
			icon: <Shield size={ICON_SIZE} className='text-primary' />,
			label: "Security",
		},
		{
			icon: <DollarSign size={ICON_SIZE} className='text-primary' />,
			label: "Pricing",
		},
		{
			icon: <Star size={ICON_SIZE} className='text-primary' />,
			label: "Quality",
		},
	];
	return (
		<div className=''>
			<main className='container'>
				<Navbar />
				<Hero />
				<OurMarque Items={Items} />
				<SectionLayout
					id='about'
					badgeIcon={<Award size={ICON_SIZE} className='text-primary' />}
					badgeLabel='About Us'
					title='Empowering Your Vision with Innovative Digital Solutions'
					description='We are a team of experienced developers and designers who are passionate about creating innovative solutions for our clients.'>
					<About />
				</SectionLayout>

				<Services />
				<section id='how-it-works'>
					<HowItWorks />
				</section>

				<SectionLayout
					id='faq'
					badgeIcon={<HelpCircle size={ICON_SIZE} className='text-primary' />}
					badgeLabel='FAQ'
					title='Frequently Asked Questions'
					description='Answers to common questions about our services and solutions.'>
					<FAQ />
				</SectionLayout>
				<section id='contact-us'>
					<ContactUs />
				</section>
			</main>
			<Footer />
		</div>
	);
}
