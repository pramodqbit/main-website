import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

const about_data = [
	{
		url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
		alt: "Professional development team collaborating on web development project with modern laptops and multiple monitors",
	},
	{
		url: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
		alt: "Software development workspace with code on screen, showcasing modern web development technologies and programming",
	},
	{
		url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80",
		alt: "Business analytics dashboard and data visualization representing our IT consulting and digital transformation services",
	},
];
export default function About() {
	return (
		<div className='flex lg:flex-row  gap-1 lg:gap-4 items-center justify-center '>
			{about_data.map((item, index) => (
				<Card
					key={index}
					className={cn("p-0 overflow-hidden", "rounded-sm md:rounded-md")}>
					<CardContent className='p-0'>
						<Image
							src={item.url}
							alt={item.alt}
							className={cn(
								" object-cover hover:scale-105 transition-all duration-300",
								" w-[100px] sm:w-[150px] md:w-[220px] lg:w-[370px]",
								" h-[100px] sm:h-[150px] md:h-[220px] lg:h-[370px]",
							)}
							width={370}
							height={370}
							loading='lazy'
							quality={100}
						/>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
