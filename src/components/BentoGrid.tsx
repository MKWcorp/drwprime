import Image from 'next/image';
import Link from 'next/link';

export default function BentoGrid() {
  return (
    <section className="py-20 px-5 bg-black">
      <div className="max-w-full mx-auto px-0 md:px-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-4">
            Explore Our Premium Treatments
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Discover our range of advanced aesthetic treatments designed to enhance your natural beauty
          </p>
        </div>

        {/* Bento Grid Layout - Full Width */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3">
          
          {/* Large Feature - HIFU Ultraformer MPT (Spans 6 columns, 2 rows) */}
          <Link 
            href="/treatments?category=hifu-ultraformer-mpt" 
            className="md:col-span-6 md:row-span-2 group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20"
          >
            <div className="relative h-[400px] md:h-full min-h-[500px] p-8 flex flex-col justify-between">
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/ultraformermpt/ultraformermpt-alat.png"
                  alt="HIFU Ultraformer MPT"
                  fill
                  className="object-cover object-top opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="inline-block bg-primary/20 border border-primary px-4 py-2 rounded-full mb-4">
                  <span className="text-primary text-sm font-semibold">FEATURED TREATMENT</span>
                </div>
              </div>

              <div className="relative z-10">
                <div className="mb-4">
                  <Image
                    src="/ultraformermpt/ultraformermpt-logo.png"
                    alt="Ultraformer MPT Logo"
                    width={200}
                    height={60}
                    className="mb-4 brightness-0 invert"
                  />
                </div>
                <h3 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-3">
                  HIFU Ultraformer MPT
                </h3>
                <p className="text-white/80 text-base md:text-lg mb-6 max-w-xl">
                  Advanced HIFU technology for non-invasive skin tightening and facial rejuvenation. Experience natural lifting without surgery.
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
            className="md:col-span-3 group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="relative h-[200px] md:h-full p-6 flex flex-col justify-end">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/drwprime-facial-room-3.png"
                  alt="Facial Basic"
                  fill
                  className="object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
              </div>

              <div className="relative z-10">
                <h3 className="font-playfair text-xl font-bold text-white mb-2">
                  Facial Basic
                </h3>
                <p className="text-white/70 text-sm mb-3">
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
            className="md:col-span-3 group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="relative h-[200px] md:h-full p-6 flex flex-col justify-end">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/drwprime-facial-room.png"
                  alt="Facial Prime"
                  fill
                  className="object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
              </div>

              <div className="relative z-10">
                <h3 className="font-playfair text-xl font-bold text-white mb-2">
                  Facial Prime
                </h3>
                <p className="text-white/70 text-sm mb-3">
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
            className="md:col-span-3 group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="relative h-[200px] p-6 flex flex-col justify-end">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/drwprime-facial-room-2.png"
                  alt="Chemical Peeling"
                  fill
                  className="object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
              </div>

              <div className="relative z-10">
                <h3 className="font-playfair text-xl font-bold text-white mb-2">
                  Chemical Peeling
                </h3>
                <p className="text-white/70 text-sm mb-3">
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

          {/* Laser Treatment */}
          <Link
            href="/treatments?category=ipl"
            className="md:col-span-3 group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="relative h-[200px] p-6 flex flex-col justify-end">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/drwprime-laser-room.png"
                  alt="IPL Treatment"
                  fill
                  className="object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
              </div>

              <div className="relative z-10">
                <h3 className="font-playfair text-xl font-bold text-white mb-2">
                  IPL (Intense Pulsed Light)
                </h3>
                <p className="text-white/70 text-sm mb-3">
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

          {/* Body Contouring */}
          <Link
            href="/treatments?category=dermapen-epn"
            className="md:col-span-3 group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="relative h-[200px] p-6 flex flex-col justify-end">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/drwprime-contouring-room.png"
                  alt="Dermapen EPN"
                  fill
                  className="object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
              </div>

              <div className="relative z-10">
                <h3 className="font-playfair text-xl font-bold text-white mb-2">
                  Dermapen EPN
                </h3>
                <p className="text-white/70 text-sm mb-3">
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

          {/* Aesthetic Injection */}
          <Link
            href="/treatments?category=injection"
            className="md:col-span-3 group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="relative h-[200px] p-6 flex flex-col justify-end">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/drwprime-doctor-room.png"
                  alt="Injection Treatment"
                  fill
                  className="object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
              </div>

              <div className="relative z-10">
                <h3 className="font-playfair text-xl font-bold text-white mb-2">
                  Injection Treatment
                </h3>
                <p className="text-white/70 text-sm mb-3">
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

          {/* Facial Male Treatment */}
          <Link
            href="/treatments?category=botox"
            className="md:col-span-6 group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
          >
            <div className="relative h-[200px] p-6 flex flex-col justify-end">
              <div className="absolute inset-0 z-0">
                <Image
                  src="/drwprime-facial-male-room.png"
                  alt="Botox Treatment"
                  fill
                  className="object-cover opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
              </div>

              <div className="relative z-10">
                <h3 className="font-playfair text-xl font-bold text-white mb-2">
                  Botox
                </h3>
                <p className="text-white/70 text-sm mb-3">
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

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Link
            href="/treatments"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-primary-light text-dark px-8 py-4 rounded-lg font-bold text-base hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
          >
            <span>View All Treatments</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
