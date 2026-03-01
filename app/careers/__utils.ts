import { readFileSync } from "fs";
import { join } from "path";
import { Career } from "./__types";

export function slugify(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

let cachedCareers: Career[] | null = null;

function loadCareers(): Career[] {
	if (cachedCareers) return cachedCareers;
	const data: { careers: Career[] } = JSON.parse(
		readFileSync(join(process.cwd(), "app/careers/__data/carrer.json"), "utf8")
	);
	cachedCareers = data.careers;
	return data.careers;
}

export function getCareers(): Career[] {
	return loadCareers();
}

export function getCareerBySlug(slug: string): Career | undefined {
	return loadCareers().find((c) => slugify(c.title) === slug);
}
