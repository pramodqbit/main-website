import Navbar from "@/components/global/navbar";
import Hero from "@/app/_home/components/hero";
import OurMarque from "@/components/global/our-marque";
import About from "@/app/_home/components/about";
import Services from "@/components/global/services";
import { Star, Sparkles, Shield, DollarSign } from "lucide-react";
import HowItWorks from "@/components/global/how-it-works";
import ContactUs from "@/components/global/contact-us";
import Footer from "@/components/global/footer";
import FAQ from "@/components/global/faq";
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
				<About />
				<Services />
				<HowItWorks />
				<FAQ />
				<ContactUs />
			</main>
			<Footer />
		</div>
	);
}
