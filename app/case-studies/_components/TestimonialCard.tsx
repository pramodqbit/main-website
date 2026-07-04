import { Quote, Star } from "lucide-react";
import type { CaseStudyTestimonial } from "../_data/types";

export function TestimonialCard({
	testimonial,
}: {
	testimonial?: CaseStudyTestimonial;
}) {
	if (!testimonial) return null;
	const rating = testimonial.rating ?? 5;

	return (
		<div className='flex h-full flex-col justify-between rounded-2xl bg-primary/5 p-6 md:p-8'>
			<div>
				<Quote className='h-8 w-8 rotate-180 fill-primary text-primary' />
				<blockquote className='mt-4 text-sm leading-relaxed text-foreground/80 md:text-base'>
					{testimonial.quote}
				</blockquote>
			</div>
			<div className='mt-6 flex items-center gap-4'>
				{testimonial.avatar && (
					/* eslint-disable-next-line @next/next/no-img-element */
					<img
						src={testimonial.avatar}
						alt={testimonial.name}
						className='h-12 w-12 rounded-full object-cover'
					/>
				)}
				<div>
					<p className='text-sm font-bold text-foreground'>
						{testimonial.name}
					</p>
					<p className='text-xs text-muted-foreground'>
						{testimonial.position}
					</p>
					<div className='mt-1 flex gap-0.5'>
						{Array.from({ length: 5 }).map((_, i) => (
							<Star
								key={i}
								className={
									i < rating
										? "h-3.5 w-3.5 fill-amber-400 text-amber-400"
										: "h-3.5 w-3.5 text-border"
								}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default TestimonialCard;
