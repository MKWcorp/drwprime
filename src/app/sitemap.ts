import type { MetadataRoute } from 'next';
import { getPayloadClient, type PayloadPost } from '@/lib/payload';

const SITE_URL = 'https://drwprime.com';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/treatments`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/home-treatment`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/products`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/reservation`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'daily', priority: 0.7 }
  ];

  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      _status: { equals: 'published' },
      publishedAt: { less_than_equal: new Date().toISOString() }
    },
    sort: '-publishedAt',
    depth: 0,
    limit: 1000
  });
  const posts = docs as unknown as PayloadPost[];

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.6
  }));

  return [...staticRoutes, ...blogRoutes];
}
