import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-black/50 border-t border-primary/20 py-12">
      <div className="max-w-7xl mx-auto px-5 text-center">
        <Image 
          src="/drwprime-logo.png" 
          alt="DRW Prime Logo" 
          width={180} 
          height={60} 
          className="mx-auto mb-6 h-12 w-auto"
        />
        <p className="text-white/70 text-sm mb-2">
          Menghadirkan &apos;The Art of Timeless Beauty&apos; untuk wanita Indonesia
        </p>
        <p className="text-white/50 text-xs">
          &copy; 2025 DRW Prime. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
