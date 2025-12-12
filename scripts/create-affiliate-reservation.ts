import { prisma } from '../src/lib/prisma';

async function createAffiliateReservation() {
  console.log('🎯 Creating reservation through affiliate link...\n');

  // Find the affiliate with code DR9OM
  const affiliate = await prisma.user.findUnique({
    where: { affiliateCode: 'DR9OM' }
  });

  if (!affiliate) {
    console.log('❌ Affiliate with code DR9OM not found');
    return;
  }

  console.log('👤 Affiliate:', affiliate.firstName, affiliate.lastName);
  console.log('🔗 Affiliate Code:', affiliate.affiliateCode, '\n');

  // Get a treatment
  const treatment = await prisma.treatment.findFirst();
  
  if (!treatment) {
    console.log('❌ No treatments found');
    return;
  }

  console.log('📝 Creating reservation through affiliate link...\n');

  // Create reservation with affiliate code
  const reservation = await prisma.reservation.create({
    data: {
      userId: affiliate.id, // The affiliate's user account
      treatmentId: treatment.id,
      referredBy: affiliate.affiliateCode, // DR9OM
      referrerId: affiliate.id, // Points to the affiliate
      patientName: 'Customer dari Link DR9OM',
      patientEmail: 'customer.dr9om@email.com',
      patientPhone: '085678901234',
      patientNotes: 'Booking melalui link affiliate DR9OM',
      reservationDate: new Date('2025-12-20'),
      reservationTime: '13:00',
      originalPrice: treatment.price,
      finalPrice: treatment.price,
      commissionAmount: Number(treatment.price) * 0.10, // 10% commission
      status: 'pending'
    },
    include: { 
      treatment: true,
      user: true
    }
  });

  console.log('✅ Reservasi berhasil dibuat!');
  console.log('   Pasien:', reservation.patientName);
  console.log('   Treatment:', reservation.treatment.name);
  console.log('   Harga: Rp', Number(reservation.finalPrice).toLocaleString('id-ID'));
  console.log('   Komisi untuk', affiliate.affiliateCode + ':', 'Rp', Number(reservation.commissionAmount).toLocaleString('id-ID'));
  console.log('\n✨ Sekarang cek dashboard My Prime untuk melihat referral ini!\n');
  
  await prisma.$disconnect();
}

createAffiliateReservation();
