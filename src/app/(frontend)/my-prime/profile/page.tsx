'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import MobileLayout from '@/components/MobileLayout';

const PROVINCES = [
  'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Jambi', 'Sumatera Selatan',
  'Bengkulu', 'Lampung', 'Kepulauan Bangka Belitung', 'Kepulauan Riau',
  'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur', 'Banten',
  'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur',
  'Kalimantan Barat', 'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara',
  'Sulawesi Utara', 'Sulawesi Tengah', 'Sulawesi Selatan', 'Sulawesi Tenggara', 'Gorontalo', 'Sulawesi Barat',
  'Maluku', 'Maluku Utara',
  'Papua', 'Papua Barat', 'Papua Selatan', 'Papua Tengah', 'Papua Pegunungan', 'Papua Barat Daya',
];

interface ProfileForm {
  phone: string;
  nik: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

const EMPTY_FORM: ProfileForm = {
  phone: '',
  nik: '',
  gender: '',
  dateOfBirth: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
};

const inputClass =
  'w-full fo-glass-input px-4 py-2.5 rounded-lg text-sm placeholder:text-white/30 [&>option]:text-black';

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [form, setForm] = useState<ProfileForm>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [alreadyComplete, setAlreadyComplete] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      let res = await fetch('/api/profile');

      if (res.status === 404) {
        // User not yet synced to DB — sync then retry
        await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user?.emailAddresses[0]?.emailAddress,
            firstName: user?.firstName,
            lastName: user?.lastName,
          }),
        });
        res = await fetch('/api/profile');
      }

      if (!res.ok) {
        setError('Gagal memuat data profil. Silakan refresh halaman.');
        return;
      }

      const data = await res.json();
      const p = data.profile;
      setForm({
        phone: p.phone ?? '',
        nik: p.nik ?? '',
        gender: p.gender ?? '',
        dateOfBirth: p.dateOfBirth ?? '',
        address: p.address ?? '',
        city: p.city ?? '',
        province: p.province ?? '',
        postalCode: p.postalCode ?? '',
      });
      setAlreadyComplete(Boolean(p.isComplete));
    } catch (err) {
      console.error('Load profile error:', err);
      setError('Terjadi kesalahan saat memuat profil.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isLoaded && user) {
      loadProfile();
    }
  }, [isLoaded, user, loadProfile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setFieldErrors({});

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.fields) {
          setFieldErrors(data.fields);
          setError('Periksa kembali data yang Anda isi.');
        } else {
          setError(data.error || 'Gagal menyimpan profil.');
        }
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/my-prime'), 1800);
    } catch (err) {
      console.error('Save profile error:', err);
      setError('Terjadi kesalahan saat menyimpan profil.');
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <MobileLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-white/60 text-sm">Memuat profil...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (!user) {
    return (
      <MobileLayout>
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-white/60 mb-4 text-sm">Silakan login untuk mengakses halaman ini.</p>
            <Link href="/sign-in" className="bg-primary text-dark px-6 py-3 rounded-lg font-semibold text-sm">
              Sign In
            </Link>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (success) {
    return (
      <MobileLayout>
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 bg-primary/20 border border-primary/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-white font-bold text-lg mb-1">Profil Tersimpan!</h2>
            <p className="text-white/60 text-sm">Selamat, profil member DRW Prime Anda telah lengkap.</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  const renderError = (name: keyof ProfileForm) =>
    fieldErrors[name] ? (
      <p className="text-red-400 text-[11px] mt-1">{fieldErrors[name]}</p>
    ) : null;

  return (
    <MobileLayout>
      <Navbar />
      <div className="min-h-screen fo-glass-page mp-theme-bright">
        <div className="pt-20 relative z-10">
          <div className="max-w-2xl mx-auto px-4 py-6">

            <Link
              href="/my-prime"
              className="inline-flex items-center gap-1.5 text-white/50 hover:text-primary text-xs mb-4 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke My Prime
            </Link>

            <div className="mb-5 fo-fade-up">
              <h1 className="font-playfair text-2xl md:text-3xl font-bold text-primary">Lengkapi Profil</h1>
              <p className="text-white/70 text-sm mt-1">
                Lengkapi data pribadi untuk menjadi member DRW Prime
              </p>
            </div>

            {alreadyComplete && (
              <div className="mb-4 p-3 bg-primary/10 backdrop-blur-md border border-primary/25 rounded-xl flex items-center gap-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-white/70 text-xs">Profil Anda sudah lengkap. Anda bisa memperbarui datanya di sini.</p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="fo-glass-card fo-fade-up rounded-xl p-6 border-primary/35 space-y-4">
                <h3 className="text-white font-semibold text-sm">Data Pribadi</h3>

                <div>
                  <label className="block text-white/70 text-xs mb-1.5">Nomor HP / WhatsApp *</label>
                  <input
                    type="tel"
                    name="phone"
                    inputMode="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="08123456789"
                    className={inputClass}
                  />
                  {renderError('phone')}
                </div>

                <div>
                  <label className="block text-white/70 text-xs mb-1.5">NIK (No. KTP) *</label>
                  <input
                    type="text"
                    name="nik"
                    inputMode="numeric"
                    maxLength={16}
                    value={form.nik}
                    onChange={handleChange}
                    placeholder="16 digit nomor KTP"
                    className={inputClass}
                  />
                  {renderError('nik')}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 text-xs mb-1.5">Jenis Kelamin *</label>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="" className="bg-white text-black">Pilih jenis kelamin</option>
                      <option value="Pria" className="bg-white text-black">Pria</option>
                      <option value="Wanita" className="bg-white text-black">Wanita</option>
                    </select>
                    {renderError('gender')}
                  </div>

                  <div>
                    <label className="block text-white/70 text-xs mb-1.5">Tanggal Lahir *</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={form.dateOfBirth}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      className={`${inputClass} [color-scheme:dark]`}
                    />
                    {renderError('dateOfBirth')}
                  </div>
                </div>
              </div>

              <div className="fo-glass-card fo-fade-up rounded-xl p-6 border-primary/35 space-y-4">
                <h3 className="text-white font-semibold text-sm">Alamat</h3>

                <div>
                  <label className="block text-white/70 text-xs mb-1.5">Alamat Lengkap *</label>
                  <textarea
                    name="address"
                    rows={3}
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan"
                    className={inputClass}
                  />
                  {renderError('address')}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 text-xs mb-1.5">Kota / Kabupaten *</label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Contoh: Yogyakarta"
                      className={inputClass}
                    />
                    {renderError('city')}
                  </div>

                  <div>
                    <label className="block text-white/70 text-xs mb-1.5">Provinsi *</label>
                    <select
                      name="province"
                      value={form.province}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="" className="bg-white text-black">Pilih provinsi</option>
                      {PROVINCES.map((p) => (
                        <option key={p} value={p} className="bg-white text-black">{p}</option>
                      ))}
                    </select>
                    {renderError('province')}
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-xs mb-1.5">Kode Pos *</label>
                  <input
                    type="text"
                    name="postalCode"
                    inputMode="numeric"
                    maxLength={5}
                    value={form.postalCode}
                    onChange={handleChange}
                    placeholder="5 digit kode pos"
                    className={inputClass}
                  />
                  {renderError('postalCode')}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-primary text-dark font-semibold text-sm py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Menyimpan...' : 'Simpan Profil'}
              </button>
            </form>

          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
