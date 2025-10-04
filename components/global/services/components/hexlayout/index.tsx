"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";

type HexTileProps = {
	src: string;
	alt: string;
	size: number;
	className?: string;
	style?: React.CSSProperties;
};

function HexTile({ src, alt, size, className, style }: HexTileProps) {
	return (
		<div
			className={`overflow-hidden bg-card shadow-sm border border-border p-1 sm:p-2 flex items-center justify-center ${
				className ?? ""
			}`}
			style={{
				width: size,
				height: size,
				clipPath:
					"polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0 50%)",
				...style,
			}}>
			<Image
				src={src}
				alt={alt}
				height={size}
				width={size}
				sizes='(max-width: 768px) 60px, 100px'
				className='object-contain p-2 sm:p-4 mix-blend-multiply'
			/>
		</div>
	);
}

function HexRing({
	center,
	ring,
	iconSize = 150,
}: {
	center?: string;
	ring: string[];
	iconSize?: number;
}) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [dims, setDims] = useState<{ width: number; height: number }>({
		width: 0,
		height: 0,
	});
	const [responsiveIconSize, setResponsiveIconSize] = useState(iconSize);

	useEffect(() => {
		if (!containerRef.current) return;

		const updateSize = () => {
			if (!containerRef.current) return;
			const { width, height } = containerRef.current.getBoundingClientRect();
			setDims({ width, height });

			// Adjust icon size based on container width
			const newIconSize = width < 380 ? iconSize * 0.42 : iconSize * 0.9;
			setResponsiveIconSize(newIconSize);
		};

		updateSize();

		const ro = new ResizeObserver(updateSize);
		ro.observe(containerRef.current);

		return () => ro.disconnect();
	}, [iconSize]);

	const centerX = dims.width / 2;
	const centerY = dims.height / 2;
	const containerCircleRadius = Math.min(centerX, centerY);
	const radius = containerCircleRadius - responsiveIconSize / 2 - 8;

	return (
		<div
			ref={containerRef}
			className='relative w-full max-w-[440px] mx-auto aspect-square'
			style={{ maxHeight: 440 }}>
			{center && (
				<motion.div
					initial={{ opacity: 0, scale: 0.85 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: false, amount: 0.2 }}
					transition={{ duration: 0.5, ease: "easeOut", delay: 0.01 }}>
					<HexTile
						src={center}
						alt={"center"}
						size={responsiveIconSize}
						className='absolute bg-black'
						style={{
							left: centerX - responsiveIconSize / 2,
							top: centerY - responsiveIconSize / 2,
						}}
					/>
				</motion.div>
			)}
			{ring.map((src, i) => {
				const angleDeg = -90 + (i * 360) / ring.length;
				const angle = (angleDeg * Math.PI) / 180;
				const x = Math.cos(angle) * radius;
				const y = Math.sin(angle) * radius;
				const left = centerX + x - responsiveIconSize / 2;
				const top = centerY + y - responsiveIconSize / 2;
				return (
					<motion.div
						key={`${src}-${i}`}
						initial={{ opacity: 0, scale: 0.85 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: false, amount: 0.2 }}
						transition={{
							duration: 0.5,
							ease: "easeOut",
							delay: 0.1 + i * 0.1,
						}}>
						<HexTile
							src={src}
							alt={"ring"}
							size={responsiveIconSize}
							className='absolute bg-muted'
							style={{ left, top }}
						/>
					</motion.div>
				);
			})}
		</div>
	);
}

export default HexRing;
