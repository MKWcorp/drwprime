import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const SITE_URL = 'https://drwprime.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/treatments`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/home-treatment`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/products`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/reservation`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${SITE_URL}/prime-insight`, changeFrequency: 'daily', priority: 0.9 }
  ];

  const posts = await prisma.blogPost.findMany({
    where: {
      status: 'published',
      publishedAt: {
        lte: new Date()
      }
    },
    select: {
      slug: true,
      updatedAt: true,
      publishedAt: true,
      createdAt: true
    },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }]
  });

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6
  }));

  const primeInsightRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/prime-insight/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.8
  }));

  return [...staticRoutes, ...primeInsightRoutes, ...blogRoutes];
}
