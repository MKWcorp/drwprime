import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const treatment = await prisma.treatment.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    });

    if (!treatment) {
      return NextResponse.json(
        { error: 'Treatment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(treatment);
  } catch (error) {
    console.error('Error fetching treatment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch treatment' },
      { status: 500 }
    );
  }
}
