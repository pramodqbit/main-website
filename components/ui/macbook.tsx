import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface MacbookProps extends HTMLAttributes<HTMLDivElement> {
	src?: string;
	alt?: string;
}

/**
 * A lightweight, realistic MacBook mockup: a dark-bezel lid holding the screen
 * image, sitting on a brushed-aluminium base with the front lip notch.
 */
export function Macbook({ src, alt = "", className, ...props }: MacbookProps) {
	return (
		<div className={cn("relative w-full select-none", className)} {...props}>
			{/* Lid / screen */}
			<div className='relative mx-auto w-[84%] rounded-t-[16px] border-[7px] border-b-0 border-[#0b0b0b] bg-[#0b0b0b] shadow-[0_22px_50px_-18px_rgba(15,15,20,0.45)]'>
				{/* camera */}
				<div className='absolute left-1/2 top-[3px] z-10 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[#2b2b2e] ring-1 ring-black/40' />
				<div className='overflow-hidden rounded-[6px] bg-white'>
					{src && (
						/* eslint-disable-next-line @next/next/no-img-element */
						<img
							src={src}
							alt={alt}
							className='block aspect-[16/10] w-full object-cover object-top'
						/>
					)}
				</div>
			</div>

			{/* Base / deck */}
			<div className='relative mx-auto h-[14px] w-full'>
				{/* aluminium bar */}
				<div className='absolute inset-0 rounded-b-[12px] rounded-t-[2px] bg-gradient-to-b from-[#e9ebee] via-[#cfd3d9] to-[#aeb3bb] shadow-[0_8px_14px_-6px_rgba(0,0,0,0.35)]' />
				{/* hinge shadow line under the screen */}
				<div className='absolute inset-x-[8%] top-0 h-[2px] bg-black/15' />
				{/* front lip notch */}
				<div className='absolute left-1/2 top-0 h-[6px] w-[16%] -translate-x-1/2 rounded-b-[6px] bg-[#9aa0a8]' />
			</div>
		</div>
	);
}

export default Macbook;
