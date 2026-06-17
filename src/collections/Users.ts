import type { CollectionConfig } from 'payload';

/** Payload-native auth for the marketing/content team (separate from the app's Clerk auth). */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
};
