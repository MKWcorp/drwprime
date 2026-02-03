'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type GalleryCategory = 'fasilitas' | 'produk';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
}

const galleryImages: GalleryImage[] = [
  // Produk - Package displays (full images from PDF)
  {
    id: 'prod-acne-package',
    src: '/products/003.webp',
    alt: 'Acne Specialized Series Package',
    category: 'produk'
  },
  {
    id: 'prod-lumiera-package',
    src: '/products/006.webp',
    alt: 'Lumièra Series Package',
    category: 'produk'
  },
  {
    id: 'prod-antiaging-package',
    src: '/products/009.webp',
    alt: 'Anti Aging Series Package',
    category: 'produk'
  },
  // Produk - Individual products
  {
    id: 'prod-acne-cleanser',
    src: '/products/individual/acne-cleanser.webp',
    alt: 'Specialized Acne Control Cleanser',
    category: 'produk'
  },
  {
    id: 'prod-acne-moisturizer',
    src: '/products/individual/acne-moisturizer.webp',
    alt: 'Specialized Acne Soothing Moisturizer',
    category: 'produk'
  },
  {
    id: 'prod-acne-uv',
    src: '/products/individual/acne-uv-protect.webp',
    alt: 'Specialized Acne Shield UV Protect',
    category: 'produk'
  },
  {
    id: 'prod-acne-cream',
    src: '/products/individual/acne-glow-cream.webp',
    alt: 'Specialized Acne Glow Bright Cream',
    category: 'produk'
  },
  {
    id: 'prod-lumiera-cleanser',
    src: '/products/individual/lumiera-cleanser.webp',
    alt: 'Lumièra Gentle Cleansing Gel',
    category: 'produk'
  },
  {
    id: 'prod-lumiera-moist',
    src: '/products/individual/lumiera-moisturizer.webp',
    alt: 'Lumièra Bright Moist Crème',
    category: 'produk'
  },
  {
    id: 'prod-lumiera-uv',
    src: '/products/individual/lumiera-uv-defense.webp',
    alt: 'Lumièra UV Defense Creme',
    category: 'produk'
  },
  {
    id: 'prod-lumiera-serum',
    src: '/products/individual/lumiera-glow-serum.webp',
    alt: 'Lumièra Glow Serum',
    category: 'produk'
  },
  {
    id: 'prod-antiaging-wash',
    src: '/products/individual/antiaging-facial-wash.webp',
    alt: 'Gentle Brightening Facial Wash',
    category: 'produk'
  },
  {
    id: 'prod-antiaging-moist',
    src: '/products/individual/antiaging-moisturizer.webp',
    alt: 'Brightening Moisturizer',
    category: 'produk'
  },
  {
    id: 'prod-antiaging-serum',
    src: '/products/individual/antiaging-dna-serum.webp',
    alt: 'RevivAge DNA Serum',
    category: 'produk'
  },
];

export default function GaleriPage() {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('fasilitas');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const filteredImages = galleryImages.filter(img => img.category === selectedCategory);

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-dark pt-24 pb-16">
        {/* Hero Section */}
        <section className="px-5 py-12 text-center">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-primary mb-4">
            Galeri
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Lihat koleksi fasilitas dan produk kami
          </p>
        </section>

        {/* Category Tabs */}
        <section className="px-5 mb-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setSelectedCategory('fasilitas')}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                  selectedCategory === 'fasilitas'
                    ? 'bg-gradient-to-r from-primary to-primary-light text-dark shadow-lg shadow-primary/30'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                Galeri Fasilitas
              </button>
              <button
                onClick={() => setSelectedCategory('produk')}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                  selectedCategory === 'produk'
                    ? 'bg-gradient-to-r from-primary to-primary-light text-dark shadow-lg shadow-primary/30'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                Galeri Produk
              </button>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="px-5">
          <div className="max-w-7xl mx-auto">
            {selectedCategory === 'fasilitas' && filteredImages.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-white/50 text-lg">
                  Galeri fasilitas akan segera ditambahkan
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className="group relative aspect-square bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-primary/20"
                    onClick={() => setSelectedImage(image)}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-contain p-4 transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-white font-semibold text-sm">{image.alt}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-5"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-5 right-5 text-white/70 hover:text-white text-4xl font-light w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-full transition-all"
          >
            ×
          </button>
          <div
            className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 px-6 py-3 rounded-full">
            <p className="text-white font-semibold">{selectedImage.alt}</p>
          </div>
        </div>
      )}
    </>
  );
}
