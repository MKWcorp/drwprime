'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import treatmentsData from '@/data/treatments.json';
import Link from 'next/link';

interface Treatment {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  priceNumeric?: number;
  benefits: string[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  treatments: Treatment[];
}

export default function TreatmentDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [treatment, setTreatment] = useState<(Treatment & { categoryName: string }) | null>(null);

  useEffect(() => {
    // Find treatment by slug (id)
    let foundTreatment = null;
    let categoryName = '';

    for (const category of treatmentsData.categories as Category[]) {
      const found = category.treatments.find((t: Treatment) => t.id === slug);
      if (found) {
        foundTreatment = found;
        categoryName = category.name;
        break;
      }
    }

    if (foundTreatment) {
      setTreatment({ ...foundTreatment, categoryName });
    }
  }, [slug]);

  const handleWhatsAppBooking = (treatmentName: string) => {
    const message = encodeURIComponent(`Booking ${treatmentName}`);
    const whatsappUrl = `${(treatmentsData as any).contact.whatsapp.url}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!treatment) {
    return (
      <>
        <Navbar />
        <main className="pt-32 min-h-screen bg-dark px-5">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Treatment Not Found</h1>
            <Link 
              href="/treatments"
              className="inline-block bg-gradient-to-r from-primary to-primary-light text-dark px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
            >
              Back to Treatments
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className="pt-32 pb-20 min-h-screen bg-dark px-5">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm text-white/60">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/treatments" className="hover:text-primary transition-colors">Treatments</Link>
            <span>/</span>
            <span className="text-primary">{treatment.name}</span>
          </div>

          {/* Header */}
          <div className="mb-12">
            <div className="inline-block bg-primary/10 border border-primary/30 px-4 py-2 rounded-full text-primary text-sm font-semibold mb-4">
              {treatment.categoryName}
            </div>
            <h1 className="font-jakarta text-4xl md:text-5xl font-bold text-white mb-4">
              {treatment.name}
            </h1>
            <p className="text-xl text-white/70 leading-relaxed">
              {treatment.description}
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Duration Card */}
            <div className="bg-black/50 border border-primary/20 p-6 rounded-xl">
              <div className="text-sm text-white/60 mb-1">Durasi Treatment</div>
              <div className="text-2xl font-bold text-primary">{treatment.duration}</div>
            </div>

            {/* Price Card */}
            <div className="bg-black/50 border border-primary/20 p-6 rounded-xl">
              <div className="text-sm text-white/60 mb-1">Harga Treatment</div>
              <div className="text-2xl font-bold text-primary">{treatment.price}</div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-black/50 border border-primary/20 p-8 rounded-xl mb-12">
            <h2 className="text-2xl font-bold text-primary mb-6 font-jakarta">
              Manfaat Treatment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {treatment.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white/80 leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary/10 to-primary-light/10 border-2 border-primary/30 p-8 rounded-xl text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Tertarik dengan Treatment Ini?
            </h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Hubungi kami sekarang untuk booking treatment dan konsultasi gratis dengan tim profesional kami
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleWhatsAppBooking(treatment.name)}
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-primary-light text-dark px-8 py-4 rounded-lg font-bold text-base hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
              >
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>Booking Sekarang</span>
              </button>
              
              <Link 
                href="/treatments"
                className="inline-block bg-transparent border-2 border-primary/50 text-primary px-8 py-4 rounded-lg font-semibold hover:bg-primary/10 transition-all duration-300 text-center"
              >
                Lihat Treatment Lainnya
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
