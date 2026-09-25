import type { Block } from "payload";
import { blockHelp } from "../fields/blockHelp";
import { sectionHeadFields } from "../fields/sectionHead";

export const ContactForm: Block = {
  slug: "contactForm",
  interfaceName: "ContactFormBlock",
  labels: { singular: "Contact form", plural: "Contact forms" },
  admin: { group: "Content" },
  fields: [
    blockHelp("The contact form. Submissions arrive in Inbox → Leads and by email."),
    ...sectionHeadFields(),
    {
      name: "showBooking",
      type: "checkbox",
      defaultValue: true,
      admin: { description: "Also show the booking link from Site Settings." },
    },
  ],
};
