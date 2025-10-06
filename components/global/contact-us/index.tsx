"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ContactUs() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

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

	return (
		<section
			id='contact'
			aria-labelledby='contact-heading'
			className='w-full min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10 md:py-20 px-4 md:px-8 my-2 rounded-2xl'>
			<div className='max-w-7xl mx-auto'>
				{/* Mobile Layout */}
				<div className='block lg:hidden'>
					{/* Form Card - Mobile */}
					<div className='bg-white rounded-3xl p-6 md:p-8 shadow-xl mb-8'>
						<h2
							id='contact-heading'
							className='text-2xl md:text-3xl font-bold text-gray-800 mb-4'>
							GET IN TOUCH
						</h2>
						<p className='text-gray-500 mb-6'>
							We will contact you within 24 hours
						</p>

						<form
							onSubmit={handleSubmit}
							className='space-y-6'
							aria-label='Contact form'>
							<div>
								<label htmlFor='name-mobile' className='sr-only'>
									Your Name
								</label>
								<input
									id='name-mobile'
									type='text'
									name='name'
									placeholder='Name'
									value={formData.name}
									onChange={handleChange}
									autoComplete='name'
									className='w-full pb-3 border-b-2 border-gray-300  outline-none focus:border-primary text-gray-700 placeholder-gray-400 transition-colors'
									required
									aria-required='true'
								/>
							</div>
							<div>
								<label htmlFor='email-mobile' className='sr-only'>
									Your Email Address
								</label>
								<input
									id='email-mobile'
									type='email'
									name='email'
									placeholder='Email'
									value={formData.email}
									onChange={handleChange}
									autoComplete='email'
									className='w-full pb-3 border-b-2 border-gray-300  outline-none focus:border-primary text-gray-700 placeholder-gray-400 transition-colors'
									required
									aria-required='true'
								/>
							</div>
							<div>
								<label htmlFor='subject-mobile' className='sr-only'>
									Subject
								</label>
								<input
									id='subject-mobile'
									type='text'
									name='subject'
									placeholder='Subject'
									value={formData.subject}
									onChange={handleChange}
									autoComplete='off'
									className='w-full pb-3 border-b-2 border-gray-300  outline-none focus:border-primary text-gray-700 placeholder-gray-400 transition-colors'
									required
									aria-required='true'
								/>
							</div>
							<div>
								<label htmlFor='message-mobile' className='sr-only'>
									Your Message
								</label>
								<textarea
									id='message-mobile'
									name='message'
									placeholder='Message'
									value={formData.message}
									onChange={handleChange}
									rows={4}
									className='w-full pb-3 border-b-2 border-gray-300  outline-none focus:border-primary text-gray-700 placeholder-gray-400 transition-colors resize-none'
									required
									aria-required='true'
								/>
							</div>
							<Button
								type='submit'
								className='bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-black'>
								Contact Us
							</Button>
						</form>
					</div>

					{/* Contact Info - Mobile */}
					<div className='space-y-8'>
						<div>
							<h2 className='text-md md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 md:mb-4'>
								We&apos;re Here To Connect And Assist You
							</h2>
							<p className='text-gray-500 text-[10px] md:text-base'>
								Have questions or need assistance? Our team is ready to help you
								with your project inquiries.
							</p>
						</div>

						<address className='flex flex-wrap gap-8 not-italic'>
							<div>
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
							</div>

							<div>
								<h3 className='text-md font-bold text-primary mb-2'>EMAIL</h3>
								<p className='text-gray-700'>
									<a
										href='mailto:info@qbitlog.com'
										className='hover:text-primary transition-colors text-[10px]'>
										info@qbitlog.com
									</a>
								</p>
							</div>
						</address>

						<nav aria-label='Social media links'>
							<h3 className='text-md font-bold text-blue-500 mb-4'>
								FOLLOW US
							</h3>
							<div className='flex gap-2'>
								<a
									href='https://facebook.com/qbitlog'
									className='w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors focus:ring-2 focus:ring-primary focus:outline-none'
									aria-label='Follow us on Facebook'
									target='_blank'
									rel='noopener noreferrer'>
									<svg
										className='w-5 h-5 text-gray-700'
										fill='currentColor'
										viewBox='0 0 24 24'
										aria-hidden='true'>
										<path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
									</svg>
								</a>
								<a
									href='https://linkedin.com/company/qbitlog'
									className='w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors focus:ring-2 focus:ring-primary focus:outline-none'
									aria-label='Follow us on LinkedIn'
									target='_blank'
									rel='noopener noreferrer'>
									<svg
										className='w-5 h-5 text-gray-700'
										fill='currentColor'
										viewBox='0 0 24 24'
										aria-hidden='true'>
										<path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
									</svg>
								</a>
								<a
									href='https://instagram.com/qbitlog'
									className='w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors focus:ring-2 focus:ring-primary focus:outline-none'
									aria-label='Follow us on Instagram'
									target='_blank'
									rel='noopener noreferrer'>
									<svg
										className='w-5 h-5 text-gray-700'
										fill='currentColor'
										viewBox='0 0 24 24'
										aria-hidden='true'>
										<path d='M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z' />
									</svg>
								</a>
								<a
									href='https://youtube.com/@qbitlog'
									className='w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors focus:ring-2 focus:ring-primary focus:outline-none'
									aria-label='Subscribe to our YouTube channel'
									target='_blank'
									rel='noopener noreferrer'>
									<svg
										className='w-5 h-5 text-gray-700'
										fill='currentColor'
										viewBox='0 0 24 24'
										aria-hidden='true'>
										<path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
									</svg>
								</a>
							</div>
						</nav>
					</div>
				</div>

				{/* Desktop Layout */}
				<div className='hidden lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-20 items-center'>
					{/* Left Side - Contact Info */}
					<div className='space-y-10'>
						<div>
							<h2 className='text-xl xl:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6'>
								We&apos;re Here To Connect And Assist You
							</h2>
							<p className='text-gray-500 text-md'>
								Have questions or need assistance? Our team is ready to help you
								with your project inquiries.
							</p>
						</div>

						<address className='space-y-6 not-italic'>
							<div>
								<h3 className='text-xl font-semibold text-blue-500 mb-2'>
									CONTACT US
								</h3>
								<p className='text-gray-700 text-lg'>
									<a
										href='tel:+31201234567'
										className='hover:text-primary transition-colors'>
										+31 20 123 4567
									</a>
								</p>
							</div>

							<div>
								<h3 className='text-xl font-semibold text-primary mb-2'>
									EMAIL
								</h3>
								<p className='text-gray-700 text-lg'>
									<a
										href='mailto:info@qbitlog.com'
										className='hover:text-primary transition-colors'>
										info@qbitlog.com
									</a>
								</p>
							</div>
						</address>

						<nav aria-label='Social media links'>
							<h3 className='text-xl font-semibold text-blue-500 mb-4'>
								FOLLOW US
							</h3>
							<div className='flex gap-4'>
								<a
									href='https://facebook.com/qbitlog'
									className='w-12 h-12 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors focus:ring-2 focus:ring-primary focus:outline-none'
									aria-label='Follow us on Facebook'
									target='_blank'
									rel='noopener noreferrer'>
									<svg
										className='w-6 h-6 text-gray-700'
										fill='currentColor'
										viewBox='0 0 24 24'
										aria-hidden='true'>
										<path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
									</svg>
								</a>
								<a
									href='https://linkedin.com/company/qbitlog'
									className='w-12 h-12 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors focus:ring-2 focus:ring-primary focus:outline-none'
									aria-label='Follow us on LinkedIn'
									target='_blank'
									rel='noopener noreferrer'>
									<svg
										className='w-6 h-6 text-gray-700'
										fill='currentColor'
										viewBox='0 0 24 24'
										aria-hidden='true'>
										<path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
									</svg>
								</a>
								<a
									href='https://instagram.com/qbitlog'
									className='w-12 h-12 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors focus:ring-2 focus:ring-primary focus:outline-none'
									aria-label='Follow us on Instagram'
									target='_blank'
									rel='noopener noreferrer'>
									<svg
										className='w-6 h-6 text-gray-700'
										fill='currentColor'
										viewBox='0 0 24 24'
										aria-hidden='true'>
										<path d='M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z' />
									</svg>
								</a>
								<a
									href='https://youtube.com/@qbitlog'
									className='w-12 h-12 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors focus:ring-2 focus:ring-primary focus:outline-none'
									aria-label='Subscribe to our YouTube channel'
									target='_blank'
									rel='noopener noreferrer'>
									<svg
										className='w-6 h-6 text-gray-700'
										fill='currentColor'
										viewBox='0 0 24 24'
										aria-hidden='true'>
										<path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
									</svg>
								</a>
							</div>
						</nav>
					</div>

					{/* Right Side - Form Card */}
					<div className='bg-white rounded-3xl p-8 xl:p-12 shadow-2xl'>
						<h2 className='text-3xl xl:text-4xl font-bold text-gray-800 mb-4'>
							GET IN TOUCH
						</h2>
						<p className='text-gray-500 text-lg mb-8'>
							We will contact you within 24 hours
						</p>

						<form
							onSubmit={handleSubmit}
							className='space-y-8'
							aria-label='Contact form'>
							<div>
								<label htmlFor='name-desktop' className='sr-only'>
									Your Name
								</label>
								<input
									id='name-desktop'
									type='text'
									name='name'
									placeholder='Name'
									value={formData.name}
									onChange={handleChange}
									autoComplete='name'
									className='w-full pb-3 border-b-2 border-gray-300 focus:border-primary   outline-none text-gray-700 placeholder-gray-400 transition-colors text-lg'
									required
									aria-required='true'
								/>
							</div>
							<div>
								<label htmlFor='email-desktop' className='sr-only'>
									Your Email Address
								</label>
								<input
									id='email-desktop'
									type='email'
									name='email'
									placeholder='Email'
									value={formData.email}
									onChange={handleChange}
									autoComplete='email'
									className='w-full pb-3 border-b-2 border-gray-300 focus:border-primary   outline-none text-gray-700 placeholder-gray-400 transition-colors text-lg'
									required
									aria-required='true'
								/>
							</div>
							<div>
								<label htmlFor='subject-desktop' className='sr-only'>
									Subject
								</label>
								<input
									id='subject-desktop'
									type='text'
									name='subject'
									placeholder='Subject'
									value={formData.subject}
									onChange={handleChange}
									autoComplete='off'
									className='w-full pb-3 border-b-2 border-gray-300 focus:border-primary   outline-none text-gray-700 placeholder-gray-400 transition-colors text-lg'
									required
									aria-required='true'
								/>
							</div>
							<div>
								<label htmlFor='message-desktop' className='sr-only'>
									Your Message
								</label>
								<textarea
									id='message-desktop'
									name='message'
									placeholder='Message'
									value={formData.message}
									onChange={handleChange}
									rows={4}
									className='w-full pb-3 border-b-2 border-gray-300 focus:border-primary   outline-none text-gray-700 placeholder-gray-400 transition-colors resize-none text-lg'
									required
									aria-required='true'
								/>
							</div>
							<Button
								type='submit'
								className='bg-black hover:bg-gray-800 text-white px-10 py-3 rounded-lg transition-colors text-lg focus:ring-2 focus:ring-offset-2 focus:ring-black'>
								Contact Us
							</Button>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}
