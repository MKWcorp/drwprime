import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Produk Skincare & Perawatan',
  description:
    'Temukan produk skincare dan perawatan kulit premium dari DRW Prime — diformulasikan untuk merawat dan menjaga kesehatan kulit Anda.',
  path: '/products',
});

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
