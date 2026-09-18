import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";
import { ChevronRight, Home, Shield } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qbitlog.com";

export const metadata: Metadata = {
	title: "Privacy Policy - Academy Ai",
	description:
		"Privacy Policy for Academy Ai by Qbitlog. Learn how we collect, process, store, and protect your personal information under DPDP Act 2023, GDPR, and CCPA/CPRA.",
	keywords: [
		"Academy Ai privacy policy",
		"Qbitlog privacy",
		"DPDP Act 2023",
		"data fiduciary",
		"GDPR",
		"CCPA",
		"AI data usage",
		"account deletion",
	],
	openGraph: {
		title: "Privacy Policy - Academy Ai | QBITLOG",
		description:
			"How Academy Ai by Qbitlog collects, processes, and protects your personal information.",
		url: `${siteUrl}/academyai/privacy-policy`,
		type: "website",
	},
	twitter: {
		card: "summary",
		title: "Privacy Policy - Academy Ai | QBITLOG",
		description:
			"How Academy Ai by Qbitlog collects, processes, and protects your personal information.",
	},
	alternates: {
		canonical: `${siteUrl}/academyai/privacy-policy`,
	},
};

export default function PrivacyPolicyPage() {
	return (
		<div>
			<main className='container px-4'>
				<Navbar />

				<div className='mx-auto mt-8 max-w-3xl pb-16'>
					<nav className='flex flex-wrap items-center gap-2 py-2 text-sm text-muted-foreground'>
						<Link
							href='/'
							className='flex items-center transition-colors hover:text-primary'>
							<Home className='mr-1 h-4 w-4' />
							Home
						</Link>
						<ChevronRight className='h-4 w-4 flex-shrink-0' />
						<span className='text-muted-foreground'>Academy Ai</span>
						<ChevronRight className='h-4 w-4 flex-shrink-0' />
						<span className='font-medium text-foreground'>Privacy Policy</span>
					</nav>

					<header className='mt-6 space-y-4 border-b border-border/60 pb-8'>
						<div className='inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground'>
							<Shield className='h-3.5 w-3.5 text-primary' />
							Legal Documentation
						</div>
						<h1 className='text-3xl font-bold tracking-tight text-foreground md:text-4xl'>
							Privacy Policy
						</h1>
						<p className='text-lg font-medium text-foreground'>Academy Ai</p>
						<div className='space-y-1 text-sm text-muted-foreground'>
							<p>
								<span className='font-medium text-foreground'>
									Last Updated:
								</span>{" "}
								September 18, 2026
							</p>
							<p>
								<span className='font-medium text-foreground'>
									Data Fiduciary &amp; Service Provider:
								</span>{" "}
								Qbitlog (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
							</p>
							<p>
								<span className='font-medium text-foreground'>
									Primary Contact &amp; Grievance Redressal:
								</span>{" "}
								<a
									href='mailto:contact@qbitlog.com'
									className='text-primary hover:underline'>
									contact@qbitlog.com
								</a>
							</p>
						</div>
						<p className='text-sm text-muted-foreground'>
							Also see our{" "}
							<Link
								href='/academyai/terms-and-conditions'
								className='text-primary hover:underline'>
								Terms &amp; Conditions
							</Link>
							.
						</p>
						<p className='text-base leading-relaxed text-muted-foreground'>
							This Privacy Policy governs the collection, processing, storage,
							and protection of personal information obtained through the{" "}
							<strong className='text-foreground'>Academy Ai</strong> mobile
							application, web application, and associated services
							(collectively, the &quot;Application&quot;) operated by Qbitlog.
						</p>
					</header>

					<article className='prose prose-neutral mt-10 max-w-none prose-headings:scroll-mt-28 prose-headings:font-bold prose-headings:text-foreground prose-h2:mt-10 prose-h2:text-2xl prose-h3:text-lg prose-h4:text-base prose-a:text-primary prose-strong:text-foreground prose-p:leading-relaxed prose-p:text-muted-foreground prose-li:text-muted-foreground'>
						<section id='information-we-collect'>
							<h2>1. Information We Collect</h2>
							<p>
								We adhere to the principle of data minimization and only collect
								information strictly necessary to provide and optimize our
								educational AI services.
							</p>

							<h3>User-Provided Information</h3>
							<ul>
								<li>
									Account credentials and profile details (e.g., name, email
									address, optional phone number).
								</li>
								<li>
									Educational inputs, including text prompts, study queries,
									uploaded learning material, and questions submitted directly
									to the AI features.
								</li>
								<li>
									Communications and feedback submitted directly to our support
									or administrative team.
								</li>
							</ul>

							<h3>Automatically Collected Telemetry</h3>
							<ul>
								<li>
									Device attributes: Operating system version, device model,
									hardware specifications, and unique device identifiers.
								</li>
								<li>
									Technical log data: Internet Protocol (IP) address, browser
									type, crash logs, and interaction timestamps (time spent,
									features accessed).
								</li>
							</ul>

							<h3>Tracking &amp; Analytics</h3>
							<ul>
								<li>
									Necessary operational tokens, SDKs, and telemetry to maintain
									session integrity and app stability. Non-essential tracking is
									deployed only where consent has been affirmatively granted in
									accordance with applicable statutory frameworks.
								</li>
							</ul>
						</section>

						<section id='ai-features'>
							<h2>2. Artificial Intelligence (AI) Features &amp; Data Usage</h2>
							<p>
								Academy Ai utilizes artificial intelligence and machine learning
								models to deliver educational content, contextual responses, and
								personalized study workflows.
							</p>
							<ul>
								<li>
									<strong>Purpose of Processing:</strong> User prompts and
									inputs are processed solely to generate real-time AI responses
									and maintain conversational context within your learning
									session.
								</li>
								<li>
									<strong>No Unauthorized Model Training:</strong> We do not
									sell, rent, or use your personal data, queries, or submitted
									learning materials to train, fine-tune, or improve
									foundational third-party AI models without your explicit,
									opt-in consent.
								</li>
								<li>
									<strong>AI Sub-Processors:</strong> Where cloud-hosted AI
									inference infrastructure (such as OpenAI, Anthropic, or Google
									Cloud Vertex AI) is utilized, prompts are transmitted via
									enterprise APIs subject to strict confidentiality,
									zero-data-retention-for-training agreements, and data
									minimization protocols.
								</li>
							</ul>
						</section>

						<section id='third-party-providers'>
							<h2>3. Third-Party Service Providers (Sub-Processors)</h2>
							<p>
								We do not sell, lease, or monetize your personal information to
								data brokers or advertising networks. We partner strictly with
								infrastructure and performance vendors who are contractually
								bound to process data only on our behalf:
							</p>
							<ul>
								<li>
									<strong>Google Play Services:</strong> Core mobile
									infrastructure and operating-system-level runtime services (
									<a
										href='https://www.google.com/policies/privacy/'
										target='_blank'
										rel='noopener noreferrer'>
										Google Privacy Policy
									</a>
									).
								</li>
								<li>
									<strong>
										Google Analytics for Firebase &amp; Firebase Crashlytics:
									</strong>{" "}
									Aggregated application telemetry, crash diagnostics, and
									performance optimization (
									<a
										href='https://firebase.google.com/support/privacy/'
										target='_blank'
										rel='noopener noreferrer'>
										Firebase Privacy Policy
									</a>
									).
								</li>
								<li>
									<strong>Expo:</strong> Cross-platform application framework
									and runtime maintenance (
									<a
										href='https://expo.io/privacy'
										target='_blank'
										rel='noopener noreferrer'>
										Expo Privacy Policy
									</a>
									).
								</li>
							</ul>
							<p>
								Any data shared with external vendors for analytics or crash
								diagnosis is aggregated and anonymized wherever technically
								feasible.
							</p>
						</section>

						<section id='legal-grounds'>
							<h2>4. Legal Grounds for Processing</h2>
							<p>
								Depending on your jurisdiction, we process personal data under
								the following lawful bases:
							</p>
							<ul>
								<li>
									<strong>Performance of a Contract / Service Delivery:</strong>{" "}
									To register your account, maintain infrastructure, deliver
									educational content, and execute AI queries.
								</li>
								<li>
									<strong>Consent:</strong> For marketing communications,
									non-essential cookies/trackers, and optional features (which
									you may withdraw at any time).
								</li>
								<li>
									<strong>Legitimate Interests / Lawful Uses:</strong> To
									safeguard cybersecurity, prevent malicious activity, and
									optimize system stability.
								</li>
								<li>
									<strong>Compliance with Legal Obligations:</strong> To
									satisfy statutory accounting, tax, or lawful law enforcement
									demands under applicable regional acts.
								</li>
							</ul>
						</section>

						<section id='international-transfers'>
							<h2>5. International Data Transfers</h2>
							<p>
								Your information may be transferred to, and processed on, secure
								servers located outside of your state, province, or country of
								residence. Whenever personal data is transferred internationally
								(including outside the EEA, UK, or India), we implement adequate
								statutory safeguards:
							</p>
							<ul>
								<li>
									Standard Contractual Clauses (SCCs) approved by competent
									regulatory bodies.
								</li>
								<li>
									Binding corporate agreements with enterprise-grade encryption
									standards.
								</li>
								<li>
									Compliance with transfer restrictions and blacklists
									established under applicable data protection statutes.
								</li>
							</ul>
						</section>

						<section id='data-retention'>
							<h2>6. Data Retention &amp; Account Deletion</h2>
							<p>
								We do not retain personal information longer than is necessary
								to serve the operational purposes outlined in this policy.
							</p>
							<ul>
								<li>
									<strong>Account Data &amp; Prompts:</strong> Retained actively
									while your account remains active.
								</li>
								<li>
									<strong>Account Deletion:</strong> You may delete your
									account and associated personal data at any time via the
									in-app settings (
									<strong>Settings &gt; Account &gt; Delete Account</strong>)
									or by emailing{" "}
									<a href='mailto:contact@qbitlog.com'>contact@qbitlog.com</a>.
									Upon verified deletion, your personal identifiers and prompt
									histories are permanently purged or irreversibly anonymized
									within <strong>30 calendar days</strong>, except where
									retention is strictly mandated by statutory record-keeping
									laws.
								</li>
								<li>
									<strong>System Telemetry:</strong> Anonymized crash reports
									and aggregate analytical metrics are retained for a maximum of{" "}
									<strong>12 months</strong>, after which they are
									systematically deleted.
								</li>
							</ul>
						</section>

						<section id='statutory-rights'>
							<h2>7. Statutory Rights &amp; Regional Disclosures</h2>

							<h3>
								A. Digital Personal Data Protection Act, 2023 (India)
							</h3>
							<p>
								For users located in India, Qbitlog operates as the &quot;Data
								Fiduciary&quot; regarding your digital personal data:
							</p>
							<ul>
								<li>
									<strong>Right to Access &amp; Summary:</strong> You have the
									right to obtain a summary of the personal data we process, the
									identities of all third-party Data Processors with whom your
									data has been shared, and any other relevant information.
								</li>
								<li>
									<strong>Right to Correction &amp; Erasure:</strong> You may
									request the correction of inaccurate or misleading personal
									data, completion of incomplete data, and the updating or
									erasure of your personal data when it is no longer necessary
									for the purpose for which it was collected.
								</li>
								<li>
									<strong>Right to Nominate:</strong> In the event of death or
									incapacity, you have the right to nominate an individual who
									shall exercise your data rights in accordance with the
									provisions of the DPDP Act.
								</li>
								<li>
									<strong>Grievance Escalation:</strong> If you are dissatisfied
									with our response to your data access or erasure request, you
									may write to our Grievance Officer at{" "}
									<a href='mailto:contact@qbitlog.com'>contact@qbitlog.com</a>.
									If your grievance remains unaddressed within 30 days, you
									retain the statutory right to escalate the matter to the Data
									Protection Board of India.
								</li>
							</ul>

							<h3>B. GDPR (EEA &amp; UK) &amp; CCPA/CPRA (California)</h3>
							<ul>
								<li>
									<strong>Access, Portability &amp; Erasure:</strong> You may
									request a machine-readable export of your personal information
									or demand complete erasure (&quot;Right to be Forgotten&quot;).
								</li>
								<li>
									<strong>Non-Sale of Personal Data:</strong> We do not sell or
									&quot;share&quot; personal information for cross-context
									behavioral advertising under the California Consumer Privacy
									Act.
								</li>
								<li>
									<strong>Non-Discrimination:</strong> We will never deny
									services, charge differentiated prices, or degrade feature
									quality because you exercised your statutory privacy rights.
								</li>
							</ul>
						</section>

						<section id='child-privacy'>
							<h2>8. Child Privacy Protection</h2>
							<p>
								Academy Ai is not directed toward, nor intended for, children
								under the age of <strong>16</strong> (or the applicable minimum
								age of digital consent in your jurisdiction; 18 in India without
								verifiable parental consent). We do not knowingly solicit or
								collect personal information from minors.
							</p>
							<p>
								If we identify that an account belongs to an underage user
								without verified parental consent, we will promptly terminate
								the account and permanently delete all associated data. Parents
								or guardians who believe their child has provided us with
								personal information should contact us immediately at{" "}
								<a href='mailto:contact@qbitlog.com'>contact@qbitlog.com</a>.
							</p>
						</section>

						<section id='security'>
							<h2>9. Security Safeguards &amp; Breach Notification</h2>
							<p>
								We employ industry-standard technical and organizational
								security controls—including TLS/SSL transport layer encryption,
								AES-256 at-rest database encryption, network firewalls, and
								least-privilege administrative access controls—to protect your
								personal information against unauthorized access, loss, or
								destruction.
							</p>
							<p>
								In the event of a security incident that compromises your
								personal data, we will notify affected individuals and competent
								supervisory authorities (including the Indian Computer Emergency
								Response Team / CERT-In where applicable) in accordance with
								statutory timelines.
							</p>
						</section>

						<section id='amendments'>
							<h2>10. Privacy Policy Amendments</h2>
							<p>
								We reserve the right to revise this Privacy Policy to reflect
								technical, operational, or legal developments. When material
								changes occur, we will update the &quot;Last Updated&quot; date
								at the top of this document and provide notice through an in-app
								prompt, dashboard banner, or email alert prior to modifications
								taking effect.
							</p>
						</section>
					</article>
				</div>
			</main>
			<Footer />
		</div>
	);
}
