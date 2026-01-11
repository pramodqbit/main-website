"use client";

import { motion, useMotionValue, useSpring, useInView } from "motion/react";
import {
	useEffect,
	useState,
	useRef,
	useCallback,
	useMemo,
} from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Animated Counter Component - Rolling numbers like Antimatter AI
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

			// Easing function for smooth animation
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

// Intense Glowing Energy Sphere with Radiant Core
function EnergySphere() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);
	const springX = useSpring(mouseX, { stiffness: 30, damping: 20 });
	const springY = useSpring(mouseY, { stiffness: 30, damping: 20 });

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

		// Generate dense sphere points
		const numPoints = 1200;
		const points: { x: number; y: number; z: number; size: number }[] = [];
		const goldenRatio = (1 + Math.sqrt(5)) / 2;

		for (let i = 0; i < numPoints; i++) {
			const theta = (2 * Math.PI * i) / goldenRatio;
			const phi = Math.acos(1 - (2 * (i + 0.5)) / numPoints);

			points.push({
				x: Math.sin(phi) * Math.cos(theta),
				y: Math.sin(phi) * Math.sin(theta),
				z: Math.cos(phi),
				size: Math.random() * 2 + 0.5,
			});
		}

		const animate = () => {
			const rect = canvas.getBoundingClientRect();
			ctx.clearRect(0, 0, rect.width, rect.height);

			const centerX = rect.width / 2;
			const centerY = rect.height / 2;
			const radius = Math.min(rect.width, rect.height) * 0.32;

			time += 0.003;

			// Pulsing effect - the sphere breathes
			const pulse = 1 + Math.sin(time * 2) * 0.03;
			const currentRadius = radius * pulse;

			const mouseInfluenceX = springX.get() * 0.0003;
			const mouseInfluenceY = springY.get() * 0.0003;

			// Draw intense glowing core
			const coreGlow = ctx.createRadialGradient(
				centerX,
				centerY,
				0,
				centerX,
				centerY,
				currentRadius * 1.5,
			);
			const corePulse = 0.3 + Math.sin(time * 3) * 0.15;
			coreGlow.addColorStop(0, `rgba(255, 255, 255, ${corePulse + 0.4})`);
			coreGlow.addColorStop(0.1, `rgba(138, 56, 245, ${corePulse + 0.2})`);
			coreGlow.addColorStop(0.3, `rgba(138, 56, 245, ${corePulse * 0.5})`);
			coreGlow.addColorStop(0.5, `rgba(0, 207, 255, ${corePulse * 0.3})`);
			coreGlow.addColorStop(1, "rgba(0, 207, 255, 0)");

			ctx.beginPath();
			ctx.fillStyle = coreGlow;
			ctx.arc(centerX, centerY, currentRadius * 1.5, 0, Math.PI * 2);
			ctx.fill();

			// Inner bright core
			const innerCore = ctx.createRadialGradient(
				centerX,
				centerY,
				0,
				centerX,
				centerY,
				currentRadius * 0.3,
			);
			innerCore.addColorStop(0, "rgba(255, 255, 255, 0.9)");
			innerCore.addColorStop(0.5, "rgba(138, 56, 245, 0.4)");
			innerCore.addColorStop(1, "rgba(138, 56, 245, 0)");

			ctx.beginPath();
			ctx.fillStyle = innerCore;
			ctx.arc(centerX, centerY, currentRadius * 0.3, 0, Math.PI * 2);
			ctx.fill();

			// Sort and draw particles
			const sortedPoints = points
				.map((point) => {
					const cosR = Math.cos(time + mouseInfluenceX);
					const sinR = Math.sin(time + mouseInfluenceX);
					const cosY = Math.cos(mouseInfluenceY);
					const sinY = Math.sin(mouseInfluenceY);

					let x = point.x * cosR - point.z * sinR;
					let z = point.x * sinR + point.z * cosR;
					let y = point.y;

					const y2 = y * cosY - z * sinY;
					const z2 = y * sinY + z * cosY;
					y = y2;
					z = z2;

					return { x, y, z, size: point.size };
				})
				.sort((a, b) => a.z - b.z);

			// Draw connections
			ctx.lineWidth = 0.5;
			for (let i = 0; i < sortedPoints.length; i += 3) {
				for (let j = i + 1; j < sortedPoints.length; j += 3) {
					const p1 = sortedPoints[i];
					const p2 = sortedPoints[j];
					const dist = Math.sqrt(
						Math.pow(p1.x - p2.x, 2) +
							Math.pow(p1.y - p2.y, 2) +
							Math.pow(p1.z - p2.z, 2),
					);

					if (dist < 0.25) {
						const alpha = (1 - dist / 0.25) * 0.2 * ((p1.z + 1) / 2);
						const gradient = ctx.createLinearGradient(
							centerX + p1.x * currentRadius,
							centerY + p1.y * currentRadius,
							centerX + p2.x * currentRadius,
							centerY + p2.y * currentRadius,
						);
						gradient.addColorStop(0, `rgba(138, 56, 245, ${alpha})`);
						gradient.addColorStop(1, `rgba(0, 207, 255, ${alpha})`);
						ctx.strokeStyle = gradient;
						ctx.beginPath();
						ctx.moveTo(
							centerX + p1.x * currentRadius,
							centerY + p1.y * currentRadius,
						);
						ctx.lineTo(
							centerX + p2.x * currentRadius,
							centerY + p2.y * currentRadius,
						);
						ctx.stroke();
					}
				}
			}

			// Draw particles with glow
			sortedPoints.forEach((point) => {
				const screenX = centerX + point.x * currentRadius;
				const screenY = centerY + point.y * currentRadius;
				const depth = (point.z + 1) / 2;
				const size = point.size * (0.5 + depth * 2);
				const alpha = 0.3 + depth * 0.7;

				// Particle glow
				const glow = ctx.createRadialGradient(
					screenX,
					screenY,
					0,
					screenX,
					screenY,
					size * 4,
				);
				glow.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
				glow.addColorStop(0.3, `rgba(138, 56, 245, ${alpha * 0.6})`);
				glow.addColorStop(0.6, `rgba(0, 207, 255, ${alpha * 0.3})`);
				glow.addColorStop(1, "rgba(0, 207, 255, 0)");

				ctx.beginPath();
				ctx.fillStyle = glow;
				ctx.arc(screenX, screenY, size * 4, 0, Math.PI * 2);
				ctx.fill();
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
			className='absolute inset-0 w-full h-full'
			onMouseMove={handleMouseMove}
		/>
	);
}

// Light Rays Component - Dramatic beams
function LightRays() {
	return (
		<div className='absolute inset-0 pointer-events-none overflow-hidden'>
			{/* Main intense glow */}
			<motion.div
				className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]'
				animate={{
					scale: [1, 1.15, 1],
					opacity: [0.5, 0.7, 0.5],
				}}
				transition={{
					duration: 4,
					repeat: Infinity,
					ease: "easeInOut",
				}}>
				<div
					className='w-full h-full'
					style={{
						background:
							"radial-gradient(circle, rgba(138, 56, 245, 0.3) 0%, rgba(0, 207, 255, 0.1) 40%, transparent 70%)",
					}}
				/>
			</motion.div>

			{/* Light beam - top right */}
			<motion.div
				className='absolute top-0 right-[20%] w-[400px] h-[120%] origin-top'
				style={{
					background:
						"linear-gradient(180deg, rgba(138, 56, 245, 0.2) 0%, rgba(0, 207, 255, 0.05) 50%, transparent 100%)",
					transform: "rotate(15deg) translateY(-20%)",
					filter: "blur(40px)",
				}}
				animate={{
					opacity: [0.3, 0.6, 0.3],
				}}
				transition={{
					duration: 3,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>

			{/* Light beam - top left */}
			<motion.div
				className='absolute top-0 left-[20%] w-[300px] h-[100%] origin-top'
				style={{
					background:
						"linear-gradient(180deg, rgba(0, 207, 255, 0.15) 0%, rgba(138, 56, 245, 0.05) 50%, transparent 100%)",
					transform: "rotate(-10deg) translateY(-20%)",
					filter: "blur(30px)",
				}}
				animate={{
					opacity: [0.2, 0.4, 0.2],
				}}
				transition={{
					duration: 4,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 1,
				}}
			/>

			{/* Horizontal flare */}
			<motion.div
				className='absolute top-[40%] left-0 right-0 h-[200px]'
				style={{
					background:
						"linear-gradient(90deg, transparent 0%, rgba(138, 56, 245, 0.1) 30%, rgba(0, 207, 255, 0.15) 50%, rgba(138, 56, 245, 0.1) 70%, transparent 100%)",
					filter: "blur(60px)",
				}}
				animate={{
					opacity: [0.3, 0.5, 0.3],
					scaleX: [0.8, 1.1, 0.8],
				}}
				transition={{
					duration: 5,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
		</div>
	);
}

// Huge Background Watermark
function BackgroundWatermark() {
	return (
		<div className='absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden'>
			<motion.div
				className='text-[20vw] font-bold whitespace-nowrap tracking-widest select-none'
				style={{
					WebkitTextStroke: "1px rgba(138, 56, 245, 0.1)",
					color: "transparent",
				}}
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 2, ease: "easeOut" }}>
				QBITLOG
			</motion.div>
		</div>
	);
}

// Stats Section with animated counters
function Stats() {
	const stats = [
		{ value: 50, suffix: "+", label: "Projects Delivered" },
		{ value: 99, suffix: "%", label: "Client Satisfaction" },
		{ value: 24, suffix: "/7", label: "Support Available" },
	];

	return (
		<motion.div
			className='flex gap-12 md:gap-20 mt-16'
			initial={{ opacity: 0, y: 40 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 1, delay: 1.5 }}>
			{stats.map((stat, index) => (
				<motion.div
					key={index}
					className='text-center'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 1.8 + index * 0.2 }}>
					<div className='text-3xl md:text-5xl font-bold text-white'>
						<AnimatedCounter
							value={stat.value}
							suffix={stat.suffix}
							duration={2.5}
						/>
					</div>
					<div className='text-sm md:text-base text-gray-400 mt-2 tracking-wide'>
						{stat.label}
					</div>
				</motion.div>
			))}
		</motion.div>
	);
}

// Main Hero Component
export default function Hero4({
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
				className='relative min-h-screen bg-[#030014]'
				aria-hidden='true'
			/>
		);
	}

	return (
		<section
			className='relative flex flex-col items-center justify-center min-h-screen overflow-hidden'
			style={{
				background:
					"radial-gradient(ellipse at 50% 50%, #0d0520 0%, #050114 40%, #000000 100%)",
			}}
			aria-label='Hero Section'>
			{/* Background watermark */}
			<BackgroundWatermark />

			{/* Light rays */}
			<LightRays />

			{/* Energy Sphere */}
			<div className='absolute inset-0'>
				<EnergySphere />
			</div>

			{/* Vignette */}
			<div
				className='absolute inset-0 pointer-events-none'
				style={{
					background:
						"radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,0.95) 100%)",
				}}
			/>

			{/* Main content */}
			<div className='relative z-10 flex flex-col items-center justify-center px-4 text-center mt-8'>
				{/* Main heading with dramatic entrance */}
				<motion.h1
					className='flex flex-col items-center'
					initial={{ opacity: 0, y: 60, filter: "blur(20px)" }}
					animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
					transition={{ duration: 1.2, ease: "easeOut" }}>
					<motion.span
						className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-white/90 tracking-wide'
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.3 }}>
						Building{" "}
						<span className='font-bold text-white'>Digital</span>
					</motion.span>
					<motion.span
						className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-white/90 tracking-wide mt-2 md:mt-4'
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.5 }}>
						<span className='font-bold bg-gradient-to-r from-primary via-purple-400 to-secondary bg-clip-text text-transparent'>
							Solutions
						</span>{" "}
						That Matter
					</motion.span>
				</motion.h1>

				{/* Subtitle */}
				<motion.p
					className='mt-8 md:mt-10 text-gray-400 text-base md:text-lg lg:text-xl max-w-[700px] leading-relaxed'
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.8 }}>
					{description ||
						"We empower organizations with technology that turns complex challenges into real-world outcomes."}
				</motion.p>

				{/* CTA Button with glow */}
				<motion.div
					className='mt-10 md:mt-12'
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 1.1 }}>
					<Link href='/contact-us'>
						<Button
							className={cn(
								"relative group overflow-hidden",
								"px-10 py-7 h-auto text-base md:text-lg font-medium",
								"bg-transparent",
								"border border-white/20 hover:border-primary/50",
								"transition-all duration-500",
								"hover:shadow-[0_0_40px_rgba(138,56,245,0.3)]",
							)}>
							<span className='relative z-10 tracking-wide'>
								{button || "Start Your Project"}
							</span>
							{/* Shimmer effect */}
							<motion.div
								className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
								style={{
									background:
										"linear-gradient(90deg, transparent, rgba(138, 56, 245, 0.2), transparent)",
								}}
								animate={{
									x: ["-100%", "200%"],
								}}
								transition={{
									duration: 1.5,
									repeat: Infinity,
									ease: "linear",
								}}
							/>
						</Button>
					</Link>
				</motion.div>

				{/* Stats */}
				<Stats />
			</div>

			{/* Bottom gradient */}
			<div className='absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none' />

			{/* Floating ambient particles */}
			<div className='absolute inset-0 pointer-events-none'>
				{[...Array(30)].map((_, i) => (
					<motion.div
						key={i}
						className='absolute rounded-full'
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							width: Math.random() * 3 + 1,
							height: Math.random() * 3 + 1,
							background:
								i % 2 === 0
									? "rgba(138, 56, 245, 0.6)"
									: "rgba(0, 207, 255, 0.6)",
						}}
						animate={{
							opacity: [0, 0.8, 0],
							scale: [0, 1.5, 0],
							y: [0, -100],
						}}
						transition={{
							duration: 4 + Math.random() * 3,
							delay: Math.random() * 5,
							repeat: Infinity,
							ease: "easeOut",
						}}
					/>
				))}
			</div>
		</section>
	);
}



