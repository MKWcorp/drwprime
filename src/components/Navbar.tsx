import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-md z-50 border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-5 flex justify-between items-center py-4">
        <Link href="/">
          <Image 
            src="/drwprime-logo.png" 
            alt="DRW Prime Logo" 
            width={150}
            height={40}
            className="h-10 w-auto"
          />
        </Link>
        <ul className="flex gap-8 items-center">
          <li>
            <Link 
              href="/#about" 
              className="text-white hover:text-primary transition-colors duration-300 text-sm font-medium tracking-wide"
            >
              TENTANG KAMI
            </Link>
          </li>
          <li>
            <Link 
              href="/treatments" 
              className="text-white hover:text-primary transition-colors duration-300 text-sm font-medium tracking-wide"
            >
              TREATMENT
            </Link>
          </li>
          <li>
            <Link 
              href="/#gallery" 
              className="text-white hover:text-primary transition-colors duration-300 text-sm font-medium tracking-wide"
            >
              GALERI
            </Link>
          </li>
          <li>
            <Link 
              href="/#contact" 
              className="text-white hover:text-primary transition-colors duration-300 text-sm font-medium tracking-wide"
            >
              KONTAK
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
