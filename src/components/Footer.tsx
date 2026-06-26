import Image from 'next/image';

const SOCIALS = [
  {
    label: '@drwprime',
    href: 'https://www.instagram.com/drwprime',
    name: 'Instagram',
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'drw.prime',
    href: 'https://www.tiktok.com/@drw.prime',
    name: 'TikTok',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-1.84-2.48V9.66a5.69 5.69 0 1 0 4.94 5.64V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.28 4.28 0 0 1-3.25-1.48Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-black/50 border-t border-primary/20 py-14">
      <div className="max-w-7xl mx-auto px-5 flex flex-col items-center text-center">
        <Image
          src="/drwprime-logo.png"
          alt="DRW Prime Logo"
          width={180}
          height={60}
          className="mb-5 h-12 w-auto"
        />

        <p className="text-white/70 text-sm max-w-md mb-7">
          Menghadirkan &apos;The Art of Timeless Beauty&apos; untuk wanita Indonesia
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {SOCIALS.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${s.name} ${s.label}`}
              className="group inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-white/[0.03] px-5 py-2.5 text-sm text-white/80 transition-all duration-300 hover:border-primary/60 hover:bg-primary/10 hover:text-primary"
            >
              <span className="text-primary/80 transition-colors group-hover:text-primary">
                {s.icon}
              </span>
              <span className="font-medium tracking-wide">{s.label}</span>
            </a>
          ))}
        </div>

        <div className="w-full max-w-xs border-t border-white/10 pt-6">
          <p className="text-white/40 text-xs tracking-wide">
            &copy; 2025 DRW Prime. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
