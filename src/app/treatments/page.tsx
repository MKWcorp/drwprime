'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import treatmentsData from '@/data/treatments.json';

interface Treatment {
  id: string;
  name: string;
  description: string;
  duration: string;
  benefits: string[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  treatments: Treatment[];
}

export default function TreatmentsPage() {
  const [activeCategory, setActiveCategory] = useState<string>(treatmentsData.categories[0]?.id || '');

  const handleWhatsAppBooking = (treatmentName: string) => {
    const message = encodeURIComponent(`Saya ingin booking untuk perawatan ini: ${treatmentName}`);
    const whatsappUrl = `${treatmentsData.whatsapp.url}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const activeData = treatmentsData.categories.find(
    (cat: Category) => cat.id === activeCategory
  ) || treatmentsData.categories[0];

  return (
    <>
      <Navbar />
      
      <main className="treatments-page">
        {/* Hero Section */}
        <section className="treatments-hero">
          <div className="container">
            <h1 className="section-title" style={{ color: '#d4af37', marginBottom: '20px' }}>
              Our Treatments
            </h1>
            <p className="section-subtitle">
              Discover our comprehensive range of premium beauty treatments
            </p>
          </div>
        </section>

        {/* Category Navigation */}
        <section className="category-navigation">
          <div className="container">
            <div className="category-buttons">
              {treatmentsData.categories.map((category: Category) => (
                <button
                  key={category.id}
                  className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Treatments Grid */}
        <section className="treatments-section">
          <div className="container">
            <div className="category-header">
              <h2 className="category-title">{activeData.name}</h2>
              <p className="category-description">{activeData.description}</p>
            </div>

            <div className="treatments-grid">
              {activeData.treatments.map((treatment: Treatment) => (
                <div key={treatment.id} className="treatment-card-detailed">
                  <div className="treatment-header">
                    <h3 className="treatment-name">{treatment.name}</h3>
                    <span className="treatment-duration">{treatment.duration}</span>
                  </div>
                  
                  <p className="treatment-description">{treatment.description}</p>
                  
                  <div className="treatment-benefits">
                    <h4>Benefits:</h4>
                    <ul>
                      {treatment.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <button
                    className="btn-book"
                    onClick={() => handleWhatsAppBooking(treatment.name)}
                  >
                    <span>Book via WhatsApp</span>
                    <svg 
                      width="20" 
                      height="20" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="treatments-cta">
          <div className="container">
            <h2 className="cta-title">Ready to Start Your Beauty Journey?</h2>
            <p className="cta-subtitle">
              Contact us now to schedule your consultation and discover the perfect treatment for you
            </p>
            <button
              className="btn-cta"
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
