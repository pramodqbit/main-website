import { Button } from "@/components/ui/button";
import { TextAnimate } from "@/components/ui/text-animate";
import { Span } from "@/components/animation/hero-animation";
import { cn } from "@/lib/utils";

export default function Hero() {
	const title = ["Q", "B", "I", "T", "L", "O", "G"];

	return (
		<section className='flex flex-col items-center justify-center  border-l border-r md:pb-10 pb-5 overflow-hidden' aria-label='Hero Section'>
			<h1
				className={cn(
					"relative  text-right  ml-2 text-nowrap",
					"sm:text-[100px] text-[80px] md:text-[150px] lg:text-[150px]  xl:text-[200px] 2xl:text-[300px]",
					" leading-[120px] lg:leading-[220px] xl:leading-[220px] 2xl:leading-[320px]",
					"lg:tracking-[50px]",
				)}>
				{title.map((item, index) => (
					<span key={index} className='relative inline-block'>
						{/* Stroke layer */}
						<Span
							delay={index * 0.1}
							as='span'
							className={cn(
								"absolute  font-bold bg-gradient-to-r from-[#8A38F5] to-[#25D0FF] bg-clip-text text-transparent inset-0 seven-segment-font",
								" top-[6px] sm:top-[7px] md:top-[11px] lg:top-[10px] xl:top-[14px] 2xl:top-[20px]",
							)}>
							{item}
						</Span>

						{/* Fill layer */}
						<Span
							delay={index * 0.1}
							as='span'
							className='relative seven-segment-font text-white'>
							{item}
						</Span>
					</span>
				))}
			</h1>

			<Span
				delay={0.3}
				as='h2'
				className='text-center lg:text-[48px] md:text-[24px] text-[16px] font-semibold bg-gradient-to-r from-[#8A38F5] to-[#25D0FF] bg-clip-text text-transparent'>
				Crafting AI Powered Digital Experiences That Drive Results
			</Span>
			<TextAnimate
				animation='blurIn'
				as='p'
				className='text-center lg:text-[24px] text-[12px]  lg:w-[1000px] md:w-[600px] w-[290px] sm:w-[300px] lg:my-[40px] my-[10px]'>
				We&apos;re a leading software design agency specializing in creating
				innovative web, mobile, and AI-driven applications that transform
				businesses and delight users.
			</TextAnimate>

			<Button
				className={cn(
					" lg:w-[200px] w-[100px]   text-[12px] lg:text-[16px]",
					" mt-2  lg:mt-2",
					"h-[30px] lg:h-[50px]",
				)}
				aria-label='Contact us to hire our services'>
				Hire Us
			</Button>
		</section>
	);
}
