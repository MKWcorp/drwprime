import { prisma } from '../src/lib/prisma';

async function createMultipleAffiliateReservations() {
  console.log('🎯 Creating 3 more reservations through DR9OM link...\n');

  // Find the affiliate with code DR9OM
  const affiliate = await prisma.user.findUnique({
    where: { affiliateCode: 'DR9OM' }
  });

  if (!affiliate) {
    console.log('❌ Affiliate with code DR9OM not found');
    return;
  }

  console.log('👤 Affiliate:', affiliate.firstName);
  console.log('🔗 Affiliate Code:', affiliate.affiliateCode, '\n');

  // Get different treatments
  const treatments = await prisma.treatment.findMany({ take: 3 });
  
  if (treatments.length < 3) {
    console.log('❌ Not enough treatments found');
    return;
  }

  const customers = [
    {
      name: 'Rina Wijaya',
      email: 'rina.wijaya@email.com',
      phone: '086789012345',
      date: '2025-12-21',
      time: '10:00'
    },
    {
      name: 'Indah Permata',
      email: 'indah.permata@email.com',
      phone: '087890123456',
      date: '2025-12-22',
      time: '14:00'
    },
    {
      name: 'Yoga Pratama',
      email: 'yoga.pratama@email.com',
      phone: '088901234567',
      date: '2025-12-23',
      time: '11:00'
    }
  ];

  console.log('📝 Creating 3 reservations...\n');

  let totalCommission = 0;

  for (let i = 0; i < 3; i++) {
    const reservation = await prisma.reservation.create({
      data: {
        userId: affiliate.id,
        treatmentId: treatments[i].id,
        referredBy: affiliate.affiliateCode,
        referrerId: affiliate.id,
        patientName: customers[i].name,
        patientEmail: customers[i].email,
        patientPhone: customers[i].phone,
        patientNotes: 'Booking melalui link affiliate DR9OM',
        reservationDate: new Date(customers[i].date),
        reservationTime: customers[i].time,
        originalPrice: treatments[i].price,
        finalPrice: treatments[i].price,
        commissionAmount: Number(treatments[i].price) * 0.10,
        status: 'pending'
      },
      include: { treatment: true }
    });

    totalCommission += Number(reservation.commissionAmount);

    console.log(`✅ Reservasi ${i + 1}:`);
    console.log('   Pasien:', reservation.patientName);
    console.log('   Treatment:', reservation.treatment.name);
    console.log('   Harga: Rp', Number(reservation.finalPrice).toLocaleString('id-ID'));
    console.log('   Komisi: Rp', Number(reservation.commissionAmount).toLocaleString('id-ID'), '\n');
  }

  console.log('📊 RINGKASAN:');
  console.log('   Total Reservasi Baru: 3');
  console.log('   Total Komisi: Rp', Number(totalCommission).toLocaleString('id-ID'));
  console.log('\n✨ Selesai! Cek My Prime dashboard untuk melihat 4 referrals total!\n');
  
  await prisma.$disconnect();
}

createMultipleAffiliateReservations();
