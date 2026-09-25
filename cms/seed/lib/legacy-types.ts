export type LegacyCaseStudy = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  heroImage: string;
  iconImage?: string;
  client: string;
  industry: string;
  duration: string;
  teamSize: string;
  challenge: string;
  solution: string;
  results: string;
  technologies: { name: string; icon?: string }[];
  categories: string[];
  projectType: string;
  description: string;
  mobileImage?: string;
  liveUrl?: string;
  metrics: { value: string; label: string; icon?: string }[];
  overviewAbout: string;
  solutionIntro: string;
  solutionFeatures: { icon?: string; title: string; description: string }[];
  features: string[];
  screenshots: { image: string; caption: string }[];
  testimonial?: { quote: string; name: string; position: string; avatar?: string; rating?: number };
  demoUrl?: string;
  isPrototype?: boolean;
  contentHtml: string;
};

export type LegacyPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  heroImage?: string;
  iconImage?: string;
  contentHtml: string;
};

export type LegacyService = {
  slug: string;
  tags: string[];
  title: string;
  description: string;
  section_name: string;
  section_description: string;
  techstack: { name: string; image?: string; description?: string }[];
};

export type LegacyCareer = {
  title: string;
  description: string;
  location: string;
  salary?: string;
  positionoverView?: string[];
  keyResponsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
};

export type LegacyTeamMember = { order: number; name: string; role: string; description: string; skills: string[] };

export type LegacyFaq = { question: string; answer: string; topic: string };
