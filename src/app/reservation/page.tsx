'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';

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

  useEffect(() => {
    fetchTreatments();
  }, []);

  const fetchTreatments = async () => {
    try {
      const response = await fetch('/api/treatments');
      const data = await response.json();
      
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching treatments:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-white/60">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-20 pb-10">
        <div className="max-w-lg mx-auto px-4">
          {/* Header */}
          <div className="mb-6">
            <h1 className="font-playfair text-2xl font-bold text-primary mb-2">
              Form Reservasi
            </h1>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-500/20 border border-green-400 rounded-lg p-5 mb-6 text-center">
              <svg className="w-12 h-12 text-green-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-bold text-white mb-1">Reservasi Berhasil!</h3>
              <p className="text-white/80 text-sm">
                Kami akan menghubungi Anda segera.
              </p>
            </div>
          )}

          {/* Reservation Form */}
          {!success && (
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Pilih Treatment <span className="text-primary">*</span>
                  </label>
                  <select
                    name="treatmentId"
                    value={formData.treatmentId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2.5 bg-black/40 border border-white/20 text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                  >
                    <option value="">Pilih treatment...</option>
                    {categories.map((category) => (
                      <optgroup key={category.id} label={category.name}>
                        {category.treatments.map((treatment) => (
                          <option key={treatment.id} value={treatment.id}>
                            {treatment.name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
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
                  className="w-full bg-primary hover:bg-primary/90 text-dark font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {submitting ? 'Memproses...' : 'Kirim Reservasi'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
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
