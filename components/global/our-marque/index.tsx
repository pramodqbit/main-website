"use client";

import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const MarqueeCard = ({
	icon,
	label,
	className,
}: {
	icon: React.ReactNode;
	label: string;
	className?: string;
}) => {
	return (
		<motion.div
			className={cn("flex items-center justify-center gap-2", className)}
			whileHover={{ scale: 1.05, y: -2 }}
			transition={{ duration: 0.2 }}>
			<motion.div
				whileHover={{ rotate: 360, scale: 1.2 }}
				transition={{ duration: 0.6 }}>
				{icon}
			</motion.div>
			<p className='lg:text-[24px] text-[16px]'>{label}</p>
		</motion.div>
	);
};

export default function OurMarque({
	Items,
}: {
	Items: { icon: React.ReactNode; label: string }[];
}) {
	return (
		<motion.div
			className='flex w-full border border-gray-200 lg:p-4 p-2 items-center'
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.5 }}
			transition={{ duration: 0.6 }}>
			<motion.div
				className=' lg:w-[300px] sm:w-[200px] w-[100px] flex flex-col items-end justify-center px-1 relative'
				initial={{ opacity: 0, x: -30 }}
				whileInView={{ opacity: 1, x: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6, delay: 0.2 }}>
				<p className='lg:text-[16px] text-[10px]  font-bold text-left md:text-right'>
					What sets us apart
				</p>
				<p className='hidden lg:block lg:text-[12px] text-[8px] text-gray-500 text-justify md:text-right'>
					Reliable delivery, robust security, fair pricing, and unmatched
					flexibility guaranteed.
				</p>
			</motion.div>
			<motion.div
				className='lg:w-[calc(100%-300px)] w-[calc(100%-100px)] relative'
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6, delay: 0.4 }}>
				<Marquee pauseOnHover className='[--duration:20s]  justify-between'>
					{Items?.map((item, index) => (
						<MarqueeCard
							key={index}
							{...item}
							className='lg:w-[220px] w-[160px]  lg:h-[60px] h-[40px] '
						/>
					))}
				</Marquee>
				<div className='from-background pointer-events-none absolute inset-y-0 h-full left-0 w-[100px] bg-gradient-to-r to-transparent'></div>
				<div className='from-background pointer-events-none absolute inset-y-0 h-full right-0 w-[100px] bg-gradient-to-l to-transparent'></div>
			</motion.div>
		</motion.div>
	);
}
