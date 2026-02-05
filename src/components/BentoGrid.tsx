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

        {/* Grid Layout - 4 columns dengan foto penuh */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          
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
