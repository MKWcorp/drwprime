import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { catalogCategories } from '@/lib/treatment-catalog';

export async function GET() {
  try {
    const dbCategories = await prisma.treatmentCategory.findMany({
      where: { active: true },
      select: {
        id: true,
        slug: true,
        treatments: {
          where: { active: true },
          select: {
            id: true,
            slug: true
          }
        }
      }
    });

    const categoryMap = new Map(
      dbCategories.map((category) => [category.slug, category])
    );

    const treatmentMap = new Map(
      dbCategories.flatMap((category) =>
        category.treatments.map((treatment) => [treatment.slug, treatment.id] as const)
      )
    );

    const categories = catalogCategories.map((category) => ({
      id: categoryMap.get(category.slug)?.id ?? category.id,
      slug: category.slug,
      name: category.name,
      description: category.description,
      treatments: category.treatments.map((treatment) => ({
        ...treatment,
        id: treatmentMap.get(treatment.slug) ?? treatment.id
      }))
    }));

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching treatments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch treatments' },
      { status: 500 }
    );
  }
}
