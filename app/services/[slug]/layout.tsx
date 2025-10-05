import CtaBanner from "@/components/global/cta-banner";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			{children}
			<div className='mt-10'>
				<CtaBanner />
			</div>
		</div>
	);
}
