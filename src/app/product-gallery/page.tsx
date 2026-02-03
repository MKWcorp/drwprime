'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type ProductCategory = 'acne' | 'lumiera' | 'antiaging';

interface ProductPhoto {
  id: string;
  src: string;
  alt: string;
  category: ProductCategory;
  sigUrl?: string; // SIG certification document URL
}

const productPhotos: ProductPhoto[] = [
  // Acne Specialized Series (Green)
  {
    id: 'acne-banner',
    src: '/products/002.webp',
    alt: 'Acne Specialized Series Banner',
    category: 'acne'
  },
  {
    id: 'acne-package',
    src: '/products/003.webp',
    alt: 'Acne Specialized Series Package',
    category: 'acne'
  },
  {
    id: 'acne-products',
    src: '/products/004.webp',
    alt: 'Acne Specialized Series Products',
    category: 'acne'
  },
  {
    id: 'acne-cleanser',
    src: '/products/individual/acne-cleanser.jpeg',
    alt: 'Specialized Acne Control Cleanser',
    category: 'acne',
    sigUrl: '/sig/acne-control-cleanser.pdf'
  },
  {
    id: 'acne-moisturizer',
    src: '/products/individual/acne-moisturizer.jpeg',
    alt: 'Specialized Acne Soothing Moisturizer',
    category: 'acne',
    sigUrl: '/sig/acne-soothing-moisturizer.pdf'
  },
  {
    id: 'acne-glow-cream',
    src: '/products/individual/acne-glow-cream.jpeg',
    alt: 'Specialized Acne Glow Bright Cream',
    category: 'acne',
    sigUrl: '/sig/acne-glow-bright-cream.pdf'
  },
  {
    id: 'acne-uv-protect',
    src: '/products/individual/acne-uv-protect.jpeg',
    alt: 'Specialized Acne Shield UV Protect',
    category: 'acne',
    sigUrl: '/sig/acne-shield-uv-protect.pdf'
  },
  // Lumièra Series (Pink)
  {
    id: 'lumiera-banner',
    src: '/products/005.webp',
    alt: 'Lumièra Series Banner',
    category: 'lumiera'
  },
  {
    id: 'lumiera-package',
    src: '/products/006.webp',
    alt: 'Lumièra Series Package',
    category: 'lumiera'
  },
  {
    id: 'lumiera-products',
    src: '/products/007.webp',
    alt: 'Lumièra Series Products',
    category: 'lumiera'
  },
  {
    id: 'lumiera-cleanser',
    src: '/products/individual/lumiera-cleanser.jpeg',
    alt: 'Lumièra Gentle Cleansing Gel',
    category: 'lumiera',
    sigUrl: '/sig/lumiera-cleansing-gel.pdf'
  },
  {
    id: 'lumiera-glow-serum',
    src: '/products/individual/lumiera-glow-serum.jpeg',
    alt: 'Glow Serum',
    category: 'lumiera',
    sigUrl: '/sig/lumiera-glow-serum.pdf'
  },
  {
    id: 'lumiera-uv-defense',
    src: '/products/individual/lumiera-uv-defense.jpeg',
    alt: 'Lumièra UV Defense Creme',
    category: 'lumiera',
    sigUrl: '/sig/lumiera-uv-defense.pdf'
  },
  // Anti Aging Series (Gold)
  {
    id: 'antiaging-banner',
    src: '/products/008.webp',
    alt: 'Anti Aging Series Banner',
    category: 'antiaging'
  },
  {
    id: 'antiaging-package',
    src: '/products/009.webp',
    alt: 'Anti Aging Series Package',
    category: 'antiaging'
  },
  {
    id: 'antiaging-products',
    src: '/products/010.webp',
    alt: 'Anti Aging Series Products',
    category: 'antiaging'
  },
  {
    id: 'antiaging-facial-wash',
    src: '/products/individual/antiaging-facial-wash.jpeg',
    alt: 'Gentle Brightening Facial Wash',
    category: 'antiaging'
  },
  {
    id: 'antiaging-moisturizer',
    src: '/products/individual/antiaging-moisturizer.jpeg',
    alt: 'Brightening Moisturizer with Tranexamic Acid',
    category: 'antiaging'
  },
  {
    id: 'antiaging-toner',
    src: '/products/individual/lumiera-toner.jpeg',
    alt: 'Crystal Glow Hydrating Toner',
    category: 'antiaging',
    sigUrl: '/sig/lumiera-toner.pdf'
  },
  {
    id: 'antiaging-gold-serum',
    src: '/products/individual/antiaging-gold-serum.jpeg',
    alt: 'Gold Serum with 6 Jewelry Complex',
    category: 'antiaging'
  },
  {
    id: 'antiaging-dna-serum',
    src: '/products/individual/antiaging-dna-serum.jpeg',
    alt: 'RevivAge DNA Serum',
    category: 'antiaging'
  },
];

const categories = [
  { id: 'acne' as ProductCategory, name: 'Acne Specialized' },
  { id: 'lumiera' as ProductCategory, name: 'Lumièra Series' },
  { id: 'antiaging' as ProductCategory, name: 'Anti Aging Series' },
];

export default function ProductGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('acne');
  const [selectedPhoto, setSelectedPhoto] = useState<ProductPhoto | null>(null);

  const filteredPhotos = productPhotos.filter(photo => photo.category === selectedCategory);

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-dark pt-24 pb-16">
        {/* Hero Section */}
        <section className="px-5 py-12 text-center">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-primary mb-4">
            Product Gallery
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Koleksi lengkap produk skincare DRW Prime
          </p>
        </section>

        {/* Category Tabs */}
        <section className="px-5 mb-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-primary to-primary-light text-dark shadow-lg shadow-primary/30'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Photo Gallery Grid */}
        <section className="px-5">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative aspect-[3/4] bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-primary/20"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white font-semibold text-sm">
                      {photo.alt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-5"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-5 right-5 text-white/70 hover:text-white text-4xl font-light w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-full transition-all z-10"
          >
            ×
          </button>
          <div
            className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 px-6 py-4 rounded-2xl max-w-2xl">
            <p className="text-white font-semibold text-center mb-3">
              {selectedPhoto.alt}
            </p>
            {selectedPhoto.sigUrl && (
              <div className="flex justify-center">
                <a
                  href={selectedPhoto.sigUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-dark font-bold px-6 py-2 rounded-lg transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View SIG Certificate
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
