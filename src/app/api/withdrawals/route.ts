import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

// POST - Create withdrawal request
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { amount, accountType, bankName, accountNumber, accountName } = body;

    // Validate input
    if (!amount || !accountType || !bankName || !accountNumber || !accountName) {
      return NextResponse.json({ error: 'Semua field harus diisi' }, { status: 400 });
    }

    if (amount <= 0) {
      return NextResponse.json({ error: 'Jumlah penarikan harus lebih dari 0' }, { status: 400 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    // Check if user has enough balance
    if (parseFloat(user.totalEarnings.toString()) < amount) {
      return NextResponse.json({ error: 'Saldo komisi tidak mencukupi' }, { status: 400 });
    }

    // Check if bank account already exists for this user
    let bankAccount = await prisma.bankAccount.findFirst({
      where: {
        userId: user.id,
        accountType,
        bankName,
        accountNumber
      }
    });

    // If not exists, create new bank account
    if (!bankAccount) {
      bankAccount = await prisma.bankAccount.create({
        data: {
          userId: user.id,
          accountType,
          bankName,
          accountNumber,
          accountName,
          isDefault: false
        }
      });
    }

    // Create withdrawal request
    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId: user.id,
        bankAccountId: bankAccount.id,
        amount,
        status: 'pending'
      },
      include: {
        bankAccount: true
      }
    });

    // Deduct from user's total earnings
    await prisma.user.update({
      where: { id: user.id },
      data: {
        totalEarnings: {
          decrement: amount
        }
      }
    });

    console.log(`[WITHDRAWAL] New request created: ${withdrawal.id} - ${amount} for user ${user.email}`);

    return NextResponse.json({
      success: true,
      withdrawal
    }, { status: 201 });

  } catch (error) {
    console.error('[WITHDRAWAL] Error creating withdrawal:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses penarikan' },
      { status: 500 }
    );
  }
}

// GET - Get user's withdrawals
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    // Get all withdrawals for this user
    const withdrawals = await prisma.withdrawal.findMany({
      where: {
        userId: user.id
      },
      include: {
        bankAccount: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      withdrawals
    }, { status: 200 });

  } catch (error) {
    console.error('[WITHDRAWAL] Error fetching withdrawals:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data penarikan' },
      { status: 500 }
    );
  }
}
