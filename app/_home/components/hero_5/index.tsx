"use client";

import { motion, useMotionValue, useSpring, useInView } from "motion/react";
import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Animated Counter
function AnimatedCounter({
	value,
	suffix = "",
	duration = 2,
}: {
	value: number;
	suffix?: string;
	duration?: number;
}) {
	const [count, setCount] = useState(0);
	const ref = useRef<HTMLSpanElement>(null);
	const isInView = useInView(ref, { once: true });

	useEffect(() => {
		if (!isInView) return;
		let startTime: number;
		let animationFrame: number;

		const animate = (timestamp: number) => {
			if (!startTime) startTime = timestamp;
			const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
			const easeOutQuart = 1 - Math.pow(1 - progress, 4);
			setCount(Math.floor(easeOutQuart * value));
			if (progress < 1) {
				animationFrame = requestAnimationFrame(animate);
			}
		};

		animationFrame = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animationFrame);
	}, [isInView, value, duration]);

	return (
		<span ref={ref} className='tabular-nums'>
			{count}
			{suffix}
		</span>
	);
}

// Elegant sparse particle sphere - WHITE particles only
function ParticleSphere() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);
	const springX = useSpring(mouseX, { stiffness: 20, damping: 30 });
	const springY = useSpring(mouseY, { stiffness: 20, damping: 30 });

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let animationId: number;
		let time = 0;

		const resize = () => {
			const dpr = window.devicePixelRatio || 1;
			const rect = canvas.getBoundingClientRect();
			canvas.width = rect.width * dpr;
			canvas.height = rect.height * dpr;
			ctx.scale(dpr, dpr);
		};
		resize();
		window.addEventListener("resize", resize);

		// Sparse particles - fewer, more spread out
		const numPoints = 600;
		const points: { x: number; y: number; z: number; size: number }[] = [];
		const goldenRatio = (1 + Math.sqrt(5)) / 2;

		for (let i = 0; i < numPoints; i++) {
			const theta = (2 * Math.PI * i) / goldenRatio;
			const phi = Math.acos(1 - (2 * (i + 0.5)) / numPoints);

			points.push({
				x: Math.sin(phi) * Math.cos(theta),
				y: Math.sin(phi) * Math.sin(theta),
				z: Math.cos(phi),
				size: Math.random() * 1.5 + 0.8,
			});
		}

		const animate = () => {
			const rect = canvas.getBoundingClientRect();
			ctx.clearRect(0, 0, rect.width, rect.height);

			const centerX = rect.width * 0.55; // Offset to right
			const centerY = rect.height * 0.5;
			const radius = Math.min(rect.width, rect.height) * 0.38;

			time += 0.002; // Slower rotation

			const mouseInfluenceX = springX.get() * 0.0002;
			const mouseInfluenceY = springY.get() * 0.0002;

			// Sort and draw particles
			const sortedPoints = points
				.map((point) => {
					const cosR = Math.cos(time + mouseInfluenceX);
					const sinR = Math.sin(time + mouseInfluenceX);
					const cosY = Math.cos(mouseInfluenceY);
					const sinY = Math.sin(mouseInfluenceY);

					const x = point.x * cosR - point.z * sinR;
					let z = point.x * sinR + point.z * cosR;
					let y = point.y;

					const y2 = y * cosY - z * sinY;
					const z2 = y * sinY + z * cosY;
					y = y2;
					z = z2;

					return { x, y, z, size: point.size };
				})
				.sort((a, b) => a.z - b.z);

			// Draw sparse connections - very subtle
			ctx.lineWidth = 0.3;
			for (let i = 0; i < sortedPoints.length; i += 4) {
				for (let j = i + 1; j < sortedPoints.length; j += 4) {
					const p1 = sortedPoints[i];
					const p2 = sortedPoints[j];
					const dist = Math.sqrt(
						Math.pow(p1.x - p2.x, 2) +
							Math.pow(p1.y - p2.y, 2) +
							Math.pow(p1.z - p2.z, 2),
					);

					if (dist < 0.3) {
						const alpha = (1 - dist / 0.3) * 0.08 * ((p1.z + 1) / 2);
						ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
						ctx.beginPath();
						ctx.moveTo(centerX + p1.x * radius, centerY + p1.y * radius);
						ctx.lineTo(centerX + p2.x * radius, centerY + p2.y * radius);
						ctx.stroke();
					}
				}
			}

			// Draw WHITE particles only - elegant and simple
			sortedPoints.forEach((point) => {
				const screenX = centerX + point.x * radius;
				const screenY = centerY + point.y * radius;
				const depth = (point.z + 1) / 2;
				const size = point.size * (0.3 + depth * 1.2);
				const alpha = 0.15 + depth * 0.6;

				// Simple white/silver particle with subtle glow
				ctx.beginPath();
				ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
				ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
				ctx.fill();

				// Subtle glow on front particles only
				if (depth > 0.6) {
					const glow = ctx.createRadialGradient(
						screenX,
						screenY,
						0,
						screenX,
						screenY,
						size * 3,
					);
					glow.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.3})`);
					glow.addColorStop(1, "rgba(255, 255, 255, 0)");
					ctx.beginPath();
					ctx.fillStyle = glow;
					ctx.arc(screenX, screenY, size * 3, 0, Math.PI * 2);
					ctx.fill();
				}
			});

			animationId = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			window.removeEventListener("resize", resize);
			cancelAnimationFrame(animationId);
		};
	}, [springX, springY]);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent) => {
			const rect = e.currentTarget.getBoundingClientRect();
			mouseX.set(e.clientX - rect.left - rect.width / 2);
			mouseY.set(e.clientY - rect.top - rect.height / 2);
		},
		[mouseX, mouseY],
	);

	return (
		<canvas
			ref={canvasRef}
			className='absolute inset-0 w-[80%] h-[80%] m-auto opacity-15 md:opacity-100'
			onMouseMove={handleMouseMove}
		/>
	);
}

// Single subtle light beam - top left (like Antimatter)
function LightBeam() {
	return (
		<div className='absolute inset-0 pointer-events-none overflow-hidden'>
			{/* Main dramatic light beam from top-left */}
			<motion.div
				className='absolute -top-[30%] -left-[15%] w-[50vw] h-[120vh]'
				style={{
					background:
						"conic-gradient(from 150deg at 20% 20%, rgba(80, 100, 255, 0.25) 0deg, rgba(120, 140, 255, 0.15) 20deg, rgba(60, 80, 200, 0.08) 40deg, transparent 70deg)",
					filter: "blur(40px)",
					transform: "rotate(-15deg)",
				}}
				animate={{
					opacity: [0.7, 0.9, 0.7],
				}}
				transition={{
					duration: 8,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
			{/* Bright core of the light */}
			<div
				className='absolute -top-[10%] -left-[5%] w-[300px] h-[300px]'
				style={{
					background:
						"radial-gradient(circle at 50% 50%, rgba(140, 160, 255, 0.3) 0%, rgba(100, 120, 255, 0.1) 40%, transparent 70%)",
					filter: "blur(30px)",
				}}
			/>
		</div>
	);
}

// Background watermark - very subtle
function BackgroundWatermark() {
	return (
		<div className='absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden'>
			<motion.div
				className='text-[18vw] font-bold tracking-[0.2em] select-none opacity-[0.03]'
				style={{
					color: "white",
				}}
				initial={{ opacity: 0 }}
				animate={{ opacity: 0.03 }}
				transition={{ duration: 2, delay: 0.5 }}>
				QBITLOG
			</motion.div>
		</div>
	);
}

// Main Hero Component
export default function Hero5({
	description,
	button,
}: {
	description?: string;
	button?: string;
}) {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return (
			<section
				className='relative min-h-screen bg-[#08080c]'
				aria-hidden='true'
			/>
		);
	}

	const stats = [
		{ value: 50, suffix: "+", label: "Projects Delivered" },
		{ value: 100, suffix: "%", label: "Client Satisfaction" },
		{ value: 24, suffix: "/7", label: "Support Available" },
	];

	return (
		<div className='relative h-[97vh] w-full overflow-hidden mx-auto max-w-[calc(100%-20px)] -my-12 mb-4 rounded-[20px] outline '>
			<section
				className='relative overflow-hidden bg-[#08080c]'
				aria-label='Hero Section'>
				{/* Background watermark */}
				<BackgroundWatermark />

				{/* Light beam */}
				<LightBeam />

				{/* Particle sphere - BEHIND content */}
				<div className='absolute inset-0 z-0'>
					<ParticleSphere />
				</div>

				{/* Main content - LEFT aligned, IN FRONT */}
				<div className='mt-10 relative z-10 min-h-screen flex flex-col justify-center  px-6 md:px-16 lg:px-24 xl:px-32 gap-4'>
					{/* Typography */}
					<div className='max-w-3xl flex flex-col gap-2 sm:gap-4 md:gap-6'>
						<motion.h1
							className='text-3xl sm:text-4xl md:text-4xl lg:text-4xl xl:text-6xl leading-[1.1] tracking-tight '
							initial={{ opacity: 0, y: 40 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 1, ease: "easeOut" }}>
							<span className='font-light text-white/90'>We Build </span>
							<span className='font-semibold italic bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent w-full px-2'>
								Intelligent Software
							</span>
							<br />
							<span className='font-light text-white/90'>That </span>
							<span className='font-semibold italic bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent w-full px-2'>
								Designed for Growth
							</span>
						</motion.h1>

						{/* Description */}
						<motion.p
							className=' text-white/50 text-base md:text-lg max-w-md leading-relaxed'
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.3 }}>
							{description ||
								"From robust web and mobile applications enhanced with AI to help you automate tasks and make smarter decisions."}
						</motion.p>

						{/* CTA Button */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.5 }}>
							<Link href='/contact-us'>
								<Button
									className={cn(
										"px-8 py-4 h-auto text-sm font-medium tracking-wide",
										"bg-primary hover:bg-primary/90",
										"rounded-full",
										"transition-all duration-300",
									)}>
									{button || "Start Your Project"}
								</Button>
							</Link>
						</motion.div>
					</div>

					{/* Stats - bottom right */}
					<motion.div
						className='relative  ml-auto  flex gap-10 md:gap-16'
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.8 }}>
						{stats.map((stat, index) => (
							<div key={index} className='text-center md:text-right'>
								<div className='text-2xl md:text-3xl font-semibold text-white'>
									<AnimatedCounter
										value={stat.value}
										suffix={stat.suffix}
										duration={2}
									/>
								</div>
								<div className='text-xs md:text-sm text-white/40 mt-1'>
									{stat.label}
								</div>
							</div>
						))}
					</motion.div>
				</div>

				{/* Subtle bottom gradient */}
			</section>
		</div>
	);
}
