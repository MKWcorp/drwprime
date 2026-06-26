import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      where: {
        profileCompletedAt: { not: null },
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        affiliateCode: true,
        phone: true,
        nik: true,
        gender: true,
        dateOfBirth: true,
        address: true,
        city: true,
        province: true,
        profileCompletedAt: true,
      },
      orderBy: {
        profileCompletedAt: 'desc',
      },
    });

    const profiles = users.map((u) => ({
      firstName: u.firstName || '',
      lastName: u.lastName || '',
      email: u.email,
      affiliateCode: u.affiliateCode,
      phone: u.phone || '',
      nik: u.nik || '',
      gender: u.gender || '',
      dateOfBirth: u.dateOfBirth ? u.dateOfBirth.toISOString() : null,
      address: u.address || '',
      city: u.city || '',
      province: u.province || '',
      profileCompletedAt: u.profileCompletedAt ? u.profileCompletedAt.toISOString() : null,
    }));

    return NextResponse.json({
      success: true,
      profiles,
      total: profiles.length,
    });
  } catch (error) {
    console.error('Error fetching completed profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch completed profiles' },
      { status: 500 }
    );
  }
}
