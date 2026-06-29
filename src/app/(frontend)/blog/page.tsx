import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileLayout from '@/components/MobileLayout';
import { getPayloadClient, heroImageUrl, type PayloadPost } from '@/lib/payload';

export const metadata: Metadata = {
  title: { absolute: 'Blog Edukasi Treatment | DRW Prime' },
  description: 'Pelajari edukasi treatment, tips skincare, dan panduan perawatan dari DRW Prime.',
  alternates: {
    canonical: 'https://drwprime.com/blog'
  },
  openGraph: {
    type: 'website',
    url: 'https://drwprime.com/blog',
    title: 'Blog Edukasi Treatment | DRW Prime',
    description: 'Pelajari edukasi treatment, tips skincare, dan panduan perawatan dari DRW Prime.',
    siteName: 'DRW Prime'
  },
  keywords: [
    'drw prime',
    'blog treatment',
    'tips skincare',
    'klinik kecantikan'
  ]
};

// Rendered at request time on the VPS (DB reachable via hairpin), NOT prerendered
// at build on GitHub runners — the Postgres port is firewalled from the internet.
export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      _status: { equals: 'published' },
      publishedAt: { less_than_equal: new Date().toISOString() }
    },
    sort: '-publishedAt',
    depth: 1,
    limit: 100
  });
  const posts = docs as unknown as PayloadPost[];

  return (
    <MobileLayout>
      <Navbar />
      <main className="pt-8 md:pt-28 pb-24 md:pb-20 min-h-screen bg-dark px-4 md:px-5">
        <section className="max-w-6xl mx-auto">
          <div className="mb-8 md:mb-12">
            <p className="text-primary uppercase tracking-[0.2em] text-xs font-semibold mb-3">DRW Prime Journal</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-[-0.03em]">
              Edukasi Treatment & Kesehatan Kulit
            </h1>
            <p className="text-white/70 max-w-3xl text-sm sm:text-base leading-7">
              Kumpulan artikel edukatif untuk membantu Anda memahami treatment, memilih perawatan yang tepat, dan menjaga hasil treatment lebih optimal.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="border border-white/10 rounded-2xl p-10 text-center bg-black/20">
              <h2 className="text-white text-xl font-semibold mb-2">Belum ada artikel</h2>
              <p className="text-white/60">Artikel edukasi akan segera dipublikasikan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {posts.map((post) => {
                const cover = heroImageUrl(post);
                const tags = post.tags ?? [];
                return (
                <article key={post.id} className="border border-white/10 rounded-2xl overflow-hidden bg-black/30 hover:border-primary/40 transition-colors">
                  {cover && (
                    <div className="relative w-full aspect-[16/9]">
                      <Image
                        src={cover}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  <div className="p-4 sm:p-5 md:p-6">
                  <p className="text-xs text-white/50 mb-3">
                    {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-3 leading-snug tracking-[-0.02em]">{post.title}</h2>
                  <p className="text-white/70 mb-4 md:mb-5 text-sm sm:text-base leading-7">{post.excerpt || 'Baca insight edukatif dari tim DRW Prime.'}</p>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full text-xs bg-primary/10 border border-primary/30 text-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-light transition-colors"
                  >
                    Baca Artikel
                    <span aria-hidden>→</span>
                  </Link>
                  </div>
                </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </MobileLayout>
  );
}
