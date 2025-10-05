import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee";
import Image from "next/image";
const services = [
	{
		name: "AWS",
		image: "/icons/react.webp",
		description:
			"Amazon Web Services (AWS) is a leading cloud platform offering scalable infrastructure, storage, machine learning, and a vast array of services for enterprises and startups worldwide.",
	},
	{
		name: "Azure",
		image: "/icons/react.webp",
		description:
			"Microsoft Azure delivers a comprehensive suite of cloud solutions, including virtual machines, databases, AI, and DevOps tools, designed for seamless integration with Microsoft products.",
	},
	{
		name: "Google Cloud",
		image: "/icons/react.webp",
		description:
			"Google Cloud Platform specializes in high-performance computing, data analytics, and AI services, empowering businesses to innovate with Google’s global network and advanced technologies.",
	},
	{
		name: "Vercel",
		image: "/icons/react.webp",
		description:
			"Vercel is a cloud platform optimized for frontend frameworks and static sites, enabling developers to deploy, preview, and scale web applications with lightning-fast global delivery.",
	},
	{
		name: "Netlify",
		image: "/icons/react.webp",
		description:
			"Netlify streamlines the deployment of modern web projects, offering continuous integration, serverless functions, and instant rollbacks for fast, secure, and scalable websites.",
	},
	{
		name: "DigitalOcean",
		image: "/icons/react.webp",
		description:
			"DigitalOcean provides simple and cost-effective cloud infrastructure, including droplets, managed databases, and Kubernetes, tailored for developers and small businesses.",
	},
];

const CloudCard = ({
	name,
	image,
	description,
}: {
	name: string;
	image: string;
	description: string;
}) => {
	return (
		<Card className='w-[200px] h-[300px] p-0'>
			<CardContent className='p-2'>
				<Image src={image} alt={name} width={50} height={50} />
				<CardTitle className='mb-2'>{name}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardContent>
		</Card>
	);
};

export default function CloudBg() {
	return (
		<Marquee
			pauseOnHover
			className='absolute inset-0  [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] [--duration:80s]'>
			{services.map((service, idx) => (
				<CloudCard key={idx} {...service} />
			))}
		</Marquee>
	);
}
