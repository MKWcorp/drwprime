import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getCatalogTreatmentBySlug } from '@/lib/treatment-catalog';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const catalogEntry = getCatalogTreatmentBySlug(slug);

  if (!catalogEntry) {
    return buildMetadata({
      title: 'Treatment tidak ditemukan',
      description: 'Treatment yang Anda cari tidak tersedia di DRW Prime.',
      path: `/treatments/${slug}`,
      index: false,
    });
  }

  // Mirror the API: an explicitly inactive treatment is treated as not found.
  const dbTreatment = await prisma.treatment.findUnique({
    where: { slug },
    select: { active: true },
  });
  const isActive = !dbTreatment || dbTreatment.active;

  const { treatment, category } = catalogEntry;
  const description =
    treatment.description?.trim() ||
    `Pelajari treatment ${treatment.name} (${category.name}) di DRW Prime — manfaat, detail, dan booking perawatan premium.`;

  return buildMetadata({
    title: `${treatment.name} — ${category.name}`,
    description,
    path: `/treatments/${slug}`,
    index: isActive,
  });
}

export default function TreatmentDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
