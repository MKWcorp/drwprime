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

    // Get all users who have claimed affiliate codes (have affiliateCode)
    const users = await prisma.user.findMany({
      where: {
        affiliateCode: {
          not: ""
        }
      },
      include: {
        referrals: {
          select: {
            id: true,
            status: true,
            commissionAmount: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Process data to get affiliator statistics
    const affiliators = users.map(user => {
      const totalCommission = user.referrals
        .filter(r => r.status === 'completed')
        .reduce((sum, r) => sum + Number(r.commissionAmount || 0), 0);
      
      const totalReservations = user.referrals.filter(r => r.status === 'completed').length;

      return {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
        affiliateCode: user.affiliateCode,
        totalCommission,
        totalReservations,
        claimedAt: user.createdAt
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
