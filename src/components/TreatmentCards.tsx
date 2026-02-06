'use client';

import Link from "next/link";

export default function TreatmentCards() {
  const treatments = [
    {
      id: 1,
      title: "Treatment Wajah",
      description: "Perawatan kulit wajah",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: "/treatments?category=facial",
    },
    {
      id: 2,
      title: "Treatment Tubuh",
      description: "Perawatan tubuh & spa",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      href: "/treatments?category=body",
    },
    {
      id: 3,
      title: "Home Treatment",
      description: "Treatment di rumah",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      href: "/home-treatment",
    },
    {
      id: 4,
      title: "Konsultasi Dokter",
      description: "Konsultasi gratis",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      href: "#contact",
    },
  ];

  return (
    <div className="lg:hidden px-4 py-6 bg-black">
      {/* Greeting Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">
          Selamat Datang 👋
        </h2>
        <p className="text-sm text-gray-400">
          Mau treatment apa hari ini?
        </p>
      </div>

      {/* Treatment Cards */}
      <div className="bg-gradient-to-br from-black via-gray-900 to-black rounded-2xl p-4 space-y-3 border border-primary/20">
        {treatments.map((treatment) => (
          <Link
            key={treatment.id}
            href={treatment.href}
            className="flex items-center gap-4 bg-black/60 backdrop-blur-sm p-4 rounded-xl border border-primary/20 hover:border-primary/50 hover:bg-black/80 transition-all duration-300 group"
          >
            {/* Icon */}
            <div className="bg-primary/10 text-primary p-3 rounded-full flex-shrink-0 border border-primary/30 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
              {treatment.icon}
            </div>

            {/* Text */}
            <div className="flex-1">
              <h3 className="text-white font-semibold text-base group-hover:text-primary transition-colors">
                {treatment.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {treatment.description}
              </p>
            </div>

            {/* Arrow */}
            <svg 
              className="w-5 h-5 text-primary/50 group-hover:text-primary group-hover:translate-x-1 transition-all" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
