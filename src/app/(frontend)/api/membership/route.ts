import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

const TIER_THRESHOLDS = {
  SILVER: 0,
  GOLD: 1_000_000,
  PLATINUM: 5_000_000,
};

const TIER_BENEFITS = {
  SILVER: [
    'Priority booking',
    'Diskon ulang tahun 10%',
    'Akses promo eksklusif member',
  ],
  GOLD: [
    'Semua benefit Silver',
    'Free skin check bulanan',
    'Diskon 15% setiap kunjungan',
    'Early access treatment baru',
  ],
  PLATINUM: [
    'Semua benefit Gold',
    'Personal beauty consultant',
    'Diskon 20% setiap kunjungan',
    'Free treatment setiap kuartal',
    'Layanan VIP & priority queue',
  ],
};

function computeTier(totalSpending: number): {
  tier: 'SILVER' | 'GOLD' | 'PLATINUM';
  benefits: string[];
  nextTier: 'GOLD' | 'PLATINUM' | null;
  nextTierThreshold: number | null;
  progressPercent: number;
  amountToNextTier: number | null;
} {
  if (totalSpending >= TIER_THRESHOLDS.PLATINUM) {
    return {
      tier: 'PLATINUM',
      benefits: TIER_BENEFITS.PLATINUM,
      nextTier: null,
      nextTierThreshold: null,
      progressPercent: 100,
      amountToNextTier: null,
    };
  }
  if (totalSpending >= TIER_THRESHOLDS.GOLD) {
    const progress = Math.min(100, Math.round(
      ((totalSpending - TIER_THRESHOLDS.GOLD) / (TIER_THRESHOLDS.PLATINUM - TIER_THRESHOLDS.GOLD)) * 100
    ));
    return {
      tier: 'GOLD',
      benefits: TIER_BENEFITS.GOLD,
      nextTier: 'PLATINUM',
      nextTierThreshold: TIER_THRESHOLDS.PLATINUM,
      progressPercent: progress,
      amountToNextTier: TIER_THRESHOLDS.PLATINUM - totalSpending,
    };
  }
  const progress = Math.min(100, Math.round(
    (totalSpending / TIER_THRESHOLDS.GOLD) * 100
  ));
  return {
    tier: 'SILVER',
    benefits: TIER_BENEFITS.SILVER,
    nextTier: 'GOLD',
    nextTierThreshold: TIER_THRESHOLDS.GOLD,
    progressPercent: progress,
    amountToNextTier: TIER_THRESHOLDS.GOLD - totalSpending,
  };
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        reservations: {
          orderBy: { createdAt: 'desc' },
          include: {
            treatment: { select: { name: true } },
          },
        },
        spendingRecords: {
          orderBy: { spendingDate: 'desc' },
          select: {
            id: true,
            amount: true,
            treatment: true,
            spendingDate: true,
            pointsEarned: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const completedReservations = user.reservations.filter(
      (r) => r.status === 'completed'
    );

    const reservationSpending = completedReservations.reduce(
      (sum, r) => sum + Number(r.finalPrice),
      0
    );

    const scanSpending = user.spendingRecords.reduce(
      (sum, s) => sum + Number(s.amount),
      0
    );

    const totalSpending = reservationSpending + scanSpending;

    const tierData = computeTier(totalSpending);

    return NextResponse.json({
      membership: {
        ...tierData,
        totalSpending,
        memberSince: user.createdAt,
        isTeamLeader: user.isTeamLeader,
        points: user.points,
        pointHistory: user.spendingRecords
          .filter((s) => s.pointsEarned > 0)
          .slice(0, 20)
          .map((s) => ({
            id: s.id,
            amount: Number(s.amount),
            treatment: s.treatment,
            spendingDate: s.spendingDate,
            pointsEarned: s.pointsEarned,
          })),
        reservations: user.reservations.slice(0, 20).map((r) => ({
          id: r.id,
          patientName: r.patientName,
          treatmentName: r.treatment?.name ?? null,
          status: r.status,
          reservationDate: r.reservationDate,
          finalPrice: Number(r.finalPrice),
        })),
      },
    });
  } catch (error) {
    console.error('Membership API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
