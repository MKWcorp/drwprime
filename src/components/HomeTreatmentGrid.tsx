import Image from 'next/image';
import Link from 'next/link';

export default function HomeTreatmentGrid() {
  return (
    <section className="py-20 px-5 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-4">
            Home Treatment Services
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Experience premium beauty treatments in the comfort of your home
          </p>
        </div>

        {/* Grid Layout - 4 columns uniform */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          
          {/* Body Spa */}
          <Link 
            href="/home-treatment?category=Body%20Treatment" 
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="relative aspect-[4/5] p-5 flex flex-col justify-between">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/home-treatments/body-spa.jpeg"
                  alt="Body Spa"
                  fill
                  className="object-cover object-center opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="relative z-10"></div>
              <div className="relative z-10 bg-black/60 backdrop-blur-md rounded-xl p-4">
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-white mb-2">
                  Body Spa
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Relaxing spa treatment for body wellness
                </p>
                <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                  <span>Explore</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Eyelash Extension */}
          <Link
            href="/home-treatment"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="relative aspect-[4/5] p-5 flex flex-col justify-between">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/home-treatments/eyelash-extension.jpeg"
                  alt="Eyelash Extension"
                  fill
                  className="object-cover object-center opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="relative z-10"></div>
              <div className="relative z-10 bg-black/60 backdrop-blur-md rounded-xl p-4">
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-white mb-2">
                  Eyelash Extension
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Beautiful lash extensions at home
                </p>
                <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                  <span>Explore</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Facial */}
          <Link
            href="/home-treatment?category=Facial%20Basic"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="relative aspect-[4/5] p-5 flex flex-col justify-between">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/home-treatments/facial.jpeg"
                  alt="Facial Treatment"
                  fill
                  className="object-cover object-center opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="relative z-10"></div>
              <div className="relative z-10 bg-black/60 backdrop-blur-md rounded-xl p-4">
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-white mb-2">
                  Facial Treatment
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Professional facial care at your home
                </p>
                <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                  <span>Explore</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Hot Stone */}
          <Link
            href="/home-treatment?category=Body%20Treatment"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="relative aspect-[4/5] p-5 flex flex-col justify-between">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/home-treatments/hot-stone.jpeg"
                  alt="Hot Stone Massage"
                  fill
                  className="object-cover object-center opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="relative z-10"></div>
              <div className="relative z-10 bg-black/60 backdrop-blur-md rounded-xl p-4">
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-white mb-2">
                  Hot Stone Massage
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Therapeutic hot stone therapy
                </p>
                <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                  <span>Explore</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Infuse Booster */}
          <Link
            href="/home-treatment?category=Infusion"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="relative aspect-[4/5] p-5 flex flex-col justify-between">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/home-treatments/infuse-booster.png"
                  alt="Infuse Booster"
                  fill
                  className="object-cover object-center opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="relative z-10"></div>
              <div className="relative z-10 bg-black/60 backdrop-blur-md rounded-xl p-4">
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-white mb-2">
                  Infuse Booster
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Vitamin infusion for skin rejuvenation
                </p>
                <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                  <span>Explore</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Javanese Massage */}
          <Link
            href="/home-treatment?category=Body%20Treatment"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="relative aspect-[4/5] p-5 flex flex-col justify-between">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/home-treatments/javanese-massage.jpeg"
                  alt="Javanese Massage"
                  fill
                  className="object-cover object-center opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="relative z-10"></div>
              <div className="relative z-10 bg-black/60 backdrop-blur-md rounded-xl p-4">
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-white mb-2">
                  Javanese Massage
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Traditional massage for relaxation
                </p>
                <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                  <span>Explore</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Lymphatic */}
          <Link
            href="/home-treatment?category=Body%20Treatment"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="relative aspect-[4/5] p-5 flex flex-col justify-between">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/home-treatments/lymphatic.png"
                  alt="Lymphatic Drainage"
                  fill
                  className="object-cover object-center opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="relative z-10"></div>
              <div className="relative z-10 bg-black/60 backdrop-blur-md rounded-xl p-4">
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-white mb-2">
                  Lymphatic Drainage
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Detoxifying lymphatic massage
                </p>
                <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                  <span>Explore</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Manicure Pedicure */}
          <Link
            href="/home-treatment?category=Nail%20Treatment"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="relative aspect-[4/5] p-5 flex flex-col justify-between">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/home-treatments/manicure-pedicure.png"
                  alt="Manicure Pedicure"
                  fill
                  className="object-cover object-center opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="relative z-10"></div>
              <div className="relative z-10 bg-black/60 backdrop-blur-md rounded-xl p-4">
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-white mb-2">
                  Manicure & Pedicure
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Complete nail care service
                </p>
                <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                  <span>Explore</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Nail Art */}
          <Link
            href="/home-treatment?category=Nail%20Treatment"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="relative aspect-[4/5] p-5 flex flex-col justify-between">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/home-treatments/nail-art.png"
                  alt="Nail Art"
                  fill
                  className="object-cover object-center opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="relative z-10"></div>
              <div className="relative z-10 bg-black/60 backdrop-blur-md rounded-xl p-4">
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-white mb-2">
                  Nail Art
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Creative nail designs at home
                </p>
                <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                  <span>Explore</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Chemical Peeling */}
          <Link
            href="/home-treatment?category=Chemical%20Peeling"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="relative aspect-[4/5] p-5 flex flex-col justify-between">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/home-treatments/peeling.jpeg"
                  alt="Chemical Peeling"
                  fill
                  className="object-cover object-center opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="relative z-10"></div>
              <div className="relative z-10 bg-black/60 backdrop-blur-md rounded-xl p-4">
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-white mb-2">
                  Chemical Peeling
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Skin renewal treatment at home
                </p>
                <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                  <span>Explore</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
