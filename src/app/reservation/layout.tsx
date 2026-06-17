import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Booking Reservasi Treatment',
  description:
    'Booking treatment dan jadwalkan perawatan Anda di DRW Prime dengan mudah. Pilih treatment, tanggal, dan waktu yang sesuai untuk Anda.',
  path: '/reservation',
});

export default function ReservationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
