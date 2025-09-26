import Image from 'next/image';

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <Image 
          src="/drwprime-logo.png" 
          alt="DRW Prime Logo" 
          className="footer-logo" 
          width={180} 
          height={60} 
          style={{ width: 'auto', height: '60px', maxWidth: '180px' }}
        />
        <p>&copy; 2025 DRW Prime. All rights reserved.</p>
        <p>Menghadirkan &apos;The Art of Timeless Beauty&apos; untuk wanita Indonesia</p>
      </div>
    </footer>
  );
}
