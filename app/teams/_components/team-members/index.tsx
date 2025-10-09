import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Span } from "@/components/animation/hero-animation";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";

const teamData = [
	{
		name: "Arup",
		role: "Chief Executive Officer (CEO)",
		image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
		alt: "Arup, Chief Executive Officer leading QBITLOG with strategic vision and innovation",
		description: "Visionary leader with a proven track record in driving digital transformation and business growth. Arup brings strategic insight and entrepreneurial expertise to steer QBITLOG towards innovation, ensuring client success through cutting-edge solutions and exceptional service delivery.",
		skills: ["Strategic Planning", "Business Development", "Leadership", "Innovation"],
		social: {
			github: "https://github.com/arup",
			linkedin: "https://linkedin.com/in/arup",
			email: "arup@qbitlog.com"
		}
	},
	{
		name: "Adil",
		role: "Chief Technology Officer (CTO)",
		image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
		alt: "Adil, Chief Technology Officer with deep technical expertise and innovation mindset",
		description: "As Chief Technology Officer, Adil possesses an exceptional depth of technical knowledge spanning modern frameworks, cloud architecture, and emerging technologies. His expertise in React, Node.js, AI/ML integration, and scalable system design ensures QBITLOG delivers robust, future-proof solutions that exceed client expectations.",
		skills: ["React", "Node.js", "Cloud Architecture", "AI/ML", "System Design"],
		social: {
			github: "https://github.com/adil",
			linkedin: "https://linkedin.com/in/adil",
			email: "adil@qbitlog.com"
		}
	},
	{
		name: "Srijan",
		role: "Chief Product Officer (CPO)",
		image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
		alt: "Srijan, Chief Product Officer crafting exceptional product experiences",
		description: "Srijan excels at transforming ideas into market-leading products through data-driven strategies and user-centric design thinking. With expertise in product roadmapping, market analysis, and agile methodologies, he ensures every solution we build delivers maximum value and delights users at every touchpoint.",
		skills: ["Product Strategy", "User Research", "Agile", "Analytics", "Roadmapping"],
		social: {
			github: "https://github.com/srijan",
			linkedin: "https://linkedin.com/in/srijan",
			email: "srijan@qbitlog.com"
		}
	},
	{
		name: "Hiren",
		role: "Chief Software Architect (CSA)",
		image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
		alt: "Hiren, Chief Software Architect designing scalable and resilient systems",
		description: "Hiren architects enterprise-grade solutions with a focus on scalability, security, and performance. His mastery of microservices, distributed systems, cloud-native technologies, and design patterns enables QBITLOG to build resilient applications that handle millions of users while maintaining optimal performance.",
		skills: ["Microservices", "System Architecture", "AWS/Azure", "Performance Optimization"],
		social: {
			github: "https://github.com/hiren",
			linkedin: "https://linkedin.com/in/hiren",
			email: "hiren@qbitlog.com"
		}
	},
	{
		name: "Muskan",
		role: "Chief Innovation Officer (CINO)",
		image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
		alt: "Muskan, Chief Innovation Officer driving breakthrough innovations and digital transformation",
		description: "Muskan spearheads QBITLOG's innovation initiatives, exploring emerging technologies like AI, blockchain, and IoT to create groundbreaking solutions. Her forward-thinking approach and passion for disruptive innovation keep our clients ahead of the curve in an ever-evolving digital landscape.",
		skills: ["Innovation Strategy", "Emerging Tech", "AI/Blockchain", "R&D", "Digital Transformation"],
		social: {
			github: "https://github.com/muskan",
			linkedin: "https://linkedin.com/in/muskan",
			email: "muskan@qbitlog.com"
		}
	},
	{
		name: "Deepak",
		role: "Chief Operating Officer (COO)",
		image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
		alt: "Deepak, Chief Operating Officer ensuring operational excellence and efficiency",
		description: "Deepak orchestrates seamless operations across all QBITLOG initiatives, optimizing processes and ensuring exceptional project execution. His expertise in operational strategy, resource management, and quality assurance guarantees that every project is delivered on time, within budget, and exceeds quality standards.",
		skills: ["Operations Management", "Process Optimization", "Quality Assurance", "Team Leadership"],
		social: {
			github: "https://github.com/deepak",
			linkedin: "https://linkedin.com/in/deepak",
			email: "deepak@qbitlog.com"
		}
	},
	{
		name: "Jeevan",
		role: "Chief Growth Officer (CGO)",
		image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
		alt: "Jeevan, Chief Growth Officer accelerating business expansion and market reach",
		description: "Jeevan drives exponential growth through strategic partnerships, market expansion, and data-driven marketing initiatives. His expertise in growth hacking, customer acquisition, and revenue optimization has consistently delivered remarkable results, helping QBITLOG and our clients achieve sustainable, scalable growth.",
		skills: ["Growth Strategy", "Marketing", "Partnerships", "Revenue Optimization", "Analytics"],
		social: {
			github: "https://github.com/jeevan",
			linkedin: "https://linkedin.com/in/jeevan",
			email: "jeevan@qbitlog.com"
		}
	},
	{
		name: "Ashish",
		role: "Chief Financial Officer (CFO)",
		image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
		alt: "Ashish, Chief Financial Officer ensuring financial stability and strategic investment",
		description: "Ashish brings financial acumen and strategic foresight to manage QBITLOG's fiscal health and investment strategies. With expertise in financial planning, risk management, and strategic forecasting, he ensures sustainable profitability while enabling smart investments in innovation and growth opportunities.",
		skills: ["Financial Planning", "Risk Management", "Investment Strategy", "Budgeting", "Forecasting"],
		social: {
			github: "https://github.com/ashish",
			linkedin: "https://linkedin.com/in/ashish",
			email: "ashish@qbitlog.com"
		}
	}
];

export default function TeamMembers() {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
			{teamData.map((member, index) => (
				<Span
					key={index}
					delay={index * 0.1}
					as='div'
					className='group'>
					<Card className='h-full hover:shadow-lg transition-all duration-300 hover:scale-105'>
						<CardContent className='p-6'>
							<div className='flex flex-col items-center text-center space-y-4'>
								{/* Profile Image */}
								<div className='relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/40 transition-colors'>
									<img
										src={member.image}
										alt={member.alt}
										className='w-full h-full object-cover'
									/>
								</div>

								{/* Name and Role */}
								<div className='space-y-2'>
									<h3 className='text-xl font-bold text-foreground group-hover:text-primary transition-colors'>
										{member.name}
									</h3>
									<p className='text-primary font-medium'>
										{member.role}
									</p>
								</div>

								{/* Description */}
								<p className='text-sm text-muted-foreground leading-relaxed'>
									{member.description}
								</p>

								{/* Skills */}
								<div className='flex flex-wrap gap-2 justify-center'>
									{member.skills.map((skill, skillIndex) => (
										<Badge
											key={skillIndex}
											variant='secondary'
											className='text-xs px-2 py-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors'>
											{skill}
										</Badge>
									))}
								</div>

								{/* Social Links */}
								<div className='flex gap-3 pt-2'>
									<a
										href={member.social.github}
										target='_blank'
										rel='noopener noreferrer'
										className='p-2 rounded-full bg-muted hover:bg-primary hover:text-white transition-all duration-200 group/link'>
										<Github className='w-4 h-4' />
									</a>
									<a
										href={member.social.linkedin}
										target='_blank'
										rel='noopener noreferrer'
										className='p-2 rounded-full bg-muted hover:bg-primary hover:text-white transition-all duration-200 group/link'>
										<Linkedin className='w-4 h-4' />
									</a>
									<a
										href={`mailto:${member.social.email}`}
										className='p-2 rounded-full bg-muted hover:bg-primary hover:text-white transition-all duration-200 group/link'>
										<Mail className='w-4 h-4' />
									</a>
								</div>
							</div>
						</CardContent>
					</Card>
				</Span>
			))}
		</div>
	);
}
