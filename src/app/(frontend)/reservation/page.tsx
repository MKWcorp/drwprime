'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

import MobileLayout from '@/components/MobileLayout';
interface Treatment {
  id: string;
  name: string;
  price: number;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  treatments: Treatment[];
}

function ReservationContent() {
  const searchParams = useSearchParams();
  const affiliateCode = searchParams.get('ref');
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    treatmentId: '',
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    reservationDate: '',
    reservationTime: '',
    notes: ''
  });

  const [treatmentQuery, setTreatmentQuery] = useState('');
  const [treatmentOpen, setTreatmentOpen] = useState(false);

  useEffect(() => {
    fetchTreatments();
  }, []);

  const fetchTreatments = async () => {
    try {
      const response = await fetch('/api/treatments');
      const data = await response.json();

      setCategories(Array.isArray(data.categories) ? data.categories : []);
    } catch (error) {
      console.error('Error fetching treatments:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.treatmentId) {
      alert('Silakan pilih treatment terlebih dahulu');
      return;
    }
    
    setSubmitting(true);

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          treatmentId: formData.treatmentId,
          patientName: formData.patientName,
          patientEmail: formData.patientEmail,
          patientPhone: formData.patientPhone,
          reservationDate: formData.reservationDate,
          reservationTime: formData.reservationTime,
          patientNotes: formData.notes,
          referredBy: affiliateCode || undefined
        })
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          treatmentId: '',
          patientName: '',
          patientEmail: '',
          patientPhone: '',
          reservationDate: '',
          reservationTime: '',
          notes: ''
        });
        setTreatmentQuery('');
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      } else {
        alert('Gagal membuat reservasi. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTreatment = useMemo(() => {
    for (const category of categories) {
      const found = category.treatments.find((t) => t.id === formData.treatmentId);
      if (found) return found;
    }
    return null;
  }, [categories, formData.treatmentId]);

  const allTreatments = useMemo(
    () =>
      categories.flatMap((category) =>
        category.treatments.map((t) => ({ ...t, categoryName: category.name }))
      ),
    [categories]
  );

  const filteredTreatments = useMemo(() => {
    const q = treatmentQuery.trim().toLowerCase();
    if (!q) return allTreatments;
    return allTreatments.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.categoryName.toLowerCase().includes(q)
    );
  }, [allTreatments, treatmentQuery]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);

  if (loading) {
    return (
      <MobileLayout>
        <div className="min-h-screen bg-black">
          <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-white/60">Memuat data...</p>
          </div>
        </div>
      </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="min-h-screen bg-black">
        <Navbar />
      <div className="pt-20 pb-12 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 right-0 w-80 h-80 rounded-full bg-primary/10 blur-3xl"></div>
          <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-amber-500/5 blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-8">
            <p className="text-primary/70 text-xs tracking-[0.3em] uppercase mb-2">Reservasi</p>
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-2">
              Buat Janji Temu
            </h1>
            <p className="text-white/60 text-sm max-w-md mx-auto">
              Isi formulir di bawah ini. Tim kami akan menghubungi Anda untuk konfirmasi jadwal.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-6">
            {/* Info panel */}
            <aside className="space-y-4">
              <div className="bg-white/[0.04] backdrop-blur-sm border border-primary/15 rounded-2xl p-5">
                <h2 className="font-playfair text-lg font-bold text-white mb-4">Kenapa DRW Prime?</h2>
                <ul className="space-y-3.5">
                  {[
                    { t: 'Tim Profesional', d: 'Dokter & terapis berpengalaman' },
                    { t: 'Produk & Alat Premium', d: 'Standar klinik kecantikan terbaik' },
                    { t: 'Konsultasi Personal', d: 'Perawatan sesuai kebutuhan kulit Anda' },
                  ].map((item) => (
                    <li key={item.t} className="flex items-start gap-3">
                      <span className="mt-0.5 w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <div>
                        <p className="text-white text-sm font-semibold leading-tight">{item.t}</p>
                        <p className="text-white/50 text-xs mt-0.5">{item.d}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/[0.04] backdrop-blur-sm border border-primary/15 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-white text-sm font-semibold">Jam Operasional</p>
                    <p className="text-white/50 text-xs">Setiap hari, 09.00 &ndash; 20.00 WIB</p>
                  </div>
                </div>
                <Link
                  href="https://wa.me/6281138800071?text=Halo%2C%20saya%20ingin%20bertanya%20soal%20reservasi"
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-full bg-primary/10 border border-primary/30 text-primary rounded-lg py-2.5 text-sm font-semibold hover:bg-primary/20 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Tanya via WhatsApp
                </Link>
              </div>
            </aside>

            {/* Form / Success column */}
            <div>
              {/* Success Message */}
              {success && (
                <div className="bg-green-500/10 border border-green-400/40 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/15 border border-green-400/40 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Reservasi Berhasil!</h3>
                  <p className="text-white/70 text-sm">
                    Terima kasih. Tim kami akan menghubungi Anda segera untuk konfirmasi jadwal.
                  </p>
                </div>
              )}

              {/* Reservation Form */}
              {!success && (
                <div className="bg-white/[0.04] backdrop-blur-sm border border-primary/20 rounded-2xl p-5 md:p-6 shadow-2xl shadow-black/30">
                  {affiliateCode && (
                    <div className="mb-4 flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-lg px-3 py-2">
                      <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-white/70 text-xs">Kode referral: <span className="text-primary font-semibold">{affiliateCode}</span></span>
                    </div>
                  )}
                  <h2 className="font-playfair text-lg font-bold text-white mb-4">Detail Reservasi</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <label className="block text-white text-sm font-semibold mb-2">
                    Pilih Treatment <span className="text-primary">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={treatmentQuery}
                      onChange={(e) => {
                        setTreatmentQuery(e.target.value);
                        setTreatmentOpen(true);
                        if (formData.treatmentId) {
                          setFormData((prev) => ({ ...prev, treatmentId: '' }));
                        }
                      }}
                      onFocus={() => setTreatmentOpen(true)}
                      placeholder="Ketik untuk cari treatment..."
                      autoComplete="off"
                      className="w-full px-3 py-2.5 pr-9 bg-black/40 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary placeholder-white/40 text-sm"
                    />
                    <svg
                      className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60 transition-transform duration-200 pointer-events-none ${treatmentOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {treatmentOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setTreatmentOpen(false)}></div>
                      <div className="absolute left-0 right-0 mt-1 z-40 max-h-64 overflow-y-auto bg-[#161616] border border-primary/30 rounded-lg shadow-2xl shadow-black/60">
                        {filteredTreatments.length === 0 ? (
                          <p className="px-3 py-3 text-white/50 text-sm">Tidak ada treatment yang cocok</p>
                        ) : (
                          filteredTreatments.map((t) => (
                            <button
                              type="button"
                              key={t.id}
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, treatmentId: t.id }));
                                setTreatmentQuery(t.name);
                                setTreatmentOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center justify-between gap-2 border-b border-white/5 last:border-b-0 hover:bg-primary/15 ${
                                formData.treatmentId === t.id ? 'bg-primary/10' : ''
                              }`}
                            >
                              <span className="min-w-0">
                                <span className="block truncate text-white/90">{t.name}</span>
                                <span className="block text-[11px] text-white/40 truncate">{t.categoryName}</span>
                              </span>
                              <span className="text-primary/80 text-xs whitespace-nowrap">{formatCurrency(t.price)}</span>
                            </button>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </div>

                {selectedTreatment && (
                  <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-lg px-4 py-3">
                    <span className="text-white/80 text-sm truncate pr-2">{selectedTreatment.name}</span>
                    <span className="text-primary font-bold text-sm whitespace-nowrap">{formatCurrency(selectedTreatment.price)}</span>
                  </div>
                )}

                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Nama Lengkap <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 bg-black/40 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary placeholder-white/40 text-sm"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Email <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    name="patientEmail"
                    value={formData.patientEmail}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 bg-black/40 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary placeholder-white/40 text-sm"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Nomor Telepon <span className="text-primary">*</span>
                  </label>
                  <input
                    type="tel"
                    name="patientPhone"
                    value={formData.patientPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 bg-black/40 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary placeholder-white/40 text-sm"
                    placeholder="08xx xxxx xxxx"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Tanggal <span className="text-primary">*</span>
                    </label>
                    <input
                      type="date"
                      name="reservationDate"
                      value={formData.reservationDate}
                      onChange={handleInputChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2.5 bg-black/40 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm [color-scheme:dark]"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-semibold mb-2">
                      Waktu <span className="text-primary">*</span>
                    </label>
                    <select
                      name="reservationTime"
                      value={formData.reservationTime}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2.5 bg-black/40 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                    >
                      <option value="">Pilih jam...</option>
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="12:00">12:00</option>
                      <option value="13:00">13:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                      <option value="17:00">17:00</option>
                      <option value="18:00">18:00</option>
                      <option value="19:00">19:00</option>
                      <option value="20:00">20:00</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Catatan (Opsional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2.5 bg-black/40 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none placeholder-white/40 text-sm"
                    placeholder="Tambahkan catatan..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-primary to-primary-light text-dark font-bold py-3.5 px-6 rounded-lg transition-all hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    'Memproses...'
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Kirim Reservasi
                    </>
                  )}
                </button>
                <p className="text-white/40 text-[11px] text-center pt-1">
                  Dengan mengirim, Anda setuju dihubungi tim kami untuk konfirmasi jadwal.
                </p>
              </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
      </MobileLayout>
  );
}

export default function ReservationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    }>
      <ReservationContent />
    </Suspense>
  );
}
