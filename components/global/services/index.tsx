import { ServicesData } from "./types";
import Carsoule from "./components/carsoule";

const services_data: ServicesData = [
	{
		title: "Web Development",
		description: "We develop websites that are fast, secure, and scalable.",
		learn_more: "/services/web-development",
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
		description: "We develop mobile apps that are fast, secure, and scalable.",
		learn_more: "/services/mobile-development",
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
			"We develop marketing campaigns that are fast, secure, and scalable.",
		learn_more: "/services/marketing",
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
			"We develop SEO campaigns that are fast, secure, and scalable.",
		learn_more: "/services/seo",
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
			"We develop Graphics Design campaigns that are fast, secure, and scalable.",
		learn_more: "/services/graphics-design",
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
		<div className='p-10 border relative'>
			<Carsoule data={services_data} />
		</div>
	);
}
