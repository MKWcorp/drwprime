'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileLayout from '@/components/MobileLayout';

interface Treatment {
  id: string;
  slug: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  benefits: string[];
}

interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  treatments: Treatment[];
}

function TreatmentsContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch treatments from database
  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const response = await fetch('/api/treatments');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Error fetching treatments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatments();
  }, []);

  // Set category from URL parameter on mount
  useEffect(() => {
    if (categoryFromUrl) {
      setActiveCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  // Get all treatments or filtered by category and search
  const displayedTreatments = useMemo(() => {
    let treatments: (Treatment & { categoryName: string })[] = [];
    
    if (activeCategory === 'all') {
      // Flatten all treatments from all categories
      treatments = categories.flatMap((cat: Category) => 
        cat.treatments.map((treatment: Treatment) => ({
          ...treatment,
          categoryName: cat.name
        }))
      );
    } else {
      const category = categories.find(
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
        treatment.description.toLowerCase().includes(query) ||
        treatment.categoryName.toLowerCase().includes(query)
      );
    }

    return treatments;
  }, [activeCategory, searchQuery, categories]);

  const activeCategoryData = categories.find(
    (cat: Category) => cat.slug === activeCategory
  );

  if (loading) {
    return (
      <MobileLayout>
        <Navbar />
        <main className="pt-20 min-h-screen bg-dark flex items-center justify-center">
          <div className="text-primary text-xl">Loading treatments...</div>
        </main>
        <Footer />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <Navbar />
      
      <main className="pt-20 min-h-screen bg-dark">
        {/* Hero Section */}
        <section className="py-20 px-5 text-center bg-gradient-to-br from-primary/10 to-dark/95 border-b border-primary/20">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-playfair text-5xl font-bold text-primary mb-5">
              Our Treatments
            </h1>
            <p className="text-xl text-white/70">
              Discover our comprehensive range of premium beauty treatments
            </p>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section className="py-6 px-5 bg-[#0f0f0f]/80 border-b border-primary/10 sticky top-[70px] z-50 backdrop-blur-md">
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
                        : categories.find((c: Category) => c.slug === activeCategory)?.name}
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
                    {categories.map((category: Category) => (
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
                    <span>{categories.find((c: Category) => c.slug === activeCategory)?.name}</span>
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
        <section className="py-20 px-5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-playfair text-4xl font-bold text-primary mb-4">
                {activeCategory === 'all' ? 'All Treatments' : activeCategoryData?.name}
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                {activeCategory === 'all' 
                  ? 'Explore our complete range of premium beauty treatments' 
                  : activeCategoryData?.description}
              </p>
              {displayedTreatments.length > 0 && (
                <p className="text-sm text-primary/80 mt-2">
                  {displayedTreatments.length} treatment{displayedTreatments.length > 1 ? 's' : ''} ditemukan
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
                    
                    {/* Duration & Price */}
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs bg-primary/15 text-primary px-2 py-1 rounded">
                        {treatment.duration} Menit
                      </span>
                      <span className="text-sm font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                        Rp {treatment.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                    
                    {/* Description */}
                    <p className="text-sm text-white/60 line-clamp-2">
                      {treatment.description}
                    </p>
                    
                    {/* Benefits */}
                    <div className="flex-1">
                      <ul className="text-xs text-white/50 space-y-1 max-h-20 overflow-hidden">
                        {treatment.benefits.map((benefit: string, index: number) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-primary mt-0.5">✓</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Read More Link */}
                    <Link 
                      href={`/treatments/${treatment.slug}`}
                      className="text-sm text-primary hover:text-primary-light transition-colors duration-300 flex items-center gap-1 group"
                    >
                      <span>Selengkapnya</span>
                      <svg 
                        width="14" 
                        height="14" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        className="group-hover:translate-x-1 transition-transform duration-300"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    
                    {/* Book Button */}
                    <Link
                      href={`/treatments/${treatment.slug}`}
                      className="mt-auto w-full bg-gradient-to-r from-primary to-primary-light text-dark py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
                    >
                      <span>Booking Sekarang</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
        <section className="py-20 px-5 bg-gradient-to-br from-primary/10 to-dark text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-playfair text-4xl font-bold text-primary mb-4">
              Ready to Start Your Beauty Journey?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Login dan booking treatment sekarang untuk dapatkan loyalty points dan komisi affiliate
            </p>
            <Link
              href="/sign-in"
              className="inline-block bg-gradient-to-r from-primary to-primary-light text-dark py-4 px-12 rounded-lg font-bold text-lg hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
            >
              Login untuk Booking
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </MobileLayout>
  );
}

export default function TreatmentsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    }>
      <TreatmentsContent />
    </Suspense>
  );
}
