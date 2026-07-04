import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BackToCaseStudies() {
	return (
		<Link
			href='/case-studies'
			className='group inline-flex w-fit items-center gap-2 self-start text-sm font-medium text-muted-foreground transition-colors hover:text-primary'>
			<ArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-0.5' />
			Back to Case Studies
		</Link>
	);
}

export default BackToCaseStudies;
