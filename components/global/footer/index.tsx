"use client";

import Image from "next/image";
import Link from "next/link";
import {
	Mail,
	Phone,
	MapPin,
	Facebook,
	Twitter,
	Linkedin,
	Instagram,
} from "lucide-react";
import { motion } from "motion/react";

const fadeInUp = {
	initial: { opacity: 0, y: 30 },
	whileInView: { opacity: 1, y: 0 },
	viewport: { once: true, amount: 0.2 },
};

export default function Footer() {
	const currentYear = new Date().getFullYear();

	const footerLinks = {
		services: [
			{ name: "Web Development", href: "/services/web-development" },
			{ name: "Mobile Apps", href: "/services/mobile-development" },
			{ name: "UI/UX Design", href: "/services/uiux" },
			{ name: "Cloud Solutions", href: "/services/cloud-solutions" },
		],
		company: [
			{ name: "About Us", href: "/aboutus" },
			{ name: "Our Team", href: "/teams" },
			{ name: "Contact", href: "/contact-us" },
		],
		resources: [
			{ name: "Blog", href: "/blog" },
			{ name: "Case Studies", href: "/case-studies" },
		],
		legal: [
			{ name: "Privacy Policy", href: "/construction" },
			{ name: "Terms of Service", href: "/construction" },
			{ name: "Cookie Policy", href: "/construction" },
		],
	};

	const socialLinks = [
		{
			icon: Facebook,
			href: "https://www.facebook.com/Qbitlog",
			label: "Facebook",
		},
		{ icon: Twitter, href: "https://x.com/qbitlog", label: "X (Twitter)" },
		{
			icon: Linkedin,
			href: "https://www.linkedin.com/company/qbitlog",
			label: "LinkedIn",
		},
		{
			icon: Instagram,
			href: "https://www.instagram.com/qbit_log/?utm_source=qr&igsh=ZXN6ZjRuYzF6aWtv#",
			label: "Instagram",
		},
	];

	return (
		<footer className='relative w-full overflow-hidden bg-[#08080c]'>
			{/* Light beam effect - matching hero5 */}
			<div className='absolute inset-0 pointer-events-none overflow-hidden'>
				<motion.div
					className='absolute -top-[30%] -right-[15%] w-[50vw] h-[120%]'
					style={{
						background:
							"conic-gradient(from 330deg at 80% 20%, rgba(80, 100, 255, 0.15) 0deg, rgba(120, 140, 255, 0.08) 20deg, rgba(60, 80, 200, 0.05) 40deg, transparent 70deg)",
						filter: "blur(40px)",
						transform: "rotate(15deg)",
					}}
					animate={{
						opacity: [0.5, 0.7, 0.5],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
				<div
					className='absolute -top-[10%] -right-[5%] w-[300px] h-[300px]'
					style={{
						background:
							"radial-gradient(circle at 50% 50%, rgba(138, 56, 245, 0.15) 0%, rgba(100, 120, 255, 0.05) 40%, transparent 70%)",
						filter: "blur(30px)",
					}}
				/>
			</div>

			{/* Main Footer Content */}
			<div className='relative z-10 mx-auto py-12 lg:py-16'>
				<div className='grid px-8 md:px-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12'>
					{/* Brand Section */}
					<motion.div
						className='lg:col-span-2 space-y-4'
						{...fadeInUp}
						transition={{ duration: 0.5 }}>
						<Link href='/' className='inline-block'>
							<motion.div
								whileHover={{ scale: 1.1 }}
								transition={{ duration: 0.6 }}>
								<Image
									src='/icons/logo.png'
									alt='Qbitlog Logo'
									width={50}
									height={50}
									className='w-12 h-12'
								/>
							</motion.div>
						</Link>
						<h3 className='text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent'>
							QBITLOG
						</h3>
						<p className='text-white/50 text-sm leading-relaxed max-w-xs'>
							Crafting innovative digital experiences that transform businesses
							and delight users. Your vision, our expertise.
						</p>

						{/* Contact Info */}
						<div className='space-y-3 pt-4'>
							<motion.div
								className='flex items-start gap-3 text-sm text-white/50'
								whileHover={{ x: 5 }}
								transition={{ duration: 0.2 }}>
								<Mail className='w-4 h-4 mt-0.5 text-purple-400 flex-shrink-0' />
								<a
									href='mailto:contact@qbitlog.com'
									className='hover:text-purple-400 transition-colors'>
									contact@qbitlog.com
								</a>
							</motion.div>
							<motion.div
								className='flex items-start gap-3 text-sm text-white/50'
								whileHover={{ x: 5 }}
								transition={{ duration: 0.2 }}>
								<Phone className='w-4 h-4 mt-0.5 text-violet-300 flex-shrink-0' />
								<a
									href='tel:+918981969797'
									className='hover:text-violet-300 transition-colors'>
									+91 - 8981969797
								</a>
							</motion.div>
							<motion.div
								className='flex items-start gap-3 text-sm text-white/50'
								whileHover={{ x: 5 }}
								transition={{ duration: 0.2 }}>
								<MapPin className='w-4 h-4 mt-0.5 text-purple-400 flex-shrink-0' />
								<span>New Delhi, India</span>
							</motion.div>
						</div>
					</motion.div>

					{/* Services Links */}
					<motion.div
						className='space-y-4'
						{...fadeInUp}
						transition={{ duration: 0.5, delay: 0.1 }}>
						<h4 className='text-sm font-bold uppercase tracking-wider text-white'>
							Services
						</h4>
						<ul className='space-y-3'>
							{footerLinks.services.map((link, index) => (
								<motion.li
									key={link.name}
									initial={{ opacity: 0, x: -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.3, delay: index * 0.1 }}>
									<Link
										href={link.href}
										className='text-sm text-white/50 hover:text-purple-400 transition-colors hover:translate-x-1 inline-block'>
										{link.name}
									</Link>
								</motion.li>
							))}
						</ul>
					</motion.div>

					{/* Company Links */}
					<motion.div
						className='space-y-4'
						{...fadeInUp}
						transition={{ duration: 0.5, delay: 0.2 }}>
						<h4 className='text-sm font-bold uppercase tracking-wider text-white'>
							Company
						</h4>
						<ul className='space-y-3'>
							{footerLinks.company.map((link, index) => (
								<motion.li
									key={link.name}
									initial={{ opacity: 0, x: -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.3, delay: index * 0.1 }}>
									<Link
										href={link.href}
										className='text-sm text-white/50 hover:text-violet-300 transition-colors hover:translate-x-1 inline-block'>
										{link.name}
									</Link>
								</motion.li>
							))}
						</ul>
					</motion.div>

					{/* Resources Links */}
					<motion.div
						className='space-y-4'
						{...fadeInUp}
						transition={{ duration: 0.5, delay: 0.3 }}>
						<h4 className='text-sm font-bold uppercase tracking-wider text-white'>
							Resources
						</h4>
						<ul className='space-y-3'>
							{footerLinks.resources.map((link, index) => (
								<motion.li
									key={link.name}
									initial={{ opacity: 0, x: -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.3, delay: index * 0.1 }}>
									<Link
										href={link.href}
										className='text-sm text-white/50 hover:text-purple-400 transition-colors hover:translate-x-1 inline-block'>
										{link.name}
									</Link>
								</motion.li>
							))}
						</ul>
					</motion.div>

					{/* Legal Links */}
					<motion.div
						className='space-y-4'
						{...fadeInUp}
						transition={{ duration: 0.5, delay: 0.4 }}>
						<h4 className='text-sm font-bold uppercase tracking-wider text-white'>
							Legal
						</h4>
						<ul className='space-y-3'>
							{footerLinks.legal.map((link, index) => (
								<motion.li
									key={link.name}
									initial={{ opacity: 0, x: -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.3, delay: index * 0.1 }}>
									<Link
										href={link.href}
										className='text-sm text-white/50 hover:text-violet-300 transition-colors hover:translate-x-1 inline-block'>
										{link.name}
									</Link>
								</motion.li>
							))}
						</ul>
					</motion.div>
				</div>

				{/* Newsletter Section */}
				<motion.div
					className='mt-12 pt-8 px-8 md:px-12 border-t border-white/10'
					{...fadeInUp}
					transition={{ duration: 0.5, delay: 0.5 }}>
					<div className='flex flex-col md:flex-row items-center justify-between gap-6'>
						<div className='text-center md:text-left'>
							<h4 className='text-lg font-bold mb-2 bg-gradient-to-r from-purple-400 to-violet-300 bg-clip-text text-transparent'>
								Stay Updated
							</h4>
							<p className='text-sm text-white/50'>
								Subscribe to our newsletter for the latest updates and insights.
							</p>
						</div>
						<div className='flex gap-2 w-full md:w-auto'>
							<motion.input
								type='email'
								placeholder='Enter your email'
								className='px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-purple-400/50 outline-none text-sm flex-1 md:w-64 transition-colors text-white placeholder:text-white/30'
								whileFocus={{ scale: 1.02 }}
							/>
							<motion.button
								className='px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-opacity text-sm whitespace-nowrap'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}>
								Subscribe
							</motion.button>
						</div>
					</div>
				</motion.div>
			</div>

			{/* Bottom Bar */}
			<div className='relative z-10 border-t border-white/10'>
				<div className='container mx-auto px-4 py-6'>
					<div className='flex flex-col md:flex-row items-center justify-between gap-4'>
						{/* Copyright */}
						<p className='text-sm text-white/40 text-center md:text-left'>
							© {currentYear} Qbitlog. All rights reserved. Built with passion
							and innovation.
						</p>

						{/* Social Links */}
						<div className='flex items-center gap-3'>
							{socialLinks.map((social, index) => {
								const Icon = social.icon;
								return (
									<motion.a
										key={social.label}
										href={social.href}
										aria-label={social.label}
										className='w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:border-purple-400/50 flex items-center justify-center transition-all group'
										initial={{ opacity: 0, scale: 0 }}
										whileInView={{ opacity: 1, scale: 1 }}
										viewport={{ once: true }}
										transition={{ duration: 0.3, delay: index * 0.1 }}
										whileHover={{ scale: 1.2, rotate: 360 }}
										whileTap={{ scale: 0.9 }}>
										<Icon className='w-4 h-4 text-white/50 group-hover:text-purple-400 transition-colors' />
									</motion.a>
								);
							})}
						</div>
					</div>
				</div>
			</div>

			{/* Decorative Gradient Line */}
			<div className='h-1 bg-gradient-to-r from-primary via-secondary to-primary'></div>
		</footer>
	);
}
