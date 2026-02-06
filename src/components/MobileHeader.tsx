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
    <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-black via-gray-900 to-black border-b border-primary/20">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/30">
              <Image 
                src="/drwprime-icon.png" 
                alt="DRW Prime" 
                width={24} 
                height={24}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-sm font-bold text-primary">DRW Prime</h1>
              <p className="text-xs text-gray-400">Aesthetic Clinic</p>
            </div>
          </Link>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/30 hover:bg-primary/20 transition-colors">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {/* User Profile */}
            <Link href={user ? "/my-prime" : "/sign-in"}>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/30 hover:bg-primary/20 transition-colors">
                {user?.imageUrl ? (
                  <Image 
                    src={user.imageUrl} 
                    alt={user.firstName || "User"} 
                    width={40} 
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
            </Link>
          </div>
        </div>

        {/* Greeting */}
        <div className="mt-4">
          <h2 className="text-lg font-bold text-white">
            {getGreeting()}, {user?.firstName || "Guest"} 👋
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Mau treatment apa hari ini?
          </p>
        </div>
      </div>
    </header>
  );
}
