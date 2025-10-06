import CtaBanner from "@/components/global/cta-banner";
import Navbar from "@/components/global/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<Navbar />
			{children}
			<div className='mt-10'>
				<CtaBanner />
			</div>
		</div>
	);
}
