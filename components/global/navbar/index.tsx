"use client";
import Image from "next/image";
import {
	Info,
	Menu,
	X,
	Users,
	Mail,
	Book,
	BookMarked,
	Server,
	CodeXml,
	TabletSmartphone,
	Palette,
	ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const NavigationCard = ({
	icon,
	label,
	description,
}: {
	icon: React.ReactNode;
	label: string;
	description: string;
}) => {
	return (
		<div className='flex items-center gap-4'>
			<div className='md:h-10 md:w-10 h-8 w-8 bg-gray-400 rounded  flex items-center justify-center border p-1 text-white'>
				{icon}
			</div>
			<div>
				<p
					className='text-sm md:text-md font-bold line-clamp-1  md:max-w-none'
					title={label}>
					{label}
				</p>
				<p
					className='text-xs md:text-sm text-muted-foreground line-clamp-1'
					title={description}>
					{description}
				</p>
			</div>
		</div>
	);
};

const COMPANY_LINKS = [
	{
		icon: <Info />,
		label: "About us",
		description: "Learn more about our company",
		href: "/aboutus",
	},
	{
		icon: <Users />,
		label: "Team",
		description: "Meet our team",
		href: "/teams",
	},
	{
		icon: <Mail />,
		label: "Contact",
		description: "Connect with us",
		href: "/contact-us",
	},
];

const RESOURCES_LINKS = [
	{
		icon: <Book />,
		label: "Blog",
		description: "Read our blog",
		href: "/blog",
	},
	{
		icon: <BookMarked />,
		label: "Case Studies",
		description: "Read our case studies",
		href: "/case-studies",
	},
];

const OUR_SERVICES = [
	{
		icon: <Server />,
		label: "Cloud Solutions",
		description: "Cloud solutions",
		href: "/services/cloud-solutions",
	},
	{
		icon: <CodeXml />,
		label: "Web Development",
		description: "Web development",
		href: "/services/web-development",
	},

	{
		icon: <TabletSmartphone />,
		label: "Mobile Development",
		description: "Mobile development",
		href: "/services/mobile-development",
	},
	{
		icon: <Palette />,
		label: "UI/UX Design",
		description: "UI/UX design",
		href: "/services/uiux",
	},
];

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<motion.div
				initial={{ scaleX: 0, opacity: 0 }}
				animate={{ scaleX: 1, opacity: 1 }}
				transition={{
					duration: 0.6,
					ease: "easeOut",
				}}
				style={{ originX: 0.5 }}
				className='sticky max-w-[1200px] mx-auto top-8 z-50 flex w-full items-center justify-between gap-4 bg-background rounded-full px-4 py-3 shadow-md mt-2'>
				<Link href='/'>
					<Image
						src='/icons/logo.png'
						alt='logo'
						width={40}
						height={40}
						className='w-8 h-8 md:w-10 md:h-10'
					/>
				</Link>

				{/* Tagline - Hidden on mobile, visible on larger screens */}
				<div className='hidden md:flex items-center justify-center flex-1'>
					<motion.p
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className='text-sm font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:from-secondary hover:to-primary transition-all duration-300 cursor-default'>
						Crafting Digital Excellence
					</motion.p>
				</div>

				<div className='flex items-center gap-6'>
					<AnimatePresence mode='wait' initial={false}>
						{!isOpen ? (
							<motion.div
								key='menu'
								initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
								animate={{ rotate: 0, opacity: 1, scale: 1 }}
								exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
								transition={{
									duration: 0.3,
									ease: "easeInOut",
								}}>
								<Menu
									size={32}
									className='cursor-pointer hover:text-primary transition-colors'
									onClick={() => setIsOpen(!isOpen)}
								/>
							</motion.div>
						) : (
							<motion.div
								key='close'
								initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
								animate={{ rotate: 0, opacity: 1, scale: 1 }}
								exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
								transition={{
									duration: 0.3,
									ease: "easeInOut",
								}}>
								<X
									size={32}
									className='cursor-pointer hover:text-primary transition-colors'
									onClick={() => setIsOpen(!isOpen)}
								/>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</motion.div>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						onClick={() => setIsOpen(false)}
						initial={{ height: 0, opacity: 0, y: -20, scaleX: 0 }}
						animate={{ height: "auto", opacity: 1, y: 0, scaleX: 1 }}
						exit={{ height: 0, opacity: 0, y: -20, scaleX: 0 }}
						transition={{
							duration: 0.3,
							ease: "easeInOut",
						}}
						style={{ originX: 0.5 }}
						className='fixed top-26 z-50 h-[100dvh] container translate-x-[-50%] left-1/2 overflow-y-auto md:overflow-hidden shadow-lg rounded-2xl backdrop-blur-lg bg-white/90 dark:bg-black/60 border border-white/40 dark:border-white/40'>
						<Card className='bg-transparent border-none shadow-none p-0'>
							<CardContent className='backdrop-blur-sm md:p-0 h-[100dvh] md:h-auto'>
								<div className='grid md:grid-cols-4 grid-cols-2  md:gap-4 gap-0 '>
									<div className=' col-span-2 md:px-5 px-3 md:py-4 py-0 '>
										<h5 className='text-xl font-semibold mb-4'>Qbitlog</h5>
										<p className='text-sm text-muted-foreground max-w-lg'>
											Crafting innovative digital experiences that transform
											businesses and delight users. Your vision, our expertise.
										</p>
										<div className='grid grid-cols-1 md:grid-cols-2  md:gap-4 gap-0 my-4'>
											{OUR_SERVICES.map((service) => (
												<Link
													href={service.href}
													key={service.label}
													className='hover:bg-primary/10 rounded-md p-2'>
													<NavigationCard
														key={service.href}
														icon={service.icon}
														label={service.label}
														description={service.description}
													/>
												</Link>
											))}
										</div>

										<motion.div
											whileHover='hover'
											initial='rest'
											animate='rest'>
											<Link
												href='/services'
												className='md:text-sm text-xs md:p-2 p-1 inline-flex items-center md:gap-2 gap-1 text-white px-4 rounded-md bg-gradient-to-r from-primary to-secondary justify-center'>
												View All Services
												<motion.span
													variants={{
														rest: { x: 0 },
														hover: { x: 5 },
													}}
													transition={{
														type: "spring",
														stiffness: 400,
														damping: 10,
													}}>
													<ArrowRight className='w-4 h-4' />
												</motion.span>
											</Link>
										</motion.div>
									</div>
									<div className='border-r-0 border-l-0 md:border-r-2 md:border-l-2 col-span-2 md:col-span-1 border-dashed mt-2 md:mt-0 md:px-5 px-3 md:py-2 py-0'>
										<h5 className='md:text-xl text-lg font-semibold md:mb-4 mb-2'>
											Company
										</h5>
										<ul>
											{COMPANY_LINKS.map((link) => (
												<li
													key={link.href}
													className='hover:bg-primary/10 rounded-md  md:p-2 p-1'>
													<Link href={link.href}>
														<NavigationCard
															icon={link.icon}
															label={link.label}
															description={link.description}
														/>
													</Link>
												</li>
											))}
										</ul>
									</div>
									<div className='  border-dashed col-span-2 md:col-span-1  md:px-5 px-3 md:py-2 py-0'>
										<h5 className='md:text-xl text-lg font-semibold md:mb-4 mb-2 capitalize'>
											Resources
										</h5>
										<ul>
											{RESOURCES_LINKS.map((link) => (
												<li
													key={link.href}
													className='hover:bg-primary/10 rounded-md md:p-2 p-1'>
													<Link href={link.href}>
														<NavigationCard
															icon={link.icon}
															label={link.label}
															description={link.description}
														/>
													</Link>
												</li>
											))}
										</ul>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
