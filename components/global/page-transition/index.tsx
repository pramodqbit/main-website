"use client";

import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageTransition({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		const timer = setTimeout(() => setIsLoading(false), 100);
		return () => clearTimeout(timer);
	}, [pathname]);

	return (
		<AnimatePresence mode='wait'>
			{isLoading ? (
				<motion.div
					key='loader'
					className='fixed inset-0 z-[100] flex items-center justify-center bg-background'
					initial={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3 }}>
					<motion.div
						className='w-16 h-16 border-4 border-primary border-t-transparent rounded-full'
						animate={{ rotate: 360 }}
						transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
					/>
				</motion.div>
			) : (
				<motion.div
					key={pathname}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{
						duration: 0.4,
						ease: [0.21, 0.47, 0.32, 0.98],
					}}>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	);
}

