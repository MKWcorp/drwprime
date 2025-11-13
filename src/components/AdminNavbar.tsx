'use client';

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function AdminNavbar() {
  return (
    <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-md z-50 border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-5 flex justify-between items-center py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image 
            src="/drwprime-logo.png" 
            alt="DRW Prime Logo" 
            width={150}
            height={40}
            className="h-10 w-auto"
          />
          <span className="text-primary text-sm font-semibold">Admin</span>
        </Link>

        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-primary text-dark px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link 
              href="/"
              className="text-white hover:text-primary transition-colors text-sm font-medium"
            >
              Back to Site
            </Link>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10"
                }
              }}
            />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
