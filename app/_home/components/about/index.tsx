import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { TextAnimate } from "@/components/ui/text-animate";

export default function About() {
	return (
		<div className='flex flex-col items-center justify-center py-10 border'>
			<TextAnimate className='lg:text-[32px] text-[16px] text-center font-bold lg:mb-8 mb-4 text-purple-500'>
				About us
			</TextAnimate>
			<TextAnimate
				animation='fadeIn'
				by='line'
				className='text-gray-500 text-center lg:text-[24px] text-[12px] lg:mb-10 mb-4 lg:w-[1200px] w-[320px]'>
				Lorem Ipsum is simply dummy text of the printing and typesetting
				industry. Lorem Ipsum has been the industry&apos;s standard dummy text
				ever since the 1500s, when an unknown printer took a galley of type and
				scrambled it to make a type specimen book. It has survived not only five
			</TextAnimate>
			<div className='flex lg:flex-row lg:gap-4 gap-1 items-center justify-center mt-4'>
				{[1, 2, 3].map((item, index) => (
					<Card key={index}>
						<CardContent>
							<Image
								src={`/images/about/${item}.png`}
								alt={item.toString()}
								className='lg:w-[370px] w-[70px] lg:h-[370px] h-[70px]'
								width={370}
								height={370}
							/>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
