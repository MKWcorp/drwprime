import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureUniqueAffiliateCode } from '@/lib/affiliate';
import { ADMIN_USER_IDS } from '@/lib/admin';

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { email, firstName, lastName, referralCode } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (existingUser) {
      return NextResponse.json({ user: existingUser });
    }

    let affiliateCode: string;
    let isTeamLeader = false;

    // Check if user is joining with a referral code
    if (referralCode) {
      // Validate referral code exists
      const referrer = await prisma.user.findFirst({
        where: { affiliateCode: referralCode }
      });

      if (!referrer) {
        return NextResponse.json(
          { error: 'Kode afiliasi tidak valid' },
          { status: 400 }
        );
      }

      // Use the same affiliate code as the referrer (team-based system)
      affiliateCode = referralCode;
      isTeamLeader = false;
    } else {
      // Generate unique affiliate code for new team leader
      affiliateCode = await ensureUniqueAffiliateCode(
        firstName || '',
        lastName || '',
        async (code) => {
          const exists = await prisma.user.findFirst({
            where: { affiliateCode: code }
          });
          return !exists;
        }
      );
      isTeamLeader = true;
    }

    // Check if user is admin
    const isAdmin = ADMIN_USER_IDS.includes(userId);

    // Create new user
    const user = await prisma.user.create({
      data: {
        clerkUserId: userId,
        email,
        firstName,
        lastName,
        affiliateCode,
        isTeamLeader,
        isAdmin
      }
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error syncing user:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { 
        error: 'Failed to sync user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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
      where: { clerkUserId: userId },
      include: {
        reservations: {
          include: {
            treatment: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        referrals: {
          where: {
            status: 'completed'
          },
          include: {
            treatment: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        transactions: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    });

    // If user doesn't exist, return null data (client will sync via POST)
    if (!user) {
      return NextResponse.json({ 
        user: null,
        needsSync: true 
      }, { status: 200 });
    }

    // Calculate additional fields
    const totalReferrals = user.referrals.length;
    const loyaltyLevel = getLoyaltyLevel(user.loyaltyPoints);

    // Get team members count (users with same affiliate code)
    const teamMembersCount = await prisma.user.count({
      where: { 
        affiliateCode: user.affiliateCode,
        clerkUserId: { not: userId } // Exclude self
      }
    });

    return NextResponse.json({ 
      user: {
        ...user,
        totalReferrals,
        loyaltyLevel,
        teamMembersCount
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

function getLoyaltyLevel(points: number): string {
  if (points >= 10000) return 'Platinum';
  if (points >= 5000) return 'Gold';
  if (points >= 1000) return 'Silver';
  return 'Bronze';
}
