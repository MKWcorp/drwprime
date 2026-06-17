import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import MobileLayout from '@/components/MobileLayout';
import { prisma } from '@/lib/prisma';
import { buildMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = buildMetadata({
  title: 'Best Deal & Promo Treatment',
  description:
    'Dapatkan penawaran terbaik dan promo treatment bulanan dari DRW Prime. Hemat untuk perawatan kecantikan premium pilihan Anda.',
  path: '/best-deal',
});

type Promo = {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  promoMonth: string;
  validFrom?: Date | null;
  validUntil?: Date | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  terms?: string | null;
};

async function getPromos(): Promise<Promo[]> {
  try {
    const now = new Date();
    const startOfTodayUtc = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0)
    );
    const endOfTodayUtc = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999)
    );
    const promos = await prisma.bestDealPromo.findMany({
      where: {
        isActive: true,
        AND: [
          {
            OR: [{ validFrom: null }, { validFrom: { lte: endOfTodayUtc } }],
          },
          {
            OR: [{ validUntil: null }, { validUntil: { gte: startOfTodayUtc } }],
          },
        ],
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return promos;
  } catch {
    return [];
  }
}

function formatDate(value?: Date | string | null) {
  if (!value) return '-';
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export default async function BestDealPage() {
  const promos = await getPromos();

  return (
    <MobileLayout>
      <main className="min-h-screen bg-black text-white">
        <Navbar />

        <section className="pt-24 pb-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <p className="text-primary uppercase tracking-[0.2em] text-xs mb-3">Promo Bulanan</p>
              <h1 className="font-playfair text-4xl md:text-5xl text-white font-bold mb-3">Best Deal DRW Prime</h1>
              <p className="text-white/70 max-w-2xl">
                Koleksi promo pilihan setiap bulan yang bisa langsung Anda klaim untuk treatment favorit di DRW Prime.
              </p>
            </div>

            {promos.length === 0 ? (
              <div className="rounded-2xl border border-primary/25 bg-gradient-to-b from-primary/10 to-transparent p-8 text-center">
                <h2 className="text-xl font-semibold text-white mb-2">Belum ada promo aktif</h2>
                <p className="text-white/65 mb-5">Tim kami sedang menyiapkan best deal terbaru untuk Anda.</p>
                <Link
                  href="/reservation"
                  className="inline-flex items-center rounded-lg bg-primary text-black px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Tetap Reservasi
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {promos.map((promo) => (
                  <article
                    key={promo.id}
                    className="group rounded-2xl border border-primary/25 bg-gradient-to-b from-white/5 to-transparent overflow-hidden"
                  >
                    <div className="p-5 border-b border-white/10">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <span className="text-[11px] uppercase tracking-[0.18em] text-primary">{promo.promoMonth}</span>
                        <span className="text-[11px] px-2 py-1 rounded-full bg-primary/15 text-primary border border-primary/30">
                          Best Deal
                        </span>
                      </div>
                      <h2 className="text-2xl font-playfair font-bold text-white mb-2">{promo.title}</h2>
                      {promo.subtitle && <p className="text-primary/90 text-sm mb-2">{promo.subtitle}</p>}
                      {promo.description && <p className="text-white/75 text-sm leading-relaxed">{promo.description}</p>}
                    </div>

                    {promo.imageUrl && (
                      <div className="px-5 pt-5">
                        <div className="w-full max-w-[320px] aspect-[4/5] rounded-xl border border-white/10 overflow-hidden">
                          <img
                            src={promo.imageUrl}
                            alt={promo.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    <div className="p-5">
                      <div className="grid grid-cols-2 gap-3 text-xs text-white/65 mb-4">
                        <div className="rounded-lg border border-white/10 p-3">
                          <p className="text-white/45 uppercase tracking-wide text-[10px] mb-1">Mulai</p>
                          <p>{formatDate(promo.validFrom)}</p>
                        </div>
                        <div className="rounded-lg border border-white/10 p-3">
                          <p className="text-white/45 uppercase tracking-wide text-[10px] mb-1">Sampai</p>
                          <p>{formatDate(promo.validUntil)}</p>
                        </div>
                      </div>

                      {promo.terms && (
                        <p className="text-[12px] text-white/60 mb-4 border-l-2 border-primary/40 pl-3">Syarat: {promo.terms}</p>
                      )}

                      <Link
                        href={promo.ctaLink || '/reservation'}
                        className="inline-flex items-center justify-center rounded-lg bg-primary text-black px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
                      >
                        {promo.ctaText || 'Reservasi Sekarang'}
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </MobileLayout>
  );
}
