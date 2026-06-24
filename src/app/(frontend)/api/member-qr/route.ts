import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { id: true, qrToken: true, firstName: true, lastName: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found', needsSync: true }, { status: 404 });
    }

    let qrToken = user.qrToken;
    if (!qrToken) {
      qrToken = randomUUID();
      await prisma.user.update({
        where: { id: user.id },
        data: { qrToken },
      });
    }

    return NextResponse.json({
      qrToken,
      name: [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Member',
    });
  } catch (error) {
    console.error('Error getting member QR:', error);
    return NextResponse.json({ error: 'Failed to get member QR' }, { status: 500 });
  }
}
