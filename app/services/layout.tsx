import Footer from "@/components/global/footer";
export default function ServicesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<main className='container'>{children}</main>
			<Footer />
		</>
	);
}
