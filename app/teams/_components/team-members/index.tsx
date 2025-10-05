import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Span } from "@/components/animation/hero-animation";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";

const teamData = [
	{
		name: "Sarah Johnson",
		role: "Lead Developer & CTO",
		image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
		alt: "Sarah Johnson, Lead Developer and CTO with expertise in full-stack development",
		description: "Full-stack developer with 8+ years of experience in React, Node.js, and cloud architecture. Passionate about building scalable web applications.",
		skills: ["React", "Node.js", "AWS", "TypeScript"],
		social: {
			github: "https://github.com/sarahjohnson",
			linkedin: "https://linkedin.com/in/sarahjohnson",
			email: "sarah@qbitlog.com"
		}
	},
	{
		name: "Michael Chen",
		role: "Senior Mobile Developer",
		image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
		alt: "Michael Chen, Senior Mobile Developer specializing in React Native and Flutter",
		description: "Mobile development expert specializing in React Native and Flutter. Has launched 20+ apps on both iOS and Android platforms.",
		skills: ["React Native", "Flutter", "Swift", "Kotlin"],
		social: {
			github: "https://github.com/michaelchen",
			linkedin: "https://linkedin.com/in/michaelchen",
			email: "michael@qbitlog.com"
		}
	},
	{
		name: "Emily Rodriguez",
		role: "UI/UX Designer",
		image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
		alt: "Emily Rodriguez, UI/UX Designer creating beautiful and intuitive user experiences",
		description: "Creative designer with a focus on user-centered design. Expert in Figma, Adobe Creative Suite, and creating engaging digital experiences.",
		skills: ["Figma", "Adobe XD", "Sketch", "Prototyping"],
		social: {
			github: "https://github.com/emilyrodriguez",
			linkedin: "https://linkedin.com/in/emilyrodriguez",
			email: "emily@qbitlog.com"
		}
	},
	{
		name: "David Kim",
		role: "DevOps Engineer",
		image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
		alt: "David Kim, DevOps Engineer ensuring reliable and scalable infrastructure",
		description: "DevOps specialist with expertise in AWS, Docker, and CI/CD pipelines. Ensures our applications are secure, scalable, and performant.",
		skills: ["AWS", "Docker", "Kubernetes", "Jenkins"],
		social: {
			github: "https://github.com/davidkim",
			linkedin: "https://linkedin.com/in/davidkim",
			email: "david@qbitlog.com"
		}
	},
	{
		name: "Lisa Wang",
		role: "Digital Marketing Specialist",
		image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
		alt: "Lisa Wang, Digital Marketing Specialist driving growth through data-driven strategies",
		description: "Marketing expert with 6+ years in digital strategy, SEO, and social media. Helps businesses grow their online presence and reach.",
		skills: ["SEO", "Google Ads", "Social Media", "Analytics"],
		social: {
			github: "https://github.com/lisawang",
			linkedin: "https://linkedin.com/in/lisawang",
			email: "lisa@qbitlog.com"
		}
	},
	{
		name: "Alex Thompson",
		role: "Project Manager",
		image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
		alt: "Alex Thompson, Project Manager ensuring smooth project delivery and client satisfaction",
		description: "Experienced project manager with a track record of delivering complex projects on time and within budget. Expert in Agile methodologies.",
		skills: ["Agile", "Scrum", "Jira", "Communication"],
		social: {
			github: "https://github.com/alexthompson",
			linkedin: "https://linkedin.com/in/alexthompson",
			email: "alex@qbitlog.com"
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
