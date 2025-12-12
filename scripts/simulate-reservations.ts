import { prisma } from '../src/lib/prisma';

async function simulate() {
  console.log('🎯 Starting reservation simulation...\n');

  const adminUser = await prisma.user.findFirst({
    where: { 
      clerkUserId: 'user_36gdG2sWQfY5wdGby1gGgML4ziC'
    }
  });

  if (!adminUser) {
    console.log('❌ Admin user not found');
    return;
  }

  console.log('👤 Admin User:', adminUser.firstName, adminUser.lastName);
  console.log('🔗 Affiliate Code:', adminUser.affiliateCode, '\n');

  const treatments = await prisma.treatment.findMany({ take: 4 });
  
  if (treatments.length < 4) {
    console.log('❌ Not enough treatments in database');
    return;
  }

  console.log('📝 Creating 4 test reservations...\n');

  // 2 reservations WITH affiliate code (from affiliate link)
  const res1 = await prisma.reservation.create({
    data: {
      userId: adminUser.id,
      treatmentId: treatments[0].id,
      referredBy: adminUser.affiliateCode,
      referrerId: adminUser.id,
      patientName: 'Budi Santoso',
      patientEmail: 'budi@email.com',
      patientPhone: '081234567890',
      patientNotes: 'Dari link affiliate',
      reservationDate: new Date('2025-12-15'),
      reservationTime: '10:00',
      originalPrice: treatments[0].price,
      finalPrice: treatments[0].price,
      commissionAmount: Number(treatments[0].price) * 0.10,
      status: 'pending'
    },
    include: { treatment: true }
  });

  console.log('✅ Reservasi 1 (Dengan Affiliate):');
  console.log('   Pasien:', res1.patientName);
  console.log('   Treatment:', res1.treatment.name);
  console.log('   Harga: Rp', Number(res1.finalPrice).toLocaleString('id-ID'));
  console.log('   Komisi: Rp', Number(res1.commissionAmount).toLocaleString('id-ID'), '\n');

  const res2 = await prisma.reservation.create({
    data: {
      userId: adminUser.id,
      treatmentId: treatments[1].id,
      referredBy: adminUser.affiliateCode,
      referrerId: adminUser.id,
      patientName: 'Siti Nurhaliza',
      patientEmail: 'siti@email.com',
      patientPhone: '082345678901',
      patientNotes: 'Dari link affiliate',
      reservationDate: new Date('2025-12-16'),
      reservationTime: '14:00',
      originalPrice: treatments[1].price,
      finalPrice: treatments[1].price,
      commissionAmount: Number(treatments[1].price) * 0.10,
      status: 'pending'
    },
    include: { treatment: true }
  });

  console.log('✅ Reservasi 2 (Dengan Affiliate):');
  console.log('   Pasien:', res2.patientName);
  console.log('   Treatment:', res2.treatment.name);
  console.log('   Harga: Rp', Number(res2.finalPrice).toLocaleString('id-ID'));
  console.log('   Komisi: Rp', Number(res2.commissionAmount).toLocaleString('id-ID'), '\n');

  // 2 reservations WITHOUT affiliate code (direct booking)
  const res3 = await prisma.reservation.create({
    data: {
      userId: adminUser.id,
      treatmentId: treatments[2].id,
      referredBy: null,
      referrerId: null,
      patientName: 'Ahmad Rizki',
      patientEmail: 'ahmad@email.com',
      patientPhone: '083456789012',
      patientNotes: 'Booking langsung tanpa affiliate',
      reservationDate: new Date('2025-12-17'),
      reservationTime: '11:00',
      originalPrice: treatments[2].price,
      finalPrice: treatments[2].price,
      commissionAmount: 0,
      status: 'pending'
    },
    include: { treatment: true }
  });

  console.log('✅ Reservasi 3 (Tanpa Affiliate):');
  console.log('   Pasien:', res3.patientName);
  console.log('   Treatment:', res3.treatment.name);
  console.log('   Harga: Rp', Number(res3.finalPrice).toLocaleString('id-ID'));
  console.log('   Komisi: Rp', Number(res3.commissionAmount).toLocaleString('id-ID'), '\n');

  const res4 = await prisma.reservation.create({
    data: {
      userId: adminUser.id,
      treatmentId: treatments[3].id,
      referredBy: null,
      referrerId: null,
      patientName: 'Dewi Lestari',
      patientEmail: 'dewi@email.com',
      patientPhone: '084567890123',
      patientNotes: 'Booking langsung tanpa affiliate',
      reservationDate: new Date('2025-12-18'),
      reservationTime: '15:00',
      originalPrice: treatments[3].price,
      finalPrice: treatments[3].price,
      commissionAmount: 0,
      status: 'pending'
    },
    include: { treatment: true }
  });

  console.log('✅ Reservasi 4 (Tanpa Affiliate):');
  console.log('   Pasien:', res4.patientName);
  console.log('   Treatment:', res4.treatment.name);
  console.log('   Harga: Rp', Number(res4.finalPrice).toLocaleString('id-ID'));
  console.log('   Komisi: Rp', Number(res4.commissionAmount).toLocaleString('id-ID'), '\n');

  // Summary
  const totalCommission = Number(res1.commissionAmount) + Number(res2.commissionAmount);
  console.log('📊 RINGKASAN SIMULASI:');
  console.log('   Total Reservasi Dengan Affiliate: 2');
  console.log('   Total Reservasi Tanpa Affiliate: 2');
  console.log('   Total Komisi Affiliate: Rp', totalCommission.toLocaleString('id-ID'));
  console.log('\n✨ Simulasi selesai! Cek di Front Office dan My Prime dashboard\n');
  
  await prisma.$disconnect();
}

simulate();
