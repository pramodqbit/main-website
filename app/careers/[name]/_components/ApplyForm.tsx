"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2 } from "lucide-react";

const ACCEPTED_FILE_TYPES = "application/pdf,.doc,.docx";
const MAX_FILE_SIZE_MB = 5;

export default function ApplyForm({ jobTitle }: { jobTitle: string }) {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		coverLetter: "",
	});
	const [resumeFile, setResumeFile] = useState<File | null>(null);
	const [resumeError, setResumeError] = useState("");
	const [fieldErrors, setFieldErrors] = useState<{
		name?: string;
		email?: string;
		phone?: string;
	}>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState<{
		type: "success" | "error" | null;
		message: string;
	}>({ type: null, message: "" });
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (fieldErrors[name as keyof typeof fieldErrors]) {
			setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setResumeError("");
		const file = e.target.files?.[0];
		if (!file) {
			setResumeFile(null);
			return;
		}
		const sizeMB = file.size / (1024 * 1024);
		if (sizeMB > MAX_FILE_SIZE_MB) {
			setResumeError(`File must be under ${MAX_FILE_SIZE_MB} MB`);
			setResumeFile(null);
			e.target.value = "";
			return;
		}
		const allowed = ["application/pdf", ".pdf", ".doc", ".docx"];
		const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
		const valid =
			file.type === "application/pdf" ||
			ext === ".pdf" ||
			ext === ".doc" ||
			ext === ".docx";
		if (!valid) {
			setResumeError("Please upload a PDF or Word document");
			setResumeFile(null);
			e.target.value = "";
			return;
		}
		setResumeFile(file);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitStatus({ type: null, message: "" });
		setResumeError("");
		setFieldErrors({});

		const errors: { name?: string; email?: string; phone?: string } = {};
		const trimmedName = formData.name.trim();
		const trimmedEmail = formData.email.trim();
		const trimmedPhone = formData.phone.trim();

		if (!trimmedName) errors.name = "Name is required";
		if (!trimmedEmail) errors.email = "Email is required";
		if (!trimmedPhone) errors.phone = "Phone is required";

		if (Object.keys(errors).length > 0) {
			setFieldErrors(errors);
			return;
		}
		if (!resumeFile) {
			setResumeError("Resume is required");
			return;
		}
		setIsSubmitting(true);
		try {
			const form = new FormData();
			form.append("name", formData.name);
			form.append("email", formData.email);
			form.append("phone", formData.phone);
			form.append("coverLetter", formData.coverLetter);
			form.append("resume", resumeFile);
			form.append("jobTitle", jobTitle);

			const response = await fetch("/api/careers/apply", {
				method: "POST",
				body: form,
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to submit application");
			}

			setSubmitStatus({
				type: "success",
				message:
					"Thank you for applying! We'll review your application and get back to you soon.",
			});
			setFormData({ name: "", email: "", phone: "", coverLetter: "" });
			setResumeFile(null);
			if (fileInputRef.current) fileInputRef.current.value = "";
		} catch (err) {
			setSubmitStatus({
				type: "error",
				message:
					err instanceof Error
						? err.message
						: "Something went wrong. Please try again.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="w-full">
			<h2 className="text-xl font-semibold text-card-foreground mb-6">
				Apply for this role
			</h2>

			{submitStatus.type && (
				<div
					className={`mb-6 p-4 rounded-lg border ${submitStatus.type === "success"
						? "bg-primary/10 text-primary border-primary/20"
						: "bg-destructive/10 text-destructive border-destructive/20"
						}`}
				>
					{submitStatus.message}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-5">
				<div className="grid grid-cols-1  gap-5">
					<div className="space-y-2">
						<Label htmlFor="name" className="text-sm font-medium">
							Full name <span className="text-destructive">*</span>
						</Label>
						<Input
							id="name"
							name="name"
							type="text"
							placeholder="Jane Doe"
							value={formData.name}
							onChange={handleInputChange}
							required
							disabled={isSubmitting}
							className={`h-11 bg-background border-border ${fieldErrors.name ? "border-destructive" : ""}`}
						/>
						{fieldErrors.name && (
							<p className="text-sm text-destructive">{fieldErrors.name}</p>
						)}
					</div>
					<div className="space-y-2">
						<Label htmlFor="email" className="text-sm font-medium">
							Email <span className="text-destructive">*</span>
						</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="jane@example.com"
							value={formData.email}
							onChange={handleInputChange}
							required
							disabled={isSubmitting}
							className={`h-11 bg-background border-border ${fieldErrors.email ? "border-destructive" : ""}`}
						/>
						{fieldErrors.email && (
							<p className="text-sm text-destructive">{fieldErrors.email}</p>
						)}
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="phone" className="text-sm font-medium">
						Phone <span className="text-destructive">*</span>
					</Label>
					<Input
						id="phone"
						name="phone"
						type="tel"
						placeholder="+1 (555) 000-0000"
						value={formData.phone}
						onChange={handleInputChange}
						required
						disabled={isSubmitting}
						className={`h-11 bg-background border-border ${fieldErrors.phone ? "border-destructive" : ""}`}
					/>
					{fieldErrors.phone && (
						<p className="text-sm text-destructive">{fieldErrors.phone}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="resume" className="text-sm font-medium">
						Resume <span className="text-destructive">*</span>
					</Label>
					<div className="flex flex-col sm:flex-row sm:items-center gap-3">
						<input
							ref={fileInputRef}
							id="resume"
							name="resume"
							type="file"
							accept={ACCEPTED_FILE_TYPES}
							onChange={handleFileChange}
							disabled={isSubmitting}
							className="hidden"
						/>
						<Button
							type="button"
							variant="outline"
							size="default"
							className="shrink-0 gap-2"
							onClick={() => fileInputRef.current?.click()}
							disabled={isSubmitting}
						>
							<Upload className="h-4 w-4" />
							Choose file
						</Button>
						{resumeFile ? (
							<span className="flex items-center gap-2 text-sm text-muted-foreground truncate">
								<FileText className="h-4 w-4 text-primary" />
								{resumeFile.name}
							</span>
						) : (
							<span className="text-sm text-muted-foreground">
								PDF or Word, max {MAX_FILE_SIZE_MB} MB
							</span>
						)}
					</div>
					{resumeError && (
						<p className="text-sm text-destructive">{resumeError}</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="coverLetter" className="text-sm font-medium">
						Cover letter
					</Label>
					<Textarea
						id="coverLetter"
						name="coverLetter"
						placeholder="Tell us why you're a great fit..."
						value={formData.coverLetter}
						onChange={handleInputChange}
						disabled={isSubmitting}
						rows={4}
						className="bg-background border-border resize-none"
					/>
				</div>

				<Button
					type="submit"
					disabled={isSubmitting}
					className="w-full sm:w-auto min-w-[180px] gap-2"
				>
					{isSubmitting ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" />
							Submitting...
						</>
					) : (
						"Submit application"
					)}
				</Button>
			</form>
		</div>
	);
}
