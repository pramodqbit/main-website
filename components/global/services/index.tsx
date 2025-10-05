import { ServicesData } from "./types";
import Carsoule from "./components/carsoule";

const services_data: ServicesData = [
	{
		title: "Web Development",
		description:
			"Custom web development solutions using React, Angular, WordPress, and modern frameworks. Build responsive, high-performance websites with seamless user experiences that drive conversions and business growth.",
		learn_more: "/services/web-development",
		tags: ["Web Development", "React", "Angular", "WordPress", "Shopify"],
		images: [
			"/icons/react.webp",
			"/icons/angular.webp",
			"/icons/python.webp",
			"/icons/js.webp",
			"/icons/wordpress.webp",
			"/icons/php.webp",
			"/icons/shopify.webp",
		],
	},
	{
		title: "Mobile Development",
		description:
			"Native and cross-platform mobile app development for iOS and Android. Create intuitive, feature-rich mobile applications that engage users and deliver exceptional performance on all devices.",
		learn_more: "/services/mobile-development",
		tags: ["Mobile Development", "React Native", "Flutter", "Swift", "Kotlin"],
		images: [
			"/icons/react.webp",
			"/icons/angular.webp",
			"/icons/python.webp",
			"/icons/js.webp",
			"/icons/wordpress.webp",
			"/icons/php.webp",
			"/icons/shopify.webp",
		],
	},
	{
		title: "Marketing",
		description:
			"Data-driven digital marketing strategies that boost brand visibility and ROI. From social media campaigns to content marketing, we help you reach your target audience and achieve measurable results.",
		learn_more: "/services/marketing",
		tags: ["Marketing", "Social Media", "Content Marketing", "SEO", "SEM"],
		images: [
			"/icons/react.webp",
			"/icons/angular.webp",
			"/icons/python.webp",
			"/icons/js.webp",
			"/icons/wordpress.webp",
			"/icons/php.webp",
			"/icons/shopify.webp",
		],
	},
	{
		title: "SEO",
		description:
			"Expert SEO optimization services to improve search rankings and organic traffic. Technical SEO audits, keyword research, on-page optimization, and link building strategies that get your website found.",
		learn_more: "/services/seo",
		tags: ["Keyword Research", "On-Page Optimization", "Link Building"],
		images: [
			"/icons/react.webp",
			"/icons/angular.webp",
			"/icons/python.webp",
			"/icons/js.webp",
			"/icons/wordpress.webp",
			"/icons/php.webp",
			"/icons/shopify.webp",
		],
	},
	{
		title: "Graphics Design",
		description:
			"Professional graphic design services for branding, UI/UX, and visual identity. Create stunning visuals that capture attention, communicate your message effectively, and strengthen your brand presence.",
		learn_more: "/services/graphics-design",
		tags: ["Graphics Design", "Branding", "UI/UX", "Visual Identity"],
		images: [
			"/icons/react.webp",
			"/icons/angular.webp",
			"/icons/python.webp",
			"/icons/js.webp",
			"/icons/wordpress.webp",
			"/icons/php.webp",
			"/icons/shopify.webp",
		],
	},
];

export default function Services() {
	return (
		<section id='services' className='p-10 border relative'>
			<Carsoule data={services_data} />
		</section>
	);
}
