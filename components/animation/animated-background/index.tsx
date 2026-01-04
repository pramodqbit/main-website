"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function AnimatedBackground() {
	const [isMounted, setIsMounted] = useState(false);

	// Generate random floating particles only on client side
	const [particles] = useState(() =>
		Array.from({ length: 20 }, (_, i) => ({
			id: i,
			x: Math.random() * 100,
			y: Math.random() * 100,
			size: Math.random() * 4 + 2,
			duration: Math.random() * 10 + 10,
			delay: Math.random() * 5,
		})),
	);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<div className='absolute inset-0 overflow-hidden pointer-events-none'>
			{/* Animated gradient blobs */}
			<motion.div
				className='absolute -top-1/2 -left-1/2 w-full h-full'
				animate={{
					scale: [1, 1.2, 1],
					rotate: [0, 90, 0],
					x: [0, 100, 0],
					y: [0, 50, 0],
				}}
				transition={{
					duration: 20,
					repeat: Infinity,
					ease: "easeInOut",
				}}>
				<div className='w-[32rem] h-[32rem] bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl' />
			</motion.div>

			<motion.div
				className='absolute -bottom-1/2 -right-1/2 w-full h-full'
				animate={{
					scale: [1, 1.3, 1],
					rotate: [0, -90, 0],
					x: [0, -100, 0],
					y: [0, -50, 0],
				}}
				transition={{
					duration: 25,
					repeat: Infinity,
					ease: "easeInOut",
				}}>
				<div className='w-[32rem] h-[32rem] bg-gradient-to-l from-secondary/20 to-primary/20 rounded-full blur-3xl' />
			</motion.div>

			{/* Center floating orb */}
			<motion.div
				className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
				animate={{
					scale: [1, 1.5, 1],
					opacity: [0.3, 0.6, 0.3],
				}}
				transition={{
					duration: 8,
					repeat: Infinity,
					ease: "easeInOut",
				}}>
				<div className='w-96 h-96 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10 rounded-full blur-2xl' />
			</motion.div>

			{/* Floating particles */}
			{particles.map((particle) => (
				<motion.div
					key={particle.id}
					className='absolute rounded-full bg-gradient-to-r from-primary/40 to-secondary/40'
					style={{
						left: `${particle.x}%`,
						top: `${particle.y}%`,
						width: particle.size,
						height: particle.size,
					}}
					animate={{
						y: [0, -30, 0],
						x: [0, Math.random() * 20 - 10, 0],
						opacity: [0.2, 0.8, 0.2],
						scale: [1, 1.5, 1],
					}}
					transition={{
						duration: particle.duration,
						delay: particle.delay,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
			))}

			{/* Animated grid lines */}
			<div className='absolute inset-0 opacity-10'>
				<motion.div
					className='w-full h-full'
					style={{
						backgroundImage: `
							linear-gradient(to right, rgba(138, 56, 245, 0.3) 1px, transparent 1px),
							linear-gradient(to bottom, rgba(37, 208, 255, 0.3) 1px, transparent 1px)
						`,
						backgroundSize: "50px 50px",
					}}
					animate={{
						backgroundPosition: ["0px 0px", "50px 50px"],
					}}
					transition={{
						duration: 20,
						repeat: Infinity,
						ease: "linear",
					}}
				/>
			</div>

			{/* Floating rings */}
			{/* {[...Array(3)].map((_, i) => (
				<motion.div
					key={`ring-${i}`}
					className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
					animate={{
						scale: [1, 2, 1],
						opacity: [0.5, 0, 0.5],
						rotate: [0, 360, 0],
					}}
					transition={{
						duration: 8,
						delay: i * 2,
						repeat: Infinity,
						ease: "easeInOut",
					}}>
					<div className='w-48 h-48 border-2 border-primary/20 rounded-full' />
				</motion.div>
			))} */}

			{/* Glowing dots */}
			{[...Array(8)].map((_, i) => (
				<motion.div
					key={`dot-${i}`}
					className='absolute'
					style={{
						left: `${i * 12.5 + 10}%`,
						top: `${Math.sin(i) * 30 + 50}%`,
					}}
					animate={{
						y: [0, -20, 0],
						opacity: [0.3, 1, 0.3],
						scale: [1, 1.5, 1],
					}}
					transition={{
						duration: 3 + i * 0.5,
						repeat: Infinity,
						ease: "easeInOut",
					}}>
					<div className='w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg shadow-primary/50' />
				</motion.div>
			))}
		</div>
	);
}
