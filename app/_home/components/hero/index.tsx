import { Button } from "@/components/ui/button";
import { TextAnimate } from "@/components/ui/text-animate";
import { Span } from "@/components/animation/hero-animation";

export default function Hero() {
	const title = ["Q", "B", "I", "T", "L", "O", "G"];

	return (
		<div className='flex flex-col items-center justify-center  border-l border-r pb-10'>
			<h1 className='relative inline-block text-right text-[100px] lg:text-[245px] lg:leading-[320px] lg:tracking-[80px] ml-2'>
				{title.map((item, index) => (
					<span key={index} className='relative inline-block'>
						{/* Stroke layer */}
						<Span
							delay={index * 0.1}
							as='span'
							className='absolute lg:top-[17px] top-[7px] font-bold bg-gradient-to-r from-[#8A38F5] to-[#25D0FF] bg-clip-text text-transparent inset-0 seven-segment-font'>
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
				Crafting Digital Experiences That Drive Results
			</Span>
			<TextAnimate
				animation='blurIn'
				as='p'
				className='text-center lg:text-[24px] text-[12px]  lg:w-[1000px] w-[300px] lg:my-[40px] my-[10px]'>
				We&apos;re a leading software design agency specializing in creating
				innovative web and mobile applications that transform businesses and
				delight users.
			</TextAnimate>

			<Button className=' lg:mt-10 mt-2 lg:w-[200px] w-[100px] h-[30px] text-[12px] lg:text-[16px]'>
				Hire Us
			</Button>
		</div>
	);
}
