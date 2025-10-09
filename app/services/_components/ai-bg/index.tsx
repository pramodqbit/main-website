"use client";

import { motion } from "framer-motion";

export default function AIBg() {
	// Generate random positions for network nodes
	const networkNodes = Array.from({ length: 20 }, (_, i) => ({
		id: i,
		x: Math.random() * 100,
		y: Math.random() * 100,
		size: Math.random() * 6 + 3,
		delay: Math.random() * 2,
	}));

	return (
		<div className='absolute inset-0 overflow-hidden'>
			{/* Light Background Overlay */}
			<div className='absolute inset-0 bg-white/60 dark:bg-white/5' />
			
			{/* Animated Grid Pattern */}
			<div className='absolute inset-0 opacity-10'>
				<svg width='100%' height='100%'>
					<defs>
						<pattern
							id='grid'
							width='40'
							height='40'
							patternUnits='userSpaceOnUse'>
							<path
								d='M 40 0 L 0 0 0 40'
								fill='none'
								stroke='currentColor'
								strokeWidth='0.5'
							/>
						</pattern>
					</defs>
					<rect width='100%' height='100%' fill='url(#grid)' />
				</svg>
			</div>

			{/* Neural Network Nodes */}
			<div className='absolute inset-0'>
				{networkNodes.map((node) => (
					<motion.div
						key={node.id}
						initial={{ opacity: 0, scale: 0 }}
						animate={{
							opacity: [0.2, 0.6, 0.2],
							scale: [0.8, 1.2, 0.8],
						}}
						transition={{
							duration: 3 + Math.random() * 2,
							repeat: Infinity,
							delay: node.delay,
							ease: "easeInOut",
						}}
						className='absolute rounded-full bg-gradient-to-br from-primary to-secondary'
						style={{
							left: `${node.x}%`,
							top: `${node.y}%`,
							width: `${node.size}px`,
							height: `${node.size}px`,
						}}
					/>
				))}
			</div>

			{/* Connection Lines between nodes */}
			<svg className='absolute inset-0 w-full h-full opacity-15'>
				{networkNodes.slice(0, 12).map((node, i) => {
					const nextNode = networkNodes[(i + 3) % networkNodes.length];
					return (
						<motion.line
							key={`line-${i}`}
							x1={`${node.x}%`}
							y1={`${node.y}%`}
							x2={`${nextNode.x}%`}
							y2={`${nextNode.y}%`}
							stroke='currentColor'
							strokeWidth='1'
							initial={{ pathLength: 0, opacity: 0 }}
							animate={{ pathLength: 1, opacity: [0.1, 0.3, 0.1] }}
							transition={{
								pathLength: { duration: 2, delay: i * 0.1 },
								opacity: {
									duration: 2,
									repeat: Infinity,
									delay: i * 0.1,
								},
							}}
						/>
					);
				})}
			</svg>

			{/* Glowing Orbs */}
			<div className='absolute top-10 right-10'>
				<motion.div
					animate={{
						scale: [1, 1.5, 1],
						opacity: [0.3, 0.6, 0.3],
					}}
					transition={{
						duration: 3,
						repeat: Infinity,
						ease: "easeInOut",
					}}
					className='w-32 h-32 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 blur-2xl'
				/>
			</div>

			<div className='absolute bottom-10 left-10'>
				<motion.div
					animate={{
						scale: [1.2, 0.8, 1.2],
						opacity: [0.4, 0.7, 0.4],
					}}
					transition={{
						duration: 4,
						repeat: Infinity,
						ease: "easeInOut",
					}}
					className='w-40 h-40 rounded-full bg-gradient-to-br from-secondary/40 to-primary/40 blur-3xl'
				/>
			</div>

			{/* AI Brain Visualization */}
			<div className='absolute right-10 top-1/4 opacity-25'>
				<svg width='80' height='80' viewBox='0 0 80 80'>
					{/* Brain outline */}
					<motion.path
						d='M40 10 Q50 10 55 20 Q60 15 65 25 Q70 30 68 40 Q70 50 65 55 Q60 65 50 70 Q45 72 40 70 Q35 72 30 70 Q20 65 15 55 Q10 50 12 40 Q10 30 15 25 Q20 15 25 20 Q30 10 40 10'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						initial={{ pathLength: 0 }}
						animate={{ pathLength: 1 }}
						transition={{
							duration: 3,
							repeat: Infinity,
							repeatType: "reverse",
						}}
					/>
					{/* Neural connections inside brain */}
					{[...Array(6)].map((_, i) => (
						<motion.circle
							key={i}
							cx={25 + (i % 3) * 15}
							cy={30 + Math.floor(i / 3) * 20}
							r='2'
							fill='currentColor'
							animate={{
								opacity: [0.3, 1, 0.3],
								r: [2, 3, 2],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								delay: i * 0.2,
							}}
						/>
					))}
				</svg>
			</div>

			{/* Binary Code Rain */}
			{[...Array(10)].map((_, i) => (
				<motion.div
					key={`binary-${i}`}
					className='absolute text-xs font-mono text-primary/30'
					initial={{
						left: `${5 + i * 10}%`,
						top: "-5%",
						opacity: 0,
					}}
					animate={{
						top: "105%",
						opacity: [0, 0.8, 0.8, 0],
					}}
					transition={{
						duration: 4 + Math.random() * 2,
						repeat: Infinity,
						delay: i * 0.5,
						ease: "linear",
					}}>
					{Array.from({ length: 8 }, () => Math.random() > 0.5 ? '1' : '0').join('')}
				</motion.div>
			))}

			{/* ML Algorithm Equations */}
			<div className='absolute bottom-8 right-8 opacity-15 font-mono text-xs'>
				<motion.div
					animate={{ opacity: [0.2, 0.6, 0.2] }}
					transition={{ duration: 3, repeat: Infinity }}>
					<div>ŷ = w₁x₁ + w₂x₂ + b</div>
					<div className='mt-1'>σ(z) = 1/(1+e⁻ᶻ)</div>
					<div className='mt-1'>∇J(θ) = ∂J/∂θ</div>
				</motion.div>
			</div>

			{/* Neural Network Activation */}
			<div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10'>
				<motion.div
					animate={{ rotate: 360 }}
					transition={{
						duration: 20,
						repeat: Infinity,
						ease: "linear",
					}}>
					<svg width='120' height='120' viewBox='0 0 120 120'>
						{[...Array(8)].map((_, i) => {
							const angle = (i * 360) / 8;
							const x = 60 + 40 * Math.cos((angle * Math.PI) / 180);
							const y = 60 + 40 * Math.sin((angle * Math.PI) / 180);
							return (
								<g key={`neuron-${i}`}>
									<motion.circle
										cx={x}
										cy={y}
										r='8'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										animate={{
											r: [8, 12, 8],
											opacity: [0.5, 1, 0.5],
										}}
										transition={{
											duration: 2,
											repeat: Infinity,
											delay: i * 0.2,
										}}
									/>
									<line
										x1='60'
										y1='60'
										x2={x}
										y2={y}
										stroke='currentColor'
										strokeWidth='1'
										opacity='0.3'
									/>
								</g>
							);
						})}
						<circle cx='60' cy='60' r='6' fill='currentColor' opacity='0.8' />
					</svg>
				</motion.div>
			</div>

			{/* Data Processing Bars */}
			<div className='absolute top-8 left-8 space-y-1 opacity-20'>
				{[...Array(5)].map((_, i) => (
					<motion.div
						key={`bar-${i}`}
						className='h-1 rounded-full bg-gradient-to-r from-primary to-secondary'
						initial={{ width: 0 }}
						animate={{ width: [0, 60 + i * 10, 40 + i * 5, 60 + i * 10] }}
						transition={{
							duration: 2,
							repeat: Infinity,
							delay: i * 0.2,
						}}
					/>
				))}
			</div>

			{/* AI Badges/Labels */}
			<motion.div
				className='absolute top-5 right-5 opacity-15 text-[10px] font-bold'
				animate={{ opacity: [0.1, 0.3, 0.1] }}
				transition={{ duration: 3, repeat: Infinity }}>
				<div className='px-2 py-1 border border-current rounded-full mb-1'>ML</div>
				<div className='px-2 py-1 border border-current rounded-full mb-1'>AI</div>
				<div className='px-2 py-1 border border-current rounded-full'>DL</div>
			</motion.div>

			{/* Gradient Overlays */}
			<div className='absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3' />
			<div className='absolute inset-0 bg-gradient-to-tl from-white/40 via-transparent to-transparent dark:from-white/5' />
		</div>
	);
}
