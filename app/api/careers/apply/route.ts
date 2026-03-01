import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Zoho SMTP: use smtp.zoho.com (US) or smtp.zoho.eu (Europe) or smtp.zoho.in (India)
const ZOHO_SMTP_HOST = process.env.ZOHO_SMTP_HOST || "smtp.zoho.com";
const ZOHO_USER = process.env.ZOHO_MAIL_USER; // Your Zoho email (e.g. Madhusmita@qbitlog.com)
const ZOHO_APP_PASSWORD = process.env.ZOHO_MAIL_APP_PASSWORD; // App password from Zoho → Settings → App Passwords (required if 2FA)
const FROM_EMAIL =
	process.env.CAREERS_FROM_EMAIL || ZOHO_USER || "Madhusmita@qbitlog.com";
const TO_EMAIL = process.env.CAREERS_TO_EMAIL || "Madhusmitadas872@gmail.com";

function getTransporter() {
	if (!ZOHO_USER || !ZOHO_APP_PASSWORD) {
		throw new Error(
			"ZOHO_MAIL_USER and ZOHO_MAIL_APP_PASSWORD must be set in environment variables.",
		);
	}
	console.log(ZOHO_USER, ZOHO_APP_PASSWORD);
	return nodemailer.createTransport({
		host: ZOHO_SMTP_HOST,
		secure: true,
		port: 465,
		auth: {
			user: ZOHO_USER,
			pass: ZOHO_APP_PASSWORD,
		},
	});
}

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const name = formData.get("name") as string | null;
		const email = formData.get("email") as string | null;
		const phone = (formData.get("phone") as string) || "";
		const coverLetter = (formData.get("coverLetter") as string) || "";
		const jobTitle = formData.get("jobTitle") as string | null;
		const resume = formData.get("resume") as File | null;

		if (!name?.trim() || !email?.trim()) {
			return NextResponse.json(
				{ error: "Name and email are required" },
				{ status: 400 },
			);
		}

		if (!jobTitle?.trim()) {
			return NextResponse.json(
				{ error: "Job title is required" },
				{ status: 400 },
			);
		}

		if (!resume || !(resume instanceof File) || resume.size === 0) {
			return NextResponse.json(
				{ error: "Resume file is required" },
				{ status: 400 },
			);
		}

		const resumeInfo = `Resume: ${resume.name} (${(resume.size / 1024).toFixed(1)} KB)`;

		const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Job Application</h2>
        <p><strong>Position:</strong> ${jobTitle}</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>${resumeInfo}</strong></p>
          ${
						coverLetter
							? `
          <p><strong>Cover letter:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 8px; white-space: pre-wrap;">${coverLetter.replace(
						/</g,
						"&lt;",
					)}</div>`
							: ""
					}
        </div>
      </div>`;

		const resumeBuffer = Buffer.from(await resume.arrayBuffer());

		const transporter = getTransporter();
		await transporter.sendMail({
			from: `"Qbitlog Careers" <${FROM_EMAIL}>`,
			to: TO_EMAIL,
			subject: `Job Application: ${jobTitle} – ${name}`,
			html: htmlBody,
			attachments: [
				{
					filename: resume.name,
					content: resumeBuffer,
				},
			],
		});

		return NextResponse.json(
			{ success: true, message: "Application submitted successfully." },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Careers apply error:", error);
		if (error instanceof Error && error.message.includes("ZOHO_MAIL")) {
			return NextResponse.json(
				{ error: "Email is not configured. Please contact support." },
				{ status: 503 },
			);
		}
		return NextResponse.json(
			{ error: "Failed to submit application. Please try again." },
			{ status: 500 },
		);
	}
}
