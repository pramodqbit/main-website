import { Check } from "lucide-react";

export default function ContactInfo() {
	const points = [
		"Get a comprehensive walkthrough of our development services and solutions",
		"Receive expert guidance on selecting the right technology stack for your project",
		"Discuss collaboration opportunities and explore partnership possibilities",
		"Get personalized consultation on web, mobile, and cloud development needs",
	];

	return (
		<div className='space-y-8'>
			<div>
				<h2 className='text-xl xl:text-3xl font-bold  mb-6'>
					Let&apos;s connect and help you build faster
				</h2>
				<p className='text-gray-500 text-md mb-6'>
					Reach out to our team for questions about components, templates,
					pricing, or collaboration opportunities.
				</p>
			</div>

			<ul className='space-y-4'>
				{points.map((point, index) => (
					<li key={index} className='flex items-start gap-3'>
						<div className='flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mt-0.5'>
							<Check className='w-4 h-4 text-white' strokeWidth={3} />
						</div>
						<span className='text-gray-700 text-base leading-relaxed'>
							{point}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}
