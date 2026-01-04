"use client";

import { motion } from "motion/react";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Glowing particle configuration - simplified for elegance
const PARTICLE_COUNT = 12;

// Mesh network nodes
interface Node {
	id: number;
	x: number;
	y: number;
	connections: number[];
}

function generateMeshNodes(count: number): Node[] {
	const nodes: Node[] = [];
	for (let i = 0; i < count; i++) {
		nodes.push({
			id: i,
			x: Math.random() * 100,
			y: Math.random() * 100,
			connections: [],
		});
	}
	// Connect nearby nodes
	nodes.forEach((node, i) => {
		nodes.forEach((other, j) => {
			if (i !== j) {
				const dist = Math.hypot(node.x - other.x, node.y - other.y);
				if (dist < 25 && node.connections.length < 3) {
					node.connections.push(j);
				}
			}
		});
	});
	return nodes;
}

// Elegant glowing particle component
function GlowingParticle({
	delay,
	x,
	y,
	size,
	color,
}: {
	delay: number;
	x: number;
	y: number;
	size: number;
	color: "primary" | "secondary";
}) {
	return (
		<motion.div
			className={cn(
				"absolute rounded-full pointer-events-none",
				color === "primary" ? "bg-primary/40" : "bg-secondary/40",
			)}
			style={{
				left: `${x}%`,
				top: `${y}%`,
				width: size,
				height: size,
				filter: "blur(1px)",
			}}
			animate={{
				opacity: [0, 0.6, 0],
				scale: [0.5, 1, 0.5],
				y: [0, -40, -80],
			}}
			transition={{
				duration: 6 + Math.random() * 4,
				delay,
				repeat: Infinity,
				ease: "easeInOut",
			}}
		/>
	);
}

// Mesh network background
function MeshNetwork({ nodes }: { nodes: Node[] }) {
	return (
		<svg className='absolute inset-0 w-full h-full pointer-events-none'>
			<defs>
				<linearGradient id='lineGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
					<stop offset='0%' stopColor='#8a38f5' stopOpacity='0.1' />
					<stop offset='100%' stopColor='#00cfff' stopOpacity='0.1' />
				</linearGradient>
			</defs>
			{nodes.map((node) =>
				node.connections.map((connIdx) => (
					<motion.line
						key={`${node.id}-${connIdx}`}
						x1={`${node.x}%`}
						y1={`${node.y}%`}
						x2={`${nodes[connIdx].x}%`}
						y2={`${nodes[connIdx].y}%`}
						stroke='url(#lineGradient)'
						strokeWidth='1'
						initial={{ pathLength: 0, opacity: 0 }}
						animate={{ pathLength: 1, opacity: 1 }}
						transition={{
							duration: 2,
							delay: node.id * 0.1,
							ease: "easeOut",
						}}
					/>
				)),
			)}
			{nodes.map((node) => (
				<motion.circle
					key={node.id}
					cx={`${node.x}%`}
					cy={`${node.y}%`}
					r='2'
					fill='#8a38f5'
					initial={{ scale: 0, opacity: 0 }}
					animate={{
						scale: [1, 1.5, 1],
						opacity: [0.3, 0.6, 0.3],
					}}
					transition={{
						duration: 3,
						delay: node.id * 0.1,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
			))}
		</svg>
	);
}

// Glitch text effect component
function GlitchText({ text, className }: { text: string; className?: string }) {
	return (
		<span className={cn("relative inline-block group", className)}>
			{/* Main text */}
			<span className='relative z-10 bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent animate-gradient-x'>
				{text}
			</span>
			{/* Glitch layers - only visible on hover */}
			<span
				className='absolute inset-0 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-100'
				style={{ transform: "translate(-2px, 2px)" }}
				aria-hidden='true'>
				{text}
			</span>
			<span
				className='absolute inset-0 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-100'
				style={{ transform: "translate(2px, -2px)" }}
				aria-hidden='true'>
				{text}
			</span>
		</span>
	);
}

// Code lines for typing animation (outside component to avoid dependency issues)
const CODE_LINES = [
	"// Building something amazing",
	"const qbitlog = {",
	"  mission: 'Code that works',",
	"  stack: ['React', 'Next.js'],",
	"  deploy: () => success",
	"};",
];

// Typing code animation component
function TypingCode() {
	const [displayedCode, setDisplayedCode] = useState("");
	const [currentLineIndex, setCurrentLineIndex] = useState(0);
	const [currentCharIndex, setCurrentCharIndex] = useState(0);

	useEffect(() => {
		const currentLine = CODE_LINES[currentLineIndex];

		if (currentCharIndex < currentLine.length) {
			const timeout = setTimeout(() => {
				setDisplayedCode((prev) => prev + currentLine[currentCharIndex]);
				setCurrentCharIndex((prev) => prev + 1);
			}, 50 + Math.random() * 30);
			return () => clearTimeout(timeout);
		} else if (currentLineIndex < CODE_LINES.length - 1) {
			const timeout = setTimeout(() => {
				setDisplayedCode((prev) => prev + "\n");
				setCurrentLineIndex((prev) => prev + 1);
				setCurrentCharIndex(0);
			}, 300);
			return () => clearTimeout(timeout);
		} else {
			// Reset after completion
			const timeout = setTimeout(() => {
				setDisplayedCode("");
				setCurrentLineIndex(0);
				setCurrentCharIndex(0);
			}, 3000);
			return () => clearTimeout(timeout);
		}
	}, [currentCharIndex, currentLineIndex]);

	return (
		<div className='absolute right-[5%] top-1/2 -translate-y-1/2 hidden lg:block'>
			<motion.div
				className='bg-[#0d1117]/80 backdrop-blur-sm rounded-lg border border-primary/20 p-4 font-mono text-sm shadow-2xl shadow-primary/10'
				initial={{ opacity: 0, x: 50 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.8, delay: 0.5 }}>
				<div className='flex gap-1.5 mb-3'>
					<div className='w-3 h-3 rounded-full bg-red-500/70' />
					<div className='w-3 h-3 rounded-full bg-yellow-500/70' />
					<div className='w-3 h-3 rounded-full bg-green-500/70' />
				</div>
				<pre className='text-gray-300 min-h-[150px] min-w-[280px]'>
					{displayedCode}
					<motion.span
						className='inline-block w-2 h-4 bg-secondary ml-0.5'
						animate={{ opacity: [1, 0] }}
						transition={{ duration: 0.8, repeat: Infinity }}
					/>
				</pre>
			</motion.div>
		</div>
	);
}

// Main Hero component
export default function Hero2({
	title,
	description,
	subtitle,
	button,
}: {
	title: string[];
	description: string;
	subtitle: string;
	button: string;
}) {
	const [isMounted, setIsMounted] = useState(false);
	const meshNodes = useMemo(() => generateMeshNodes(12), []);

	// Generate elegant glowing particles
	const glowingParticles = useMemo(
		() =>
			Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
				delay: i * 0.8,
				x: 5 + (i * 90) / PARTICLE_COUNT + Math.random() * 5,
				y: 70 + Math.random() * 25,
				size: 3 + Math.random() * 4,
				color: (i % 2 === 0 ? "primary" : "secondary") as
					| "primary"
					| "secondary",
			})),
		[],
	);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return (
			<section
				className='relative min-h-screen bg-[#050816]'
				aria-hidden='true'
			/>
		);
	}

	return (
		<section
			className='relative flex flex-col items-center justify-center min-h-screen overflow-hidden -mt-14'
			style={{
				background:
					"linear-gradient(135deg, #050816 0%, #0a0a1a 50%, #0d0d20 100%)",
			}}
			aria-label='Hero Section'>
			{/* Animated gradient overlay */}
			<div className='absolute inset-0 opacity-30'>
				<motion.div
					className='absolute inset-0'
					style={{
						background:
							"radial-gradient(ellipse at 20% 50%, rgba(138, 56, 245, 0.15) 0%, transparent 50%)",
					}}
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.3, 0.5, 0.3],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
				<motion.div
					className='absolute inset-0'
					style={{
						background:
							"radial-gradient(ellipse at 80% 50%, rgba(0, 207, 255, 0.1) 0%, transparent 50%)",
					}}
					animate={{
						scale: [1.2, 1, 1.2],
						opacity: [0.5, 0.3, 0.5],
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
			</div>

			{/* Grid mesh background */}
			<div className='absolute inset-0 opacity-20'>
				<div
					className='w-full h-full'
					style={{
						backgroundImage: `
							linear-gradient(to right, rgba(138, 56, 245, 0.1) 1px, transparent 1px),
							linear-gradient(to bottom, rgba(0, 207, 255, 0.1) 1px, transparent 1px)
						`,
						backgroundSize: "60px 60px",
					}}
				/>
			</div>

			{/* Mesh network */}
			<div className='absolute inset-0 opacity-40'>
				<MeshNetwork nodes={meshNodes} />
			</div>

			{/* Glowing particles - subtle rising effect */}
			<div className='absolute inset-0 overflow-hidden'>
				{glowingParticles.map((item, i) => (
					<GlowingParticle key={i} {...item} />
				))}
			</div>

			{/* Typing code terminal */}
			<TypingCode />

			{/* Main content */}
			<div className='relative z-10 flex flex-col items-center justify-center px-4'>
				{/* QBITLOG title with glitch effect */}
				<motion.h1
					className={cn(
						"text-center font-bold cursor-default",
						"text-[60px] sm:text-[80px] md:text-[120px] lg:text-[160px] xl:text-[200px] 2xl:text-[260px]",
						"leading-none tracking-tight",
					)}
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: "easeOut" }}>
					<span className='relative inline-flex'>
						{title.map((letter, index) => (
							<motion.span
								key={index}
								className='relative inline-block seven-segment-font'
								initial={{ opacity: 0, y: 50 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.5,
									delay: index * 0.08,
									ease: "easeOut",
								}}>
								<GlitchText
									text={letter}
									className='bg-gradient-to-b from-white via-gray-100 to-gray-300 bg-clip-text text-transparent'
								/>
							</motion.span>
						))}
					</span>
				</motion.h1>

				{/* Subtitle with terminal cursor */}
				{subtitle && (
					<motion.div
						className='flex items-center gap-2 mt-4 sm:mt-6'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.6 }}>
						<span className='text-primary font-mono text-sm sm:text-base'>
							{"//"}
						</span>
						<h2 className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
							{subtitle}
						</h2>
						<motion.span
							className='w-0.5 h-5 sm:h-6 bg-secondary'
							animate={{ opacity: [1, 0] }}
							transition={{ duration: 0.8, repeat: Infinity }}
						/>
					</motion.div>
				)}

				{/* Description */}
				{description && (
					<motion.p
						className='mt-4 sm:mt-6 text-center text-gray-400 text-sm sm:text-base md:text-lg max-w-[300px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[800px]'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.8 }}>
						{description}
					</motion.p>
				)}

				{/* CTA Button with glow */}
				{button && (
					<motion.div
						className='mt-6 sm:mt-10'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 1 }}>
						<Link href='/contact-us'>
							<Button
								className={cn(
									"relative font-mono font-semibold text-sm sm:text-base",
									"px-6 sm:px-8 py-4 sm:py-6 h-auto",
									"bg-gradient-to-r from-primary to-primary/80",
									"hover:from-primary hover:to-secondary",
									"shadow-lg shadow-primary/25 hover:shadow-primary/40",
									"transition-all duration-300",
									"border border-primary/20",
								)}
								aria-label='Start a project with us'>
								<span className='relative z-10'>{button}</span>
								{/* Glow effect */}
								<div className='absolute inset-0 rounded-md bg-primary/20 blur-xl opacity-50 group-hover:opacity-100 transition-opacity' />
							</Button>
						</Link>
					</motion.div>
				)}
			</div>

			{/* Bottom gradient fade */}
			<div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none' />
		</section>
	);
}
