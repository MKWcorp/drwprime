'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Treatment {
  id: string;
  slug: string;
  name: string;
  price: number;
}

interface Category {
  id: string;
  slug: string;
  name: string;
  treatments: Treatment[];
}

// Data Home Treatment dari Google Sheets
const homeCategories: Category[] = [
  {
    id: '1',
    slug: 'facial-basic',
    name: 'Facial Basic',
    treatments: [
      { id: '1-1', slug: 'acne-facial', name: 'Acne Facial', price: 160000 },
      { id: '1-2', slug: 'glow-facial', name: 'Glow Facial', price: 185000 },
    ]
  },
  {
    id: '2',
    slug: 'facial-prime',
    name: 'Facial Prime',
    treatments: [
      { id: '2-1', slug: 'acne-cure-facial', name: 'Acne Cure Facial', price: 235000 },
      { id: '2-2', slug: 'whitening-glow-facial', name: 'Whitening Glow Facial', price: 260000 },
      { id: '2-3', slug: 'eternal-rejuve-facial', name: 'Eternal Rejuve Facial', price: 260000 },
    ]
  },
  {
    id: '3',
    slug: 'chemical-peeling',
    name: 'Chemical Peeling',
    treatments: [
      { id: '3-1', slug: 'purifying-acne-peel', name: 'Purifying Acne Peel', price: 260000 },
      { id: '3-2', slug: 'clarifying-light-peel', name: 'Clarifying Light Peel', price: 260000 },
      { id: '3-3', slug: 'radiance-glow-peel', name: 'Radiance Glow Peel', price: 260000 },
      { id: '3-4', slug: 'retinol-bright-peel', name: 'Retinol Bright Peel', price: 410000 },
      { id: '3-5', slug: 'body-peel', name: 'Body Peel', price: 510000 },
    ]
  },
  {
    id: '4',
    slug: 'infusion',
    name: 'Infusion',
    treatments: [
      { id: '4-1', slug: 'vitamin-c', name: 'Vitamin C', price: 260000 },
      { id: '4-2', slug: 'vitamin-white-booster', name: 'Vitamin White Booster', price: 760000 },
      { id: '4-3', slug: 'vitamin-prime-booster', name: 'Vitamin Prime Booster', price: 1510000 },
    ]
  },
  {
    id: '5',
    slug: 'body-treatment',
    name: 'Body Treatment',
    treatments: [
      { id: '5-1', slug: 'lymphatic-dm-wajah', name: 'Lymphatic DM Wajah', price: 160000 },
      { id: '5-2', slug: 'lymphatic-dm-perut', name: 'Lymphatic DM Perut', price: 160000 },
      { id: '5-3', slug: 'lymphatic-dm-kaki', name: 'Lymphatic DM Kaki', price: 135000 },
      { id: '5-4', slug: 'lymphatic-dm-full-body', name: 'Lymphatic DM Full Body', price: 410000 },
      { id: '5-5', slug: 'javanese-massage-60', name: 'Javanese Massage 60\'', price: 130000 },
      { id: '5-6', slug: 'javanese-massage-90', name: 'Javanese Massage 90\'', price: 160000 },
      { id: '5-7', slug: 'hot-stone', name: 'Hot Stone', price: 60000 },
      { id: '5-8', slug: 'body-spa', name: 'Body Spa', price: 260000 },
    ]
  },
  {
    id: '6',
    slug: 'nail-treatment',
    name: 'Nail Treatment',
    treatments: [
      { id: '6-1', slug: 'nail-art-basic', name: 'Nail Art Basic', price: 135000 },
      { id: '6-2', slug: 'nail-art-cat-eye', name: 'Nail Art Cat Eye', price: 160000 },
      { id: '6-3', slug: 'french-nail', name: 'French Nail', price: 200000 },
      { id: '6-4', slug: 'chrome', name: 'Chrome', price: 160000 },
      { id: '6-5', slug: 'nail-gel-3d', name: 'Nail Gel 3D', price: 260000 },
      { id: '6-6', slug: 'korean-blush-nail', name: 'Korean Blush Nail', price: 160000 },
      { id: '6-7', slug: 'glazed-pearl-nail', name: 'Glazed Pearl Nail', price: 160000 },
      { id: '6-8', slug: 'nail-gel-gliter', name: 'Nail Gel Gliter', price: 145000 },
      { id: '6-9', slug: 'nail-extension', name: 'Nail Extension', price: 185000 },
      { id: '6-10', slug: 'remove-nail-gel', name: 'Remove Nail Gel', price: 65000 },
      { id: '6-11', slug: 'gradasi-nail', name: 'Gradasi Nail', price: 160000 },
    ]
  },
];

export default function HomeTreatmentPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // Get all treatments or filtered by category and search
  const displayedTreatments = useMemo(() => {
    let treatments: (Treatment & { categoryName: string })[] = [];
    
    if (activeCategory === 'all') {
      // Flatten all treatments from all categories
      treatments = homeCategories.flatMap((cat: Category) => 
        cat.treatments.map((treatment: Treatment) => ({
          ...treatment,
          categoryName: cat.name
        }))
      );
    } else {
      const category = homeCategories.find(
        (cat: Category) => cat.slug === activeCategory
      );
      treatments = category ? category.treatments.map((treatment: Treatment) => ({
        ...treatment,
        categoryName: category.name
      })) : [];
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      treatments = treatments.filter(treatment => 
        treatment.name.toLowerCase().includes(query) ||
        treatment.categoryName.toLowerCase().includes(query)
      );
    }

    return treatments;
  }, [activeCategory, searchQuery]);

  const activeCategoryData = homeCategories.find(
    (cat: Category) => cat.slug === activeCategory
  );

  return (
    <>
      <Navbar />
      
      <main className="pt-20 min-h-screen bg-dark relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative py-20 px-5 text-center bg-gradient-to-br from-primary/10 to-dark/95 border-b border-primary/20">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-playfair text-5xl font-bold text-primary mb-5">
              Home Treatment
            </h1>
            <p className="text-xl text-white/70">
              Nikmati layanan treatment premium di kenyamanan rumah Anda
            </p>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section className="relative py-6 px-5 bg-[#0f0f0f]/80 border-b border-primary/10 sticky top-[70px] z-50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Cari treatment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/50 border-2 border-primary/30 text-white placeholder-white/40 px-5 py-3 md:py-3.5 rounded-lg focus:outline-none focus:border-primary transition-all duration-300 pr-12"
                />
                <svg 
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/60"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Category Dropdown */}
              <div className="relative min-w-[200px]">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="w-full bg-primary/10 border-2 border-primary/30 text-primary px-5 py-3 md:py-3.5 rounded-lg font-semibold text-sm flex items-center justify-between hover:bg-primary/20 hover:border-primary transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span className="truncate">
                      {activeCategory === 'all' 
                        ? 'Semua Kategori' 
                        : homeCategories.find((c: Category) => c.slug === activeCategory)?.name}
                    </span>
                  </span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isFilterOpen && (
                  <div className="absolute top-full mt-2 w-full bg-[#1a1a1a] border-2 border-primary/30 rounded-lg shadow-2xl shadow-black/50 max-h-[400px] overflow-y-auto z-[60]">
                    <button
                      onClick={() => {
                        setActiveCategory('all');
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-5 py-3 hover:bg-primary/20 transition-colors duration-200 ${
                        activeCategory === 'all' ? 'bg-primary/10 text-primary font-semibold' : 'text-white/80'
                      }`}
                    >
                      Semua Kategori
                    </button>
                    {homeCategories.map((category: Category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setActiveCategory(category.slug);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-5 py-3 hover:bg-primary/20 transition-colors duration-200 border-t border-primary/10 ${
                          activeCategory === category.slug ? 'bg-primary/10 text-primary font-semibold' : 'text-white/80'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Active filters indicator */}
            {(searchQuery || activeCategory !== 'all') && (
              <div className="flex flex-wrap gap-2 mt-4">
                {searchQuery && (
                  <span className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 text-primary px-3 py-1 rounded-full text-sm">
                    <span>&quot;{searchQuery}&quot;</span>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {activeCategory !== 'all' && (
                  <span className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 text-primary px-3 py-1 rounded-full text-sm">
                    <span>{homeCategories.find((c: Category) => c.slug === activeCategory)?.name}</span>
                    <button 
                      onClick={() => setActiveCategory('all')}
                      className="hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Treatments Grid */}
        <section className="relative py-20 px-5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-playfair text-4xl font-bold text-primary mb-4">
                {activeCategory === 'all' ? 'All Home Treatments' : activeCategoryData?.name}
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                {activeCategory === 'all' 
                  ? 'Pilih treatment favorit Anda untuk layanan di rumah' 
                  : `Layanan ${activeCategoryData?.name} profesional di rumah Anda`}
              </p>
              {displayedTreatments.length > 0 && (
                <p className="text-sm text-primary/80 mt-2">
                  {displayedTreatments.length} treatment{displayedTreatments.length > 1 ? 's' : ''} tersedia
                </p>
              )}
            </div>

            {/* No Results Message */}
            {displayedTreatments.length === 0 && (
              <div className="text-center py-20">
                <svg className="w-20 h-20 text-primary/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-2xl font-bold text-white/80 mb-2">Tidak ada treatment ditemukan</h3>
                <p className="text-white/60 mb-6">Coba ubah kata kunci atau kategori pencarian Anda</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="inline-flex items-center gap-2 bg-primary/20 border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/30 transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset Filter
                </button>
              </div>
            )}

            {/* Grid 3 kolom untuk web, 1 kolom untuk mobile */}
            {displayedTreatments.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedTreatments.map((treatment: Treatment & { categoryName?: string }) => (
                <div 
                  key={treatment.id} 
                  className="bg-[#141414]/95 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2 flex flex-col"
                >
                  {/* Category Badge */}
                  {activeCategory === 'all' && (
                    <div className="w-full bg-gradient-to-r from-primary to-primary-light text-dark text-center py-3 px-4 font-semibold text-sm tracking-wide border-b-2 border-primary/50">
                      {treatment.categoryName}
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-5 flex flex-col gap-3 flex-1">
                    {/* Treatment Name */}
                    <h3 className="font-playfair text-xl font-bold text-white leading-tight min-h-[2.5rem] line-clamp-2">
                      {treatment.name}
                    </h3>
                    
                    {/* Price */}
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-sm font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                        Rp {treatment.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                    
                    {/* Book Button */}
                    <Link
                      href={`https://wa.me/6281138800071?text=Halo%2C%20saya%20ingin%20booking%20Home%20Treatment%20${encodeURIComponent(treatment.name)}`}
                      target="_blank"
                      className="mt-auto w-full bg-gradient-to-r from-primary to-primary-light text-dark py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
                    >
                      <span>Booking via WhatsApp</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 px-5 bg-gradient-to-br from-primary/10 to-dark text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-playfair text-4xl font-bold text-primary mb-4">
              Siap Merasakan Layanan Premium di Rumah?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Hubungi kami via WhatsApp untuk booking Home Treatment sekarang
            </p>
            <Link
              href="https://wa.me/6281138800071?text=Halo%2C%20saya%20ingin%20booking%20Home%20Treatment"
              target="_blank"
              className="inline-block bg-gradient-to-r from-primary to-primary-light text-dark py-4 px-12 rounded-lg font-bold text-lg hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
            >
              Booking via WhatsApp
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
