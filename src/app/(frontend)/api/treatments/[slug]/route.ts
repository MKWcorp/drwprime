import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCatalogTreatmentBySlug } from '@/lib/treatment-catalog';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const catalogEntry = getCatalogTreatmentBySlug(slug);

    if (!catalogEntry) {
      return NextResponse.json(
        { error: 'Treatment not found' },
        { status: 404 }
      );
    }

    const dbTreatment = await prisma.treatment.findUnique({
      where: { slug },
      select: {
        id: true,
        active: true
      }
    });

    if (dbTreatment && !dbTreatment.active) {
      return NextResponse.json(
        { error: 'Treatment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...catalogEntry.treatment,
      id: dbTreatment?.id ?? catalogEntry.treatment.id,
      category: {
        name: catalogEntry.category.name
      }
    });
  } catch (error) {
    console.error('Error fetching treatment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch treatment' },
      { status: 500 }
    );
  }
}
