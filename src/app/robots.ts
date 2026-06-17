import type { MetadataRoute } from 'next';

const SITE_URL = 'https://drwprime.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Private/member areas use a noindex meta tag (kept crawlable so the tag is read).
      // Block the pure API surface and the Payload CMS admin (no public content there).
      disallow: ['/api/', '/cms', '/cms-api']
    },
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
