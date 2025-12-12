import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Front Office endpoint - no auth required
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'all';
    const date = searchParams.get('date');

    const whereClause: Record<string, unknown> = {};

    if (status !== 'all') {
      whereClause.status = status;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      whereClause.reservationDate = {
        gte: startDate,
        lt: endDate
      };
    }

    const reservations = await prisma.reservation.findMany({
      where: whereClause,
      include: {
        treatment: {
          include: {
            category: true
          }
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            affiliateCode: true
          }
        },
        referrer: {
          select: {
            firstName: true,
            lastName: true,
            affiliateCode: true
          }
        }
      },
      orderBy: [
        { reservationDate: 'asc' },
        { reservationTime: 'asc' }
      ]
    });

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { reservationId, status, adminNotes, finalPrice } = body;

    // Calculate commission based on finalPrice if provided
    const updateData: Record<string, unknown> = {
      status,
      adminNotes: adminNotes || null,
      completedAt: status === 'completed' ? new Date() : null
    };

    // If finalPrice provided, update it and recalculate commission
    if (finalPrice !== undefined) {
      const commissionRate = 0.10; // 10%
      updateData.finalPrice = finalPrice;
      updateData.commissionAmount = finalPrice * commissionRate;
    }

    const reservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: updateData
    });

    // If completed and has referrer, pay commission
    if (status === 'completed' && reservation.referrerId && !reservation.commissionPaid) {
      const commissionAmount = reservation.commissionAmount;

      // Update referrer earnings
      await prisma.user.update({
        where: { id: reservation.referrerId },
        data: {
          totalEarnings: { increment: commissionAmount },
          totalReferrals: { increment: 1 },
          points: { increment: Math.floor(Number(commissionAmount) / 100) }
        }
      });

      // Create commission transaction
      await prisma.transaction.create({
        data: {
          userId: reservation.referrerId,
          type: 'commission',
          amount: commissionAmount,
          points: Math.floor(Number(commissionAmount) / 100),
          description: `Commission from referral: ${reservation.patientName}`,
          referenceId: reservation.id
        }
      });

      // Mark commission as paid
      await prisma.reservation.update({
        where: { id: reservationId },
        data: { commissionPaid: true }
      });
    }

    return NextResponse.json({ reservation });
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to update reservation' },
      { status: 500 }
    );
  }
}
