'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      checkAdminStatus();
    }
  }, [isLoaded, user]);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/user');
      const data = await response.json();
      setIsAdmin(data.user?.isAdmin || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

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

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 items-center">
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
              href="/product-gallery" 
              className="text-white hover:text-primary transition-colors duration-300 text-sm font-medium tracking-wide"
            >
              PRODUCT GALLERY
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
          
          {/* Member Section - Only visible when signed in */}
          <SignedIn>
            <li>
              <Link 
                href="/my-prime" 
                className="text-primary hover:text-primary/80 transition-colors duration-300 text-sm font-medium tracking-wide"
              >
                MY PRIME
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link 
                  href="/front-office" 
                  className="text-primary hover:text-primary/80 transition-colors duration-300 text-sm font-medium tracking-wide"
                >
                  FRONT OFFICE
                </Link>
              </li>
            )}
            <li>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9"
                  }
                }}
              />
            </li>
          </SignedIn>
            {/* Sign In Button - Only visible when signed out */}
          <SignedOut>
            <li>
              <Link href="/sign-in">
                <button className="bg-primary/20 border border-primary text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/30 transition-colors">
                  Sign In
                </button>
              </Link>
            </li>
          </SignedOut>
        </ul>

        {/* Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/98 border-t border-primary/20">
          <ul className="flex flex-col py-4">
            <li>
              <Link 
                href="/treatments"
                onClick={() => setIsOpen(false)}
                className="block px-5 py-3 text-white hover:text-primary hover:bg-primary/10 transition-colors duration-300 text-sm font-medium tracking-wide"
              >
                TREATMENT
              </Link>
            </li>
            <li>
              <Link 
                href="/#gallery"
                onClick={() => setIsOpen(false)}
                className="block px-5 py-3 text-white hover:text-primary hover:bg-primary/10 transition-colors duration-300 text-sm font-medium tracking-wide"
              >
                GALERI
              </Link>
            </li>
            <li>
              <Link 
                href="/product-gallery"
                onClick={() => setIsOpen(false)}
                className="block px-5 py-3 text-white hover:text-primary hover:bg-primary/10 transition-colors duration-300 text-sm font-medium tracking-wide"
              >
                PRODUCT GALLERY
              </Link>
            </li>
            <li>
              <Link 
                href="/#contact"
                onClick={() => setIsOpen(false)}
                className="block px-5 py-3 text-white hover:text-primary hover:bg-primary/10 transition-colors duration-300 text-sm font-medium tracking-wide"
              >
                KONTAK
              </Link>
            </li>
            
            {/* Mobile Auth Menu */}
            <SignedIn>
              <li>
                <Link 
                  href="/my-prime"
                  onClick={() => setIsOpen(false)}
                  className="block px-5 py-3 text-primary hover:text-primary/80 hover:bg-primary/10 transition-colors duration-300 text-sm font-medium tracking-wide"
                >
                  MY PRIME
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link 
                    href="/front-office"
                    onClick={() => setIsOpen(false)}
                    className="block px-5 py-3 text-primary hover:text-primary/80 hover:bg-primary/10 transition-colors duration-300 text-sm font-medium tracking-wide"
                  >
                    FRONT OFFICE
                  </Link>
                </li>
              )}
              <li className="px-5 py-3">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9"
                    }
                  }}
                />
              </li>
            </SignedIn>
              <SignedOut>
              <li className="px-5 py-3">
                <Link href="/sign-in">
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-primary/20 border border-primary text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/30 transition-colors"
                  >
                    Sign In
                  </button>
                </Link>
              </li>
            </SignedOut>
          </ul>
        </div>
      )}
    </nav>
  );
}
