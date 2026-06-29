'use client';

import { useState, useEffect } from 'react';
import ExcelJS from 'exceljs';
import { Hourglass } from '@/components/LoadingScreen';

interface AffiliatorData {
  firstName: string;
  lastName: string;
  email: string;
  affiliateCode: string;
  totalCommission: number;
  totalWithdrawn: number;
  remainingCommission: number;
  totalReservations: number;
  claimedAt: string;
}

export default function ReportPage() {
  const [affiliators, setAffiliators] = useState<AffiliatorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAffiliators();
  }, []);

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

  const exportToExcel = async () => {
    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report Affiliator');

    // Define columns
    worksheet.columns = [
      { header: 'Nama', key: 'nama', width: 25 },
      { header: 'Gmail', key: 'gmail', width: 35 },
      { header: 'Kode', key: 'kode', width: 15 },
      { header: 'Total Komisi', key: 'totalKomisi', width: 18 },
      { header: 'Sudah Ditarik', key: 'sudahDitarik', width: 18 },
      { header: 'Sisa Komisi', key: 'sisaKomisi', width: 18 },
      { header: 'Terdaftar Kapan', key: 'terdaftar', width: 18 }
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD4AF37' } // Gold color
    };

    // Add data rows
    affiliators.forEach((aff) => {
      const fullName = `${aff.firstName} ${aff.lastName}`.trim();
      worksheet.addRow({
        nama: fullName,
        gmail: aff.email,
        kode: aff.affiliateCode,
        totalKomisi: aff.totalCommission,
        sudahDitarik: aff.totalWithdrawn,
        sisaKomisi: aff.remainingCommission,
        terdaftar: formatDate(aff.claimedAt)
      });
    });

    // Generate Excel file and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Report_Affiliator_${new Date().toISOString().split('T')[0]}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  if (loading) {
    return (
      <div className="min-h-screen fo-glass-page fo-theme-report">
        <div className="pt-20 flex items-center justify-center">
          <Hourglass size={56} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen fo-glass-page fo-theme-report">
      <div className="pt-20">
          <div className="max-w-7xl mx-auto px-4 py-6 fo-fade-up">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">📊 Report Affiliator</h1>
                  <p className="text-white/60 text-sm">Daftar affiliator yang sudah terdaftar dan aktif</p>
                </div>
                <button
                  onClick={exportToExcel}
                  className="fo-glass-card-soft border-green-500/35 text-green-300 px-4 py-2 rounded-lg hover:bg-green-500/20 transition-colors text-sm font-semibold flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Excel
                </button>
              </div>
            </div>

            {/* Total Count Card */}
            <div className="fo-glass-card fo-fade-up fo-stagger-1 rounded-xl p-6 mb-6 border-primary/40">
              <div className="text-center">
                <p className="text-white/70 text-sm mb-2">Total Affiliator Terdaftar</p>
                <p className="text-5xl font-bold text-primary mb-1">{affiliators.length}</p>
                <p className="text-white/50 text-xs">orang</p>
              </div>
            </div>

            {/* Affiliators List */}
            <div className="fo-glass-card fo-fade-up fo-stagger-2 rounded-xl overflow-hidden">
              <div className="fo-glass-card-soft border-b border-primary/30 p-4">
                <h2 className="font-bold text-white">Daftar Affiliator</h2>
              </div>

              {affiliators.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-white/60">Belum ada affiliator yang terdaftar</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="fo-glass-card-soft border-b border-white/10">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/70">No</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/70">Nama</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/70">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/70">Kode</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/70">Total Komisi</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/70">Sudah Ditarik</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/70">Sisa Komisi</th>
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
                          <td className="px-4 py-3 text-sm text-red-400">
                            {formatCurrency(affiliator.totalWithdrawn)}
                          </td>
                          <td className="px-4 py-3 text-sm text-green-400 font-semibold">
                            {formatCurrency(affiliator.remainingCommission)}
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
  );
}
