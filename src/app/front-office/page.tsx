'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Reservation {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientNotes?: string;
  reservationDate: string;
  reservationTime: string;
  status: string;
  originalPrice: number;
  finalPrice: number;
  commissionAmount: number;
  adminNotes?: string;
  treatment: {
    name: string;
    category: {
      name: string;
    };
  };
  user: {
    firstName: string;
    lastName: string;
    email: string;
    affiliateCode: string;
  };
  referrer?: {
    firstName: string;
    lastName: string;
    affiliateCode: string;
  };
  createdAt: string;
}

interface Treatment {
  id: string;
  name: string;
  categoryName: string;
}

interface EditFormData {
  reservationId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  reservationDate: string;
  reservationTime: string;
  treatmentId: string;
  finalPrice: number;
  status: string;
  adminNotes: string;
  patientNotes: string;
  affiliateCode: string;
}

export default function FrontOfficePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [expandedReservation, setExpandedReservation] = useState<string | null>(null);
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);
  const [affiliateCode, setAffiliateCode] = useState('');
  const [affiliateError, setAffiliateError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<Reservation | null>(null);
  const [deleteError, setDeleteError] = useState('');


  const checkAdminAccess = async () => {
    if (!user) {
      router.push('/sign-in');
      return;
    }

    try {
      // Sync user with database
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.emailAddresses[0]?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName
        })
      });

      // Fetch user data to check admin status
      const response = await fetch('/api/user');
      const data = await response.json();
      
      if (data.user?.isAdmin) {
        setIsAdmin(true);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/');
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      checkAdminAccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterDate) params.append('date', filterDate);

      const response = await fetch(`/api/front-office/reservations?${params}`);
      const data = await response.json();
      setReservations(data.reservations || []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTreatments = async () => {
    try {
      const response = await fetch('/api/treatments');
      const data = await response.json();
      const allTreatments = data.categories.flatMap((cat: { name: string; treatments: Treatment[] }) => 
        cat.treatments.map((t: Treatment) => ({ ...t, categoryName: cat.name }))
      );
      setTreatments(allTreatments);
    } catch (error) {
      console.error('Error fetching treatments:', error);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchReservations();
      fetchTreatments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterDate, isAdmin]);

  const updateReservationStatus = async (id: string, status: string, adminNotes?: string, finalPrice?: number) => {
    try {
      const response = await fetch('/api/front-office/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId: id, status, adminNotes, finalPrice })
      });

      if (response.ok) {
        fetchReservations();
        setSelectedReservation(null);
        setShowPaymentModal(false);
        setPaymentAmount('');
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  const handleCompleteWithPayment = () => {
    if (!selectedReservation || !paymentAmount) return;
    
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    updateReservationStatus(selectedReservation.id, 'completed', undefined, amount);
  };

  const handleAddAffiliate = async () => {
    if (!selectedReservation || !affiliateCode) {
      setAffiliateError('Masukkan kode affiliate');
      return;
    }

    try {
      const response = await fetch(`/api/front-office/reservations`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationId: selectedReservation.id,
          affiliateCode: affiliateCode.trim().toUpperCase(),
          action: 'addAffiliate'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setAffiliateError(data.error || 'Gagal menambahkan affiliate');
        return;
      }

      // Success - refresh data
      await fetchReservations();
      setShowAffiliateModal(false);
      setAffiliateCode('');
      setAffiliateError('');
      setSelectedReservation(null);
    } catch (error) {
      console.error('Error adding affiliate:', error);
      setAffiliateError('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  const handleOpenEditModal = (reservation: Reservation) => {
    setEditFormData({
      reservationId: reservation.id,
      patientName: reservation.patientName,
      patientEmail: reservation.patientEmail,
      patientPhone: reservation.patientPhone,
      reservationDate: new Date(reservation.reservationDate).toISOString().split('T')[0],
      reservationTime: reservation.reservationTime,
      treatmentId: reservation.treatment ? (treatments.find(t => t.name === reservation.treatment.name)?.id || '') : '',
      finalPrice: reservation.finalPrice,
      status: reservation.status,
      adminNotes: reservation.adminNotes || '',
      patientNotes: reservation.patientNotes || '',
      affiliateCode: reservation.referrer?.affiliateCode || ''
    });
    setShowEditModal(true);
    setEditError('');
    setEditSuccess('');
  };

  const handleEditReservation = async () => {
    if (!editFormData) return;

    try {
      setEditError('');
      setEditSuccess('');

      const response = await fetch('/api/front-office/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData)
      });

      const data = await response.json();

      if (!response.ok) {
        setEditError(data.error || 'Gagal mengupdate reservasi');
        return;
      }

      // Success
      setEditSuccess('Reservasi berhasil diupdate!');
      await fetchReservations();
      
      // Close modal after 1 second
      setTimeout(() => {
        setShowEditModal(false);
        setEditFormData(null);
        setEditError('');
        setEditSuccess('');
      }, 1000);
    } catch (error) {
      console.error('Error updating reservation:', error);
      setEditError('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  const handleDeleteReservation = async () => {
    if (!reservationToDelete) return;

    try {
      setDeleteError('');

      const response = await fetch(`/api/front-office/reservations?id=${reservationToDelete.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        setDeleteError(data.error || 'Gagal menghapus reservasi');
        return;
      }

      // Success - refresh data and close modal
      await fetchReservations();
      setShowDeleteModal(false);
      setReservationToDelete(null);
      setDeleteError('');
    } catch (error) {
      console.error('Error deleting reservation:', error);
      setDeleteError('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'confirmed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (checkingAuth || !isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-white/60">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-5 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-2">
                Front Office Dashboard
              </h1>
              <p className="text-white/70 text-lg">
                Manage reservations and appointments
              </p>
              <Link 
                href="/front-office/codes"
                className="text-primary hover:text-primary/80 text-sm mt-2 inline-block"
              >
                → Manage Affiliate Codes
              </Link>
            </div>
            <Image 
              src="/drwprime-logo.png" 
              alt="DRW Prime" 
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30 rounded-xl p-6">
            <p className="text-yellow-400 text-sm mb-2">Pending</p>
            <p className="font-playfair text-3xl font-bold text-yellow-400">
              {reservations.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30 rounded-xl p-6">
            <p className="text-blue-400 text-sm mb-2">Confirmed</p>
            <p className="font-playfair text-3xl font-bold text-blue-400">
              {reservations.filter(r => r.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 rounded-xl p-6">
            <p className="text-green-400 text-sm mb-2">Completed</p>
            <p className="font-playfair text-3xl font-bold text-green-400">
              {reservations.filter(r => r.status === 'completed').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-6">
            <p className="text-primary text-sm mb-2">Total Today</p>
            <p className="font-playfair text-3xl font-bold text-primary">
              {reservations.length}
            </p>
          </div>
        </div>

        {/* Reservations List */}
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-playfair text-2xl font-bold text-white">Reservations</h2>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-white/10">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-primary/10 border border-primary/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary [&>option]:text-black"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-primary/10 border border-primary/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary [color-scheme:dark]"
            />

            {filterDate && (
              <button
                onClick={() => setFilterDate('')}
                className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Clear Date
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-white/60 mt-4">Loading...</p>
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-white/60">No reservations found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="bg-black/30 rounded-lg border border-white/5 overflow-hidden"
                >
                  {/* Collapsed Header */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-black/40 transition-all"
                    onClick={() => setExpandedReservation(expandedReservation === reservation.id ? null : reservation.id)}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-white">
                            {reservation.patientName}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(reservation.status)}`}>
                            {reservation.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-white/60 text-xs">
                          {reservation.treatment.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm font-semibold">{formatDate(reservation.reservationDate)}</p>
                        <p className="text-primary text-xs">{reservation.reservationTime}</p>
                      </div>
                    </div>
                    <svg 
                      className={`w-5 h-5 text-white/60 ml-4 transition-transform ${expandedReservation === reservation.id ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Expanded Content */}
                  {expandedReservation === reservation.id && (
                    <div className="p-4 pt-0 space-y-3 border-t border-white/5">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-white/40 text-xs mb-1">Phone</p>
                          <p className="text-white">{reservation.patientPhone}</p>
                        </div>
                        <div>
                          <p className="text-white/40 text-xs mb-1">Email</p>
                          <p className="text-white text-sm">{reservation.patientEmail}</p>
                        </div>
                        <div>
                          <p className="text-white/40 text-xs mb-1">Category</p>
                          <p className="text-white">{reservation.treatment.category.name}</p>
                        </div>
                        <div>
                          <p className="text-white/40 text-xs mb-1">Price</p>
                          <p className="text-primary font-semibold">{formatCurrency(reservation.finalPrice)}</p>
                        </div>
                      </div>

                      {reservation.patientNotes && (
                        <div>
                          <p className="text-white/40 text-xs mb-1">Notes</p>
                          <p className="text-white text-sm">{reservation.patientNotes}</p>
                        </div>
                      )}

                      {reservation.referrer && (
                        <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                          <p className="text-primary text-xs font-semibold mb-1">Affiliate</p>
                          <p className="text-white text-sm font-semibold">
                            {reservation.referrer.affiliateCode}
                          </p>
                          {reservation.commissionAmount > 0 && (
                            <p className="text-green-400 text-sm mt-1">
                              Commission: {formatCurrency(reservation.commissionAmount)}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditModal(reservation);
                          }}
                          className="flex-1 bg-purple-500/20 border border-purple-500/30 text-purple-400 py-2 rounded-lg hover:bg-purple-500/30 transition-colors text-sm font-semibold"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setReservationToDelete(reservation);
                            setShowDeleteModal(true);
                          }}
                          className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400 py-2 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-semibold"
                        >
                          🗑️ Delete
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReservation(reservation);
                          }}
                          className="flex-1 bg-primary/20 border border-primary/30 text-primary py-2 rounded-lg hover:bg-primary/30 transition-colors text-sm font-semibold"
                        >
                          View Details
                        </button>
                        {reservation.status === 'pending' && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateReservationStatus(reservation.id, 'confirmed');
                              }}
                              className="flex-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 py-2 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-semibold"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateReservationStatus(reservation.id, 'cancelled');
                              }}
                              className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400 py-2 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-semibold"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {reservation.status === 'confirmed' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReservation(reservation);
                              setShowPaymentModal(true);
                            }}
                            className="flex-1 bg-green-500/20 border border-green-500/30 text-green-400 py-2 rounded-lg hover:bg-green-500/30 transition-colors text-sm font-semibold"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedReservation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair text-2xl font-bold text-white">
                Reservation Details
              </h3>
              <button
                onClick={() => setSelectedReservation(null)}
                className="text-white/60 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-white/60 text-sm mb-1">Patient Name</p>
                <p className="text-white font-semibold">{selectedReservation.patientName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 text-sm mb-1">Phone</p>
                  <p className="text-white">{selectedReservation.patientPhone}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Email</p>
                  <p className="text-white">{selectedReservation.patientEmail}</p>
                </div>
              </div>
              <div>
                <p className="text-white/60 text-sm mb-1">Treatment</p>
                <p className="text-white font-semibold">
                  {selectedReservation.treatment.category.name} - {selectedReservation.treatment.name}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-white/60 text-sm mb-1">Date</p>
                  <p className="text-white">{formatDate(selectedReservation.reservationDate)}</p>
                </div>
                <div>
                  <p className="text-white/60 text-sm mb-1">Time</p>
                  <p className="text-white">{selectedReservation.reservationTime}</p>
                </div>
              </div>
              <div>
                <p className="text-white/60 text-sm mb-1">Price</p>
                <p className="text-primary font-bold text-xl">
                  {formatCurrency(selectedReservation.finalPrice)}
                </p>
              </div>
              {selectedReservation.patientNotes && (
                <div>
                  <p className="text-white/60 text-sm mb-1">Patient Notes</p>
                  <p className="text-white">{selectedReservation.patientNotes}</p>
                </div>
              )}
              {selectedReservation.referrer ? (
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                  <p className="text-primary font-semibold mb-2">Affiliate</p>
                  <p className="text-white text-lg font-bold font-mono">
                    {selectedReservation.referrer.affiliateCode}
                  </p>
                  <p className="text-green-400 text-sm mt-2">
                    Commission: {formatCurrency(selectedReservation.commissionAmount)}
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-400 font-semibold mb-1">No Affiliate</p>
                      <p className="text-white/60 text-xs">Reservasi ini belum memiliki referrer</p>
                    </div>
                    <button
                      onClick={() => setShowAffiliateModal(true)}
                      className="bg-primary/20 border border-primary/30 text-primary px-4 py-2 rounded-lg hover:bg-primary/30 transition-colors text-sm font-semibold whitespace-nowrap"
                    >
                      + Add Referrer
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {selectedReservation.status === 'pending' && (
              <div className="flex gap-3">
                <button
                  onClick={() => updateReservationStatus(selectedReservation.id, 'confirmed')}
                  className="flex-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 py-3 rounded-lg hover:bg-blue-500/30 transition-colors font-semibold"
                >
                  Confirm
                </button>
                <button
                  onClick={() => updateReservationStatus(selectedReservation.id, 'cancelled')}
                  className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400 py-3 rounded-lg hover:bg-red-500/30 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            )}
            {selectedReservation.status === 'confirmed' && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full bg-green-500/20 border border-green-500/30 text-green-400 py-3 rounded-lg hover:bg-green-500/30 transition-colors font-semibold"
              >
                Complete with Payment
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add Affiliate Modal */}
      {showAffiliateModal && selectedReservation && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair text-2xl font-bold text-white">
                Tambah Affiliate
              </h3>
              <button
                onClick={() => {
                  setShowAffiliateModal(false);
                  setAffiliateCode('');
                  setAffiliateError('');
                }}
                className="text-white/60 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-white/60 text-sm mb-1">Patient</p>
                <p className="text-white font-semibold">{selectedReservation.patientName}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm mb-1">Treatment</p>
                <p className="text-white">{selectedReservation.treatment.name}</p>
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">
                  Kode Affiliate *
                </label>
                <input
                  type="text"
                  value={affiliateCode}
                  onChange={(e) => {
                    setAffiliateCode(e.target.value.toUpperCase());
                    setAffiliateError('');
                  }}
                  placeholder="Contoh: JO5X9"
                  className="w-full bg-black/50 border-2 border-primary/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary text-lg font-mono uppercase"
                  maxLength={10}
                />
                <p className="text-white/40 text-xs mt-1">
                  Masukkan kode affiliate untuk menambahkan referrer ke reservasi ini
                </p>
                {affiliateError && (
                  <p className="text-red-400 text-sm mt-2">{affiliateError}</p>
                )}
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-400 text-xs">
                  ⚠️ Pastikan kode affiliate valid. Komisi akan dihitung berdasarkan final price reservasi.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAffiliateModal(false);
                  setAffiliateCode('');
                  setAffiliateError('');
                }}
                className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-lg hover:bg-white/10 transition-colors font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleAddAffiliate}
                disabled={!affiliateCode}
                className="flex-1 bg-primary/20 border border-primary/30 text-primary py-3 rounded-lg hover:bg-primary/30 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editFormData && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair text-2xl font-bold text-white">
                Edit Reservasi
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditFormData(null);
                  setEditError('');
                  setEditSuccess('');
                }}
                className="text-white/60 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Patient Info */}
              <div className="bg-black/30 rounded-lg p-4 space-y-3">
                <h4 className="text-white font-semibold mb-2">Informasi Pasien</h4>
                <div>
                  <label className="text-white/60 text-sm mb-1 block">Nama Pasien *</label>
                  <input
                    type="text"
                    value={editFormData.patientName}
                    onChange={(e) => setEditFormData({...editFormData, patientName: e.target.value})}
                    className="w-full bg-black/50 border border-primary/30 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/60 text-sm mb-1 block">Email *</label>
                    <input
                      type="email"
                      value={editFormData.patientEmail}
                      onChange={(e) => setEditFormData({...editFormData, patientEmail: e.target.value})}
                      className="w-full bg-black/50 border border-primary/30 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1 block">Phone *</label>
                    <input
                      type="tel"
                      value={editFormData.patientPhone}
                      onChange={(e) => setEditFormData({...editFormData, patientPhone: e.target.value})}
                      className="w-full bg-black/50 border border-primary/30 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Reservation Details */}
              <div className="bg-black/30 rounded-lg p-4 space-y-3">
                <h4 className="text-white font-semibold mb-2">Detail Reservasi</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/60 text-sm mb-1 block">Tanggal *</label>
                    <input
                      type="date"
                      value={editFormData.reservationDate}
                      onChange={(e) => setEditFormData({...editFormData, reservationDate: e.target.value})}
                      className="w-full bg-black/50 border border-primary/30 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary [color-scheme:dark]"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1 block">Waktu *</label>
                    <input
                      type="time"
                      value={editFormData.reservationTime}
                      onChange={(e) => setEditFormData({...editFormData, reservationTime: e.target.value})}
                      className="w-full bg-black/50 border border-primary/30 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary [color-scheme:dark]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-1 block">Treatment *</label>
                  <select
                    value={editFormData.treatmentId}
                    onChange={(e) => setEditFormData({...editFormData, treatmentId: e.target.value})}
                    className="w-full bg-black/50 border border-primary/30 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary [&>option]:text-black"
                  >
                    <option value="">Pilih Treatment</option>
                    {treatments.map((treatment) => (
                      <option key={treatment.id} value={treatment.id}>
                        {treatment.categoryName} - {treatment.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/60 text-sm mb-1 block">Status *</label>
                    <select
                      value={editFormData.status}
                      onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                      className="w-full bg-black/50 border border-primary/30 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary [&>option]:text-black"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm mb-1 block">Final Price *</label>
                    <input
                      type="number"
                      value={editFormData.finalPrice}
                      onChange={(e) => setEditFormData({...editFormData, finalPrice: parseFloat(e.target.value)})}
                      className="w-full bg-black/50 border border-primary/30 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Affiliate Code */}
              <div className="bg-black/30 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Kode Affiliate</h4>
                <div>
                  <label className="text-white/60 text-sm mb-1 block">Kode Affiliate (opsional)</label>
                  <input
                    type="text"
                    value={editFormData.affiliateCode}
                    onChange={(e) => setEditFormData({...editFormData, affiliateCode: e.target.value.toUpperCase()})}
                    placeholder="Contoh: JO5X9"
                    className="w-full bg-black/50 border border-primary/30 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary font-mono uppercase"
                    maxLength={10}
                  />
                  <p className="text-white/40 text-xs mt-1">
                    Kosongkan jika tidak ada affiliate. Komisi 10% akan dihitung otomatis.
                  </p>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-black/30 rounded-lg p-4 space-y-3">
                <h4 className="text-white font-semibold mb-2">Catatan</h4>
                <div>
                  <label className="text-white/60 text-sm mb-1 block">Catatan Pasien</label>
                  <textarea
                    value={editFormData.patientNotes}
                    onChange={(e) => setEditFormData({...editFormData, patientNotes: e.target.value})}
                    rows={2}
                    className="w-full bg-black/50 border border-primary/30 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary resize-none"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-1 block">Catatan Admin</label>
                  <textarea
                    value={editFormData.adminNotes}
                    onChange={(e) => setEditFormData({...editFormData, adminNotes: e.target.value})}
                    rows={2}
                    className="w-full bg-black/50 border border-primary/30 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>

              {/* Error/Success Messages */}
              {editError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{editError}</p>
                </div>
              )}
              {editSuccess && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-400 text-sm">{editSuccess}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditFormData(null);
                  setEditError('');
                  setEditSuccess('');
                }}
                className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-lg hover:bg-white/10 transition-colors font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleEditReservation}
                disabled={!editFormData.patientName || !editFormData.patientEmail || !editFormData.treatmentId}
                className="flex-1 bg-primary/20 border border-primary/30 text-primary py-3 rounded-lg hover:bg-primary/30 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && reservationToDelete && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/30 rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair text-2xl font-bold text-white">
                Konfirmasi Hapus
              </h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setReservationToDelete(null);
                  setDeleteError('');
                }}
                className="text-white/60 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400 font-semibold mb-2">
                  ⚠️ Peringatan
                </p>
                <p className="text-white/80 text-sm">
                  Anda akan menghapus reservasi ini secara permanen. Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>

              <div className="bg-black/30 rounded-lg p-4 space-y-2">
                <div>
                  <p className="text-white/60 text-xs">Pasien</p>
                  <p className="text-white font-semibold">{reservationToDelete.patientName}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs">Treatment</p>
                  <p className="text-white">{reservationToDelete.treatment.name}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs">Tanggal</p>
                  <p className="text-white">{formatDate(reservationToDelete.reservationDate)} - {reservationToDelete.reservationTime}</p>
                </div>
                {reservationToDelete.referrer && (
                  <div>
                    <p className="text-white/60 text-xs">Affiliate</p>
                    <p className="text-primary font-semibold">{reservationToDelete.referrer.affiliateCode}</p>
                  </div>
                )}
              </div>

              {deleteError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{deleteError}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setReservationToDelete(null);
                  setDeleteError('');
                }}
                className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-lg hover:bg-white/10 transition-colors font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteReservation}
                className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400 py-3 rounded-lg hover:bg-red-500/30 transition-colors font-semibold"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedReservation && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair text-2xl font-bold text-white">
                Input Total Pembayaran
              </h3>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentAmount('');
                }}
                className="text-white/60 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-white/60 text-sm mb-1">Patient</p>
                <p className="text-white font-semibold">{selectedReservation.patientName}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm mb-1">Treatment</p>
                <p className="text-white">{selectedReservation.treatment.name}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm mb-1">Original Price</p>
                <p className="text-primary font-bold">{formatCurrency(selectedReservation.originalPrice)}</p>
              </div>
              
              {selectedReservation.referrer && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-400 text-sm font-semibold mb-1">
                    ✓ Ada Referral dari {selectedReservation.referrer.firstName}
                  </p>
                  <p className="text-white/60 text-xs">
                    Komisi 10% akan otomatis dihitung dari total pembayaran
                  </p>
                </div>
              )}

              <div>
                <label className="text-white font-semibold mb-2 block">
                  Total Pembayaran Aktual *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-semibold">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="0"
                    className="w-full bg-black/50 border-2 border-primary/30 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:border-primary text-lg font-semibold"
                  />
                </div>
                <p className="text-white/40 text-xs mt-1">
                  Masukkan jumlah yang dibayarkan pasien (bisa berbeda dari harga asli karena promo/diskon)
                </p>
              </div>

              {paymentAmount && parseFloat(paymentAmount) > 0 && selectedReservation.referrer && (
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                  <p className="text-white/60 text-xs mb-1">Komisi untuk Afiliator:</p>
                  <p className="text-primary font-bold text-lg">
                    {formatCurrency(parseFloat(paymentAmount) * 0.10)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentAmount('');
                }}
                className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-lg hover:bg-white/10 transition-colors font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleCompleteWithPayment}
                disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                className="flex-1 bg-green-500/20 border border-green-500/30 text-green-400 py-3 rounded-lg hover:bg-green-500/30 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selesaikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
