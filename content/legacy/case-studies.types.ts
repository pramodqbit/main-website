export interface CaseStudyMetric {
	/** The headline value, may include prefix/suffix e.g. "50%", "3X", "99.9%", "253K+" */
	value: string;
	/** Short description under the number */
	label: string;
	/** Optional lucide icon name (see iconMap in ProjectStats) */
	icon?: string;
}

export interface CaseStudyFeature {
	/** Optional lucide icon name (see iconMap in FeatureGrid) */
	icon?: string;
	title: string;
	description: string;
}

export interface CaseStudyScreenshot {
	image: string;
	caption: string;
}

export interface TechItem {
	name: string;
	/** Local path to a brand SVG (e.g. "/icons/tech/react.svg"); optional. */
	icon?: string;
}

export interface CaseStudyTestimonial {
	quote: string;
	name: string;
	position: string;
	avatar?: string;
	/** 1-5 */
	rating?: number;
}

export interface CaseStudyCTA {
	heading?: string;
	description?: string;
}

export interface CaseStudy {
	// --- existing core fields ---
	slug: string;
	title: string;
	excerpt: string;
	date: string;
	tags: string[];
	heroImage: string;
	iconImage: string;
	client: string;
	industry: string;
	duration: string;
	teamSize: string;
	challenge: string;
	solution: string;
	results: string;
	technologies: TechItem[];
	contentHtml?: string;
	demoUrl?: string;
	isPrototype?: boolean;

	// --- new optional fields (template renders gracefully without them) ---
	/** Hero category badges, e.g. ["SaaS Platform", "Food & Restaurant"] */
	categories?: string[];
	/** Hero paragraph; falls back to `excerpt` */
	description?: string;
	/** Phone mockup image for the hero */
	mobileImage?: string;
	/** "Visit Live Project" link; falls back to `demoUrl` */
	liveUrl?: string;
	/** "View Source" link; hidden when absent */
	sourceUrl?: string;
	/** e.g. "Web App", "Mobile App", "AI Product" */
	projectType?: string;
	/** Up to 4 headline metrics */
	metrics?: CaseStudyMetric[];
	/** "About the Project" card body */
	overviewAbout?: string;
	/** Intro paragraph under "Our Solution" */
	solutionIntro?: string;
	/** 6 solution feature cards */
	solutionFeatures?: CaseStudyFeature[];
	/** Green-tick checklist of key features */
	features?: string[];
	/** Screenshot gallery */
	screenshots?: CaseStudyScreenshot[];
	testimonial?: CaseStudyTestimonial;
	cta?: CaseStudyCTA;
}
