import type { CollectionConfig } from 'payload';

/** Uploaded images for blog posts. Files are stored on Vercel Blob (see payload.config plugin). */
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Blog',
  },
  upload: {
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt text (for SEO & accessibility)',
    },
  ],
};
