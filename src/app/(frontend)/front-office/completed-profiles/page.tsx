'use client';

import { useState, useEffect } from 'react';
import ExcelJS from 'exceljs';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import MobileLayout from '@/components/MobileLayout';
import { Hourglass } from '@/components/LoadingScreen';

interface CompletedProfile {
  firstName: string;
  lastName: string;
  email: string;
  affiliateCode: string;
  phone: string;
  nik: string;
  gender: string;
  dateOfBirth: string | null;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  profileCompletedAt: string | null;
}

export default function CompletedProfilesPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [profiles, setProfiles] = useState<CompletedProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
      return;
    }

    if (user) {
      fetchProfiles();
    }
  }, [isLoaded, user, router]);

  const fetchProfiles = async () => {
    try {
      const response = await fetch('/api/front-office/completed-profiles');
      if (!response.ok) throw new Error('Failed to fetch completed profiles');
      const data = await response.json();
      setProfiles(data.profiles || []);
    } catch (error) {
      console.error('Error fetching completed profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Profil Lengkap');

    worksheet.columns = [
      { header: 'Nama', key: 'nama', width: 25 },
      { header: 'Email', key: 'email', width: 32 },
      { header: 'No. HP', key: 'phone', width: 18 },
      { header: 'Jenis Kelamin', key: 'gender', width: 14 },
      { header: 'Tanggal Lahir', key: 'dob', width: 16 },
      { header: 'NIK', key: 'nik', width: 22 },
      { header: 'Alamat', key: 'address', width: 40 },
      { header: 'Kota', key: 'city', width: 18 },
      { header: 'Provinsi', key: 'province', width: 20 },
      { header: 'Kode Pos', key: 'postalCode', width: 12 },
      { header: 'Kode Afiliasi', key: 'affiliateCode', width: 14 },
      { header: 'Tanggal Melengkapi', key: 'completedAt', width: 18 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD4AF37' },
    };

    profiles.forEach((p) => {
      worksheet.addRow({
        nama: `${p.firstName} ${p.lastName}`.trim(),
        email: p.email,
        phone: p.phone,
        gender: p.gender,
        dob: formatDate(p.dateOfBirth),
        nik: p.nik,
        address: p.address,
        city: p.city,
        province: p.province,
        postalCode: p.postalCode,
        affiliateCode: p.affiliateCode,
        completedAt: formatDate(p.profileCompletedAt),
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Report_Profil_Lengkap_${new Date().toISOString().split('T')[0]}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isLoaded || loading) {
    return (
      <MobileLayout>
        <div className="min-h-screen fo-glass-page fo-theme-dashboard">
          <Navbar />
          <div className="pt-20 flex items-center justify-center">
            <Hourglass size={56} />
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="min-h-screen fo-glass-page fo-theme-dashboard">
        <Navbar />
        <div className="pt-20">
          <div className="max-w-7xl mx-auto px-4 py-6 fo-fade-up">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h1 className="font-playfair text-2xl md:text-3xl font-bold text-primary mb-1">
                    Report Profil Lengkap
                  </h1>
                  <p className="text-white/60 text-sm">
                    Daftar member yang sudah melengkapi profil di My Prime
                  </p>
                </div>
                <button
                  onClick={exportToExcel}
                  disabled={profiles.length === 0}
                  className="fo-glass-card-soft border-green-500/35 text-green-300 px-4 py-2 rounded-lg hover:bg-green-500/20 transition-colors text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                <p className="text-white/70 text-sm mb-2">Total Member Profil Lengkap</p>
                <p className="font-playfair text-5xl font-bold text-primary mb-1">{profiles.length}</p>
                <p className="text-white/50 text-xs">orang</p>
              </div>
            </div>

            {/* Profiles List */}
            <div className="fo-glass-card fo-fade-up fo-stagger-2 rounded-xl overflow-hidden">
              <div className="fo-glass-card-soft border-b border-primary/30 p-4">
                <h2 className="font-bold text-white">Daftar Member</h2>
              </div>

              {profiles.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-white/60">Belum ada member yang melengkapi profil</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="fo-glass-card-soft border-b border-white/10">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/70">No</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/70">Nama</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/70">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/70">No. HP</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/70">Jenis Kelamin</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/70">Tgl Lahir</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/70">NIK</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/70">Kota</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/70">Provinsi</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/70">Lengkap Pada</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {profiles.map((p, index) => (
                        <tr key={`${p.email}-${index}`} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 text-sm text-white/80">{index + 1}</td>
                          <td className="px-4 py-3 text-sm text-white whitespace-nowrap">
                            {p.firstName} {p.lastName}
                          </td>
                          <td className="px-4 py-3 text-sm text-white/60">{p.email}</td>
                          <td className="px-4 py-3 text-sm text-white/80 whitespace-nowrap">{p.phone || '-'}</td>
                          <td className="px-4 py-3 text-sm text-white/80">{p.gender || '-'}</td>
                          <td className="px-4 py-3 text-sm text-white/80 whitespace-nowrap">{formatDate(p.dateOfBirth)}</td>
                          <td className="px-4 py-3 text-sm text-white/80 font-mono">{p.nik || '-'}</td>
                          <td className="px-4 py-3 text-sm text-white/80">{p.city || '-'}</td>
                          <td className="px-4 py-3 text-sm text-white/80">{p.province || '-'}</td>
                          <td className="px-4 py-3 text-sm text-white/60 whitespace-nowrap">{formatDate(p.profileCompletedAt)}</td>
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
