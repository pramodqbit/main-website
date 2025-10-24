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
			// { name: "Careers", href: "#careers" },
			{ name: "Contact", href: "/contact-us" },
		],
		resources: [
			{ name: "Blog", href: "/blog" },
			{ name: "Case Studies", href: "/case-studies" },
			// { name: "Documentation", href: "#docs" },
			// { name: "Support", href: "#support" },
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
			href: "https://www.instagram.com/qbitlog?utm_source=qr&igsh=MWdqbDlvOTg0ejJ5cg==",
			label: "Instagram",
		},
	];

	return (
		<footer className='w-full bg-background border-t border-border'>
			{/* Main Footer Content */}
			<div className='container mx-auto px-4 py-12 lg:py-16'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12'>
					{/* Brand Section */}
					<motion.div
						className='lg:col-span-2 space-y-4'
						{...fadeInUp}
						transition={{ duration: 0.5 }}>
						<Link href='/' className='inline-block'>
							<motion.div
								whileHover={{ scale: 1.1, rotate: 360 }}
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
						<h3 className='text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
							QBITLOG
						</h3>
						<p className='text-foreground/70 text-sm leading-relaxed max-w-xs'>
							Crafting innovative digital experiences that transform businesses
							and delight users. Your vision, our expertise.
						</p>

						{/* Contact Info */}
						<div className='space-y-3 pt-4'>
							<motion.div
								className='flex items-start gap-3 text-sm text-foreground/70'
								whileHover={{ x: 5 }}
								transition={{ duration: 0.2 }}>
								<Mail className='w-4 h-4 mt-0.5 text-primary flex-shrink-0' />
								<a
									href='mailto:contact@qbitlog.com'
									className='hover:text-primary transition-colors'>
									contact@qbitlog.com
								</a>
							</motion.div>
							<motion.div
								className='flex items-start gap-3 text-sm text-foreground/70'
								whileHover={{ x: 5 }}
								transition={{ duration: 0.2 }}>
								<Phone className='w-4 h-4 mt-0.5 text-secondary flex-shrink-0' />
								<a
									href='tel:+918981969797'
									className='hover:text-secondary transition-colors'>
									+91 - 8981969797
								</a>
							</motion.div>
							<motion.div
								className='flex items-start gap-3 text-sm text-foreground/70'
								whileHover={{ x: 5 }}
								transition={{ duration: 0.2 }}>
								<MapPin className='w-4 h-4 mt-0.5 text-primary flex-shrink-0' />
								<span>New Delhi, India</span>
							</motion.div>
						</div>
					</motion.div>

					{/* Services Links */}
					<motion.div
						className='space-y-4'
						{...fadeInUp}
						transition={{ duration: 0.5, delay: 0.1 }}>
						<h4 className='text-sm font-bold uppercase tracking-wider text-foreground'>
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
										className='text-sm text-foreground/70 hover:text-primary transition-colors hover:translate-x-1 inline-block'>
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
						<h4 className='text-sm font-bold uppercase tracking-wider text-foreground'>
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
										className='text-sm text-foreground/70 hover:text-secondary transition-colors hover:translate-x-1 inline-block'>
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
						<h4 className='text-sm font-bold uppercase tracking-wider text-foreground'>
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
										className='text-sm text-foreground/70 hover:text-primary transition-colors hover:translate-x-1 inline-block'>
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
						<h4 className='text-sm font-bold uppercase tracking-wider text-foreground'>
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
										className='text-sm text-foreground/70 hover:text-secondary transition-colors hover:translate-x-1 inline-block'>
										{link.name}
									</Link>
								</motion.li>
							))}
						</ul>
					</motion.div>
				</div>

				{/* Newsletter Section */}
				<motion.div
					className='mt-12 pt-8 border-t border-border'
					{...fadeInUp}
					transition={{ duration: 0.5, delay: 0.5 }}>
					<div className='flex flex-col md:flex-row items-center justify-between gap-6'>
						<div className='text-center md:text-left'>
							<h4 className='text-lg font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
								Stay Updated
							</h4>
							<p className='text-sm text-foreground/70'>
								Subscribe to our newsletter for the latest updates and insights.
							</p>
						</div>
						<div className='flex gap-2 w-full md:w-auto'>
							<motion.input
								type='email'
								placeholder='Enter your email'
								className='px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none text-sm flex-1 md:w-64 transition-colors'
								whileFocus={{ scale: 1.02, borderColor: "var(--primary)" }}
							/>
							<motion.button
								className='px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition-opacity text-sm whitespace-nowrap'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}>
								Subscribe
							</motion.button>
						</div>
					</div>
				</motion.div>
			</div>

			{/* Bottom Bar */}
			<div className='border-t border-border'>
				<div className='container mx-auto px-4 py-6'>
					<div className='flex flex-col md:flex-row items-center justify-between gap-4'>
						{/* Copyright */}
						<p className='text-sm text-foreground/60 text-center md:text-left'>
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
										className='w-9 h-9 rounded-full bg-card border border-border hover:border-primary flex items-center justify-center transition-all group'
										initial={{ opacity: 0, scale: 0 }}
										whileInView={{ opacity: 1, scale: 1 }}
										viewport={{ once: true }}
										transition={{ duration: 0.3, delay: index * 0.1 }}
										whileHover={{ scale: 1.2, rotate: 360 }}
										whileTap={{ scale: 0.9 }}>
										<Icon className='w-4 h-4 text-foreground/70 group-hover:text-primary transition-colors' />
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
