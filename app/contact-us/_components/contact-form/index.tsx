"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function ContactForm() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		companyName: "",
		serviceType: "",
		budgetRange: "",
		projectInfo: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Form submitted:", formData);
		// Handle form submission logic here
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<div className='w-full max-w-3xl'>
			<h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-8'>
				How can we help?
			</h2>

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
							className='h-12 bg-gray-50 border-gray-200 focus:border-gray-400 focus:ring-gray-400'
						/>
					</div>
				</div>

				{/* Company Name */}
				<div className='space-y-2'>
					<Label
						htmlFor='companyName'
						className='text-sm font-medium text-gray-700'>
						Company Name{" "}
						<span className='text-gray-500 font-normal'>(Optional)</span>
					</Label>
					<Input
						id='companyName'
						name='companyName'
						type='text'
						placeholder='Your company name'
						value={formData.companyName}
						onChange={handleInputChange}
						className='h-12 bg-gray-50 border-gray-200 focus:border-gray-400 focus:ring-gray-400'
					/>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					{/* Type of Service */}
					<div className='space-y-2'>
						<Label
							htmlFor='serviceType'
							className='text-sm font-medium text-gray-700'>
							Type of Service
						</Label>
						<Select
							value={formData.serviceType}
							onValueChange={(value) =>
								handleSelectChange("serviceType", value)
							}>
							<SelectTrigger className='h-12 bg-gray-50 border-gray-200 focus:border-gray-400 focus:ring-gray-400 w-full'>
								<SelectValue placeholder='Select service type' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='web-development'>Web Development</SelectItem>
								<SelectItem value='mobile-development'>
									Mobile Development
								</SelectItem>
								<SelectItem value='ui-ux-design'>UI/UX Design</SelectItem>
								<SelectItem value='cloud-services'>Cloud Services</SelectItem>
								<SelectItem value='consulting'>Consulting</SelectItem>
								<SelectItem value='other'>Other</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Budget Range */}
					<div className='space-y-2'>
						<Label
							htmlFor='budgetRange'
							className='text-sm font-medium text-gray-700'>
							Budget Range
						</Label>
						<Select
							value={formData.budgetRange}
							onValueChange={(value) =>
								handleSelectChange("budgetRange", value)
							}>
							<SelectTrigger className='h-12 bg-gray-50 border-gray-200 focus:border-gray-400 focus:ring-gray-400 w-full'>
								<SelectValue placeholder='Select budget range' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='less-than-5k'>Less than $5,000</SelectItem>
								<SelectItem value='5k-10k'>$5,000 - $10,000</SelectItem>
								<SelectItem value='10k-25k'>$10,000 - $25,000</SelectItem>
								<SelectItem value='25k-50k'>$25,000 - $50,000</SelectItem>
								<SelectItem value='50k-100k'>$50,000 - $100,000</SelectItem>
								<SelectItem value='more-than-100k'>
									More than $100,000
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Project Information */}
				<div className='space-y-2'>
					<Label
						htmlFor='projectInfo'
						className='text-sm font-medium text-gray-700 flex flex-col md:flex-row items-start'>
						<span className=''>Project Information </span>
						<span className='text-gray-500 font-normal text-xs '>
							Please provide details about your project requirements.
						</span>
					</Label>
					<Textarea
						id='projectInfo'
						name='projectInfo'
						placeholder='Describe your project requirements...'
						value={formData.projectInfo}
						onChange={handleInputChange}
						rows={6}
						className='bg-gray-50 border-gray-200 focus:border-gray-400 focus:ring-gray-400 resize-none'
					/>
				</div>

				{/* Submit Button */}
				<div className='pt-4'>
					<Button
						type='submit'
						className='w-full md:w-auto px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:bg-gray-800 text-white font-medium rounded-lg transition-colors'>
						Submit Request
					</Button>
				</div>

				{/* Contact Email Note */}
				<p className='text-sm text-gray-600 pt-2'>
					You can also email us at our{" "}
					<a
						href='mailto:info@qbitlog.com'
						className='text-blue-600 hover:text-blue-700 underline'>
						contact email
					</a>
				</p>
			</form>
		</div>
	);
}
