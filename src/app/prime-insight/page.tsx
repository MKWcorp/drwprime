import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileLayout from '@/components/MobileLayout';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const insightTopics = [
  {
    label: 'Semua',
    href: '/prime-insight',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
      </svg>
    )
  },
  {
    label: 'Anti Aging',
    href: '/prime-insight',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l2.5 5L13 10.5 8 13l-2.5 5L3 13l-5-2.5L3 8l2-5z" transform="translate(8 3) scale(0.6)" />
      </svg>
    )
  },
  {
    label: 'Skin Booster',
    href: '/prime-insight',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.341A8 8 0 118.66 4.572M15 9h6m-3-3v6" />
      </svg>
    )
  },
  {
    label: 'Acne Care',
    href: '/prime-insight',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    label: 'Lifting',
    href: '/prime-insight',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 14l5-5 5 5M7 20l5-5 5 5" />
      </svg>
    )
  },
  {
    label: 'Aftercare',
    href: '/prime-insight',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.5-3-6-1.5-6 2.5 0 4.5 6 8.5 6 8.5s6-4 6-8.5C18 6.5 14.5 5 12 8z" />
      </svg>
    )
  }
];

export const metadata: Metadata = {
  title: 'Prime Insight | DRW Prime',
  description: 'Prime Insight berisi artikel edukasi treatment, skincare, dan kesehatan kulit dari DRW Prime.',
  alternates: {
    canonical: 'https://drwprime.com/prime-insight'
  },
  openGraph: {
    type: 'website',
    url: 'https://drwprime.com/prime-insight',
    title: 'Prime Insight | DRW Prime',
    description: 'Prime Insight berisi artikel edukasi treatment, skincare, dan kesehatan kulit dari DRW Prime.',
    siteName: 'DRW Prime'
  },
  keywords: [
    'prime insight',
    'drw prime',
    'blog treatment',
    'tips skincare',
    'klinik kecantikan'
  ]
};

export default async function PrimeInsightPage() {
  const posts = await prisma.blogPost.findMany({
    where: {
      status: 'published',
      publishedAt: {
        lte: new Date()
      }
    },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      tags: true,
      publishedAt: true,
      createdAt: true,
      coverImage: true
    }
  });

  return (
    <MobileLayout>
      <Navbar />
      <main className="pt-8 md:pt-28 pb-24 md:pb-20 min-h-screen bg-dark px-4 md:px-5">
        <section className="max-w-6xl mx-auto">
          <div className="mb-8 md:mb-12">
            <p className="text-primary uppercase tracking-[0.2em] text-xs font-semibold mb-3">Prime Insight</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-[-0.03em]">
              Memahami Bahasa Kulit & Kecantikan Anda
            </h1>
            <p className="text-white/70 max-w-3xl text-sm sm:text-base">
              Ruang edukasi yang membahas tuntas segala hal tentang kesehatan kulit, solusi masalah wajah, serta panduan perawatan yang aman dan terpercaya untuk semua jenis kulit.
            </p>
          </div>

          <div className="mb-8 md:mb-10 border-b border-white/10 pb-4">
            <ul className="flex gap-3 overflow-x-auto scrollbar-hide">
              {insightTopics.map((topic) => (
                <li key={topic.label} className="shrink-0">
                  <Link
                    href={topic.href}
                    className="group flex flex-col items-center justify-center gap-2 w-[88px] sm:w-[96px] h-[82px] rounded-2xl border border-white/15 bg-white/5 hover:border-primary/40 hover:bg-primary/10 transition-colors"
                  >
                    <span className="text-white/75 group-hover:text-primary transition-colors">{topic.icon}</span>
                    <span className="text-[11px] sm:text-xs text-center text-white/80 group-hover:text-white leading-tight px-1">
                      {topic.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {posts.length === 0 ? (
            <div className="border border-white/10 rounded-2xl p-10 text-center bg-black/20">
              <h2 className="text-white text-xl font-semibold mb-2">Belum ada artikel</h2>
              <p className="text-white/60">Artikel Prime Insight akan segera dipublikasikan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {posts.map((post) => (
                <article key={post.id} className="border border-white/10 rounded-2xl overflow-hidden bg-black/30 hover:border-primary/40 transition-colors">
                  {post.coverImage && (
                    <div className="relative w-full aspect-[16/9]">
                      <Image
                        src={post.coverImage}
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
                  <p className="text-white/70 mb-4 md:mb-5 text-sm sm:text-base">{post.excerpt || 'Baca insight terbaru dari DRW Prime.'}</p>

                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {post.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-full text-xs bg-primary/10 border border-primary/30 text-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    href={`/prime-insight/${post.slug}`}
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-light transition-colors"
                  >
                    Baca Artikel
                    <span aria-hidden>→</span>
                  </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </MobileLayout>
  );
}
