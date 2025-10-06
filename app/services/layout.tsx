import FAQ from "@/components/global/faq";
import Footer from "@/components/global/footer";
import SectionLayout from "@/components/global/section-layout";
import ContactUs from "@/components/global/contact-us";
import { HelpCircle } from "lucide-react";
import Navbar from "@/components/global/navbar";
const ICON_SIZE = 32;
export default function ServicesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<main className='container'>
				{children}
				<SectionLayout
					id='faq'
					className='border-none'
					badgeLabel='FAQ'
					badgeIcon={<HelpCircle size={ICON_SIZE} className='text-primary' />}
					title='Frequently Asked Questions'
					description='Answers to common questions about our services and solutions.'>
					<FAQ />
				</SectionLayout>
				<ContactUs />
			</main>
			<Footer />
		</>
	);
}
