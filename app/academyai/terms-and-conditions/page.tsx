import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";
import { ChevronRight, Home, FileText } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qbitlog.com";

export const metadata: Metadata = {
	title: "Terms & Conditions - Academy Ai",
	description:
		"Terms & Conditions for Academy Ai by Qbitlog. Eligibility, intellectual property, AI disclaimers, acceptable use, liability limits, and grievance redressal under Indian law.",
	keywords: [
		"Academy Ai terms and conditions",
		"Qbitlog terms of service",
		"IT Rules 2021",
		"acceptable use",
		"AI disclaimer",
		"grievance redressal",
	],
	openGraph: {
		title: "Terms & Conditions - Academy Ai | QBITLOG",
		description:
			"Legal terms governing use of the Academy Ai application operated by Qbitlog.",
		url: `${siteUrl}/academyai/terms-and-conditions`,
		type: "website",
	},
	twitter: {
		card: "summary",
		title: "Terms & Conditions - Academy Ai | QBITLOG",
		description:
			"Legal terms governing use of the Academy Ai application operated by Qbitlog.",
	},
	alternates: {
		canonical: `${siteUrl}/academyai/terms-and-conditions`,
	},
};

export default function TermsAndConditionsPage() {
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
						<span className='font-medium text-foreground'>
							Terms &amp; Conditions
						</span>
					</nav>

					<header className='mt-6 space-y-4 border-b border-border/60 pb-8'>
						<div className='inline-flex items-center gap-2 rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground'>
							<FileText className='h-3.5 w-3.5 text-primary' />
							Legal Documentation
						</div>
						<h1 className='text-3xl font-bold tracking-tight text-foreground md:text-4xl'>
							Terms &amp; Conditions
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
								href='/academyai/privacy-policy'
								className='text-primary hover:underline'>
								Privacy Policy
							</Link>
							.
						</p>
						<p className='text-base leading-relaxed text-muted-foreground'>
							By downloading, accessing, or using the Academy Ai mobile
							application, web interface, or related services (the
							&quot;Application&quot;), you enter into a legally binding contract
							with Qbitlog. If you do not agree to these Terms, you must not use
							or access the Application.
						</p>
					</header>

					<article className='prose prose-neutral mt-10 max-w-none prose-headings:scroll-mt-28 prose-headings:font-bold prose-headings:text-foreground prose-h2:mt-10 prose-h2:text-2xl prose-h3:text-lg prose-a:text-primary prose-strong:text-foreground prose-p:leading-relaxed prose-p:text-muted-foreground prose-li:text-muted-foreground prose-ol:text-muted-foreground'>
						<section id='eligibility'>
							<h2>1. Eligibility &amp; License to Use</h2>
							<ul>
								<li>
									<strong>Age Requirements:</strong> You represent that you are
									at least 16 years of age (or the minimum legal age of digital
									consent in your jurisdiction). If you are under the legal age
									of majority in your jurisdiction, your parent or legal
									guardian must review and agree to these Terms on your behalf.
								</li>
								<li>
									<strong>License Grant:</strong> We grant you a revocable,
									non-exclusive, non-transferable, limited license to access and
									use the Application strictly for personal, non-commercial
									educational purposes.
								</li>
								<li>
									<strong>Restrictions:</strong> You shall not: (a)
									reverse-engineer, decompile, or attempt to extract the source
									code of the Application; (b) scrape, harvest, or
									systematically extract data or outputs; (c) resell,
									sub-license, or commercialize our proprietary software; or (d)
									circumvent any security measures or access limits.
								</li>
							</ul>
						</section>

						<section id='intellectual-property'>
							<h2>2. Intellectual Property Rights</h2>
							<ul>
								<li>
									<strong>Qbitlog IP:</strong> All intellectual property rights
									in the Application—including source code, system architecture,
									UX/UI design, trademarks, service marks, and trade
									dress—remain the exclusive property of Qbitlog.
								</li>
								<li>
									<strong>User-Generated Inputs:</strong> You retain all
									ownership rights in the content, files, or text you submit
									(&quot;User Inputs&quot;). You grant Qbitlog a worldwide,
									non-exclusive, royalty-free license to use, display, and
									process your User Inputs solely to operate, maintain, and
									deliver the Application to you.
								</li>
								<li>
									<strong>AI-Generated Outputs:</strong> To the fullest extent
									permitted by applicable law, Qbitlog assigns to you any
									ownership rights it may hold in the direct outputs generated
									for you by the AI features (&quot;Outputs&quot;). You
									acknowledge that AI outputs are non-exclusive and that
									identical or similar outputs may be generated for other users
									based on similar prompts.
								</li>
							</ul>
						</section>

						<section id='ai-disclaimer'>
							<h2>3. Artificial Intelligence Disclaimer</h2>
							<ul>
								<li>
									<strong>Informational &amp; Educational Use Only:</strong> The
									Application incorporates artificial intelligence to support
									learning workflows.{" "}
									<strong>
										AI-generated outputs are provided strictly &quot;as is&quot;
										for educational reference.
									</strong>
								</li>
								<li>
									<strong>No Guarantee of Accuracy:</strong> AI models can
									hallucinate, produce erroneous outputs, or omit critical
									information. We make no warranty that AI outputs will be
									accurate, error-free, or complete. You are solely responsible
									for independently verifying any AI output before relying on it
									for academic, business, or professional decisions.
								</li>
							</ul>
						</section>

						<section id='acceptable-use'>
							<h2>4. Acceptable Use &amp; Statutory User Prohibitions</h2>
							<p>
								In accordance with Rule 3(1)(b) of the Information Technology
								(Intermediary Guidelines and Digital Media Ethics Code) Rules,
								2021, you agree that you shall not host, display, upload,
								modify, publish, transmit, store, update, or share any
								information that:
							</p>
							<ol>
								<li>
									Belongs to another person and to which you do not have any
									right;
								</li>
								<li>
									Is obscene, pornographic, paedophilic, invasive of
									another&apos;s privacy (including bodily privacy), insulting
									or harassing on the basis of gender, racially or ethnically
									objectionable, relating or encouraging money laundering or
									gambling, or promotes enmity between different groups;
								</li>
								<li>Is harmful to child/minors;</li>
								<li>
									Infringes any patent, trademark, copyright, or other
									proprietary rights;
								</li>
								<li>
									Deceives or misleads the addressee about the origin of the
									message or knowingly communicates any misinformation or
									patently false/misleading information;
								</li>
								<li>Impersonates another person;</li>
								<li>
									Threatens the unity, integrity, defence, security or
									sovereignty of India, friendly relations with foreign States,
									or public order, or causes incitement to the commission of any
									cognisable offence;
								</li>
								<li>
									Contains software viruses or any other computer code designed
									to interrupt, destroy, or limit the functionality of any
									computer resource;
								</li>
								<li>
									Violates any law for the time being in force in India or any
									applicable local jurisdiction.
								</li>
							</ol>
						</section>

						<section id='third-party'>
							<h2>5. Third-Party Infrastructure &amp; Connectivity Costs</h2>
							<ul>
								<li>
									<strong>Sub-Services:</strong> The Application relies on
									third-party services for hosting, authentication, analytics,
									and framework maintenance, including Google Play Services,
									Firebase Analytics, Firebase Crashlytics, and Expo.
								</li>
								<li>
									<strong>Connectivity &amp; Hardware:</strong> Certain features
									require an active internet connection. You remain solely
									responsible for any carrier data fees, roaming charges, or
									device hardware costs incurred while accessing the
									Application.
								</li>
							</ul>
						</section>

						<section id='suspension'>
							<h2>6. Suspension and Termination</h2>
							<ul>
								<li>
									<strong>For Cause (Material Breach):</strong> We may suspend
									or terminate your account if you breach these Terms. Where a
									breach is capable of remedy, we will provide written notice
									giving you <strong>14 calendar days</strong> to cure the
									breach before terminating access.
								</li>
								<li>
									<strong>Immediate Termination:</strong> We reserve the right
									to suspend or terminate your access immediately, without prior
									notice, if: (a) your use poses a security risk to the
									Application or other users; (b) you commit severe intellectual
									property infringement; or (c) we are required to do so by a
									binding court order or regulatory authority.
								</li>
								<li>
									<strong>Service Sunset:</strong> If Qbitlog elects to
									discontinue the Application, we will provide at least{" "}
									<strong>30 calendar days&apos; advance notice</strong> through
									the Application or our official channels before terminating
									services.
								</li>
								<li>
									<strong>Post-Termination:</strong> Upon termination, your
									license to use the Application ends immediately, and you must
									cease all use and delete the Application from your devices.
								</li>
							</ul>
						</section>

						<section id='liability'>
							<h2>7. Limitation of Liability &amp; Disclaimers</h2>
							<ul>
								<li>
									<strong>Warranty Disclaimer:</strong> To the maximum extent
									permitted by law, the Application is provided on an{" "}
									<strong>&quot;AS IS&quot;</strong> and{" "}
									<strong>&quot;AS AVAILABLE&quot;</strong> basis without
									warranties of any kind, whether express, implied, or
									statutory.
								</li>
								<li>
									<strong>Damages Limitation:</strong> To the fullest extent
									permitted by law, Qbitlog shall not be liable for any
									indirect, incidental, special, consequential, or punitive
									damages (including lost profits, lost data, educational
									penalties, or system downtime).
								</li>
								<li>
									<strong>Cap on Liability:</strong> Our total aggregate
									liability for all claims arising out of or relating to these
									Terms or the Application shall not exceed the amount paid by
									you to Qbitlog in the{" "}
									<strong>12 months preceding the claim</strong>, or{" "}
									<strong>INR 1,000 / $50.00 USD</strong>, whichever is greater.
								</li>
								<li>
									<strong>Statutory Carve-Out:</strong> Nothing in these Terms
									limits or excludes liability for death, personal injury caused
									by gross negligence, intentional fraud, or any liability that
									cannot be excluded under applicable consumer protection
									legislation.
								</li>
							</ul>
						</section>

						<section id='dsa'>
							<h2>8. Digital Services Act (EU DSA) Compliance</h2>
							<p>
								If the Application operates as an intermediary service under
								Regulation (EU) 2022/2065 (the &quot;DSA&quot;):
							</p>
							<ul>
								<li>
									<strong>Point of Contact:</strong> The designated electronic
									point of contact for EU authorities and users is{" "}
									<a href='mailto:contact@qbitlog.com'>contact@qbitlog.com</a>.
								</li>
								<li>
									<strong>Content Moderation &amp; Redress:</strong> If content
									is removed or an account restricted, we will provide a clear
									Statement of Reasons pursuant to Article 17 of the DSA. Users
									may appeal moderation actions via{" "}
									<a href='mailto:contact@qbitlog.com'>contact@qbitlog.com</a>{" "}
									or submit disputes to certified out-of-court dispute
									settlement bodies under Article 21 of the DSA.
								</li>
							</ul>
						</section>

						<section id='governing-law'>
							<h2>9. Governing Law &amp; Dispute Resolution</h2>
							<ul>
								<li>
									<strong>Governing Law:</strong> These Terms and Conditions and
									any dispute or claim arising out of or in connection with them
									shall be governed by, and construed in accordance with, the
									laws of the Republic of India, without regard to its conflict
									of law principles.
								</li>
								<li>
									<strong>Exclusive Jurisdiction:</strong> Subject to amicable
									resolution procedures, you irrevocably agree that the
									competent civil courts situated in{" "}
									<strong>New Delhi</strong>, India shall have exclusive
									jurisdiction over any legal suit, action, or proceeding
									arising out of or related to these Terms or the Application.
								</li>
								<li>
									<strong>Amicable Resolution:</strong> In the event of any
									dispute, controversy, or claim arising out of or relating to
									these Terms, the parties shall first attempt in good faith to
									resolve the dispute amicably by submitting the matter in
									writing to the designated Grievance Officer.
								</li>
							</ul>
						</section>

						<section id='grievance'>
							<h2>10. Grievance Redressal Mechanism (India)</h2>
							<p>
								In accordance with the Information Technology Act, 2000, and the
								Information Technology (Intermediary Guidelines and Digital Media
								Ethics Code) Rules, 2021, the contact details of the Grievance
								Officer designated to handle complaints regarding the
								Application, content moderation, or breach of terms are set forth
								below:
							</p>
							<ul>
								<li>
									<strong>Name / Designation:</strong> Grievance Redressal
									Officer, Qbitlog
								</li>
								<li>
									<strong>Physical Address:</strong> New Delhi, India
								</li>
								<li>
									<strong>Email Address:</strong>{" "}
									<a href='mailto:contact@qbitlog.com?subject=Grievance%20-%20Academy%20Ai'>
										contact@qbitlog.com
									</a>{" "}
									(Subject: &quot;Grievance - Academy Ai&quot;)
								</li>
							</ul>
							<p>
								<strong>Statutory Timelines for Redressal:</strong>
							</p>
							<ul>
								<li>
									<strong>Acknowledgment:</strong> We will acknowledge receipt
									of your complaint within{" "}
									<strong>twenty-four (24) hours</strong>.
								</li>
								<li>
									<strong>Disposal:</strong> We will investigate and dispose of
									the grievance within{" "}
									<strong>fifteen (15) calendar days</strong> from the date of
									receipt, in accordance with applicable Indian law.
								</li>
							</ul>
						</section>

						<section id='amendments'>
							<h2>11. Amendments to Terms</h2>
							<p>
								We may update these Terms to reflect operational, legal, or
								technical changes. We will provide at least{" "}
								<strong>14 days&apos; advance notice</strong> of any material
								changes via an in-app banner or electronic communication before
								the modifications take effect. Continued use of the Application
								following that date constitutes acceptance of the revised Terms.
							</p>
						</section>

						<section id='contact'>
							<h2>12. Contact Us</h2>
							<p>
								For general inquiries, operational support, or legal questions
								regarding these Terms or the{" "}
								<Link href='/academyai/privacy-policy'>Privacy Policy</Link>,
								contact:
							</p>
							<ul>
								<li>
									<strong>Entity:</strong> Qbitlog (re: Academy Ai)
								</li>
								<li>
									<strong>Email:</strong>{" "}
									<a href='mailto:contact@qbitlog.com'>contact@qbitlog.com</a>
								</li>
							</ul>
						</section>
					</article>
				</div>
			</main>
			<Footer />
		</div>
	);
}
