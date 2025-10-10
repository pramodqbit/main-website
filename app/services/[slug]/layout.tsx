import CoreCompetencies from "@/components/global/core-competencies";
import CtaBanner from "@/components/global/cta-banner";
import HowItWorks from "@/components/global/how-it-works";
import Navbar from "@/components/global/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<Navbar />

			{children}
			<div className='mt-10'>
				<CoreCompetencies className='border-none' />
				<HowItWorks className='border-none -mt-10' />
				<CtaBanner />
			</div>
		</div>
	);
}
