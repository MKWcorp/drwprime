import { PrismaClient } from '@prisma/client';

// Import from lib/prisma to use the same client configuration
import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Treatment Categories
  const categories = [
    {
      name: 'HIFU Ultraformer MPT',
      slug: 'hifu-ultraformer-mpt',
      description: 'Non-invasive skin tightening and lifting treatment',
      image: '/images/drwprime-facial-room.png',
      order: 1
    },
    {
      name: 'Facial Basic',
      slug: 'facial-basic',
      description: 'Basic facial treatment for healthy skin',
      image: '/images/drwprime-facial-room-2.png',
      order: 2
    },
    {
      name: 'Facial Prime',
      slug: 'facial-prime',
      description: 'Premium facial treatment with advanced techniques',
      image: '/images/drwprime-facial-room-3.png',
      order: 3
    },
    {
      name: 'Chemical Peeling',
      slug: 'chemical-peeling',
      description: 'Exfoliation treatment for skin renewal',
      image: '/images/drwprime-spa.png',
      order: 4
    },
    {
      name: 'IPL (Intense Pulsed Light)',
      slug: 'ipl',
      description: 'Light-based treatment for skin rejuvenation',
      image: '/images/drwprime-laser-room.png',
      order: 5
    },
    {
      name: 'Dermapen / EPN',
      slug: 'dermapen-epn',
      description: 'Microneedling treatment for skin texture improvement',
      image: '/images/drwprime-spa-2.png',
      order: 6
    },
    {
      name: 'Injection Treatment',
      slug: 'injection',
      description: 'Injectable treatments for facial enhancement',
      image: '/images/drwprime-consultation-room.png',
      order: 7
    },
    {
      name: 'Botox',
      slug: 'botox',
      description: 'Botulinum toxin treatment for wrinkle reduction',
      image: '/images/drwprime-doctor-room.png',
      order: 8
    }
  ];

  console.log('📦 Creating treatment categories...');
  for (const category of categories) {
    await prisma.treatmentCategory.upsert({
      where: { slug: category.slug },
      update: category,
      create: category
    });
  }
  console.log('✅ Treatment categories created');

  // Create Treatments
  const treatments = [
    // HIFU Ultraformer MPT
    {
      categorySlug: 'hifu-ultraformer-mpt',
      name: 'HIFU Face Lifting',
      slug: 'hifu-face-lifting',
      description: 'Full face lifting with HIFU technology',
      price: 3500000,
      duration: 90,
      benefits: ['Skin tightening', 'Face lifting', 'Wrinkle reduction', 'Non-invasive'],
      image: '/images/drwprime-facial-room.png'
    },
    {
      categorySlug: 'hifu-ultraformer-mpt',
      name: 'HIFU Body Contouring',
      slug: 'hifu-body-contouring',
      description: 'Body contouring and fat reduction',
      price: 4000000,
      duration: 120,
      benefits: ['Fat reduction', 'Body sculpting', 'Skin tightening', 'Cellulite reduction'],
      image: '/images/drwprime-contouring-room.png'
    },
    
    // Facial Basic
    {
      categorySlug: 'facial-basic',
      name: 'Basic Facial Treatment',
      slug: 'basic-facial-treatment',
      description: 'Cleansing, exfoliation, and moisturizing',
      price: 350000,
      duration: 60,
      benefits: ['Deep cleansing', 'Hydration', 'Relaxation', 'Healthy glow'],
      image: '/images/drwprime-facial-room-2.png'
    },
    {
      categorySlug: 'facial-basic',
      name: 'Acne Facial',
      slug: 'acne-facial',
      description: 'Specialized treatment for acne-prone skin',
      price: 450000,
      duration: 75,
      benefits: ['Acne reduction', 'Oil control', 'Pore minimizing', 'Anti-bacterial'],
      image: '/images/drwprime-facial-room.png'
    },
    
    // Facial Prime
    {
      categorySlug: 'facial-prime',
      name: 'Prime Whitening Facial',
      slug: 'prime-whitening-facial',
      description: 'Advanced whitening and brightening treatment',
      price: 750000,
      duration: 90,
      benefits: ['Skin brightening', 'Even tone', 'Anti-aging', 'Deep hydration'],
      image: '/images/drwprime-facial-room-3.png'
    },
    {
      categorySlug: 'facial-prime',
      name: 'Prime Anti-Aging',
      slug: 'prime-anti-aging',
      description: 'Premium anti-aging facial treatment',
      price: 850000,
      duration: 100,
      benefits: ['Wrinkle reduction', 'Firming', 'Collagen boost', 'Youthful appearance'],
      image: '/images/drwprime-spa.png'
    },
    
    // Chemical Peeling
    {
      categorySlug: 'chemical-peeling',
      name: 'Superficial Peel',
      slug: 'superficial-peel',
      description: 'Light chemical peel for gentle exfoliation',
      price: 500000,
      duration: 45,
      benefits: ['Gentle exfoliation', 'Brightening', 'Smooth texture', 'No downtime'],
      image: '/images/drwprime-spa-2.png'
    },
    {
      categorySlug: 'chemical-peeling',
      name: 'Medium Peel',
      slug: 'medium-peel',
      description: 'Medium depth peel for deeper skin renewal',
      price: 800000,
      duration: 60,
      benefits: ['Deep exfoliation', 'Pigmentation removal', 'Skin renewal', 'Smoother skin'],
      image: '/images/drwprime-spa-3.png'
    },
    
    // IPL
    {
      categorySlug: 'ipl',
      name: 'IPL Photo Facial',
      slug: 'ipl-photo-facial',
      description: 'Light therapy for skin rejuvenation',
      price: 1200000,
      duration: 45,
      benefits: ['Pigmentation reduction', 'Redness reduction', 'Skin rejuvenation', 'Even tone'],
      image: '/images/drwprime-laser-room.png'
    },
    {
      categorySlug: 'ipl',
      name: 'IPL Hair Removal',
      slug: 'ipl-hair-removal',
      description: 'Permanent hair reduction treatment',
      price: 800000,
      duration: 30,
      benefits: ['Permanent reduction', 'Smooth skin', 'Safe procedure', 'Quick results'],
      image: '/images/drwprime-laser-room-2.png'
    },
    
    // Dermapen / EPN
    {
      categorySlug: 'dermapen-epn',
      name: 'Dermapen Facial',
      slug: 'dermapen-facial',
      description: 'Microneedling for skin texture improvement',
      price: 1500000,
      duration: 75,
      benefits: ['Collagen production', 'Scar reduction', 'Fine lines reduction', 'Texture improvement'],
      image: '/images/drwprime-spa.png'
    },
    {
      categorySlug: 'dermapen-epn',
      name: 'EPN Whitening',
      slug: 'epn-whitening',
      description: 'Electroporation with whitening serum',
      price: 1000000,
      duration: 60,
      benefits: ['Deep serum penetration', 'Brightening', 'Hydration', 'No needles'],
      image: '/images/drwprime-spa-2.png'
    },
    
    // Injection Treatment
    {
      categorySlug: 'injection',
      name: 'Vitamin C Injection',
      slug: 'vitamin-c-injection',
      description: 'High-dose vitamin C for skin brightening',
      price: 500000,
      duration: 30,
      benefits: ['Antioxidant boost', 'Brightening', 'Immune support', 'Quick procedure'],
      image: '/images/drwprime-consultation-room.png'
    },
    {
      categorySlug: 'injection',
      name: 'Glutathione Injection',
      slug: 'glutathione-injection',
      description: 'Skin whitening and antioxidant injection',
      price: 750000,
      duration: 30,
      benefits: ['Skin whitening', 'Detoxification', 'Anti-aging', 'Overall wellness'],
      image: '/images/drwprime-doctor-room.png'
    },
    
    // Botox
    {
      categorySlug: 'botox',
      name: 'Botox Forehead',
      slug: 'botox-forehead',
      description: 'Botox for forehead lines',
      price: 2500000,
      duration: 30,
      benefits: ['Wrinkle reduction', 'Smooth forehead', 'Natural results', 'Long-lasting'],
      image: '/images/drwprime-doctor-room.png'
    },
    {
      categorySlug: 'botox',
      name: 'Botox Full Face',
      slug: 'botox-full-face',
      description: 'Comprehensive facial botox treatment',
      price: 5000000,
      duration: 45,
      benefits: ['Complete wrinkle reduction', 'Facial contouring', 'Youthful appearance', '6-month results'],
      image: '/images/drwprime-faceside.png'
    }
  ];

  console.log('💉 Creating treatments...');
  for (const treatment of treatments) {
    const category = await prisma.treatmentCategory.findUnique({
      where: { slug: treatment.categorySlug }
    });

    if (category) {
      await prisma.treatment.upsert({
        where: { slug: treatment.slug },
        update: {
          name: treatment.name,
          description: treatment.description,
          price: treatment.price,
          duration: treatment.duration,
          benefits: treatment.benefits,
          image: treatment.image
        },
        create: {
          categoryId: category.id,
          name: treatment.name,
          slug: treatment.slug,
          description: treatment.description,
          price: treatment.price,
          duration: treatment.duration,
          benefits: treatment.benefits,
          image: treatment.image
        }
      });
    }
  }
  console.log('✅ Treatments created');

  // Create sample vouchers
  const vouchers = [
    {
      title: 'Facial Basic Discount',
      description: 'Get 50% off on Facial Basic treatment',
      category: 'Treatment',
      discount: '50%',
      pointsCost: 500,
      availableCount: 15,
      image: '/images/drwprime-facial-room.png'
    },
    {
      title: 'IPL Treatment Discount',
      description: 'Get 30% off on IPL treatment',
      category: 'Treatment',
      discount: '30%',
      pointsCost: 800,
      availableCount: 8,
      image: '/images/drwprime-laser-room.png'
    },
    {
      title: 'Free Consultation',
      description: 'Free consultation with our specialist',
      category: 'Service',
      discount: '100%',
      pointsCost: 200,
      availableCount: 25,
      image: '/images/drwprime-consultation-room.png'
    },
    {
      title: 'Product Discount',
      description: 'Get 25% off on skincare products',
      category: 'Product',
      discount: '25%',
      pointsCost: 300,
      availableCount: 20,
      image: '/images/drwprime-product.png'
    }
  ];

  console.log('🎟️ Creating vouchers...');
  for (const voucher of vouchers) {
    await prisma.voucher.create({
      data: voucher
    });
  }
  console.log('✅ Vouchers created');

  // Create sample events
  const events = [
    {
      title: 'Beauty Workshop: Skincare Routine',
      description: 'Learn the perfect skincare routine from our experts',
      date: new Date('2025-12-25'),
      loyaltyLevel: 'Silver',
      image: '/images/drwprime-academy-room.png',
      totalSlots: 15,
      availableSlots: 15
    },
    {
      title: 'Exclusive Gold Member Spa Day',
      description: 'Full day spa experience for Gold members',
      date: new Date('2026-01-05'),
      loyaltyLevel: 'Gold',
      image: '/images/drwprime-spa-2.png',
      totalSlots: 8,
      availableSlots: 8
    },
    {
      title: 'New Treatment Launch Event',
      description: 'Be the first to try our newest treatments',
      date: new Date('2026-01-15'),
      loyaltyLevel: 'All Members',
      image: '/images/drwprime-loungue.png',
      totalSlots: 30,
      availableSlots: 30
    }
  ];

  console.log('📅 Creating events...');
  for (const event of events) {
    await prisma.event.create({
      data: event
    });
  }
  console.log('✅ Events created');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
