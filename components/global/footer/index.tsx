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
	Github,
} from "lucide-react";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	const footerLinks = {
		services: [
			{ name: "Web Development", href: "#services" },
			{ name: "Mobile Apps", href: "#services" },
			{ name: "UI/UX Design", href: "#services" },
			{ name: "Cloud Solutions", href: "#services" },
		],
		company: [
			{ name: "About Us", href: "#about" },
			{ name: "Our Team", href: "#team" },
			{ name: "Careers", href: "#careers" },
			{ name: "Contact", href: "#contact" },
		],
		resources: [
			{ name: "Blog", href: "#blog" },
			{ name: "Case Studies", href: "#cases" },
			{ name: "Documentation", href: "#docs" },
			{ name: "Support", href: "#support" },
		],
		legal: [
			{ name: "Privacy Policy", href: "#privacy" },
			{ name: "Terms of Service", href: "#terms" },
			{ name: "Cookie Policy", href: "#cookies" },
		],
	};

	const socialLinks = [
		{ icon: Facebook, href: "#", label: "Facebook" },
		{ icon: Twitter, href: "#", label: "Twitter" },
		{ icon: Linkedin, href: "#", label: "LinkedIn" },
		{ icon: Instagram, href: "#", label: "Instagram" },
		{ icon: Github, href: "#", label: "GitHub" },
	];

	return (
		<footer className='w-full bg-background border-t border-border'>
			{/* Main Footer Content */}
			<div className='container mx-auto px-4 py-12 lg:py-16'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12'>
					{/* Brand Section */}
					<div className='lg:col-span-2 space-y-4'>
						<Link href='/' className='inline-block'>
							<Image
								src='/icons/logo.svg'
								alt='Qbitlog Logo'
								width={50}
								height={50}
								className='w-12 h-12'
							/>
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
							<div className='flex items-start gap-3 text-sm text-foreground/70'>
								<Mail className='w-4 h-4 mt-0.5 text-primary flex-shrink-0' />
								<a
									href='mailto:info@qbitlog.com'
									className='hover:text-primary transition-colors'>
									info@qbitlog.com
								</a>
							</div>
							<div className='flex items-start gap-3 text-sm text-foreground/70'>
								<Phone className='w-4 h-4 mt-0.5 text-secondary flex-shrink-0' />
								<a
									href='tel:+31201234567'
									className='hover:text-secondary transition-colors'>
									+31 20 123 4567
								</a>
							</div>
							<div className='flex items-start gap-3 text-sm text-foreground/70'>
								<MapPin className='w-4 h-4 mt-0.5 text-primary flex-shrink-0' />
								<span>Amsterdam, Netherlands</span>
							</div>
						</div>
					</div>

					{/* Services Links */}
					<div className='space-y-4'>
						<h4 className='text-sm font-bold uppercase tracking-wider text-foreground'>
							Services
						</h4>
						<ul className='space-y-3'>
							{footerLinks.services.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className='text-sm text-foreground/70 hover:text-primary transition-colors hover:translate-x-1 inline-block'>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Company Links */}
					<div className='space-y-4'>
						<h4 className='text-sm font-bold uppercase tracking-wider text-foreground'>
							Company
						</h4>
						<ul className='space-y-3'>
							{footerLinks.company.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className='text-sm text-foreground/70 hover:text-secondary transition-colors hover:translate-x-1 inline-block'>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Resources Links */}
					<div className='space-y-4'>
						<h4 className='text-sm font-bold uppercase tracking-wider text-foreground'>
							Resources
						</h4>
						<ul className='space-y-3'>
							{footerLinks.resources.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className='text-sm text-foreground/70 hover:text-primary transition-colors hover:translate-x-1 inline-block'>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Legal Links */}
					<div className='space-y-4'>
						<h4 className='text-sm font-bold uppercase tracking-wider text-foreground'>
							Legal
						</h4>
						<ul className='space-y-3'>
							{footerLinks.legal.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className='text-sm text-foreground/70 hover:text-secondary transition-colors hover:translate-x-1 inline-block'>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Newsletter Section */}
				<div className='mt-12 pt-8 border-t border-border'>
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
							<input
								type='email'
								placeholder='Enter your email'
								className='px-4 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none text-sm flex-1 md:w-64 transition-colors'
							/>
							<button className='px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition-opacity text-sm whitespace-nowrap'>
								Subscribe
							</button>
						</div>
					</div>
				</div>
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
							{socialLinks.map((social) => {
								const Icon = social.icon;
								return (
									<a
										key={social.label}
										href={social.href}
										aria-label={social.label}
										className='w-9 h-9 rounded-full bg-card border border-border hover:border-primary flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg group'>
										<Icon className='w-4 h-4 text-foreground/70 group-hover:text-primary transition-colors' />
									</a>
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
