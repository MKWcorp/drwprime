import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Prime',
  robots: { index: false, follow: false },
};

export default function MyPrimeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
