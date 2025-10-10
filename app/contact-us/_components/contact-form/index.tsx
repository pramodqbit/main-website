"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ContactForm() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		companyName: "",
		phone: "",
		projectInfo: "",
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<{
		type: 'success' | 'error' | null;
		message: string;
	}>({ type: null, message: '' });

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitStatus({ type: null, message: '' });

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to send message');
			}

			setSubmitStatus({
				type: 'success',
				message: 'Thank you for your inquiry! We\'ll get back to you within 24 hours.'
			});

			// Reset form
			setFormData({
				name: "",
				email: "",
				companyName: "",
				phone: "",
				projectInfo: "",
			});

		} catch (error) {
			console.error("Error submitting form:", error);
			setSubmitStatus({
				type: 'error',
				message: 'Failed to send your request. Please try again or email us directly.'
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<div className='w-full max-w-3xl'>
			<h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-8'>
				How can we help?
			</h2>

			{submitStatus.type && (
				<div className={`mb-6 p-4 rounded-lg ${
					submitStatus.type === 'success'
						? 'bg-green-100 text-green-800 border border-green-200'
						: 'bg-red-100 text-red-800 border border-red-200'
				}`}>
					{submitStatus.message}
				</div>
			)}

			<form onSubmit={handleSubmit} className='space-y-6'>
				{/* Name and Email Row */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div className='space-y-2'>
						<Label htmlFor='name' className='text-sm font-medium text-gray-700'>
							Name
						</Label>
						<Input
							id='name'
							name='name'
							type='text'
							placeholder='Jane Doe'
							value={formData.name}
							onChange={handleInputChange}
							required
							disabled={isSubmitting}
							className='h-12 bg-gray-50 border-gray-200 focus:border-gray-400 focus:ring-gray-400'
						/>
					</div>

					<div className='space-y-2'>
						<Label
							htmlFor='email'
							className='text-sm font-medium text-gray-700'>
							Email
						</Label>
						<Input
							id='email'
							name='email'
							type='email'
							placeholder='name@example.com'
							value={formData.email}
							onChange={handleInputChange}
							required
							disabled={isSubmitting}
							className='h-12 bg-gray-50 border-gray-200 focus:border-gray-400 focus:ring-gray-400'
						/>
					</div>
				</div>

				{/* Company Name and Phone Row */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div className='space-y-2'>
						<Label
							htmlFor='companyName'
							className='text-sm font-medium text-gray-700'>
							Company Name
						</Label>
						<Input
							id='companyName'
							name='companyName'
							type='text'
							placeholder='Your company name'
							value={formData.companyName}
							onChange={handleInputChange}
							required
							disabled={isSubmitting}
							className='h-12 bg-gray-50 border-gray-200 focus:border-gray-400 focus:ring-gray-400'
						/>
					</div>

					<div className='space-y-2'>
						<Label
							htmlFor='phone'
							className='text-sm font-medium text-gray-700'>
							Phone Number
						</Label>
						<Input
							id='phone'
							name='phone'
							type='tel'
							placeholder='+1 (555) 000-0000'
							value={formData.phone}
							onChange={handleInputChange}
							required
							disabled={isSubmitting}
							className='h-12 bg-gray-50 border-gray-200 focus:border-gray-400 focus:ring-gray-400'
						/>
					</div>
				</div>

				{/* Project Information */}
				<div className='space-y-2'>
					<Label
						htmlFor='projectInfo'
						className='text-sm font-medium text-gray-700'>
						Project Information{" "}
						<span className='text-gray-500 font-normal text-xs'>
							Please provide details about your project requirements.
						</span>
					</Label>
					<Textarea
						id='projectInfo'
						name='projectInfo'
						placeholder='Describe your project requirements...'
						value={formData.projectInfo}
						onChange={handleInputChange}
						disabled={isSubmitting}
						rows={6}
						className='bg-gray-50 border-gray-200 focus:border-gray-400 focus:ring-gray-400 resize-none'
					/>
				</div>

				{/* Submit Button */}
				<div className='pt-4'>
					<Button
						type='submit'
						disabled={isSubmitting}
						className='w-full md:w-auto px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:bg-gray-800 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
						{isSubmitting ? 'Sending...' : 'Book a Consultation'}
					</Button>
				</div>

				{/* NDA and Response Note */}
				<div className='pt-2 space-y-2'>
					<p className='text-sm text-gray-700 font-medium'>
						✓ Your idea is 100% protected by our Non-Disclosure Agreement
					</p>
					<p className='text-sm text-gray-700 font-medium'>
						✓ Response guaranteed within 24 hours
					</p>
				</div>
			</form>
		</div>
	);
}
