import { notFound } from "next/navigation";
import Image from "next/image";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import ServiceBanner from "./_components/banner";
import { Badge } from "@/components/ui/badge";
import { Marquee } from "@/components/ui/marquee";

type ServiceData = {
	slug: string;
	tags: string[];
	title: string;
	description: string;
	section_name: string;
	section_description: string;
	techstack: {
		name: string;
		image: string;
		description: string;
	}[];
};

// Get all available services from the _data directory
function getAllServices(): { filename: string; slug: string }[] {
	const dataDir = join(process.cwd(), "app/services/_data");
	const files = readdirSync(dataDir).filter((file) => file.endsWith(".json"));

	return files.map((filename) => {
		const filePath = join(dataDir, filename);
		const fileContent = readFileSync(filePath, "utf-8");
		const data = JSON.parse(fileContent);
		return {
			filename: filename.replace(".json", ""),
			slug: data.slug,
		};
	});
}

// Function to get service data based on slug
async function getServiceData(slug: string): Promise<ServiceData | null> {
	const services = getAllServices();
	const service = services.find((s) => s.slug === slug);

	if (!service) {
		return null;
	}

	try {
		// Dynamically import the JSON file based on filename
		const data = await import(`../_data/${service.filename}.json`);
		return data.default;
	} catch (error) {
		console.error(`Error loading service data for ${slug}:`, error);
		return null;
	}
}

// Generate static params for all services
export async function generateStaticParams() {
	const services = getAllServices();
	return services.map((service) => ({
		slug: service.slug,
	}));
}

// Generate metadata for each service page
export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const service = await getServiceData(slug);
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qbitlog.com";

	if (!service) {
		return {
			title: "Service Not Found",
			description: "The requested service could not be found.",
		};
	}

	return {
		title: service.title,
		description: service.description,
		keywords: service.tags,
		openGraph: {
			type: "website",
			title: `${service.title} - QBITLOG`,
			description: service.description,
			url: `${siteUrl}/services/${slug}`,
			images: [
				{
					url: `${siteUrl}/og-image-services.jpg`,
					width: 1200,
					height: 630,
					alt: service.title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `${service.title} - QBITLOG`,
			description: service.description,
			images: [`${siteUrl}/twitter-image-services.jpg`],
			creator: "@qbitlog",
		},
		alternates: {
			canonical: `${siteUrl}/services/${slug}`,
		},
	};
}

export default async function ServicePage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const service = await getServiceData(slug);

	if (!service) {
		notFound();
	}

	return (
		<div>
			<ServiceBanner title={service.title} />

			<Marquee
				className='[--duration:40s] my-6  lg:hidden'
				repeat={6}
				pauseOnHover={true}>
				{service.techstack.map((tech, index) => (
					<Badge
						key={`${tech.name}-${index}`}
						variant='default'
						className='rounded-full py-2 bg-white shadow-sm text-dark w-[220px] flex items-center justify-start gap-2'>
						<Image
							src={tech.image}
							alt={tech.name}
							width={24}
							height={24}
							className='w-5 h-5 object-contain'
						/>
						{tech.name}
					</Badge>
				))}
			</Marquee>

			<div className='mt-6 w-full   gap-2 flex-nowrap hidden lg:flex'>
				{service.techstack.map((service) => (
					<Badge
						key={service.name}
						variant='default'
						className='rounded-full py-2 bg-white shadow-sm text-dark w-[220px] flex items-center justify-start gap-2'>
						<Image
							src={service.image}
							alt={service.name}
							width={24}
							height={24}
							className='w-5 h-5 object-contain'
						/>
						{service.name}
					</Badge>
				))}
			</div>

			{/* Tech Stack */}
			<div className='mt-16 mb-20'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
					{/* Header Card */}
					<div className='  flex flex-col '>
						<h2 className='text-3xl font-bold mb-4 bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent'>
							{service.section_name}
						</h2>
						<p className='text-muted-foreground text-sm leading-relaxed'>
							{service.section_description}
						</p>
					</div>

					{/* Tech Cards */}
					{service.techstack.slice(0, 5).map((tech) => (
						<div
							key={tech.name}
							className='group h-[300px] relative rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20'>
							{/* Default State - Icon Only */}
							<div className='absolute inset-0 flex flex-col items-center justify-center p-8 transition-all duration-300 group-hover:opacity-0 group-hover:scale-95'>
								<div className='relative'>
									<Image
										src={tech.image}
										alt={tech.name}
										width={80}
										height={80}
										className='w-20 h-20 object-contain'
									/>
								</div>
								<h3 className='mt-6 text-lg font-semibold text-center'>
									{tech.name}
								</h3>
							</div>

							{/* Hover State - Description */}
							<div className='absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/10 via-background to-secondary/10 opacity-0 scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100'>
								<div className='relative mb-4'>
									<Image
										src={tech.image}
										alt={tech.name}
										width={48}
										height={48}
										className='w-12 h-12 object-contain'
									/>
								</div>
								<h3 className='text-lg font-bold mb-3 text-primary text-center'>
									{tech.name}
								</h3>
								<p className='text-sm text-muted-foreground text-center leading-relaxed'>
									{tech.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
