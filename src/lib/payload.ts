import config from '@payload-config';
import { getPayload, type Payload } from 'payload';

let cached: Promise<Payload> | null = null;

/** Cached Payload Local API client for server-side reads (blog list/detail/sitemap). */
export function getPayloadClient(): Promise<Payload> {
  if (!cached) {
    cached = getPayload({ config });
  }
  return cached;
}

/** Shape returned by Payload for a published post (depth 1 populates heroImage). */
export type PayloadPost = {
  id: number | string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: unknown;
  tags?: string[] | null;
  relatedTreatmentSlugs?: string[] | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  heroImage?: { url?: string | null; alt?: string | null } | string | null;
  publishedAt?: string | null;
  updatedAt: string;
  createdAt: string;
};

/** Resolve the hero image URL whether heroImage is populated (depth>=1) or just an id. */
export function heroImageUrl(post: PayloadPost): string | null {
  if (post.heroImage && typeof post.heroImage === 'object') {
    return post.heroImage.url ?? null;
  }
  return null;
}
