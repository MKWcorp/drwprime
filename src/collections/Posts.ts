import type { CollectionConfig } from 'payload';
import { revalidatePath } from 'next/cache';

// Inlined (kept identical to slugifyTitle in src/lib/blog.ts) so the Payload
// config graph has no path-alias imports the CLI's tsx loader can't resolve.
function slugifyTitle(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 120);
}

/**
 * Blog posts — the marketing team's publishing surface.
 * Rendered first-party by Next.js at /blog and /blog/[slug].
 * Drafts + scheduled publishing are enabled via `versions`.
 */
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'publishedAt'],
    group: 'Blog',
  },
  access: {
    // Anonymous visitors only ever see published posts; logged-in CMS users see everything.
    read: ({ req: { user } }) => {
      if (user) return true;
      return {
        _status: { equals: 'published' },
      };
    },
  },
  hooks: {
    // On-demand ISR: refresh the public blog when a post changes in the CMS.
    afterChange: [
      ({ doc }) => {
        try {
          revalidatePath('/blog');
          if (doc?.slug) revalidatePath(`/blog/${doc.slug}`);
          revalidatePath('/sitemap.xml');
        } catch {
          /* Not in a request/render context (e.g. migration script) — safe to ignore. */
        }
      },
    ],
    afterDelete: [
      ({ doc }) => {
        try {
          revalidatePath('/blog');
          if (doc?.slug) revalidatePath(`/blog/${doc.slug}`);
          revalidatePath('/sitemap.xml');
        } catch {
          /* no-op */
        }
      },
    ],
  },
  versions: {
    maxPerDoc: 25,
    drafts: {
      autosave: { interval: 375 },
      schedulePublish: true,
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL path under /blog/. Auto-generated from the title if left blank.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            const base = (typeof value === 'string' && value.trim()) || data?.title || '';
            return slugifyTitle(String(base));
          },
        ],
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Shown as the article date. Set in the future + schedule publish to time a release.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short summary used in listings, meta description fallback, and social cards.',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Cover image (also used as the OpenGraph/social image).',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'tags',
      type: 'text',
      hasMany: true,
    },
    {
      name: 'relatedTreatmentSlugs',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Treatment slugs to cross-link (e.g. radiance-glow-peel).',
      },
    },
    {
      type: 'collapsible',
      label: 'SEO',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'seoTitle',
          type: 'text',
          admin: { description: 'Overrides the <title>. Falls back to the post title.' },
        },
        {
          name: 'seoDescription',
          type: 'textarea',
          admin: { description: 'Overrides the meta description. Falls back to the excerpt.' },
        },
      ],
    },
  ],
};
