'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ProductPhoto {
  id: string;
  src: string;
  alt: string;
}

const productPhotos: ProductPhoto[] = [
  {
    id: 'cover',
    src: '/products/001.webp',
    alt: 'DRW Prime Product Catalog Cover'
  },
  {
    id: 'acne-banner',
    src: '/products/002.webp',
    alt: 'Acne Specialized Series Banner'
  },
  {
    id: 'acne-package',
    src: '/products/003.webp',
    alt: 'Acne Specialized Series Package'
  },
  {
    id: 'acne-products',
    src: '/products/004.webp',
    alt: 'Acne Specialized Series Products'
  },
  {
    id: 'lumiera-banner',
    src: '/products/005.webp',
    alt: 'Lumièra Series Banner'
  },
  {
    id: 'lumiera-package',
    src: '/products/006.webp',
    alt: 'Lumièra Series Package'
  },
  {
    id: 'lumiera-products',
    src: '/products/007.webp',
    alt: 'Lumièra Series Products'
  },
  {
    id: 'antiaging-banner-couple',
    src: '/products/008.webp',
    alt: 'Anti Aging Series Banner'
  },
  {
    id: 'antiaging-package',
    src: '/products/009.webp',
    alt: 'Anti Aging Series Package'
  },
  {
    id: 'antiaging-products',
    src: '/products/010.webp',
    alt: 'Anti Aging Series Products'
  },
];

export default function ProductGalleryPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<ProductPhoto | null>(null);

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

        {/* Photo Gallery Grid */}
        <section className="px-5">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productPhotos.map((photo) => (
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
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 px-6 py-3 rounded-full max-w-2xl">
            <p className="text-white font-semibold text-center">
              {selectedPhoto.alt}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
