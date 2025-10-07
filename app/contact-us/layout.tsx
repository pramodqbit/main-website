import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";
import FAQ from "@/components/global/faq";
import SectionLayout from "@/components/global/section-layout";
import { HelpCircle } from "lucide-react";

export default function ContactUsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<main className='container mx-auto'>
				<Navbar />
				{children}
				<SectionLayout
					badgeLabel='FAQ'
					badgeIcon={<HelpCircle size={32} className='text-primary' />}
					title='Frequently Asked Questions'
					description='Answers to common questions about our services and solutions.'
					id='faq'
					className='mt-0 border-b-0'>
					<FAQ />
				</SectionLayout>
			</main>
			<Footer />
		</>
	);
}
