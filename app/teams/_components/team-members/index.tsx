import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Span } from "@/components/animation/hero-animation";

const teamData = [
	{
		name: "Madhusmita",
		role: "Chief Executive Officer (CEO)",
		description:
			"Visionary leader with a proven track record in driving digital transformation and business growth. Madhusmita brings strategic insight and entrepreneurial expertise to steer QBITLOG towards innovation, ensuring client success through cutting-edge solutions and exceptional service delivery.",
		skills: [
			"Strategic Planning",
			"Business Development",
			"Leadership",
			"Innovation",
		],
	},
	{
		name: "Adil",
		role: "Chief Technology Officer (CTO)",
		description:
			"As Chief Technology Officer, Adil possesses an exceptional depth of technical knowledge spanning modern frameworks, cloud architecture, and emerging technologies. His expertise in React, Node.js, AI/ML integration, and scalable system design ensures QBITLOG delivers robust, future-proof solutions that exceed client expectations.",
		skills: [
			"React",
			"Node.js",
			"Cloud Architecture",
			"AI/ML",
			"System Design",
		],
	},

	{
		name: "Srijan",
		role: "Chief Product Officer (CPO)",
		description:
			"Srijan excels at transforming ideas into market-leading products through data-driven strategies and user-centric design thinking. With expertise in product roadmapping, market analysis, and agile methodologies, he ensures every solution we build delivers maximum value and delights users at every touchpoint.",
		skills: [
			"Product Strategy",
			"User Research",
			"Agile",
			"Analytics",
			"Roadmapping",
		],
	},
	{
		name: "Hiren",
		role: "Chief Software Architect (CSA)",
		description:
			"Hiren architects enterprise-grade solutions with a focus on scalability, security, and performance. His mastery of microservices, distributed systems, cloud-native technologies, and design patterns enables QBITLOG to build resilient applications that handle millions of users while maintaining optimal performance.",
		skills: [
			"Microservices",
			"System Architecture",
			"AWS/Azure",
			"Performance Optimization",
		],
	},
	{
		name: "Muskan",
		role: "Chief Innovation Officer (CINO)",
		description:
			"Muskan spearheads QBITLOG's innovation initiatives, exploring emerging technologies like AI, blockchain, and IoT to create groundbreaking solutions. Her forward-thinking approach and passion for disruptive innovation keep our clients ahead of the curve in an ever-evolving digital landscape.",
		skills: [
			"Innovation Strategy",
			"Emerging Tech",
			"AI/Blockchain",
			"R&D",
			"Digital Transformation",
		],
	},
	{
		name: "Deepak",
		role: "Chief Operating Officer (COO)",
		description:
			"Deepak orchestrates seamless operations across all QBITLOG initiatives, optimizing processes and ensuring exceptional project execution. His expertise in operational strategy, resource management, and quality assurance guarantees that every project is delivered on time, within budget, and exceeds quality standards.",
		skills: [
			"Operations Management",
			"Process Optimization",
			"Quality Assurance",
			"Team Leadership",
		],
	},
	{
		name: "Jeevan",
		role: "Chief Growth Officer (CGO)",
		description:
			"Jeevan drives exponential growth through strategic partnerships, market expansion, and data-driven marketing initiatives. His expertise in growth hacking, customer acquisition, and revenue optimization has consistently delivered remarkable results, helping QBITLOG and our clients achieve sustainable, scalable growth.",
		skills: [
			"Growth Strategy",
			"Marketing",
			"Partnerships",
			"Revenue Optimization",
			"Analytics",
		],
	},
	{
		name: "Ashish",
		role: "Chief Financial Officer (CFO)",
		description:
			"Ashish brings financial acumen and strategic foresight to manage QBITLOG's fiscal health and investment strategies. With expertise in financial planning, risk management, and strategic forecasting, he ensures sustainable profitability while enabling smart investments in innovation and growth opportunities.",
		skills: [
			"Financial Planning",
			"Risk Management",
			"Investment Strategy",
			"Budgeting",
			"Forecasting",
		],
	},
	{
		name: "Pramod",
		role: "Software Engineer",
		description:
			"Pramod is a software engineer with a passion for building scalable and efficient systems. He is a master of modern web technologies and has a deep understanding of the latest trends in the industry.",
		skills: [
			"React",
			"Node.js",
			"MongoDB",
			"PostgreSQL",
			"Docker",
			"Kubernetes",
			"CI/CD",
			"AWS",
			"Azure",
			"GCP",
			"Firebase",
		],
	},
];

export default function TeamMembers() {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
			{teamData.map((member, index) => (
				<Span key={index} delay={index * 0.1} as='div' className='group'>
					<Card className='h-full hover:shadow-lg transition-all duration-300 hover:scale-105 border-l-4 border-l-primary/50 hover:border-l-primary'>
						<CardContent className='p-6'>
							<div className='flex flex-col space-y-4'>
								{/* Name and Role */}
								<div className='space-y-2'>
									<h3 className='text-2xl font-bold text-foreground group-hover:text-primary transition-colors'>
										{member.name}
									</h3>
									<p className='text-primary font-semibold text-sm uppercase tracking-wide'>
										{member.role}
									</p>
								</div>

								{/* Description */}
								<p className='text-sm text-muted-foreground leading-relaxed'>
									{member.description}
								</p>

								{/* Skills */}
								<div className='flex flex-wrap gap-2 pt-2'>
									{member.skills.map((skill, skillIndex) => (
										<Badge
											key={skillIndex}
											variant='secondary'
											className='text-xs px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors'>
											{skill}
										</Badge>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
				</Span>
			))}
		</div>
	);
}
