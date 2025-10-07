import { Card, CardContent } from "@/components/ui/card";
import { Span } from "@/components/animation/hero-animation";
import { Users, Code, Globe, Award, Clock, TrendingUp } from "lucide-react";

const statsData = [
	{
		number: "50+",
		label: "Projects Completed",
		description: "Successfully delivered projects across various industries",
		icon: <Code className="w-8 h-8" />,
		color: "text-blue-500"
	},
	{
		number: "25+",
		label: "Happy Clients",
		description: "Satisfied clients who trust us with their digital needs",
		icon: <Users className="w-8 h-8" />,
		color: "text-green-500"
	},
	{
		number: "15+",
		label: "Countries Served",
		description: "Global reach with clients across different continents",
		icon: <Globe className="w-8 h-8" />,
		color: "text-purple-500"
	},
	{
		number: "5+",
		label: "Years Experience",
		description: "Years of expertise in digital transformation",
		icon: <Award className="w-8 h-8" />,
		color: "text-yellow-500"
	},
	{
		number: "99%",
		label: "Client Satisfaction",
		description: "Consistently high satisfaction rates from our clients",
		icon: <TrendingUp className="w-8 h-8" />,
		color: "text-red-500"
	},
	{
		number: "24/7",
		label: "Support Available",
		description: "Round-the-clock support for all our clients",
		icon: <Clock className="w-8 h-8" />,
		color: "text-orange-500"
	}
];

export default function CompanyStats() {
	return (
		<div className='space-y-8'>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{statsData.map((stat, index) => (
					<Span
						key={index}
						delay={index * 0.1}
						as='div'
						className='group'>
						<Card className='h-full hover:shadow-lg transition-all duration-300 hover:scale-105'>
							<CardContent className='p-6'>
								<div className='flex flex-col items-center text-center space-y-4'>
									{/* Icon */}
									<div className={`p-4 rounded-full bg-gray-100 dark:bg-gray-800 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
										{stat.icon}
									</div>

									{/* Number */}
									<div className='text-4xl font-bold text-foreground group-hover:text-primary transition-colors'>
										{stat.number}
									</div>

									{/* Label */}
									<h3 className='text-lg font-semibold text-foreground'>
										{stat.label}
									</h3>

									{/* Description */}
									<p className='text-sm text-muted-foreground leading-relaxed'>
										{stat.description}
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
