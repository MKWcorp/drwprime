import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Home Treatment — Perawatan ke Rumah',
  description:
    'Layanan home treatment DRW Prime — nikmati perawatan dan treatment premium langsung di rumah Anda bersama tim profesional kami.',
  path: '/home-treatment',
});

export default function HomeTreatmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
