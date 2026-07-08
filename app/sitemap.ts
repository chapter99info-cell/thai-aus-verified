import type { MetadataRoute } from 'next'

const SITE_URL = 'https://thai-ausverified.com.au'

const STATE_SLUGS = ['nsw', 'vic', 'qld', 'wa', 'sa', 'tas', 'act', 'nt'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const home: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ]

  const states: MetadataRoute.Sitemap = STATE_SLUGS.map((state) => ({
    url: `${SITE_URL}/${state}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const other: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/register`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/pricing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  return [...home, ...states, ...other]
}
