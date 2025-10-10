import { MetadataRoute } from 'next'
import posts from './blog/_data/posts.json'
import caseStudies from './case-studies/_data/case-studies.json'
import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

// Get all service slugs
function getAllServiceSlugs(): string[] {
  try {
    const dataDir = join(process.cwd(), 'app/services/_data')
    const files = readdirSync(dataDir).filter((file) => file.endsWith('.json'))
    
    return files.map((filename) => {
      const filePath = join(dataDir, filename)
      const fileContent = readFileSync(filePath, 'utf-8')
      const data = JSON.parse(fileContent)
      return data.slug
    })
  } catch (error) {
    console.error('Error reading service files:', error)
    return []
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://qbitlog.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/aboutus`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/teams`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Service pages
  const servicePages = getAllServiceSlugs().map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Blog posts
  const blogPages = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Case studies
  const caseStudyPages = caseStudies.map((study) => ({
    url: `${baseUrl}/case-studies/${study.slug}`,
    lastModified: new Date(study.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    ...staticPages,
    ...servicePages,
    ...blogPages,
    ...caseStudyPages,
  ]
}

