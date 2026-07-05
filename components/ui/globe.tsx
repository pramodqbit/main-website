"use client";

import { useEffect, useRef } from "react";
import createGlobe, { COBEOptions } from "cobe";
import { useMotionValue, useSpring } from "motion/react";

import { cn } from "@/lib/utils";

const MOVEMENT_DAMPING = 1400;

const GLOBE_CONFIG: COBEOptions = {
	width: 800,
	height: 800,
	onRender: () => {},
	devicePixelRatio: 2,
	phi: 0,
	theta: 0.3,
	dark: 0,
	diffuse: 0.4,
	mapSamples: 16000,
	mapBrightness: 1.2,
	baseColor: [1, 1, 1],
	markerColor: [251 / 255, 100 / 255, 21 / 255],
	glowColor: [1, 1, 1],
	markers: [
		{ location: [14.5995, 120.9842], size: 0.03 },
		{ location: [19.076, 72.8777], size: 0.1 },
		{ location: [23.8103, 90.4125], size: 0.05 },
		{ location: [30.0444, 31.2357], size: 0.07 },
		{ location: [39.9042, 116.4074], size: 0.08 },
		{ location: [-23.5505, -46.6333], size: 0.1 },
		{ location: [19.4326, -99.1332], size: 0.1 },
		{ location: [40.7128, -74.006], size: 0.1 },
		{ location: [34.6937, 135.5022], size: 0.05 },
		{ location: [41.0082, 28.9784], size: 0.06 },
	],
};

export function Globe({
	className,
	config = GLOBE_CONFIG,
}: {
	className?: string;
	config?: COBEOptions;
}) {
	let phi = 0;
	let width = 0;
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const pointerInteracting = useRef<number | null>(null);
	const pointerInteractionMovement = useRef(0);

	const r = useMotionValue(0);
	const rs = useSpring(r, {
		mass: 1,
		damping: 30,
		stiffness: 100,
	});

	const updatePointerInteraction = (value: number | null) => {
		pointerInteracting.current = value;
		if (canvasRef.current) {
			canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
		}
	};

	const updateMovement = (clientX: number) => {
		if (pointerInteracting.current !== null) {
			const delta = clientX - pointerInteracting.current;
			pointerInteractionMovement.current = delta;
			r.set(r.get() + delta / MOVEMENT_DAMPING);
		}
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		let globe: ReturnType<typeof createGlobe> | null = null;

		const onResize = () => {
			width = canvas.offsetWidth;
		};
		window.addEventListener("resize", onResize);
		onResize();

		const start = () => {
			if (globe) return;
			globe = createGlobe(canvas, {
				...config,
				// Render at 1x instead of 2x supersampling: the globe's on-screen
				// size is buffer/devicePixelRatio, so halving both keeps identical
				// geometry while cutting per-frame pixel work by ~4x.
				devicePixelRatio: 1,
				width: width,
				height: width,
				onRender: (state) => {
					if (!pointerInteracting.current) phi += 0.001;
					state.phi = phi + rs.get();
					state.width = width;
					state.height = width;
				},
			});
			requestAnimationFrame(() => {
				if (canvasRef.current) canvasRef.current.style.opacity = "1";
			});
		};

		const stop = () => {
			if (globe) {
				globe.destroy();
				globe = null;
			}
			if (canvasRef.current) canvasRef.current.style.opacity = "0";
		};

		// Only run the (expensive, continuously-rendering) WebGL globe while it
		// is actually on screen — this frees the main thread when scrolling the
		// rest of the page.
		const observer = new IntersectionObserver(
			([entry]) => (entry.isIntersecting ? start() : stop()),
			{ threshold: 0 },
		);
		observer.observe(canvas);

		return () => {
			observer.disconnect();
			stop();
			window.removeEventListener("resize", onResize);
		};
	}, [rs, config]);

	return (
		<div
			className={cn(
				"absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[800px]",
				className,
			)}>
			<canvas
				className={cn(
					"size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]",
				)}
				ref={canvasRef}
				onPointerDown={(e) => {
					pointerInteracting.current = e.clientX;
					updatePointerInteraction(e.clientX);
				}}
				onPointerUp={() => updatePointerInteraction(null)}
				onPointerOut={() => updatePointerInteraction(null)}
				onMouseMove={(e) => updateMovement(e.clientX)}
				onTouchMove={(e) =>
					e.touches[0] && updateMovement(e.touches[0].clientX)
				}
			/>
		</div>
	);
}
