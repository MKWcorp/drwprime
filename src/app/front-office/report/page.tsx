'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import MobileLayout from '@/components/MobileLayout';

interface AffiliatorData {
  firstName: string;
  lastName: string;
  email: string;
  affiliateCode: string;
  totalCommission: number;
  totalReservations: number;
  claimedAt: string;
}

export default function ReportPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [affiliators, setAffiliators] = useState<AffiliatorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
      return;
    }

    if (user) {
      fetchAffiliators();
    }
  }, [isLoaded, user, router]);

  const fetchAffiliators = async () => {
    try {
      const response = await fetch('/api/front-office/affiliators');
      if (!response.ok) throw new Error('Failed to fetch affiliators');
      const data = await response.json();
      setAffiliators(data.affiliators || []);
    } catch (error) {
      console.error('Error fetching affiliators:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const exportToExcel = () => {
    // Helper function to escape CSV fields
    const escapeCSV = (field: string | number) => {
      const str = String(field);
      // If field contains comma, quote, or newline, wrap in quotes and escape quotes
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    // Create CSV content with proper escaping
    const headers = ['Nama', 'Gmail', 'Kode', 'Terdaftar Kapan'];
    const csvRows = [
      headers.join(','),
      ...affiliators.map((aff) => {
        const fullName = `${aff.firstName} ${aff.lastName}`.trim();
        return [
          escapeCSV(fullName),
          escapeCSV(aff.email),
          escapeCSV(aff.affiliateCode),
          escapeCSV(formatDate(aff.claimedAt))
        ].join(',');
      })
    ];
    const csvContent = csvRows.join('\n');

    // Add BOM for proper UTF-8 encoding in Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Report_Affiliator_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isLoaded || loading) {
    return (
      <MobileLayout>
        <div className="min-h-screen bg-black">
          <Navbar />
          <div className="pt-20 flex items-center justify-center">
            <p className="text-white/60">Loading...</p>
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
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">📊 Report Affiliator</h1>
                  <p className="text-white/60 text-sm">Daftar affiliator yang sudah terdaftar dan aktif</p>
                </div>
                <button
                  onClick={exportToExcel}
                  className="bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors text-sm font-semibold flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Excel
                </button>
              </div>
            </div>

            {/* Total Count Card */}
            <div className="bg-gradient-to-br from-primary/30 to-primary/10 border border-primary rounded-xl p-6 mb-6">
              <div className="text-center">
                <p className="text-white/70 text-sm mb-2">Total Affiliator Terdaftar</p>
                <p className="text-5xl font-bold text-primary mb-1">{affiliators.length}</p>
                <p className="text-white/50 text-xs">orang</p>
              </div>
            </div>

            {/* Affiliators List */}
            <div className="bg-dark-card border border-white/10 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 border-b border-primary/30 p-4">
                <h2 className="font-bold text-white">Daftar Affiliator</h2>
              </div>

              {affiliators.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-white/60">Belum ada affiliator yang terdaftar</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/70">No</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/70">Nama</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/70">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/70">Kode</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/70">Total Komisi</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/70">Reservasi</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/70">Terdaftar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {affiliators.map((affiliator, index) => (
                        <tr key={affiliator.email} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 text-sm text-white/80">{index + 1}</td>
                          <td className="px-4 py-3 text-sm text-white">
                            {affiliator.firstName} {affiliator.lastName}
                          </td>
                          <td className="px-4 py-3 text-sm text-white/60">{affiliator.email}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="font-mono text-primary">{affiliator.affiliateCode}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-white/80">
                            {formatCurrency(affiliator.totalCommission)}
                          </td>
                          <td className="px-4 py-3 text-sm text-white/80">
                            {affiliator.totalReservations} reservasi
                          </td>
                          <td className="px-4 py-3 text-sm text-white/60">
                            {formatDate(affiliator.claimedAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
