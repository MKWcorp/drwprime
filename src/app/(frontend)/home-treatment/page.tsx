'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import MobileLayout from '@/components/MobileLayout';
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
  description: string;
  treatments: Treatment[];
}

const categoryImageMap: { [key: string]: string } = {
  'facial-basic': '/home-treatments/facial.jpeg',
  'facial-prime': '/home-treatments/facial.jpeg',
  'chemical-peeling': '/home-treatments/peeling.jpeg',
  'infusion': '/home-treatments/infuse-booster.png',
  'body-treatment': '/home-treatments/body-spa.jpeg',
  'hair-treatment': '/home-treatments/facial.jpeg',
  'hand-spa': '/home-treatments/body-spa.jpeg',
  'nail-treatment': '/home-treatments/nail-art.png',
  'eyelash-extension': '/home-treatments/eyelash-extension.jpeg',
  'menicure-pedicure': '/home-treatments/nail-art.png'
};

const HOME_TREATMENT_SLUGS = new Set([
  'facial-basic',
  'facial-prime',
  'chemical-peeling',
  'infusion',
  'body-treatment',
  'hair-treatment',
  'hand-spa',
  'nail-treatment',
  'eyelash-extension',
  'menicure-pedicure'
]);

// Hanya treatment ini yang ditampilkan di Home Treatment
const HOME_TREATMENT_ALLOWED_NAMES = new Set([
  'acne facial',
  'glow facial',
  'acne cure facial'
]);

function HomeTreatmentContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');

  // Map category name from URL to slug
  const categoryMap: { [key: string]: string } = {
    'Facial Basic': 'facial-basic',
    'Facial Prime': 'facial-prime',
    'Chemical Peeling': 'chemical-peeling',
    'Infusion': 'infusion',
    'Body Treatment': 'body-treatment',
    Hair: 'hair-treatment',
    'Hand Spa': 'hand-spa',
    'Nail Treatment': 'nail-treatment',
    'Eyelash Extension': 'eyelash-extension',
    'Menicure Pedicure': 'menicure-pedicure'
  };

  // Initialize activeCategory from URL or default to 'all'
  const initialCategory = categoryFromUrl 
    ? (categoryMap[categoryFromUrl] || categoryFromUrl.toLowerCase().replace(/ /g, '-'))
    : 'all';

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const response = await fetch('/api/treatments');
        if (!response.ok) {
          throw new Error('Failed to fetch treatments');
        }

        const data = await response.json();
        setCategories(
          (data.categories as Category[])
            .filter((category) => HOME_TREATMENT_SLUGS.has(category.slug))
            .map((category) => ({
              ...category,
              treatments: category.treatments.filter((treatment) =>
                HOME_TREATMENT_ALLOWED_NAMES.has(treatment.name.trim().toLowerCase())
              ),
            }))
            .filter((category) => category.treatments.length > 0)
        );
      } catch (error) {
        console.error('Error fetching home treatments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatments();
  }, []);

  // Update activeCategory when URL changes
  useEffect(() => {
    if (categoryFromUrl) {
      const slug = categoryMap[categoryFromUrl] || categoryFromUrl.toLowerCase().replace(/ /g, '-');
      setActiveCategory(slug);
    } else {
      setActiveCategory('all');
    }
  }, [categoryFromUrl]);

  // Get all treatments or filtered by category and search
  const displayedTreatments = useMemo(() => {
    let treatments: (Treatment & { categoryName: string; categorySlug: string })[] = [];

    if (activeCategory === 'all') {
      // Flatten all treatments from all categories
      treatments = categories.flatMap((cat: Category) => 
        cat.treatments.map((treatment: Treatment) => ({
          ...treatment,
          categoryName: cat.name,
          categorySlug: cat.slug,
        }))
      );
    } else {
      const category = categories.find(
        (cat: Category) => cat.slug === activeCategory
      );
      treatments = category ? category.treatments.map((treatment: Treatment) => ({
        ...treatment,
        categoryName: category.name,
        categorySlug: category.slug,
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
  }, [activeCategory, searchQuery, categories]);

  const activeCategoryData = categories.find(
    (cat: Category) => cat.slug === activeCategory
  );

  if (loading) {
    return (
      <MobileLayout>
        <Navbar />
        <main className="pt-20 min-h-screen bg-dark flex items-center justify-center">
          <div className="text-primary text-xl">Loading home treatments...</div>
        </main>
        <Footer />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <Navbar />
      
      <main className="pt-20 min-h-screen relative overflow-hidden bg-gradient-to-b from-[#1a120b] via-[#0d0a07] to-black">
        {/* Ambient spa glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-amber-400/15 blur-3xl"></div>
          <div className="absolute top-1/3 -left-24 w-72 h-72 rounded-full bg-rose-400/10 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"></div>
        </div>

        {/* Hero Section - text only on mobile, image on desktop */}
        <div className="md:hidden relative z-10 px-4 pt-8 pb-4 text-center">
          <p className="text-primary/70 text-[11px] tracking-[0.3em] uppercase mb-2">Luxury Home Spa</p>
          <h1 className="font-playfair text-4xl font-bold text-white leading-tight">
            Prime <span className="text-primary italic">at Home</span>
          </h1>
          <div className="w-12 h-px bg-primary/50 mx-auto my-3"></div>
          <p className="text-white/60 text-sm max-w-xs mx-auto">
            Perawatan premium ala klinik, langsung di kenyamanan rumah Anda.
          </p>
        </div>
        <section className="relative z-10 hidden md:flex items-center justify-center md:py-24 overflow-hidden">
          <div className="relative z-10 text-center px-4">
            <p className="text-primary/80 text-sm tracking-[0.4em] uppercase mb-4">Luxury Home Spa</p>
            <h1 className="font-playfair text-6xl lg:text-7xl font-bold text-white drop-shadow-lg">
              Prime <span className="text-primary italic">at Home</span>
            </h1>
            <div className="w-20 h-px bg-primary/60 mx-auto my-5"></div>
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              Perawatan premium ala klinik, langsung di kenyamanan rumah Anda.
            </p>
          </div>
        </section>

        {/* Search & Filter Section */}
        <section className="relative z-20 py-3 px-4 md:py-6 md:px-5 bg-[#140d07]/85 border-b border-primary/15 sticky top-[60px] md:top-[70px] backdrop-blur-md">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Cari treatment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/50 border-2 border-primary/30 text-white placeholder-white/40 px-4 py-2.5 md:px-5 md:py-3.5 rounded-lg focus:outline-none focus:border-primary transition-all duration-300 pr-10 md:pr-12 text-sm md:text-base"
                />
                <svg 
                  className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-primary/60"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Category Dropdown */}
              <div className="relative md:min-w-[200px]">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="w-full bg-primary/10 border-2 border-primary/30 text-primary px-4 py-2.5 md:px-5 md:py-3.5 rounded-lg font-semibold text-sm flex items-center justify-between hover:bg-primary/20 hover:border-primary transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span className="truncate">
                      {activeCategory === 'all' 
                        ? 'Semua Kategori' 
                        : categories.find((c: Category) => c.slug === activeCategory)?.name}
                    </span>
                  </span>
                  <svg 
                    className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`}
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
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-primary/20 transition-colors duration-200 ${
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
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-primary/20 transition-colors duration-200 border-t border-primary/10 ${
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
              <div className="flex flex-wrap gap-2 mt-3">
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 bg-primary/20 border border-primary/40 text-primary px-2.5 py-1 rounded-full text-xs md:text-sm">
                    <span>&quot;{searchQuery}&quot;</span>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="hover:text-white transition-colors"
                    >
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {activeCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 bg-primary/20 border border-primary/40 text-primary px-2.5 py-1 rounded-full text-xs md:text-sm">
                    <span>{categories.find((c: Category) => c.slug === activeCategory)?.name}</span>
                    <button 
                      onClick={() => setActiveCategory('all')}
                      className="hover:text-white transition-colors"
                    >
                      <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <section className="relative z-10 py-8 px-4 md:py-20 md:px-5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="font-playfair text-2xl md:text-4xl font-bold text-primary mb-3 md:mb-4">
                {activeCategory === 'all' ? 'All Home Treatments' : activeCategoryData?.name}
              </h2>
              <p className="text-sm md:text-lg text-white/70 max-w-2xl mx-auto">
                {activeCategory === 'all' 
                  ? 'Pilih treatment favorit Anda untuk layanan di rumah' 
                  : `Layanan ${activeCategoryData?.name} profesional di rumah Anda`}
              </p>
              {displayedTreatments.length > 0 && (
                <p className="text-xs md:text-sm text-primary/80 mt-2">
                  {displayedTreatments.length} treatment{displayedTreatments.length > 1 ? 's' : ''} tersedia
                </p>
              )}
            </div>

            {/* No Results Message */}
            {displayedTreatments.length === 0 && (
              <div className="text-center py-10 md:py-20">
                <svg className="w-14 h-14 md:w-20 md:h-20 text-primary/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg md:text-2xl font-bold text-white/80 mb-2">Tidak ada treatment ditemukan</h3>
                <p className="text-sm text-white/60 mb-6">Coba ubah kata kunci atau kategori pencarian Anda</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="inline-flex items-center gap-2 bg-primary/20 border border-primary text-primary px-5 py-2.5 md:px-6 md:py-3 rounded-lg font-semibold text-sm hover:bg-primary/30 transition-all duration-300"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset Filter
                </button>
              </div>
            )}

            {/* Grid 2 kolom mobile, 3 kolom desktop */}
            {displayedTreatments.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 max-w-4xl mx-auto">
              {displayedTreatments.map((treatment: Treatment & { categoryName?: string; categorySlug?: string }) => (
                <div 
                  key={treatment.id} 
                  className="group bg-white/[0.04] backdrop-blur-sm border border-primary/15 rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-1.5 flex flex-col"
                >
                  {/* Image terpotong di atas */}
                  <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden flex-shrink-0">
                    <Image
                      src={categoryImageMap[treatment.categorySlug ?? activeCategory] ?? '/home-treatments/facial.jpeg'}
                      alt={treatment.categoryName ?? treatment.name}
                      fill
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    {/* Category Badge overlay */}
                    {activeCategory === 'all' && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 pt-5 pb-1.5">
                        <span className="text-primary text-[10px] md:text-xs font-semibold leading-tight line-clamp-1">
                          {treatment.categoryName}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3 md:p-5 flex flex-col gap-2 md:gap-3 flex-1">
                    {/* Treatment Name */}
                    <h3 className="font-playfair text-xs md:text-lg font-bold text-white leading-tight line-clamp-2">
                      {treatment.name}
                    </h3>
                    
                    {/* Price */}
                    <div className="flex items-center">
                      <span className="text-[11px] md:text-sm font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                        Rp {treatment.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                    
                    {/* Book Button */}
                    <Link
                      href={`https://wa.me/6281138800071?text=Halo%2C%20saya%20ingin%20booking%20Home%20Treatment%20${encodeURIComponent(treatment.name)}`}
                      target="_blank"
                      className="mt-auto w-full bg-gradient-to-r from-primary to-primary-light text-dark py-2 md:py-3 px-2 md:px-4 rounded-lg font-semibold text-[10px] md:text-sm flex items-center justify-center gap-1 md:gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
                    >
                      <span className="hidden md:inline">Booking via WhatsApp</span>
                      <span className="md:hidden">Booking</span>
                      <svg className="w-3 h-3 md:w-5 md:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
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
        <section className="relative z-10 py-10 px-4 md:py-20 md:px-5 bg-gradient-to-br from-primary/10 to-dark text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-playfair text-2xl md:text-4xl font-bold text-primary mb-3 md:mb-4">
              Siap Merasakan Layanan Premium di Rumah?
            </h2>
            <p className="text-sm md:text-lg text-white/70 mb-6 md:mb-8">
              Hubungi kami via WhatsApp untuk booking Home Treatment sekarang
            </p>
            <Link
              href="https://wa.me/6281138800071?text=Halo%2C%20saya%20ingin%20booking%20Home%20Treatment"
              target="_blank"
              className="inline-block bg-gradient-to-r from-primary to-primary-light text-dark py-3 md:py-4 px-8 md:px-12 rounded-lg font-bold text-base md:text-lg hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
            >
              Booking via WhatsApp
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </MobileLayout>
  );
}

export default function HomeTreatmentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    }>
      <HomeTreatmentContent />
    </Suspense>
  );
}
