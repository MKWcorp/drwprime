import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/">
          <img 
            src="/drwprime-logo.png" 
            alt="DRW Prime Logo" 
            className="nav-logo"
          />
        </Link>
        <ul className="nav-menu">
          <li><Link href="#about">TENTANG KAMI</Link></li>
          <li><Link href="#treatments">TREATMENT</Link></li>
          <li><Link href="#gallery">GALERI</Link></li>
          <li><Link href="#contact">KONTAK</Link></li>
        </ul>
      </div>
    </nav>
  );
}
