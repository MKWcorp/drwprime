'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface Reservation {
  id: string;
  patientName: string;
  patientPhone?: string;
  status: string;
  reservationDate: string;
  reservationTime: string;
  finalPrice: number;
  commissionAmount: number;
  treatment: {
    name: string;
  };
}

interface UserData {
  id: string;
  affiliateCode: string;
  points: number;
  loyaltyPoints: number;
  loyaltyLevel: string;
  totalReferrals: number;
  totalEarnings: number;
  reservations: Reservation[];
  referrals: Reservation[];
  transactions: Reservation[];
}

export default function MyPrimePage() {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const syncAndFetchUser = useCallback(async () => {
    try {
      // Sync user with database
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.emailAddresses[0]?.emailAddress,
          firstName: user?.firstName,
          lastName: user?.lastName
        })
      });

      // Fetch user data
      const response = await fetch('/api/user');
      const data = await response.json();
      setUserData(data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isLoaded && user) {
      syncAndFetchUser();
    }
  }, [isLoaded, user, syncAndFetchUser]);

  const copyAffiliateLink = () => {
    const link = `${window.location.origin}/reservation?ref=${userData?.affiliateCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-white/60">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60">Failed to load data. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Affiliate Code Card - Compact */}
          <div className="mb-4">
            <div className="bg-gradient-to-br from-primary/30 to-primary/10 border border-primary rounded-xl p-4 relative overflow-hidden">
              <div className="relative z-10">
                <div className="mb-3">
                  <p className="text-white/60 text-xs mb-1">Kode Affiliate</p>
                  <div className="font-mono text-3xl font-bold text-primary tracking-wider mb-3">
                    {userData.affiliateCode}
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                    <p className="text-white/60 text-xs mb-1.5">Link Referral:</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={`${typeof window !== 'undefined' ? window.location.origin : ''}/reservation?ref=${userData.affiliateCode}`}
                        readOnly
                        className="flex-1 bg-white/5 text-white px-2 py-1.5 rounded text-xs font-mono border border-white/10 focus:outline-none"
                      />
                      <button
                        onClick={copyAffiliateLink}
                        className="bg-primary hover:bg-primary/90 text-dark px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors"
                      >
                        {copied ? '✓' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Book Treatment Button */}
          <div className="mb-4">
            <Link
              href="/treatments"
              className="w-full bg-primary hover:bg-primary/90 text-dark font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Buat Reservasi Baru
            </Link>
          </div>

          {/* Dashboard Content */}
          <div className="space-y-4">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <p className="text-white/70 text-xs">Total Komisi</p>
                  </div>
                  <p className="font-bold text-lg text-primary">
                    {formatCurrency(userData.totalEarnings)}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-white/70 text-xs">Total Reservasi</p>
                  </div>
                  <p className="font-bold text-lg text-primary">
                    {userData.referrals.length}
                  </p>
                  <p className="text-white/50 text-[10px] mt-0.5">Selesai: {userData.referrals.filter((r: Reservation) => r.status === 'completed').length}</p>
                </div>

                <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-white/70 text-xs">Pending</p>
                  </div>
                  <p className="font-bold text-lg text-primary">
                    {userData.referrals.filter((r: Reservation) => r.status === 'pending').length}
                  </p>
                  <p className="text-white/50 text-[10px] mt-0.5">Menunggu konfirmasi</p>
                </div>

                <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <p className="text-white/70 text-xs">Customer</p>
                  </div>
                  <p className="font-bold text-lg text-primary">
                    {userData.referrals.filter((r: Reservation) => r.status === 'completed').length}
                  </p>
                  <p className="text-white/50 text-[10px] mt-0.5">Total dilayani</p>
                </div>
              </div>

              {/* Reservations List */}
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-4">
                <h3 className="font-bold text-base text-white mb-3">Daftar Reservasi</h3>
                {userData.referrals.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-white/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-white/60 mb-4">Belum ada reservasi</p>
                    <p className="text-white/40 text-sm">Bagikan link referral Anda untuk mendapatkan komisi!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {userData.referrals.map((referral: Reservation) => (
                      <div key={referral.id} className="bg-black/30 border border-white/10 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-semibold text-white text-sm">{referral.patientName}</p>
                            <p className="text-white/70 text-xs">{referral.treatment.name}</p>
                            <p className="text-white/50 text-[10px] mt-0.5">
                              {new Date(referral.reservationDate).toLocaleDateString('id-ID', {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })} - {referral.reservationTime}
                            </p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${
                            referral.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                            referral.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 
                            referral.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                            'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          }`}>
                            {referral.status === 'completed' ? 'Selesai' : 
                             referral.status === 'confirmed' ? 'Dikonfirmasi' :
                             referral.status === 'cancelled' ? 'Dibatalkan' : 'Pending'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                          <p className="text-white/60 text-xs">
                            {referral.patientPhone}
                          </p>
                          <p className="text-primary font-bold text-sm">
                            {formatCurrency(referral.commissionAmount)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
