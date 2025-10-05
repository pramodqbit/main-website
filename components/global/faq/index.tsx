"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
	const faqs = [
		{
			question: "What services does Qbitlog offer?",
			answer:
				"Qbitlog specializes in comprehensive digital solutions including web development, mobile app development, UI/UX design, cloud solutions, and custom software development. We leverage cutting-edge technologies to deliver innovative solutions tailored to your business needs.",
		},
		{
			question: "How long does a typical project take?",
			answer:
				"Project timelines vary based on scope and complexity. A simple website might take 2-4 weeks, while a complex web application could take 3-6 months. We provide detailed project timelines during our initial consultation and keep you updated throughout the development process.",
		},
		{
			question: "What is your development process?",
			answer:
				"Our development process follows an agile methodology with five key phases: Discovery & Planning, Design & Prototyping, Development, Testing & QA, and Deployment & Support. We maintain transparent communication throughout, providing regular updates and incorporating your feedback at each stage.",
		},
		{
			question: "Do you provide ongoing support after project completion?",
			answer:
				"Yes! We offer comprehensive post-launch support and maintenance packages. This includes bug fixes, security updates, performance monitoring, and feature enhancements. We believe in building long-term partnerships with our clients.",
		},
		{
			question: "What technologies do you work with?",
			answer:
				"We work with a wide range of modern technologies including React, Next.js, Angular, Vue.js for frontend; Node.js, Python, PHP for backend; and various databases and cloud platforms. We select the best technology stack based on your project requirements and scalability needs.",
		},
		{
			question: "How do you ensure project quality?",
			answer:
				"Quality is our top priority. We implement rigorous testing procedures including unit testing, integration testing, and user acceptance testing. Our code goes through peer reviews, we follow industry best practices, and we use automated testing tools to ensure reliability and performance.",
		},
		{
			question: "What are your pricing models?",
			answer:
				"We offer flexible pricing models to suit different needs: fixed-price projects for well-defined scopes, time & material for evolving requirements, and dedicated team arrangements for long-term partnerships. We provide transparent, detailed quotes with no hidden costs.",
		},
		{
			question: "Can you help with existing projects or only new ones?",
			answer:
				"We can definitely help with existing projects! Whether you need to modernize legacy code, add new features, fix bugs, improve performance, or take over maintenance, our team can assess your current situation and provide the support you need.",
		},
	];

	return (
		<div className='container mx-auto px-4'>
			{/* FAQ Accordion */}
			<div className=''>
				<div className=' rounded-2xl  '>
					<Accordion type='single' collapsible className='space-y-1'>
						{faqs.map((faq, index) => (
							<AccordionItem
								key={index}
								value={`item-${index}`}
								className='border-border/50'>
								<AccordionTrigger className='cursor-pointer text-base lg:text-lg font-semibold text-primary hover:text-primary transition-colors px-2'>
									{faq.question}
								</AccordionTrigger>
								<AccordionContent className='text-foreground/70 leading-relaxed px-2'>
									{faq.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>

				{/* CTA Section */}
				{/* <div className='mt-12 text-center'>
					<p className='text-foreground/70 mb-4'>Still have questions?</p>
					<a
						href='#contact'
						className='inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition-all hover:scale-105 shadow-lg'>
						Contact Us
					</a>
				</div> */}
			</div>
		</div>
	);
}
