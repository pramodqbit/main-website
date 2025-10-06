import { Card, CardContent } from "@/components/ui/card";
import { Span } from "@/components/animation/hero-animation";
import { Heart, Shield, Lightbulb, Users, Target, Zap } from "lucide-react";

const valuesData = [
	{
		title: "Client-Centric Approach",
		description: "We put our clients at the heart of everything we do. Their success is our success, and we're committed to understanding their unique needs and challenges.",
		icon: <Heart className="w-8 h-8" />,
		color: "text-red-500"
	},
	{
		title: "Quality & Reliability",
		description: "We maintain the highest standards of quality in every project. Our commitment to excellence ensures reliable, scalable, and maintainable solutions.",
		icon: <Shield className="w-8 h-8" />,
		color: "text-blue-500"
	},
	{
		title: "Innovation & Creativity",
		description: "We embrace new technologies and creative solutions. Our team constantly explores innovative approaches to solve complex problems.",
		icon: <Lightbulb className="w-8 h-8" />,
		color: "text-yellow-500"
	},
	{
		title: "Collaboration & Teamwork",
		description: "We believe in the power of collaboration. Our diverse team works together seamlessly to deliver exceptional results for our clients.",
		icon: <Users className="w-8 h-8" />,
		color: "text-green-500"
	},
	{
		title: "Transparency & Integrity",
		description: "We maintain complete transparency in our processes and communications. Honesty and integrity form the foundation of all our relationships.",
		icon: <Target className="w-8 h-8" />,
		color: "text-purple-500"
	},
	{
		title: "Continuous Learning",
		description: "We're passionate about learning and growing. Our team continuously updates their skills to stay ahead of technological advancements.",
		icon: <Zap className="w-8 h-8" />,
		color: "text-orange-500"
	}
];

export default function OurValues() {
	return (
		<div className='space-y-8'>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{valuesData.map((value, index) => (
					<Span
						key={index}
						delay={index * 0.1}
						as='div'
						className='group'>
						<Card className='h-full hover:shadow-lg transition-all duration-300 hover:scale-105'>
							<CardContent className='p-6'>
								<div className='flex flex-col items-center text-center space-y-4'>
									{/* Icon */}
									<div className={`p-4 rounded-full bg-gray-100 dark:bg-gray-800 ${value.color} group-hover:scale-110 transition-transform duration-300`}>
										{value.icon}
									</div>

									{/* Title */}
									<h3 className='text-xl font-semibold text-foreground group-hover:text-primary transition-colors'>
										{value.title}
									</h3>

									{/* Description */}
									<p className='text-sm text-muted-foreground leading-relaxed'>
										{value.description}
									</p>
								</div>
							</CardContent>
						</Card>
					</Span>
				))}
			</div>
		</div>
	);
}
