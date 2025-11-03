'use client';

import { useState, useMemo } from 'react';
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

export default function TreatmentsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const handleWhatsAppBooking = (treatmentName: string) => {
    const message = encodeURIComponent(`Booking ${treatmentName}`);
    const whatsappUrl = `${treatmentsData.whatsapp.url}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  // Get all treatments or filtered by category
  const displayedTreatments = useMemo(() => {
    if (activeCategory === 'all') {
      // Flatten all treatments from all categories
      return treatmentsData.categories.flatMap((cat: Category) => 
        cat.treatments.map((treatment: Treatment) => ({
          ...treatment,
          categoryName: cat.name
        }))
      );
    }
    
    const category = treatmentsData.categories.find(
      (cat: Category) => cat.id === activeCategory
    );
    return category ? category.treatments.map((treatment: Treatment) => ({
      ...treatment,
      categoryName: category.name
    })) : [];
  }, [activeCategory]);

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

        {/* Category Navigation */}
        <section className="py-6 md:py-10 px-5 bg-[#0f0f0f]/80 border-b border-primary/10 sticky top-[70px] z-50 backdrop-blur-md">
          <div className="max-w-7xl mx-auto">
            {/* Desktop: Flex wrap center */}
            <div className="hidden md:flex gap-4 flex-wrap justify-center">
              <button
                className={`px-8 py-3 rounded-lg font-semibold text-sm tracking-wide uppercase transition-all duration-300 ${
                  activeCategory === 'all'
                    ? 'bg-gradient-to-r from-primary to-primary-light text-dark shadow-lg shadow-primary/40'
                    : 'bg-primary/10 border-2 border-primary/30 text-primary hover:bg-primary/20 hover:border-primary hover:-translate-y-0.5'
                }`}
                onClick={() => setActiveCategory('all')}
              >
                All Treatments
              </button>
              {treatmentsData.categories.map((category: Category) => (
                <button
                  key={category.id}
                  id={category.id}
                  className={`px-8 py-3 rounded-lg font-semibold text-sm tracking-wide uppercase transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-primary to-primary-light text-dark shadow-lg shadow-primary/40'
                      : 'bg-primary/10 border-2 border-primary/30 text-primary hover:bg-primary/20 hover:border-primary hover:-translate-y-0.5'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Mobile: Horizontal scroll */}
            <div className="md:hidden overflow-x-auto hide-scrollbar">
              <div className="flex gap-3 pb-2 min-w-max">
                <button
                  className={`px-6 py-2.5 rounded-lg font-semibold text-xs tracking-wide uppercase transition-all duration-300 whitespace-nowrap ${
                    activeCategory === 'all'
                      ? 'bg-gradient-to-r from-primary to-primary-light text-dark shadow-lg shadow-primary/40'
                      : 'bg-primary/10 border-2 border-primary/30 text-primary'
                  }`}
                  onClick={() => setActiveCategory('all')}
                >
                  All Treatments
                </button>
                {treatmentsData.categories.map((category: Category) => (
                  <button
                    key={category.id}
                    id={category.id}
                    className={`px-6 py-2.5 rounded-lg font-semibold text-xs tracking-wide uppercase transition-all duration-300 whitespace-nowrap ${
                      activeCategory === category.id
                        ? 'bg-gradient-to-r from-primary to-primary-light text-dark shadow-lg shadow-primary/40'
                        : 'bg-primary/10 border-2 border-primary/30 text-primary'
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
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
            </div>

            {/* Grid 3 kolom untuk web, 1 kolom untuk mobile */}
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
