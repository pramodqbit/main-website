"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Particle Sphere Component - Creates a 3D rotating sphere of particles
function ParticleSphere() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);
	const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
	const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let animationId: number;
		let rotation = 0;

		// Set canvas size
		const resize = () => {
			const dpr = window.devicePixelRatio || 1;
			const rect = canvas.getBoundingClientRect();
			canvas.width = rect.width * dpr;
			canvas.height = rect.height * dpr;
			ctx.scale(dpr, dpr);
		};
		resize();
		window.addEventListener("resize", resize);

		// Generate sphere points using fibonacci distribution
		const numPoints = 800;
		const points: { x: number; y: number; z: number; size: number }[] = [];
		const goldenRatio = (1 + Math.sqrt(5)) / 2;

		for (let i = 0; i < numPoints; i++) {
			const theta = (2 * Math.PI * i) / goldenRatio;
			const phi = Math.acos(1 - (2 * (i + 0.5)) / numPoints);

			points.push({
				x: Math.sin(phi) * Math.cos(theta),
				y: Math.sin(phi) * Math.sin(theta),
				z: Math.cos(phi),
				size: Math.random() * 1.5 + 0.5,
			});
		}

		// Animation loop
		const animate = () => {
			const rect = canvas.getBoundingClientRect();
			ctx.clearRect(0, 0, rect.width, rect.height);

			const centerX = rect.width / 2;
			const centerY = rect.height / 2;
			const radius = Math.min(rect.width, rect.height) * 0.35;

			rotation += 0.002;

			// Get mouse influence
			const mouseInfluenceX = springX.get() * 0.0005;
			const mouseInfluenceY = springY.get() * 0.0005;

			// Sort points by z for proper depth rendering
			const sortedPoints = points
				.map((point) => {
					// Apply rotation
					const cosR = Math.cos(rotation + mouseInfluenceX);
					const sinR = Math.sin(rotation + mouseInfluenceX);
					const cosY = Math.cos(mouseInfluenceY);
					const sinY = Math.sin(mouseInfluenceY);

					// Rotate around Y axis
					let x = point.x * cosR - point.z * sinR;
					let z = point.x * sinR + point.z * cosR;
					let y = point.y;

					// Rotate around X axis
					const y2 = y * cosY - z * sinY;
					const z2 = y * sinY + z * cosY;
					y = y2;
					z = z2;

					return { x, y, z, size: point.size };
				})
				.sort((a, b) => a.z - b.z);

			// Draw connections between nearby points
			ctx.strokeStyle = "rgba(138, 56, 245, 0.03)";
			ctx.lineWidth = 0.5;

			for (let i = 0; i < sortedPoints.length; i++) {
				for (let j = i + 1; j < sortedPoints.length; j++) {
					const p1 = sortedPoints[i];
					const p2 = sortedPoints[j];
					const dist = Math.sqrt(
						Math.pow(p1.x - p2.x, 2) +
							Math.pow(p1.y - p2.y, 2) +
							Math.pow(p1.z - p2.z, 2),
					);

					if (dist < 0.3) {
						const alpha = (1 - dist / 0.3) * 0.15 * ((p1.z + 1) / 2);
						ctx.strokeStyle = `rgba(138, 56, 245, ${alpha})`;
						ctx.beginPath();
						ctx.moveTo(centerX + p1.x * radius, centerY + p1.y * radius);
						ctx.lineTo(centerX + p2.x * radius, centerY + p2.y * radius);
						ctx.stroke();
					}
				}
			}

			// Draw points
			sortedPoints.forEach((point) => {
				const screenX = centerX + point.x * radius;
				const screenY = centerY + point.y * radius;
				const depth = (point.z + 1) / 2; // 0 to 1
				const size = point.size * (0.5 + depth * 1.5);
				const alpha = 0.2 + depth * 0.8;

				// Create gradient for each point
				const gradient = ctx.createRadialGradient(
					screenX,
					screenY,
					0,
					screenX,
					screenY,
					size * 2,
				);
				gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
				gradient.addColorStop(0.5, `rgba(138, 56, 245, ${alpha * 0.5})`);
				gradient.addColorStop(1, "rgba(138, 56, 245, 0)");

				ctx.beginPath();
				ctx.fillStyle = gradient;
				ctx.arc(screenX, screenY, size * 2, 0, Math.PI * 2);
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

	// Handle mouse move
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

// Lens Flare Component
function LensFlare() {
	return (
		<div className='absolute inset-0 pointer-events-none overflow-hidden'>
			{/* Main light source */}
			<motion.div
				className='absolute top-[20%] right-[15%] w-[600px] h-[600px]'
				animate={{
					scale: [1, 1.1, 1],
					opacity: [0.6, 0.8, 0.6],
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
							"radial-gradient(circle, rgba(138, 56, 245, 0.4) 0%, rgba(59, 130, 246, 0.2) 30%, transparent 70%)",
					}}
				/>
			</motion.div>

			{/* Secondary glow */}
			<motion.div
				className='absolute top-[30%] right-[20%] w-[400px] h-[400px]'
				animate={{
					scale: [1.1, 1, 1.1],
					opacity: [0.4, 0.6, 0.4],
				}}
				transition={{
					duration: 5,
					repeat: Infinity,
					ease: "easeInOut",
				}}>
				<div
					className='w-full h-full'
					style={{
						background:
							"radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 60%)",
					}}
				/>
			</motion.div>

			{/* Light beam */}
			<div
				className='absolute top-0 right-[10%] w-[300px] h-full opacity-20'
				style={{
					background:
						"linear-gradient(180deg, rgba(138, 56, 245, 0.3) 0%, transparent 50%)",
					transform: "skewX(-15deg)",
				}}
			/>
		</div>
	);
}

// Stats Component
function Stats() {
	const stats = [
		{ value: "50+", label: "Projects Delivered" },
		{ value: "99%", label: "Client Satisfaction" },
		{ value: "24/7", label: "Support Available" },
	];

	return (
		<motion.div
			className='flex gap-8 md:gap-16 mt-12'
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8, delay: 1.2 }}>
			{stats.map((stat, index) => (
				<div key={index} className='text-center'>
					<motion.div
						className='text-2xl md:text-4xl font-bold text-white'
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}>
						{stat.value}
					</motion.div>
					<div className='text-xs md:text-sm text-gray-400 mt-1'>
						{stat.label}
					</div>
				</div>
			))}
		</motion.div>
	);
}

// Floating text behind sphere
function BackgroundText() {
	return (
		<div className='absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden'>
			<motion.div
				className='text-[15vw] font-bold text-white/[0.02] whitespace-nowrap tracking-wider select-none'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 2 }}>
				QBITLOG
			</motion.div>
		</div>
	);
}

// Main Hero component
export default function Hero3({
	title,
	description,
	subtitle,
	button,
}: {
	title?: string[];
	description?: string;
	subtitle?: string;
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
					"radial-gradient(ellipse at 50% 50%, #0a0520 0%, #030014 50%, #000000 100%)",
			}}
			aria-label='Hero Section'>
			{/* Background text */}
			<BackgroundText />

			{/* Lens flare effect */}
			<LensFlare />

			{/* Particle Sphere */}
			<div className='absolute inset-0'>
				<ParticleSphere />
			</div>

			{/* Vignette overlay */}
			<div
				className='absolute inset-0 pointer-events-none'
				style={{
					background:
						"radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)",
				}}
			/>

			{/* Main content */}
			<div className='relative z-10 flex flex-col items-center justify-center px-4 text-center'>
				{/* Main heading */}
				<motion.h1
					className='flex flex-col items-center'
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, ease: "easeOut" }}>
					<span className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white/90 tracking-wide'>
						Building{" "}
						<span className='font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent'>
							Digital
						</span>
					</span>
					<span className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white/90 tracking-wide mt-2'>
						<span className='font-bold bg-gradient-to-r from-primary via-blue-400 to-secondary bg-clip-text text-transparent'>
							Solutions
						</span>{" "}
						That Matter
					</span>
				</motion.h1>

				{/* Subtitle */}
				<motion.p
					className='mt-6 md:mt-8 text-gray-400 text-sm md:text-base lg:text-lg max-w-[600px] leading-relaxed'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}>
					{description ||
						"We empower organizations with AI that turns complex challenges into real-world outcomes."}
				</motion.p>

				{/* CTA Button */}
				<motion.div
					className='mt-8 md:mt-10'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.6 }}>
					<Link href='/contact-us'>
						<Button
							className={cn(
								"relative group overflow-hidden",
								"px-8 py-6 h-auto text-base",
								"bg-transparent border border-primary/50",
								"hover:border-primary hover:bg-primary/10",
								"transition-all duration-500",
							)}>
							<span className='relative z-10 font-medium'>
								{button || "Start Your Project"}
							</span>
							{/* Animated border glow */}
							<motion.div
								className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500'
								style={{
									background:
										"linear-gradient(90deg, transparent, rgba(138, 56, 245, 0.3), transparent)",
								}}
								animate={{
									x: ["-100%", "100%"],
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

			{/* Bottom gradient fade */}
			<div className='absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none' />

			{/* Ambient particles */}
			<div className='absolute inset-0 pointer-events-none'>
				{[...Array(20)].map((_, i) => (
					<motion.div
						key={i}
						className='absolute w-1 h-1 bg-white/30 rounded-full'
						style={{
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
						}}
						animate={{
							opacity: [0, 0.5, 0],
							scale: [0, 1, 0],
						}}
						transition={{
							duration: 3 + Math.random() * 2,
							delay: Math.random() * 3,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>
				))}
			</div>
		</section>
	);
}
