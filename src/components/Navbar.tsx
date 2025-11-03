import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/">
          <Image 
            src="/drwprime-logo.png" 
            alt="DRW Prime Logo" 
            className="nav-logo"
            width={150}
            height={50}
            style={{ width: 'auto', height: '40px', maxWidth: '150px' }}
          />
        </Link>
        <ul className="nav-menu">
          <li><Link href="/#about">TENTANG KAMI</Link></li>
          <li><Link href="/treatments">TREATMENT</Link></li>
          <li><Link href="/#gallery">GALERI</Link></li>
          <li><Link href="/#contact">KONTAK</Link></li>
        </ul>
      </div>
    </nav>
  );
}
