import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const title = 'HIFU Ultraformer MPT: Apa Itu, Manfaat, dan Siapa yang Cocok?';
  const slug = 'hifu-ultraformer-mpt-apa-itu-manfaat-dan-siapa-yang-cocok';
  const excerpt = 'Kenali teknologi HIFU Ultraformer MPT untuk lifting, tightening, dan contouring wajah tanpa bedah, termasuk manfaat, proses tindakan, serta siapa kandidat yang paling cocok.';

  const content = [
    'HIFU Ultraformer MPT adalah teknologi perawatan non-bedah yang menggunakan gelombang ultrasound terfokus untuk merangsang pembentukan kolagen pada lapisan kulit yang lebih dalam.',
    '',
    'Di DRW Prime, treatment ini dipilih oleh pasien yang ingin hasil pengencangan wajah yang natural tanpa downtime panjang. Energi ultrasound bekerja tepat sasaran sehingga membantu memperbaiki struktur kulit dari dalam.',
    '',
    'Manfaat utama HIFU Ultraformer MPT:',
    '1. Membantu lifting area pipi, rahang, dan bawah dagu',
    '2. Membantu mengencangkan kulit yang mulai kendur',
    '3. Membantu mempertegas kontur wajah (V shape look)',
    '4. Merangsang kolagen untuk perbaikan kualitas kulit bertahap',
    '',
    'Siapa yang cocok menjalani treatment ini?',
    '- Pria atau wanita dengan tanda penuaan ringan sampai sedang',
    '- Anda yang ingin treatment anti aging minim downtime',
    '- Anda yang ingin mempertahankan hasil treatment wajah jangka menengah dan panjang',
    '',
    'Apa yang dirasakan saat tindakan?',
    'Sebagian pasien merasakan sensasi hangat atau sedikit tingling saat energi dihantarkan. Intensitasnya dapat disesuaikan dengan kondisi kulit dan kenyamanan pasien.',
    '',
    'Berapa lama hasilnya terlihat?',
    'Sebagian pasien dapat melihat perubahan awal setelah tindakan. Hasil optimal biasanya berkembang bertahap dalam beberapa minggu hingga bulan, seiring proses pembentukan kolagen baru.',
    '',
    'Tips setelah treatment HIFU Ultraformer MPT:',
    '- Gunakan sunscreen setiap hari',
    '- Jaga hidrasi kulit dan tubuh',
    '- Hindari paparan panas berlebihan di hari pertama',
    '- Ikuti rekomendasi dokter untuk jadwal maintenance',
    '',
    'Kesimpulan',
    'HIFU Ultraformer MPT adalah pilihan anti aging modern yang aman, efisien, dan cocok untuk Anda yang ingin kulit tampak lebih kencang dan kontur wajah lebih tegas tanpa prosedur bedah.',
    '',
    'Ingin tahu apakah Anda kandidat yang tepat? Konsultasikan kondisi kulit Anda bersama tim DRW Prime untuk rencana treatment yang personal.'
  ].join('\n');

  const seoTitle = 'HIFU Ultraformer MPT: Manfaat, Proses, dan Kandidat Terbaik | DRW Prime';
  const seoDescription = 'Pelajari HIFU Ultraformer MPT di DRW Prime: manfaat lifting non-bedah, proses treatment, kandidat yang cocok, serta tips perawatan setelah tindakan.';

  const post = await prisma.blogPost.upsert({
    where: { slug },
    update: {
      title,
      excerpt,
      content,
      seoTitle,
      seoDescription,
      tags: ['hifu ultraformer mpt', 'treatment lifting wajah', 'anti aging', 'drw prime', 'prime insight'],
      relatedTreatmentSlugs: ['ultraformer-mpt'],
      status: 'published',
      publishedAt: new Date()
    },
    create: {
      title,
      slug,
      excerpt,
      content,
      seoTitle,
      seoDescription,
      tags: ['hifu ultraformer mpt', 'treatment lifting wajah', 'anti aging', 'drw prime', 'prime insight'],
      relatedTreatmentSlugs: ['ultraformer-mpt'],
      status: 'published',
      publishedAt: new Date()
    }
  });

  console.log('SEEDED', post.slug);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
