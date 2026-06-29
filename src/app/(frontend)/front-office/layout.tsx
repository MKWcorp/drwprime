import type { Metadata } from 'next';
import FrontOfficeShell from '@/components/FrontOfficeShell';

export const metadata: Metadata = {
  title: 'Front Office',
  robots: { index: false, follow: false },
};

export default function FrontOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FrontOfficeShell>{children}</FrontOfficeShell>;
}
