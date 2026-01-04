"use client";

import { useState, useRef } from "react";

export default function MotionTooltip({
	toolTip,
	children,
}: {
	toolTip: React.ReactNode;
	children: React.ReactNode;
}) {
	const [isHovered, setIsHovered] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const containerRef = useRef<HTMLDivElement>(null);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (containerRef.current) {
			const rect = containerRef.current.getBoundingClientRect();
			setPosition({
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
			});
		}
	};

	return (
		<div
			ref={containerRef}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onMouseMove={handleMouseMove}
			className='relative inline-block'>
			{children}
			<div
				className='pointer-events-none absolute z-50 transition-opacity duration-200'
				style={{
					left: position.x + 16,
					top: position.y + 16,
					opacity: isHovered ? 1 : 0,
					transform: "translate(0, -50%)",
				}}>
				<div className='whitespace-nowrap rounded-lg  bg-primary px-3 py-2 text-sm text-white shadow-xl border border-zinc-700/50 backdrop-blur-sm'>
					{toolTip}
				</div>
			</div>
		</div>
	);
}
