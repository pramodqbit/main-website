import { SectionHeader } from "@/components/global/section-layout";
import { Mail } from "lucide-react";
import ContactForm from "./_components/contact-form";
import ContactInfo from "./_components/contact-info";

export default function Page() {
	return (
		<div className='-mt-20 pt-24 border-l border-r'>
			<SectionHeader
				badgeLabel='Contact Us'
				badgeIcon={<Mail />}
				title='Connect with us on a journey to build faster'
				description="Ready to bring your ideas to life? Reach out to our team with your questions, project ideas, or partnership inquiries. Let's build something amazing together!"
			/>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-10   p-10 border-t border-b'>
				<div>
					<ContactInfo />
				</div>
				<div>
					<ContactForm />
				</div>
			</div>
		</div>
	);
}
