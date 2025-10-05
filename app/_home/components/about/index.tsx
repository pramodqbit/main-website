import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function About() {
	return (
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
	);
}
