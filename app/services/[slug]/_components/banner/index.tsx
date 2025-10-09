import { cn } from "@/lib/utils";
export default function ServiceBanner({ title }: { title: string }) {
	return (
		<div className='border rounded-xl p-4 bg-secondary/10 mt-10'>
			<p
				className={cn(
					"  text-center  seven-segment-font bg-clip-text   text-transparent bg-gradient-to-r from-primary to-secondary",
					"text-[40px] md:text-[60px] lg:text-[100px] text-wrap lg:text-nowrap ",
					"leading-[40px] md:leading-[60px] lg:leading-[100px]",
				)}>
				{title}
			</p>
		</div>
	);
}
