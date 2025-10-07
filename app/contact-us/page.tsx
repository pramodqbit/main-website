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
				title='Contact Us'
				description='Contact with us for any questions or inquiries.'
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
