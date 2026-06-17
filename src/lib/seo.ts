import type { Metadata } from 'next';

export const SITE_URL = 'https://drwprime.com';
export const SITE_NAME = 'DRW Prime';
export const DEFAULT_OG_IMAGE = '/drwprime-faceside.png';

type BuildMetadataInput = {
  title: string;
  description: string;
  /** Path relative to the site root, e.g. "/treatments". Defaults to "/". */
  path?: string;
  /** Absolute or root-relative image URL for OG/Twitter cards. */
  image?: string;
  type?: 'website' | 'article';
  /** Set false for private/member pages that should not be indexed. */
  index?: boolean;
};

/**
 * Builds a consistent Metadata object (canonical + OpenGraph + Twitter) for a page.
 * `metadataBase` is set in the root layout, so root-relative image paths resolve correctly.
 */
export function buildMetadata({
  title,
  description,
  path = '/',
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  index = true,
}: BuildMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: index ? undefined : { index: false, follow: false },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: SITE_NAME,
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}
