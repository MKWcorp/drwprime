'use client';

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function MobileHeader() {
  const { user } = useUser();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Image 
                src="/drwprime-icon.png" 
                alt="DRW Prime" 
                width={20} 
                height={20}
                className="object-contain"
              />
            </div>
            <h1 className="text-sm font-bold text-primary">DRW Prime</h1>
          </Link>

          {/* User Profile Only */}
          <Link href={user ? "/my-prime" : "/sign-in"}>
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              {user?.imageUrl ? (
                <Image 
                  src={user.imageUrl} 
                  alt={user.firstName || "User"} 
                  width={32} 
                  height={32}
                  className="rounded-full object-cover"
                />
              ) : (
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
