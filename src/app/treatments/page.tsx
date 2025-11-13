'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import treatmentsData from '@/data/treatments.json';

interface Treatment {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  benefits: string[];
}

interface Category {
  id: string;
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

  // Set category from URL parameter on mount
  useEffect(() => {
    if (categoryFromUrl) {
      setActiveCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  const handleWhatsAppBooking = (treatmentName: string) => {
    const message = encodeURIComponent(`Booking ${treatmentName}`);
    const contactData = treatmentsData.contact as { whatsapp: { url: string } };
    const whatsappUrl = `${contactData.whatsapp.url}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  // Get all treatments or filtered by category and search
  const displayedTreatments = useMemo(() => {
    let treatments: (Treatment & { categoryName: string })[] = [];
    
    if (activeCategory === 'all') {
      // Flatten all treatments from all categories
      treatments = treatmentsData.categories.flatMap((cat: Category) => 
        cat.treatments.map((treatment: Treatment) => ({
          ...treatment,
          categoryName: cat.name
        }))
      );
    } else {
      const category = treatmentsData.categories.find(
        (cat: Category) => cat.id === activeCategory
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
  }, [activeCategory, searchQuery]);

  const activeCategoryData = treatmentsData.categories.find(
    (cat: Category) => cat.id === activeCategory
  );

  return (
    <>
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
                        : treatmentsData.categories.find((c: Category) => c.id === activeCategory)?.name}
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
                    {treatmentsData.categories.map((category: Category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setActiveCategory(category.id);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-5 py-3 hover:bg-primary/20 transition-colors duration-200 border-t border-primary/10 ${
                          activeCategory === category.id ? 'bg-primary/10 text-primary font-semibold' : 'text-white/80'
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
                    <span>{treatmentsData.categories.find((c: Category) => c.id === activeCategory)?.name}</span>
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
                        {treatment.duration}
                      </span>
                      <span className="text-sm font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                        {treatment.price}
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
                      href={`/treatments/${treatment.id}`}
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
                    
                    {/* WhatsApp Button */}
                    <button
                      className="mt-auto w-full bg-gradient-to-r from-primary to-primary-light text-dark py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
                      onClick={() => handleWhatsAppBooking(treatment.name)}
                    >
                      <span>Book via WhatsApp</span>
                      <svg 
                        width="18" 
                        height="18" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </button>
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
              Contact us now to schedule your consultation and discover the perfect treatment for you
            </p>
            <button
              className="bg-gradient-to-r from-primary to-primary-light text-dark py-4 px-12 rounded-lg font-bold text-lg hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
              onClick={() => handleWhatsAppBooking('Konsultasi Gratis')}
            >
              Book Free Consultation
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
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
