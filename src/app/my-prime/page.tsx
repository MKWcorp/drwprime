'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import MobileLayout from '@/components/MobileLayout';

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

interface BankAccount {
  id: string;
  accountType: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
}

interface Withdrawal {
  id: string;
  amount: number;
  status: string;
  requestDate: string;
  processedDate?: string;
  adminNotes?: string;
  bankAccount: BankAccount;
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
  bankAccounts?: BankAccount[];
  withdrawals?: Withdrawal[];
}

export default function MyPrimePage() {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'reservations' | 'withdraw'>('reservations');
  
  // Withdrawal form state
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [accountType, setAccountType] = useState<'bank' | 'ewallet'>('bank');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [withdrawalMessage, setWithdrawalMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const banks = ['Mandiri', 'BRI', 'BCA', 'BSI', 'CIMB Niaga', 'BPD DIY'];
  const ewallets = ['DANA', 'GoPay', 'ShopeePay', 'OVO'];

  const syncAndFetchUser = useCallback(async () => {
    try {
      setLoading(true);
      
      // First, try to fetch user data
      const fetchResponse = await fetch('/api/user');
      
      if (!fetchResponse.ok) {
        console.error('Failed to fetch user:', fetchResponse.status);
        setUserData(null);
        return;
      }
      
      const fetchData = await fetchResponse.json();
      
      // If user needs sync (doesn't exist), sync first
      if (fetchData.needsSync) {
        console.log('User needs sync, creating user...');
        const syncResponse = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user?.emailAddresses[0]?.emailAddress,
            firstName: user?.firstName,
            lastName: user?.lastName,
            referralCode: user?.unsafeMetadata?.referralCode as string | undefined
          })
        });
        
        if (!syncResponse.ok) {
          const errorData = await syncResponse.json();
          console.error('Sync error:', errorData);
          setUserData(null);
          return;
        }
        
        // Fetch again after sync
        const response = await fetch('/api/user');
        if (!response.ok) {
          console.error('Failed to fetch after sync:', response.status);
          setUserData(null);
          return;
        }
        const data = await response.json();
        setUserData(data.user);
      } else {
        setUserData(fetchData.user);
      }

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

  const handleWithdrawalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setWithdrawalMessage(null);

    try {
      const amount = parseFloat(withdrawAmount);
      
      if (isNaN(amount) || amount <= 0) {
        setWithdrawalMessage({ type: 'error', text: 'Jumlah penarikan tidak valid' });
        setSubmitting(false);
        return;
      }

      if (amount > (userData?.totalEarnings || 0)) {
        setWithdrawalMessage({ type: 'error', text: 'Saldo komisi tidak mencukupi' });
        setSubmitting(false);
        return;
      }

      if (!bankName || !accountNumber || !accountName) {
        setWithdrawalMessage({ type: 'error', text: 'Semua field harus diisi' });
        setSubmitting(false);
        return;
      }

      const response = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          accountType,
          bankName,
          accountNumber,
          accountName
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setWithdrawalMessage({ type: 'error', text: data.error || 'Gagal mengajukan penarikan' });
        setSubmitting(false);
        return;
      }

      setWithdrawalMessage({ type: 'success', text: 'Penarikan berhasil diajukan! Admin akan memproses dalam 1-3 hari kerja.' });
      
      // Reset form
      setWithdrawAmount('');
      setBankName('');
      setAccountNumber('');
      setAccountName('');
      
      // Refresh user data
      await syncAndFetchUser();
      
    } catch (error) {
      console.error('Withdrawal error:', error);
      setWithdrawalMessage({ type: 'error', text: 'Terjadi kesalahan. Silakan coba lagi.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MobileLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-white/60">Loading your dashboard...</p>
        </div>
        </div>
      </MobileLayout>
    );
  }

  if (!userData) {
    return (
      <MobileLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60">Failed to load data. Please refresh the page.</p>
        </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Affiliate Code Card - Compact */}
          <div className="mb-4">
            <div className="bg-gradient-to-br from-primary/30 to-primary/10 border border-primary rounded-xl p-4 relative overflow-hidden">
              <div className="relative z-10">
                <div className="mb-3">
                  <p className="text-white/60 text-xs mb-2">Kode Affiliate</p>
                  <div className="font-mono text-3xl font-bold text-primary tracking-wider mb-3">
                    {userData.affiliateCode}
                  </div>
                  <p className="text-white/50 text-[10px] mb-2">
                    💡 Hubungi admin untuk mengubah kode affiliate
                  </p>

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

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
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

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('reservations')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'reservations'
                  ? 'bg-primary text-dark'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              Daftar Reservasi
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'withdraw'
                  ? 'bg-primary text-dark'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              Tarik Komisi
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'reservations' ? (
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
          ) : (
            <div className="space-y-4">
              {/* Withdrawal Form */}
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-4">
                <h3 className="font-bold text-base text-white mb-3">Ajukan Penarikan Komisi</h3>
                
                {withdrawalMessage && (
                  <div className={`mb-4 p-3 rounded-lg ${
                    withdrawalMessage.type === 'success' 
                      ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                      : 'bg-red-500/20 border border-red-500/30 text-red-400'
                  }`}>
                    <p className="text-sm">{withdrawalMessage.text}</p>
                  </div>
                )}

                <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      Jumlah Penarikan
                    </label>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Masukkan jumlah"
                      className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                      required
                    />
                    <p className="text-white/50 text-xs mt-1">
                      Saldo tersedia: {formatCurrency(userData.totalEarnings)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      Metode Penarikan
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAccountType('bank');
                          setBankName('');
                        }}
                        className={`py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
                          accountType === 'bank'
                            ? 'bg-primary text-dark'
                            : 'bg-black/30 text-white/60 border border-white/20'
                        }`}
                      >
                        Bank
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAccountType('ewallet');
                          setBankName('');
                        }}
                        className={`py-2 px-4 rounded-lg text-sm font-semibold transition-colors ${
                          accountType === 'ewallet'
                            ? 'bg-primary text-dark'
                            : 'bg-black/30 text-white/60 border border-white/20'
                        }`}
                      >
                        E-Wallet
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      {accountType === 'bank' ? 'Pilih Bank' : 'Pilih E-Wallet'}
                    </label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                      required
                    >
                      <option value="">-- Pilih {accountType === 'bank' ? 'Bank' : 'E-Wallet'} --</option>
                      {(accountType === 'bank' ? banks : ewallets).map((name) => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      {accountType === 'bank' ? 'Nomor Rekening' : 'Nomor E-Wallet'}
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder={accountType === 'bank' ? 'Contoh: 1234567890' : 'Contoh: 08123456789'}
                      className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-2">
                      Nama Pemilik Rekening
                    </label>
                    <input
                      type="text"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      placeholder="Nama sesuai rekening"
                      className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary hover:bg-primary/90 text-dark font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Memproses...' : 'Ajukan Penarikan'}
                  </button>
                </form>
              </div>

              {/* Withdrawal History */}
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-4">
                <h3 className="font-bold text-base text-white mb-3">Riwayat Penarikan</h3>
                {!userData.withdrawals || userData.withdrawals.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-white/60 text-sm">Belum ada riwayat penarikan</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {userData.withdrawals.map((withdrawal: Withdrawal) => (
                      <div key={withdrawal.id} className="bg-black/30 border border-white/10 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-semibold text-white text-sm">
                              {formatCurrency(withdrawal.amount)}
                            </p>
                            <p className="text-white/70 text-xs">
                              {withdrawal.bankAccount.bankName} - {withdrawal.bankAccount.accountNumber}
                            </p>
                            <p className="text-white/50 text-[10px] mt-0.5">
                              {new Date(withdrawal.requestDate).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${
                            withdrawal.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                            withdrawal.status === 'approved' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 
                            withdrawal.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                            'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          }`}>
                            {withdrawal.status === 'completed' ? 'Selesai' : 
                             withdrawal.status === 'approved' ? 'Disetujui' :
                             withdrawal.status === 'rejected' ? 'Ditolak' : 'Pending'}
                          </span>
                        </div>
                        {withdrawal.adminNotes && (
                          <div className="pt-2 border-t border-white/10">
                            <p className="text-white/60 text-xs">
                              <span className="font-semibold">Catatan Admin:</span> {withdrawal.adminNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </MobileLayout>
  );
}
