import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileLayout from '@/components/MobileLayout';
import { prisma } from '@/lib/prisma';

type BlogDetailProps = {
  params: Promise<{ slug: string }>;
};

async function getPublishedPost(slug: string) {
  return prisma.blogPost.findFirst({
    where: {
      slug,
      status: 'published',
      publishedAt: {
        lte: new Date()
      }
    }
  });
}

export async function generateMetadata({ params }: BlogDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) {
    return {
      title: 'Artikel Tidak Ditemukan | DRW Prime Blog'
    };
  }

  const title = `${post.seoTitle || post.title} | DRW Prime Blog`;
  const description = post.seoDescription || post.excerpt || 'Artikel edukasi treatment dari DRW Prime';
  const canonical = `https://drwprime.com/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      type: 'article',
      url: canonical,
      title,
      description,
      siteName: 'DRW Prime',
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      images: post.coverImage ? [{ url: post.coverImage, alt: post.title }] : undefined
    },
    keywords: post.tags
  };
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) {
    notFound();
  }

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || post.title,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: (post.publishedAt ?? post.createdAt).toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: `https://drwprime.com/blog/${post.slug}`,
    keywords: post.tags.join(', '),
    author: {
      '@type': 'Organization',
      name: 'DRW Prime'
    },
    publisher: {
      '@type': 'Organization',
      name: 'DRW Prime',
      logo: {
        '@type': 'ImageObject',
        url: 'https://drwprime.com/drwprime-logo.png'
      }
    }
  };

  return (
    <MobileLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <Navbar />
      <main className="pt-8 md:pt-28 pb-24 md:pb-20 min-h-screen bg-dark px-4 md:px-5">
        <article className="max-w-3xl mx-auto">
          <Link href="/blog" className="text-primary hover:text-primary-light transition-colors text-sm">
            ← Kembali ke Blog
          </Link>

          <header className="mt-6 mb-8 border-b border-white/10 pb-6">
            {post.coverImage && (
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-6">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
              </div>
            )}
            <p className="text-xs text-white/50 mb-3">
              {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight tracking-[-0.03em]">{post.title}</h1>
            {post.excerpt && <p className="text-white/70 text-sm sm:text-base leading-7">{post.excerpt}</p>}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs bg-primary/10 border border-primary/30 text-primary">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <section className="prose prose-invert prose-headings:text-white prose-p:text-white/85 prose-sm sm:prose-base md:prose-lg max-w-none whitespace-pre-wrap text-white/85 leading-7 sm:leading-8">
            {post.content}
          </section>

          {post.relatedTreatmentSlugs.length > 0 && (
            <section className="mt-12 border border-white/10 rounded-2xl p-6 bg-black/30">
              <h2 className="text-white font-semibold mb-3">Treatment Terkait</h2>
              <div className="flex flex-wrap gap-3">
                {post.relatedTreatmentSlugs.map((slugItem) => (
                  <Link
                    key={slugItem}
                    href={`/treatments/${slugItem}`}
                    className="text-sm px-3 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors"
                  >
                    {slugItem}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
      <Footer />
    </MobileLayout>
  );
}
