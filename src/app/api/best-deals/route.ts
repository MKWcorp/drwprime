import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const now = new Date();
    const startOfTodayUtc = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0)
    );
    const endOfTodayUtc = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999)
    );

    const promos = await prisma.bestDealPromo.findMany({
      where: {
        isActive: true,
        AND: [
          {
            OR: [{ validFrom: null }, { validFrom: { lte: endOfTodayUtc } }],
          },
          {
            OR: [{ validUntil: null }, { validUntil: { gte: startOfTodayUtc } }],
          },
        ],
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ promos });
  } catch (error) {
    console.error('[BEST DEALS] GET error:', error);
    return NextResponse.json({ error: 'Failed to load best deals' }, { status: 500 });
  }
}
