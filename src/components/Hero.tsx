import React from 'react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-5 pt-20 overflow-hidden" id="about">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/drwprime_section_1.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Content */}
      <div className="relative z-20 max-w-4xl text-center">
        <h1 className="font-bold text-primary mb-10 leading-tight drop-shadow-2xl">
          <div className="font-playfair text-3xl md:text-4xl mb-2 drop-shadow-lg">The Art of</div>
          <div className="font-jakarta text-5xl md:text-7xl drop-shadow-lg">Timeless Beauty</div>
        </h1>
        <Link 
          href="/treatments" 
          className="inline-block bg-gradient-to-r from-primary to-primary-light text-dark px-10 py-4 rounded-lg font-bold text-sm tracking-wider hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
        >
          OUR TREATMENTS
        </Link>
      </div>
    </section>
  );
}
