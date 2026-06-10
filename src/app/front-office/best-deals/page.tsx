'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import MobileLayout from '@/components/MobileLayout';

type Promo = {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  promoMonth: string;
  validFrom?: string | null;
  validUntil?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  terms?: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
};

type FormState = {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  promoMonth: string;
  validFrom: string;
  validUntil: string;
  ctaText: string;
  ctaLink: string;
  terms: string;
  order: string;
  isActive: boolean;
};

const initialForm: FormState = {
  title: '',
  subtitle: '',
  description: '',
  imageUrl: '',
  promoMonth: '',
  validFrom: '',
  validUntil: '',
  ctaText: 'Reservasi Sekarang',
  ctaLink: '/reservation',
  terms: '',
  order: '0',
  isActive: true,
};

function normalizeDateInput(value?: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

export default function BestDealManagerPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState<FormState>(initialForm);

  const activeCount = useMemo(() => promos.filter((p) => p.isActive).length, [promos]);

  const checkAdminAccess = useCallback(async () => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    try {
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.emailAddresses[0]?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
        }),
      });

      const response = await fetch('/api/user');
      const data = await response.json();

      if (data.user?.isAdmin) {
        setIsAdmin(true);
      } else {
        router.push('/');
      }
    } catch (e) {
      console.error('Error checking admin access:', e);
      router.push('/');
    } finally {
      setCheckingAuth(false);
    }
  }, [router, user]);

  const fetchPromos = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/front-office/best-deals');
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal mengambil data promo');
      }

      setPromos(result.promos || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan saat mengambil promo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      checkAdminAccess();
    }
  }, [isLoaded, checkAdminAccess]);

  useEffect(() => {
    if (isAdmin) {
      fetchPromos();
    }
  }, [isAdmin]);

  const resetForm = () => {
    setForm(initialForm);
    setSelectedImageFile(null);
  };

  const uploadImageFile = async (file: File): Promise<string> => {
    const body = new FormData();
    body.append('file', file);

    const response = await fetch('/api/front-office/best-deals/upload', {
      method: 'POST',
      body,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Gagal upload gambar');
    }

    return result.url || '';
  };

  const onSubmit = async () => {
    if (!form.title.trim()) {
      setError('Judul promo wajib diisi');
      return;
    }

    if (!form.promoMonth.trim()) {
      setError('Bulan promo wajib diisi');
      return;
    }

    if (!form.imageUrl.trim() && !selectedImageFile) {
      setError('Gambar promo wajib diisi. Upload file atau isi URL gambar terlebih dahulu.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    let imageUrl = form.imageUrl.trim();

    try {
      if (!imageUrl && selectedImageFile) {
        setUploadingImage(true);
        imageUrl = await uploadImageFile(selectedImageFile);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan saat upload gambar');
      setSubmitting(false);
      setUploadingImage(false);
      return;
    } finally {
      setUploadingImage(false);
    }

    const payload = {
      id: form.id,
      title: form.title,
      subtitle: form.subtitle,
      description: form.description,
      imageUrl,
      promoMonth: form.promoMonth,
      validFrom: form.validFrom || undefined,
      validUntil: form.validUntil || undefined,
      ctaText: form.ctaText,
      ctaLink: form.ctaLink,
      terms: form.terms,
      order: Number(form.order || 0),
      isActive: form.isActive,
    };

    try {
      const response = await fetch('/api/front-office/best-deals', {
        method: form.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal menyimpan promo');
      }

      setSuccess(form.id ? 'Promo berhasil diupdate' : 'Promo berhasil diupload');
      resetForm();
      await fetchPromos();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan saat menyimpan promo');
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (promo: Promo) => {
    setForm({
      id: promo.id,
      title: promo.title,
      subtitle: promo.subtitle || '',
      description: promo.description || '',
      imageUrl: promo.imageUrl || '',
      promoMonth: promo.promoMonth,
      validFrom: normalizeDateInput(promo.validFrom),
      validUntil: normalizeDateInput(promo.validUntil),
      ctaText: promo.ctaText || 'Reservasi Sekarang',
      ctaLink: promo.ctaLink || '/reservation',
      terms: promo.terms || '',
      order: String(promo.order || 0),
      isActive: promo.isActive,
    });
    setError('');
    setSuccess('');
    setSelectedImageFile(null);
  };

  const onDelete = async (id: string) => {
    const confirmed = window.confirm('Hapus promo ini?');
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/front-office/best-deals?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Gagal menghapus promo');
      }

      setSuccess('Promo berhasil dihapus');
      await fetchPromos();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan saat menghapus promo');
    }
  };

  const toggleActive = async (promo: Promo) => {
    try {
      const response = await fetch('/api/front-office/best-deals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: promo.id,
          title: promo.title,
          promoMonth: promo.promoMonth,
          isActive: !promo.isActive,
          order: promo.order,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Gagal update status promo');
      }

      await fetchPromos();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan saat update status');
    }
  };

  if (checkingAuth || !isLoaded) {
    return (
      <MobileLayout>
        <div className="min-h-screen fo-glass-page fo-theme-dashboard">
          <Navbar />
          <div className="pt-24 flex items-center justify-center">
            <p className="text-white/60">Checking access...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <MobileLayout>
      <div className="min-h-screen fo-glass-page fo-theme-dashboard">
        <Navbar />

        <div className="pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Best Deal Manager</h1>
                <p className="text-white/60 text-sm">Upload dan kelola promo bulanan untuk halaman Best Deal</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/best-deal" className="fo-nav-chip text-sm">
                  Lihat Halaman Best Deal
                </Link>
                <Link href="/front-office" className="fo-nav-chip text-sm">
                  Kembali ke Front Office
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="fo-glass-card rounded-xl p-5 border-primary/35">
                <p className="text-primary text-xs mb-1">Total Promo</p>
                <p className="text-2xl font-bold text-white">{promos.length}</p>
              </div>
              <div className="fo-glass-card rounded-xl p-5 border-green-500/35">
                <p className="text-green-400 text-xs mb-1">Promo Aktif</p>
                <p className="text-2xl font-bold text-white">{activeCount}</p>
              </div>
              <div className="fo-glass-card rounded-xl p-5 border-blue-500/35">
                <p className="text-blue-400 text-xs mb-1">Promo Nonaktif</p>
                <p className="text-2xl font-bold text-white">{promos.length - activeCount}</p>
              </div>
            </div>

            <div className="fo-glass-card rounded-xl p-5 mb-6">
              <h2 className="text-white font-semibold mb-4">{form.id ? 'Edit Promo' : 'Upload Promo Baru'}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Judul Promo</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full fo-glass-input rounded-lg px-3 py-2 text-sm"
                    placeholder="Contoh: Laser Bright Package"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Bulan Promo</label>
                  <input
                    type="text"
                    value={form.promoMonth}
                    onChange={(e) => setForm((prev) => ({ ...prev, promoMonth: e.target.value }))}
                    className="w-full fo-glass-input rounded-lg px-3 py-2 text-sm"
                    placeholder="Contoh: Juni 2026"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Subjudul</label>
                  <input
                    type="text"
                    value={form.subtitle}
                    onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                    className="w-full fo-glass-input rounded-lg px-3 py-2 text-sm"
                    placeholder="Optional"
                  />
                </div>
                <div className="md:col-span-2 rounded-lg border border-white/15 p-4 bg-black/20">
                  <label className="block text-white/70 text-sm mb-2">Gambar Promo</label>
                  <p className="text-white/50 text-xs mb-3">Pilih file gambar atau isi URL. File akan diupload otomatis saat klik Simpan Promo. Rekomendasi rasio gambar 4:5 (portrait).</p>

                  <div className="grid grid-cols-1 gap-3 mb-3">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(e) => setSelectedImageFile(e.target.files?.[0] || null)}
                      className="w-full fo-glass-input rounded-lg px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary/20 file:px-3 file:py-1.5 file:text-primary"
                    />
                    {selectedImageFile && (
                      <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                        <p className="text-xs text-white/70 truncate pr-3">
                          {selectedImageFile.name} ({(selectedImageFile.size / (1024 * 1024)).toFixed(2)} MB)
                        </p>
                        <button
                          type="button"
                          onClick={() => setSelectedImageFile(null)}
                          className="text-xs text-white/70 hover:text-white"
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>

                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                    className="w-full fo-glass-input rounded-lg px-3 py-2 text-sm"
                    placeholder="URL gambar hasil upload akan muncul di sini"
                  />

                  {form.imageUrl && (
                    <div className="mt-3">
                      <p className="text-[11px] text-white/50 mb-2">Preview</p>
                      <div className="w-40 aspect-[4/5] rounded-lg border border-white/15 overflow-hidden">
                        <img
                          src={form.imageUrl}
                          alt="Preview promo"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white/70 text-sm mb-2">Deskripsi Promo</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full fo-glass-input rounded-lg px-3 py-2 text-sm"
                    placeholder="Isi detail promo"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Valid From</label>
                  <input
                    type="date"
                    value={form.validFrom}
                    onChange={(e) => setForm((prev) => ({ ...prev, validFrom: e.target.value }))}
                    className="w-full fo-glass-input rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Valid Until</label>
                  <input
                    type="date"
                    value={form.validUntil}
                    onChange={(e) => setForm((prev) => ({ ...prev, validUntil: e.target.value }))}
                    className="w-full fo-glass-input rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Teks Tombol CTA</label>
                  <input
                    type="text"
                    value={form.ctaText}
                    onChange={(e) => setForm((prev) => ({ ...prev, ctaText: e.target.value }))}
                    className="w-full fo-glass-input rounded-lg px-3 py-2 text-sm"
                    placeholder="Reservasi Sekarang"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Link CTA</label>
                  <input
                    type="text"
                    value={form.ctaLink}
                    onChange={(e) => setForm((prev) => ({ ...prev, ctaLink: e.target.value }))}
                    className="w-full fo-glass-input rounded-lg px-3 py-2 text-sm"
                    placeholder="/reservation"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Urutan Tampil</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm((prev) => ({ ...prev, order: e.target.value }))}
                    className="w-full fo-glass-input rounded-lg px-3 py-2 text-sm"
                    min={0}
                  />
                </div>
                <div className="flex items-end">
                  <label className="inline-flex items-center gap-2 text-sm text-white/80">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                      className="accent-primary"
                    />
                    Promo aktif
                  </label>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white/70 text-sm mb-2">Syarat & Ketentuan</label>
                  <textarea
                    value={form.terms}
                    onChange={(e) => setForm((prev) => ({ ...prev, terms: e.target.value }))}
                    rows={2}
                    className="w-full fo-glass-input rounded-lg px-3 py-2 text-sm"
                    placeholder="Contoh: Tidak dapat digabung promo lain"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-sm text-green-300">
                  {success}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-4">
                <button
                  onClick={onSubmit}
                  disabled={submitting}
                  className="fo-glass-card-soft border-primary/35 text-primary px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/20 transition-colors"
                >
                  {submitting ? 'Menyimpan...' : form.id ? 'Update Promo' : 'Simpan Promo'}
                </button>
                <button
                  onClick={resetForm}
                  className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/15 transition-colors"
                >
                  Reset Form
                </button>
              </div>
            </div>

            <div className="fo-glass-card rounded-xl overflow-hidden">
              <div className="p-4 border-b border-white/10 fo-glass-card-soft">
                <h3 className="text-white font-semibold">Daftar Promo Bulanan</h3>
              </div>

              {loading ? (
                <div className="p-8 text-center text-white/60">Loading promo...</div>
              ) : promos.length === 0 ? (
                <div className="p-8 text-center text-white/60">Belum ada promo yang diupload</div>
              ) : (
                <div className="divide-y divide-white/10">
                  {promos.map((promo) => (
                    <div key={promo.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="text-white font-semibold truncate">{promo.title}</p>
                          <span className={`text-[11px] px-2 py-0.5 rounded-full border ${promo.isActive ? 'text-green-300 border-green-400/40 bg-green-500/10' : 'text-gray-300 border-gray-400/30 bg-gray-500/10'}`}>
                            {promo.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-white/60 text-sm">{promo.promoMonth}</p>
                        {promo.description && <p className="text-white/50 text-xs mt-1 line-clamp-2">{promo.description}</p>}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => toggleActive(promo)}
                          className="bg-white/10 border border-white/20 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-white/15 transition-colors"
                        >
                          {promo.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                        <button
                          onClick={() => onEdit(promo)}
                          className="bg-primary/20 border border-primary/35 text-primary px-3 py-1.5 rounded-lg text-xs hover:bg-primary/30 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(promo.id)}
                          className="bg-red-500/10 border border-red-500/35 text-red-300 px-3 py-1.5 rounded-lg text-xs hover:bg-red-500/20 transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
