import type { CollectionConfig } from 'payload';

/** Payload-native auth for the marketing/content team (separate from the app's Clerk auth). */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Pengguna',
    plural: 'Pengguna',
  },
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
    description: 'Akun admin untuk mengelola konten CMS.',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nama',
    },
  ],
};
