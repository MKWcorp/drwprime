import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Daftar Treatment & Perawatan',
  description:
    'Jelajahi pilihan treatment wajah, perawatan kulit, laser, facial, dan layanan estetika premium di DRW Prime. Lihat detail, manfaat, dan harga tiap treatment.',
  path: '/treatments',
});

export default function TreatmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
