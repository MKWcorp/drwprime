import type { CollectionConfig } from 'payload';

/** Uploaded images for blog posts. Files are stored on Vercel Blob (see payload.config plugin). */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  access: {
    read: () => true,
  },
  admin: {
    group: 'Blog',
    description: 'Upload dan kelola gambar untuk artikel blog.',
  },
  upload: {
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Teks Alt (untuk SEO & aksesibilitas)',
    },
  ],
};
