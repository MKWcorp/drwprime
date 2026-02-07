import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all affiliate codes that have been claimed (have assignedEmail)
    const claimedCodes = await prisma.preClaimAffiliateCode.findMany({
      where: {
        assignedEmail: {
          not: null
        }
      },
      include: {
        user: {
          select: {
            email: true,
            clerkUserId: true,
            createdAt: true
          }
        },
        reservations: {
          select: {
            id: true,
            status: true,
            commission: true
          }
        }
      },
      orderBy: {
        claimedAt: 'desc'
      }
    });

    // Process data to get affiliator statistics
    const affiliators = claimedCodes.map(code => {
      const totalCommission = code.reservations
        .filter(r => r.status === 'completed')
        .reduce((sum, r) => sum + (r.commission || 0), 0);
      
      const totalReservations = code.reservations.filter(r => r.status === 'completed').length;

      return {
        email: code.assignedEmail,
        affiliateCode: code.code,
        totalCommission,
        totalReservations,
        claimedAt: code.claimedAt || code.user?.createdAt || new Date()
      };
    });

    return NextResponse.json({
      success: true,
      affiliators,
      total: affiliators.length
    });

  } catch (error) {
    console.error('Error fetching affiliators:', error);
    return NextResponse.json(
      { error: 'Failed to fetch affiliators' },
      { status: 500 }
    );
  }
}
