import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ensureUniqueAffiliateCode } from '@/lib/affiliate';
import { ADMIN_USER_IDS } from '@/lib/admin';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { email, firstName, lastName } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (existingUser) {
      return NextResponse.json({ user: existingUser });
    }

    // Generate unique affiliate code
    const affiliateCode = await ensureUniqueAffiliateCode(
      firstName || '',
      lastName || '',
      async (code) => {
        const exists = await prisma.user.findUnique({
          where: { affiliateCode: code }
        });
        return !exists;
      }
    );

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
        isAdmin
      }
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
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

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate additional fields
    const totalReferrals = user.referrals.length;
    const loyaltyLevel = getLoyaltyLevel(user.loyaltyPoints);

    return NextResponse.json({ 
      user: {
        ...user,
        totalReferrals,
        loyaltyLevel
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
