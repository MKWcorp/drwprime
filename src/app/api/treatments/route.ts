import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.treatmentCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        treatments: {
          orderBy: { name: 'asc' }
        }
      }
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching treatments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch treatments' },
      { status: 500 }
    );
  }
}
