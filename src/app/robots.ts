import type { MetadataRoute } from 'next';

const SITE_URL = 'https://drwprime.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Private/member areas use a noindex meta tag (kept crawlable so the tag is read).
      // Only block the pure API surface, which has no HTML metadata.
      disallow: '/api/'
    },
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
