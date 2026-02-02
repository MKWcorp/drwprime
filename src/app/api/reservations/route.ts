import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateCommission, calculateLoyaltyPoints } from '@/lib/affiliate';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    const body = await req.json();
    const {
      treatmentId,
      patientName,
      patientEmail,
      patientPhone,
      patientNotes,
      reservationDate,
      reservationTime,
      referredBy // Affiliate code
    } = body;

    // Get treatment details
    const treatment = await prisma.treatment.findUnique({
      where: { id: treatmentId }
    });

    if (!treatment) {
      return NextResponse.json({ error: 'Treatment not found' }, { status: 404 });
    }

    let user = null;
    let referrer = null;
    let commissionAmount = 0;

    // If user is logged in, get their data
    if (userId) {
      user = await prisma.user.findUnique({
        where: { clerkUserId: userId }
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Validate: cannot use own affiliate code
      if (referredBy && referredBy === user.affiliateCode) {
        return NextResponse.json(
          { error: 'Tidak dapat menggunakan kode affiliate sendiri' },
          { status: 400 }
        );
      }
    }

    // Check if there's a referrer (for both logged-in and guest users)
    if (referredBy) {
      // Find referrer by affiliate code
      referrer = await prisma.user.findFirst({
        where: { affiliateCode: referredBy.toUpperCase() }
      });

      // Validate: affiliate code must exist
      if (!referrer) {
        return NextResponse.json(
          { error: `Kode affiliate '${referredBy}' tidak ditemukan` },
          { status: 404 }
        );
      }

      commissionAmount = calculateCommission(Number(treatment.price));
      console.log(`[AFFILIATE] Referral tracked: ${referredBy} -> Commission: ${commissionAmount}`);
    }

    // Create reservation (with or without userId)
    const reservation = await prisma.reservation.create({
      data: {
        userId: user?.id || null, // null for guest users
        treatmentId: treatment.id,
        referredBy: referredBy || null,
        referrerId: referrer?.id || null,
        patientName,
        patientEmail,
        patientPhone,
        patientNotes: patientNotes || null,
        reservationDate: new Date(reservationDate),
        reservationTime,
        originalPrice: treatment.price,
        finalPrice: treatment.price,
        commissionAmount: commissionAmount
      }
    });

    // Only add loyalty points and transaction if user is logged in
    if (user) {
      const loyaltyPoints = calculateLoyaltyPoints(Number(treatment.price));
      await prisma.user.update({
        where: { id: user.id },
        data: {
          loyaltyPoints: { increment: loyaltyPoints }
        }
      });

      // Create transaction record
      await prisma.transaction.create({
        data: {
          userId: user.id,
          type: 'points_earned',
          amount: treatment.price,
          points: loyaltyPoints,
          description: `Earned ${loyaltyPoints} loyalty points from reservation`,
          referenceId: reservation.id
        }
      });
    }

    return NextResponse.json({ reservation });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to create reservation' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const reservations = await prisma.reservation.findMany({
      where: { userId: user.id },
      include: {
        treatment: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
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
