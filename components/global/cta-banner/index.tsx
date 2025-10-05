import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CtaBanner() {
	return (
		<section className='pb-16 md:pb-24'>
			<div className='relative bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 rounded-2xl p-12 md:p-16 text-center border border-primary/10'>
				<div className='max-w-2xl mx-auto space-y-6'>
					<h2 className='text-3xl md:text-4xl font-bold'>
						Ready to Get Started?
					</h2>
					<p className='text-lg text-muted-foreground'>
						Let&apos;s discuss your project and how we can help you achieve your
						goals. Get in touch with our team today.
					</p>
					<div className='flex flex-col sm:flex-row gap-4 justify-center items-center pt-4'>
						<Link href='/#contact'>
							<Button size='lg' className='px-8'>
								Start Your Project
								<ArrowRight className='w-4 h-4 ml-2' />
							</Button>
						</Link>
						<Link href='/#faq'>
							<Button variant='outline' size='lg' className='px-8'>
								Learn More
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
