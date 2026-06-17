import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Galeri Produk',
  description:
    'Lihat galeri produk skincare dan perawatan DRW Prime — koleksi lengkap produk premium untuk kebutuhan perawatan kulit Anda.',
  path: '/product-gallery',
});

export default function ProductGalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
