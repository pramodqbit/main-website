import { Card, CardContent } from "@/components/ui/card";
import { Span } from "@/components/animation/hero-animation";
import { Calendar, MapPin, Users, Target } from "lucide-react";

const storyData = [
	{
		year: "Our Vision",
		title: "Expertise-Driven Excellence",
		description: "QBITLOG brings together seasoned professionals with decades of combined experience in software development, cloud architecture, and digital transformation. Our leadership team has successfully delivered enterprise solutions across Fortune 500 companies and innovative startups alike.",
		icon: <Target className="w-6 h-6" />,
		highlight: "Expert Team"
	},
	{
		year: "Our Mission",
		title: "Client Success Through Innovation",
		description: "We leverage cutting-edge technologies and proven methodologies to deliver solutions that exceed expectations. Each team member brings specialized expertise from leading tech companies, ensuring world-class quality in every project we undertake.",
		icon: <Target className="w-6 h-6" />,
		highlight: "Excellence"
	},
	{
		year: "Our Approach",
		title: "Agile & Scalable Solutions",
		description: "Our architects and developers have built systems handling millions of users. We apply enterprise-grade best practices, DevOps excellence, and modern frameworks to create robust, future-proof applications that scale effortlessly with your business growth.",
		icon: <Users className="w-6 h-6" />,
		highlight: "Proven Methods"
	},
	{
		year: "Our Reach",
		title: "Global Standards, Local Touch",
		description: "With experience serving international markets and diverse industries, our team understands global business requirements. We combine international best practices with personalized attention, ensuring your project receives the expertise it deserves regardless of scale.",
		icon: <MapPin className="w-6 h-6" />,
		highlight: "Global Expertise"
	},
	{
		year: "Our Promise",
		title: "Innovation & Reliability",
		description: "We stay ahead of technology trends through continuous learning and R&D. Our innovation-first culture, combined with rigorous quality standards, ensures you receive cutting-edge solutions built on stable, reliable foundations that drive real business results.",
		icon: <Calendar className="w-6 h-6" />,
		highlight: "Future-Ready"
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
