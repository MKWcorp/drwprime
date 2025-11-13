'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Voucher {
  id: number;
  title: string;
  points: number;
  available: number;
  discount: string;
  image: string;
  category: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  loyaltyLevel: string;
  description: string;
  image: string;
  slots: number;
}

export default function MyPrimePage() {
  const [userPoints] = useState(1250);
  const [loyaltyPoints] = useState(3450);
  const [currentLevel] = useState('Gold');
  const [nextLevel] = useState('Platinum');
  const [pointsToNextLevel] = useState(1550);

  const vouchers: Voucher[] = [
    {
      id: 1,
      title: "Facial Basic",
      points: 500,
      available: 15,
      discount: "50%",
      image: "/drwprime-facial-room.png",
      category: "Treatment"
    },
    {
      id: 2,
      title: "IPL Treatment",
      points: 800,
      available: 8,
      discount: "30%",
      image: "/drwprime-laser-room.png",
      category: "Treatment"
    },
    {
      id: 3,
      title: "Chemical Peeling",
      points: 600,
      available: 12,
      discount: "40%",
      image: "/drwprime-facial-room-2.png",
      category: "Treatment"
    },
    {
      id: 4,
      title: "Free Consultation",
      points: 200,
      available: 25,
      discount: "100%",
      image: "/drwprime-consultation-room.png",
      category: "Service"
    },
    {
      id: 5,
      title: "Dermapen Treatment",
      points: 1000,
      available: 5,
      discount: "50%",
      image: "/drwprime-spa.png",
      category: "Treatment"
    },
    {
      id: 6,
      title: "Product Discount",
      points: 300,
      available: 20,
      discount: "25%",
      image: "/drwprime-product.png",
      category: "Product"
    }
  ];

  const events: Event[] = [
    {
      id: 1,
      title: "Beauty Workshop: Skincare Routine",
      date: "25 Nov 2025",
      loyaltyLevel: "Silver",
      description: "Learn the perfect skincare routine from our experts",
      image: "/drwprime-academy-room.png",
      slots: 15
    },
    {
      id: 2,
      title: "Exclusive Gold Member Spa Day",
      date: "5 Dec 2025",
      loyaltyLevel: "Gold",
      description: "Full day spa experience for Gold members",
      image: "/drwprime-spa-2.png",
      slots: 8
    },
    {
      id: 3,
      title: "New Treatment Launch Event",
      date: "15 Dec 2025",
      loyaltyLevel: "All Members",
      description: "Be the first to try our newest treatments",
      image: "/drwprime-loungue.png",
      slots: 30
    },
    {
      id: 4,
      title: "VIP Platinum Night",
      date: "20 Dec 2025",
      loyaltyLevel: "Platinum",
      description: "Exclusive evening with premium treatments",
      image: "/drwprime-loungue-2.png",
      slots: 5
    }
  ];

  const getLoyaltyColor = (level: string) => {
    switch (level) {
      case 'Platinum': return 'from-slate-300 to-slate-500';
      case 'Gold': return 'from-primary to-primary-light';
      case 'Silver': return 'from-gray-300 to-gray-400';
      default: return 'from-bronze-300 to-bronze-500';
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-5 py-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-4">
            My Prime
          </h1>
          <p className="text-white/70 text-lg">
            Your exclusive member benefits and rewards
          </p>
        </div>

        {/* Points & Loyalty Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-10">
          
          {/* My Points Card - Large */}
          <div className="md:col-span-5 bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 rounded-xl p-8 relative overflow-hidden group hover:border-primary transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/60 text-sm">My Points</p>
                  <p className="text-xs text-white/40">Redeemable for vouchers</p>
                </div>
              </div>
              <div className="mb-6">
                <h2 className="font-playfair text-5xl font-bold text-primary mb-2">
                  {userPoints.toLocaleString()}
                </h2>
                <p className="text-white/60 text-sm">Points Available</p>
              </div>
              <Link 
                href="#vouchers"
                className="inline-flex items-center gap-2 text-primary text-sm font-semibold hover:gap-3 transition-all"
              >
                <span>Redeem Vouchers</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* My Loyalty Card - Large */}
          <div className="md:col-span-7 bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 rounded-xl p-8 relative overflow-hidden group hover:border-primary transition-all duration-500">
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full -ml-20 -mb-20"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Loyalty Status</p>
                      <div className={`inline-block bg-gradient-to-r ${getLoyaltyColor(currentLevel)} text-dark px-3 py-1 rounded-full text-xs font-bold mt-1`}>
                        {currentLevel} Member
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <h3 className="font-playfair text-4xl font-bold text-primary">
                    {loyaltyPoints.toLocaleString()}
                  </h3>
                  <p className="text-white/60 text-sm">Loyalty Points</p>
                </div>
              </div>
              
              {/* Progress to Next Level */}
              <div className="bg-black/30 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/70 text-sm">Progress to {nextLevel}</span>
                  <span className="text-primary text-sm font-semibold">{pointsToNextLevel} points to go</span>
                </div>
                <div className="w-full bg-black/50 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-primary to-primary-light h-full rounded-full transition-all duration-500"
                    style={{ width: `${(loyaltyPoints / (loyaltyPoints + pointsToNextLevel)) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-black/30 rounded-lg p-3 text-center">
                  <p className="text-primary text-lg font-bold">25</p>
                  <p className="text-white/50 text-xs">Visits</p>
                </div>
                <div className="bg-black/30 rounded-lg p-3 text-center">
                  <p className="text-primary text-lg font-bold">12</p>
                  <p className="text-white/50 text-xs">Treatments</p>
                </div>
                <div className="bg-black/30 rounded-lg p-3 text-center">
                  <p className="text-primary text-lg font-bold">8</p>
                  <p className="text-white/50 text-xs">Referrals</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vouchers Section */}
        <div id="vouchers" className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-playfair text-3xl font-bold text-white">Available Vouchers</h2>
            <span className="text-white/50 text-sm">{vouchers.length} vouchers</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vouchers.map((voucher) => (
              <div 
                key={voucher.id}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
              >
                <div className="relative h-48">
                  <Image
                    src={voucher.image}
                    alt={voucher.title}
                    fill
                    className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                  
                  {/* Discount Badge */}
                  <div className="absolute top-4 right-4 bg-primary text-dark px-3 py-1 rounded-full text-sm font-bold">
                    {voucher.discount} OFF
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
                    {voucher.category}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-playfair text-xl font-bold text-white mb-2">
                    {voucher.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-primary font-bold">{voucher.points} pts</span>
                    </div>
                    <span className="text-white/60 text-sm">{voucher.available} available</span>
                  </div>

                  <button 
                    disabled={userPoints < voucher.points}
                    className="w-full bg-gradient-to-r from-primary to-primary-light text-dark py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {userPoints >= voucher.points ? 'Redeem Now' : 'Not Enough Points'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-playfair text-3xl font-bold text-white">Member Events</h2>
            <span className="text-white/50 text-sm">{events.length} upcoming events</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((event) => (
              <div 
                key={event.id}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary transition-all duration-500 hover:shadow-xl hover:shadow-primary/20"
              >
                <div className="relative h-56">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                  
                  {/* Loyalty Badge */}
                  <div className="absolute top-4 right-4 bg-primary text-dark px-3 py-1 rounded-full text-xs font-bold">
                    {event.loyaltyLevel}
                  </div>

                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-center">
                    <p className="text-xs text-white/60">Date</p>
                    <p className="text-sm font-bold">{event.date}</p>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-playfair text-2xl font-bold text-white mb-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-white/70 text-sm mb-4">
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>{event.slots} slots remaining</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-primary to-primary-light text-dark py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300">
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
