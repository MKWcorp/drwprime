import Image from 'next/image';
import Link from 'next/link';

export default function BentoGrid() {
  return (
    <section className="py-20 px-5 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-4">
            Explore Our Premium Treatments
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Discover our range of advanced aesthetic treatments designed to enhance your natural beauty
          </p>
        </div>

        {/* Grid Layout - 4 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          
          {/* HIFU Ultraformer MPT - Featured (2 columns) */}
          <Link 
            href="/treatments?category=hifu-ultraformer-mpt" 
            className="lg:col-span-2 group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20"
          >
            <div className="relative aspect-[2/3] p-6 flex flex-col justify-between">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/treatments/hifu.png"
                  alt="HIFU Ultraformer MPT"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-all duration-700"
                />
              </div>

              <div className="relative z-10">
                <div className="inline-block bg-primary/20 backdrop-blur-sm border border-primary px-4 py-2 rounded-full mb-4">
                  <span className="text-primary text-sm font-semibold">FEATURED TREATMENT</span>
                </div>
              </div>

              <div className="relative z-10 bg-black/60 backdrop-blur-md rounded-xl p-4">
                <div className="mb-4">
                  <Image
                    src="/ultraformermpt/ultraformermpt-logo.png"
                    alt="Ultraformer MPT Logo"
                    width={180}
                    height={54}
                    className="mb-4 brightness-0 invert"
                  />
                </div>
                <h3 className="font-playfair text-2xl md:text-3xl font-bold text-primary mb-3">
                  HIFU Ultraformer MPT
                </h3>
                <p className="text-white/80 text-sm md:text-base mb-6">
                  Advanced HIFU technology for non-invasive skin tightening and facial rejuvenation.
                </p>
                <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-4 transition-all duration-300">
                  <span>Discover More</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Facial Basic */}
          <Link
            href="/treatments?category=facial-basic"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="relative aspect-[3/4] p-5 flex flex-col justify-end">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/treatments/facial-basic.jpeg"
                  alt="Facial Basic"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="relative z-10 bg-black/60 backdrop-blur-md rounded-xl p-4">
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-white mb-2">
                  Facial Basic
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Essential facial care for all skin types
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

          {/* Facial Prime */}
          <Link
            href="/treatments?category=facial-prime"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="relative aspect-[3/4] p-5 flex flex-col justify-end">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/treatments/facial-prime.jpeg"
                  alt="Facial Prime"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="relative z-10 bg-black/60 backdrop-blur-md rounded-xl p-4">
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-white mb-2">
                  Facial Prime
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Premium facial with specialized serums
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
            href="/treatments?category=chemical-peeling"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="relative aspect-[3/4] p-5 flex flex-col justify-end">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/treatments/chemical-peeling.png"
                  alt="Chemical Peeling"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="relative z-10 bg-black/60 backdrop-blur-md rounded-xl p-4">
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-white mb-2">
                  Chemical Peeling
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Medical peeling for skin regeneration
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

          {/* IPL */}
          <Link
            href="/treatments?category=ipl"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="relative aspect-[3/4] p-5 flex flex-col justify-end">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/treatments/ipl.jpeg"
                  alt="IPL"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="relative z-10 bg-black/60 backdrop-blur-md rounded-xl p-4">
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-white mb-2">
                  IPL (Intense Pulsed Light)
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Advanced light therapy for various skin concerns
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

          {/* Dermapen EPN */}
          <Link
            href="/treatments?category=dermapen-epn"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="relative aspect-[3/4] p-5 flex flex-col justify-end">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/treatments/dermapen.png"
                  alt="Dermapen EPN"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="relative z-10 bg-black/60 backdrop-blur-md rounded-xl p-4">
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-white mb-2">
                  Dermapen EPN
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Microneedling for skin rejuvenation
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

          {/* Injection Treatment */}
          <Link
            href="/treatments?category=injection"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="relative aspect-[3/4] p-5 flex flex-col justify-end">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/treatments/injection.png"
                  alt="Injection Treatment"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="relative z-10 bg-black/60 backdrop-blur-md rounded-xl p-4">
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-white mb-2">
                  Injection Treatment
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Advanced injection therapies
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

          {/* Botox */}
          <Link
            href="/treatments?category=botox"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="relative aspect-[3/4] p-5 flex flex-col justify-end">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/treatments/botox.jpeg"
                  alt="Botox"
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="relative z-10 bg-black/60 backdrop-blur-md rounded-xl p-4">
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-white mb-2">
                  Botox
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Anti-aging wrinkle reduction treatment
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
