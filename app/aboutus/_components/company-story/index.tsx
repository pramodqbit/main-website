import { Card, CardContent } from "@/components/ui/card";
import { Span } from "@/components/animation/hero-animation";
import { Calendar, MapPin, Users, Target } from "lucide-react";

const storyData = [
	{
		year: "2020",
		title: "The Beginning",
		description: "QBITLOG was founded with a vision to bridge the gap between innovative ideas and digital reality. Our journey began with a small team of passionate developers.",
		icon: <Calendar className="w-6 h-6" />,
		highlight: "Founded"
	},
	{
		year: "2021",
		title: "First Major Project",
		description: "We delivered our first enterprise-level web application, establishing our reputation for quality and reliability in the market.",
		icon: <Target className="w-6 h-6" />,
		highlight: "Breakthrough"
	},
	{
		year: "2022",
		title: "Team Expansion",
		description: "We grew our team to include UI/UX designers, mobile developers, and DevOps specialists, expanding our service offerings.",
		icon: <Users className="w-6 h-6" />,
		highlight: "Growth"
	},
	{
		year: "2023",
		title: "Global Reach",
		description: "We expanded our services internationally, working with clients across different continents and time zones.",
		icon: <MapPin className="w-6 h-6" />,
		highlight: "Expansion"
	},
	{
		year: "2024",
		title: "Innovation Leader",
		description: "Today, we're recognized as a leading digital solutions provider, continuously innovating and setting new industry standards.",
		icon: <Target className="w-6 h-6" />,
		highlight: "Leadership"
	}
];

export default function CompanyStory() {
	return (
		<div className='space-y-8'>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{storyData.map((milestone, index) => (
					<Span
						key={index}
						delay={index * 0.1}
						as='div'
						className='group'>
						<Card className='h-full hover:shadow-lg transition-all duration-300 hover:scale-105'>
							<CardContent className='p-6'>
								<div className='flex flex-col space-y-4'>
									{/* Year and Icon */}
									<div className='flex items-center justify-between'>
										<span className='text-2xl font-bold text-primary'>{milestone.year}</span>
										<div className='p-2 rounded-full bg-primary/10 text-primary'>
											{milestone.icon}
										</div>
									</div>

									{/* Title */}
									<h3 className='text-xl font-semibold text-foreground group-hover:text-primary transition-colors'>
										{milestone.title}
									</h3>

									{/* Description */}
									<p className='text-sm text-muted-foreground leading-relaxed'>
										{milestone.description}
									</p>

									{/* Highlight Badge */}
									<div className='pt-2'>
										<span className='inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full'>
											{milestone.highlight}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</Span>
				))}
			</div>
		</div>
	);
}
