"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export default function ContactUs() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

	const [focusedField, setFocusedField] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<{
		type: 'success' | 'error' | null;
		message: string;
	}>({ type: null, message: '' });

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle form submission
		console.log("Form submitted:", formData);
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
			},
		},
	};

	return (
		<section
			id='contact'
			aria-labelledby='contact-heading'
			className='w-full  bg-gradient-to-br from-gray-100 to-gray-200 py-10 md:py-20 px-4 md:px-4 my-2 rounded-2xl'>
			<div className='max-w-7xl mx-auto'>
				{/* Mobile Layout */}
				<div className='block lg:hidden'>
					{/* Form Card - Mobile */}
					<motion.div
						className='bg-white rounded-3xl p-6 md:p-8 shadow-xl mb-8'
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.2 }}
						transition={{ duration: 0.6 }}>
						<motion.h2
							id='contact-heading'
							className='text-2xl md:text-3xl font-bold text-gray-800 mb-4'
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.2 }}>
							GET IN TOUCH
						</motion.h2>
						<motion.p
							className='text-gray-500 mb-6'
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.3 }}>
							We will contact you within 24 hours
						</motion.p>

						{submitStatus.type && (
							<div className={`mb-6 p-4 rounded-lg ${
								submitStatus.type === 'success'
									? 'bg-green-100 text-green-800 border border-green-200'
									: 'bg-red-100 text-red-800 border border-red-200'
							}`}>
								{submitStatus.message}
							</div>
						)}

						<motion.form
							onSubmit={handleSubmit}
							className='space-y-6'
							aria-label='Contact form'
							variants={containerVariants}
							initial='hidden'
							whileInView='visible'
							viewport={{ once: true }}>
							<motion.div variants={itemVariants}>
								<label htmlFor='name-mobile' className='sr-only'>
									Your Name
								</label>
								<motion.input
									id='name-mobile'
									type='text'
									name='name'
									placeholder='Name'
									value={formData.name}
									onChange={handleChange}
									onFocus={() => setFocusedField("name")}
									onBlur={() => setFocusedField(null)}
									autoComplete='name'
									className='w-full pb-3 border-b-2 border-gray-300  outline-none focus:border-primary text-gray-700 placeholder-gray-400 transition-colors'
									required
									aria-required='true'
									disabled={isSubmitting}
									animate={{
										borderColor:
											focusedField === "name" ? "#8A38F5" : "#d1d5db",
									}}
									transition={{ duration: 0.3 }}
								/>
							</motion.div>
							<motion.div variants={itemVariants}>
								<label htmlFor='email-mobile' className='sr-only'>
									Your Email Address
								</label>
								<motion.input
									id='email-mobile'
									type='email'
									name='email'
									placeholder='Email'
									value={formData.email}
									onChange={handleChange}
									onFocus={() => setFocusedField("email")}
									onBlur={() => setFocusedField(null)}
									autoComplete='email'
									className='w-full pb-3 border-b-2 border-gray-300  outline-none focus:border-primary text-gray-700 placeholder-gray-400 transition-colors'
									required
									aria-required='true'
									disabled={isSubmitting}
									animate={{
										borderColor:
											focusedField === "email" ? "#8A38F5" : "#d1d5db",
									}}
									transition={{ duration: 0.3 }}
								/>
							</motion.div>
							<motion.div variants={itemVariants}>
								<label htmlFor='subject-mobile' className='sr-only'>
									Subject
								</label>
								<motion.input
									id='subject-mobile'
									type='text'
									name='subject'
									placeholder='Subject'
									value={formData.subject}
									onChange={handleChange}
									onFocus={() => setFocusedField("subject")}
									onBlur={() => setFocusedField(null)}
									autoComplete='off'
									className='w-full pb-3 border-b-2 border-gray-300  outline-none focus:border-primary text-gray-700 placeholder-gray-400 transition-colors'
									required
									aria-required='true'
									disabled={isSubmitting}
									animate={{
										borderColor:
											focusedField === "subject" ? "#8A38F5" : "#d1d5db",
									}}
									transition={{ duration: 0.3 }}
								/>
							</motion.div>
							<motion.div variants={itemVariants}>
								<label htmlFor='message-mobile' className='sr-only'>
									Your Message
								</label>
								<motion.textarea
									id='message-mobile'
									name='message'
									placeholder='Message'
									value={formData.message}
									onChange={handleChange}
									onFocus={() => setFocusedField("message")}
									onBlur={() => setFocusedField(null)}
									rows={4}
									className='w-full pb-3 border-b-2 border-gray-300  outline-none focus:border-primary text-gray-700 placeholder-gray-400 transition-colors resize-none'
									required
									aria-required='true'
									disabled={isSubmitting}
									animate={{
										borderColor:
											focusedField === "message" ? "#8A38F5" : "#d1d5db",
									}}
									transition={{ duration: 0.3 }}
								/>
							</motion.div>
							<motion.div variants={itemVariants}>
								<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
									<Button
										type='submit'
								disabled={isSubmitting}
										className='bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed w-full'>
										{isSubmitting ? 'Sending...' : 'Contact Us'}
									</Button>
								</motion.div>
							</motion.div>
						</motion.form>
					</motion.div>

					{/* Contact Info - Mobile */}
					<motion.div
						className='space-y-8'
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.3 }}>
						<div>
							<motion.h2
								className='text-md md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 md:mb-4'
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5 }}>
								We&apos;re Here To Connect And Assist You
							</motion.h2>
							<motion.p
								className='text-gray-500 text-[10px] md:text-base'
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.2 }}>
								Have questions or need assistance? Our team is ready to help you
								with your project inquiries.
							</motion.p>
						</div>

						<motion.address
							className='flex flex-wrap gap-8 not-italic'
							variants={containerVariants}
							initial='hidden'
							whileInView='visible'
							viewport={{ once: true }}>
							<motion.div variants={itemVariants}>
								<h3 className='text-md font-bold text-blue-500 mb-2'>
									CONTACT US
								</h3>
								<p className='text-gray-700'>
									<a
										href='tel:+31201234567'
										className='hover:text-primary text-[10px] md:text-base transition-colors'>
										+31 20 123 4567
									</a>
								</p>
							</motion.div>

							<motion.div variants={itemVariants}>
								<h3 className='text-md font-bold text-primary mb-2'>EMAIL</h3>
								<p className='text-gray-700'>
									<a
										href='mailto:info@qbitlog.com'
										className='hover:text-primary transition-colors text-[10px]'>
										info@qbitlog.com
									</a>
								</p>
							</motion.div>
						</motion.address>

						<motion.nav
							aria-label='Social media links'
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.4 }}>
							<h3 className='text-md font-bold text-blue-500 mb-4'>
								FOLLOW US
							</h3>
							<div className='flex gap-2'>
								<motion.a
									href='https://facebook.com/qbitlog'
									className='w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors focus:ring-2 focus:ring-primary focus:outline-none'
									aria-label='Follow us on Facebook'
									target='_blank'
									rel='noopener noreferrer'
									whileHover={{ scale: 1.2, rotate: 360 }}
									whileTap={{ scale: 0.9 }}>
									<svg
										className='w-5 h-5 text-gray-700'
										fill='currentColor'
										viewBox='0 0 24 24'
										aria-hidden='true'>
										<path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
									</svg>
								</motion.a>
								<motion.a
									href='https://linkedin.com/company/qbitlog'
									className='w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors focus:ring-2 focus:ring-primary focus:outline-none'
									aria-label='Follow us on LinkedIn'
									target='_blank'
									rel='noopener noreferrer'
									whileHover={{ scale: 1.2, rotate: 360 }}
									whileTap={{ scale: 0.9 }}>
									<svg
										className='w-5 h-5 text-gray-700'
										fill='currentColor'
										viewBox='0 0 24 24'
										aria-hidden='true'>
										<path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
									</svg>
								</motion.a>
								<motion.a
									href='https://instagram.com/qbitlog'
									className='w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors focus:ring-2 focus:ring-primary focus:outline-none'
									aria-label='Follow us on Instagram'
									target='_blank'
									rel='noopener noreferrer'
									whileHover={{ scale: 1.2, rotate: 360 }}
									whileTap={{ scale: 0.9 }}>
									<svg
										className='w-5 h-5 text-gray-700'
										fill='currentColor'
										viewBox='0 0 24 24'
										aria-hidden='true'>
										<path d='M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z' />
									</svg>
								</motion.a>
								<motion.a
									href='https://youtube.com/@qbitlog'
									className='w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors focus:ring-2 focus:ring-primary focus:outline-none'
									aria-label='Subscribe to our YouTube channel'
									target='_blank'
									rel='noopener noreferrer'
									whileHover={{ scale: 1.2, rotate: 360 }}
									whileTap={{ scale: 0.9 }}>
									<svg
										className='w-5 h-5 text-gray-700'
										fill='currentColor'
										viewBox='0 0 24 24'
										aria-hidden='true'>
										<path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
									</svg>
								</motion.a>
							</div>
						</motion.nav>
					</motion.div>
				</div>

				{/* Desktop Layout */}
				<div className='hidden lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-20 items-center'>
					{/* Left Side - Contact Info */}
					<motion.div
						className='space-y-10'
						initial={{ opacity: 0, x: -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.8 }}>
						<div>
							<motion.h2
								className='text-xl xl:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6'
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}>
								We&apos;re Here To Connect And Assist You
							</motion.h2>
							<motion.p
								className='text-gray-500 text-md'
								initial={{ opacity: 0 }}
								whileInView={{ opacity: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.2 }}>
								Have questions or need assistance? Our team is ready to help you
								with your project inquiries.
							</motion.p>
						</div>

						<motion.address
							className='space-y-6 not-italic'
							variants={containerVariants}
							initial='hidden'
							whileInView='visible'
							viewport={{ once: true }}>
							<motion.div variants={itemVariants}>
								<h3 className='text-xl font-semibold text-blue-500 mb-2'>
									CONTACT US
								</h3>
								<p className='text-gray-700 text-lg'>
									<motion.a
										href='tel:+31201234567'
										className='hover:text-primary transition-colors'
										whileHover={{ x: 5 }}>
										+31 20 123 4567
									</motion.a>
								</p>
							</motion.div>

							<motion.div variants={itemVariants}>
								<h3 className='text-xl font-semibold text-primary mb-2'>
									EMAIL
								</h3>
								<p className='text-gray-700 text-lg'>
									<motion.a
										href='mailto:info@qbitlog.com'
										className='hover:text-primary transition-colors'
										whileHover={{ x: 5 }}>
										info@qbitlog.com
									</motion.a>
								</p>
							</motion.div>
						</motion.address>

						<motion.nav
							aria-label='Social media links'
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.4 }}>
							<h3 className='text-xl font-semibold text-blue-500 mb-4'>
								FOLLOW US
							</h3>
							<div className='flex gap-4'>
								<motion.a
									href='https://facebook.com/qbitlog'
									className='w-12 h-12 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors focus:ring-2 focus:ring-primary focus:outline-none'
									aria-label='Follow us on Facebook'
									target='_blank'
									rel='noopener noreferrer'
									whileHover={{ scale: 1.2, rotate: 360 }}
									whileTap={{ scale: 0.9 }}>
									<svg
										className='w-6 h-6 text-gray-700'
										fill='currentColor'
										viewBox='0 0 24 24'
										aria-hidden='true'>
										<path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
									</svg>
								</motion.a>
								<motion.a
									href='https://linkedin.com/company/qbitlog'
									className='w-12 h-12 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors focus:ring-2 focus:ring-primary focus:outline-none'
									aria-label='Follow us on LinkedIn'
									target='_blank'
									rel='noopener noreferrer'
									whileHover={{ scale: 1.2, rotate: 360 }}
									whileTap={{ scale: 0.9 }}>
									<svg
										className='w-6 h-6 text-gray-700'
										fill='currentColor'
										viewBox='0 0 24 24'
										aria-hidden='true'>
										<path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
									</svg>
								</motion.a>
								<motion.a
									href='https://instagram.com/qbitlog'
									className='w-12 h-12 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors focus:ring-2 focus:ring-primary focus:outline-none'
									aria-label='Follow us on Instagram'
									target='_blank'
									rel='noopener noreferrer'
									whileHover={{ scale: 1.2, rotate: 360 }}
									whileTap={{ scale: 0.9 }}>
									<svg
										className='w-6 h-6 text-gray-700'
										fill='currentColor'
										viewBox='0 0 24 24'
										aria-hidden='true'>
										<path d='M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z' />
									</svg>
								</motion.a>
								<motion.a
									href='https://youtube.com/@qbitlog'
									className='w-12 h-12 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors focus:ring-2 focus:ring-primary focus:outline-none'
									aria-label='Subscribe to our YouTube channel'
									target='_blank'
									rel='noopener noreferrer'
									whileHover={{ scale: 1.2, rotate: 360 }}
									whileTap={{ scale: 0.9 }}>
									<svg
										className='w-6 h-6 text-gray-700'
										fill='currentColor'
										viewBox='0 0 24 24'
										aria-hidden='true'>
										<path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
									</svg>
								</motion.a>
							</div>
						</motion.nav>
					</motion.div>

					{/* Right Side - Form Card */}
					<motion.div
						className='bg-white rounded-3xl p-8 xl:p-12 shadow-2xl'
						initial={{ opacity: 0, x: 50 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, amount: 0.3 }}
						transition={{ duration: 0.8 }}>
						<motion.h2
							className='text-3xl xl:text-4xl font-bold text-gray-800 mb-4'
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}>
							GET IN TOUCH
						</motion.h2>
						<motion.p
							className='text-gray-500 text-lg mb-8'
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}>
							We will contact you within 24 hours
						</motion.p>

						{submitStatus.type && (
							<div className={`mb-6 p-4 rounded-lg ${
								submitStatus.type === 'success'
									? 'bg-green-100 text-green-800 border border-green-200'
									: 'bg-red-100 text-red-800 border border-red-200'
							}`}>
								{submitStatus.message}
							</div>
						)}

						<motion.form
							onSubmit={handleSubmit}
							className='space-y-8'
							aria-label='Contact form'
							variants={containerVariants}
							initial='hidden'
							whileInView='visible'
							viewport={{ once: true }}>
							<motion.div variants={itemVariants}>
								<label htmlFor='name-desktop' className='sr-only'>
									Your Name
								</label>
								<motion.input
									id='name-desktop'
									type='text'
									name='name'
									placeholder='Name'
									value={formData.name}
									onChange={handleChange}
									onFocus={() => setFocusedField("name-desktop")}
									onBlur={() => setFocusedField(null)}
									autoComplete='name'
									className='w-full pb-3 border-b-2 border-gray-300 focus:border-primary   outline-none text-gray-700 placeholder-gray-400 transition-colors text-lg'
									required
									aria-required='true'
									disabled={isSubmitting}
									animate={{
										borderColor:
											focusedField === "name-desktop" ? "#8A38F5" : "#d1d5db",
									}}
									transition={{ duration: 0.3 }}
								/>
							</motion.div>
							<motion.div variants={itemVariants}>
								<label htmlFor='email-desktop' className='sr-only'>
									Your Email Address
								</label>
								<motion.input
									id='email-desktop'
									type='email'
									name='email'
									placeholder='Email'
									value={formData.email}
									onChange={handleChange}
									onFocus={() => setFocusedField("email-desktop")}
									onBlur={() => setFocusedField(null)}
									autoComplete='email'
									className='w-full pb-3 border-b-2 border-gray-300 focus:border-primary   outline-none text-gray-700 placeholder-gray-400 transition-colors text-lg'
									required
									aria-required='true'
									disabled={isSubmitting}
									animate={{
										borderColor:
											focusedField === "email-desktop" ? "#8A38F5" : "#d1d5db",
									}}
									transition={{ duration: 0.3 }}
								/>
							</motion.div>
							<motion.div variants={itemVariants}>
								<label htmlFor='subject-desktop' className='sr-only'>
									Subject
								</label>
								<motion.input
									id='subject-desktop'
									type='text'
									name='subject'
									placeholder='Subject'
									value={formData.subject}
									onChange={handleChange}
									onFocus={() => setFocusedField("subject-desktop")}
									onBlur={() => setFocusedField(null)}
									autoComplete='off'
									className='w-full pb-3 border-b-2 border-gray-300 focus:border-primary   outline-none text-gray-700 placeholder-gray-400 transition-colors text-lg'
									required
									aria-required='true'
									disabled={isSubmitting}
									animate={{
										borderColor:
											focusedField === "subject-desktop" ? "#8A38F5" : "#d1d5db",
									}}
									transition={{ duration: 0.3 }}
								/>
							</motion.div>
							<motion.div variants={itemVariants}>
								<label htmlFor='message-desktop' className='sr-only'>
									Your Message
								</label>
								<motion.textarea
									id='message-desktop'
									name='message'
									placeholder='Message'
									value={formData.message}
									onChange={handleChange}
									onFocus={() => setFocusedField("message-desktop")}
									onBlur={() => setFocusedField(null)}
									rows={4}
									className='w-full pb-3 border-b-2 border-gray-300 focus:border-primary   outline-none text-gray-700 placeholder-gray-400 transition-colors resize-none text-lg'
									required
									aria-required='true'
									disabled={isSubmitting}
									animate={{
										borderColor:
											focusedField === "message-desktop" ? "#8A38F5" : "#d1d5db",
									}}
									transition={{ duration: 0.3 }}
								/>
							</motion.div>
							<motion.div variants={itemVariants}>
								<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
									<Button
										type='submit'
								disabled={isSubmitting}
										className='bg-black hover:bg-gray-800 text-white px-10 py-3 rounded-lg transition-colors text-lg focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed w-full'>
										{isSubmitting ? 'Sending...' : 'Contact Us'}
									</Button>
								</motion.div>
							</motion.div>
						</motion.form>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
