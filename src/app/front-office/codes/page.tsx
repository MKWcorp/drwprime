'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { QRCodeCanvas } from 'qrcode.react';

interface BankAccount {
  id: string;
  accountType: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
}

interface AffiliateCode {
  id: string;
  code: string;
  assignedEmail: string | null;
  claimedBy: string | null;
  claimedAt: string | null;
  usageCount: number;
  status: string;
  notes: string | null;
  createdAt: string;
  reservationCount: number;
  totalCommission: number;
  bankAccount: BankAccount | null;
}

interface CodeReservation {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  status: string;
  treatment: {
    name: string;
  };
  reservationDate: string;
  finalPrice: number;
  commissionAmount: number;
  patientNotes?: string;
  referredBy?: string;
}

export default function AffiliateCodesPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [codes, setCodes] = useState<AffiliateCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Generate code form
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [customCode, setCustomCode] = useState('');
  const [codeNotes, setCodeNotes] = useState('');
  
  // QR Code modal
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedCodeForQR, setSelectedCodeForQR] = useState<AffiliateCode | null>(null);
  const qrRef = useRef<HTMLCanvasElement>(null);
  const [generateError, setGenerateError] = useState('');
  const [generateSuccess, setGenerateSuccess] = useState('');
  
  // Delete code
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [codeToDelete, setCodeToDelete] = useState<AffiliateCode | null>(null);
  const [deleteError, setDeleteError] = useState('');
  
  // Copy link
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // Detail modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCodeDetail, setSelectedCodeDetail] = useState<AffiliateCode | null>(null);
  const [codeReservations, setCodeReservations] = useState<CodeReservation[]>([]);
  
  // Assign/Claim/Transfer modals
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState<AffiliateCode | null>(null);
  const [assignEmail, setAssignEmail] = useState('');
  const [claimEmail, setClaimEmail] = useState('');
  const [transferEmail, setTransferEmail] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const checkAdminAccess = async () => {
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
          lastName: user.lastName
        })
      });

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

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const response = await fetch(`/api/affiliate-codes?${params}`);
      const data = await response.json();
      setCodes(data.codes || []);
    } catch (error) {
      console.error('Error fetching codes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchCodes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, isAdmin]);

  const handleGenerateCode = async () => {
    try {
      setGenerateError('');
      setGenerateSuccess('');

      const response = await fetch('/api/affiliate-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customCode: customCode || null,
          notes: codeNotes || null,
          createdBy: user?.emailAddresses[0]?.emailAddress
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setGenerateError(data.error || 'Gagal generate kode');
        return;
      }

      setGenerateSuccess(`Kode ${data.code.code} berhasil dibuat!`);
      await fetchCodes();
      
      setTimeout(() => {
        setShowGenerateModal(false);
        setCustomCode('');
        setCodeNotes('');
        setGenerateError('');
        setGenerateSuccess('');
      }, 1500);
    } catch (error) {
      console.error('Error generating code:', error);
      setGenerateError('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  const handleDeleteCode = async () => {
    if (!codeToDelete) return;

    try {
      setDeleteError('');

      const response = await fetch(`/api/affiliate-codes?id=${codeToDelete.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        setDeleteError(data.error || 'Gagal menghapus kode');
        return;
      }

      await fetchCodes();
      setShowDeleteModal(false);
      setCodeToDelete(null);
      setDeleteError('');
    } catch (error) {
      console.error('Error deleting code:', error);
      setDeleteError('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  const handleShowQR = (code: AffiliateCode) => {
    setSelectedCodeForQR(code);
    setShowQRModal(true);
  };

  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    
    const canvas = qrRef.current;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `QR-${selectedCodeForQR?.code}.png`;
    link.href = url;
    link.click();
  };

  const handleShareQR = async () => {
    if (!qrRef.current || !selectedCodeForQR) return;

    try {
      const canvas = qrRef.current;
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png');
      });

      const file = new File([blob], `QR-${selectedCodeForQR.code}.png`, { type: 'image/png' });
      const referralLink = `https://drwprime.com/reservation?ref=${selectedCodeForQR.code}`;

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Kode Affiliate: ${selectedCodeForQR.code}`,
          text: `Gunakan kode affiliate ${selectedCodeForQR.code} untuk booking treatment di DRW Prime!\n\n${referralLink}`,
          files: [file]
        });
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(referralLink);
        alert('Link referral berhasil di-copy! Share QR code tidak didukung di browser ini.');
      }
    } catch (error) {
      console.error('Error sharing QR:', error);
      alert('Gagal share QR code. Silakan coba download.');
    }
  };

  const handleViewDetails = async (code: AffiliateCode) => {
    setSelectedCodeDetail(code);
    setShowDetailModal(true);
    
    try {
      // Fetch reservations that use this code
      const response = await fetch(`/api/front-office/reservations`);
      const data = await response.json();
      
      // Filter reservations by this affiliate code
      const filteredReservations = data.reservations.filter(
        (res: CodeReservation) => res.referredBy === code.code
      );
      
      setCodeReservations(filteredReservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setCodeReservations([]);
    }
  };

  const handleCopyLink = async (code: string) => {
    const referralLink = `https://drwprime.com/reservation?ref=${code}`;
    
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedCode(code);
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedCode(null);
      }, 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setCopiedCode(code);
      setTimeout(() => {
        setCopiedCode(null);
      }, 2000);
    }
  };

  const handleAssignOwner = async () => {
    if (!selectedCode || !assignEmail.trim()) {
      setActionError('Email tidak boleh kosong');
      return;
    }

    try {
      const response = await fetch('/api/affiliate-codes/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codeId: selectedCode.id,
          email: assignEmail.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setActionError(data.error || 'Gagal assign kode');
        return;
      }

      setActionSuccess('Kode berhasil di-assign!');
      await fetchCodes();
      setTimeout(() => {
        setShowAssignModal(false);
        setSelectedCode(null);
        setAssignEmail('');
        setActionError('');
        setActionSuccess('');
      }, 1500);
    } catch (error) {
      console.error('Error assigning code:', error);
      setActionError('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  const handleClaimCode = async () => {
    if (!selectedCode || !claimEmail.trim()) {
      setActionError('Email tidak boleh kosong');
      return;
    }

    try {
      const response = await fetch('/api/affiliate-codes/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codeId: selectedCode.id,
          email: claimEmail.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setActionError(data.error || 'Gagal claim kode');
        return;
      }

      setActionSuccess('Kode berhasil di-claim!');
      await fetchCodes();
      setTimeout(() => {
        setShowClaimModal(false);
        setSelectedCode(null);
        setClaimEmail('');
        setActionError('');
        setActionSuccess('');
      }, 1500);
    } catch (error) {
      console.error('Error claiming code:', error);
      setActionError('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  const handleTransferOwnership = async () => {
    if (!selectedCode || !transferEmail.trim()) {
      setActionError('Email tidak boleh kosong');
      return;
    }

    try {
      const response = await fetch('/api/affiliate-codes/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codeId: selectedCode.id,
          newEmail: transferEmail.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setActionError(data.error || 'Gagal transfer kode');
        return;
      }

      setActionSuccess('Kode berhasil di-transfer!');
      await fetchCodes();
      setTimeout(() => {
        setShowTransferModal(false);
        setSelectedCode(null);
        setTransferEmail('');
        setActionError('');
        setActionSuccess('');
      }, 1500);
    } catch (error) {
      console.error('Error transferring code:', error);
      setActionError('Terjadi kesalahan. Silakan coba lagi.');
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
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'claimed' 
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
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
              <Link 
                href="/front-office"
                className="text-primary hover:text-primary/80 text-sm mb-2 inline-block"
              >
                ← Back to Reservations
              </Link>
              <h1 className="font-playfair text-4xl md:text-5xl font-bold text-primary mb-2">
                Affiliate Codes
              </h1>
              <p className="text-white/70 text-lg">
                Generate and manage pre-claim affiliate codes
              </p>
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
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-6">
            <p className="text-primary text-sm mb-2">Total Codes</p>
            <p className="font-playfair text-3xl font-bold text-primary">
              {codes.length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/30 rounded-xl p-6">
            <p className="text-yellow-400 text-sm mb-2">Unclaimed</p>
            <p className="font-playfair text-3xl font-bold text-yellow-400">
              {codes.filter(c => c.status === 'unclaimed').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 rounded-xl p-6">
            <p className="text-green-400 text-sm mb-2">Claimed</p>
            <p className="font-playfair text-3xl font-bold text-green-400">
              {codes.filter(c => c.status === 'claimed').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30 rounded-xl p-6">
            <p className="text-blue-400 text-sm mb-2">Total Usage</p>
            <p className="font-playfair text-3xl font-bold text-blue-400">
              {codes.reduce((sum, c) => sum + c.reservationCount, 0)}
            </p>
          </div>
        </div>

        {/* Codes List */}
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-playfair text-2xl font-bold text-white">Codes</h2>
            <button
              onClick={() => setShowGenerateModal(true)}
              className="bg-primary/20 border border-primary/30 text-primary px-6 py-2 rounded-lg hover:bg-primary/30 transition-colors font-semibold"
            >
              + Generate Code
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-white/10">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-primary/10 border border-primary/30 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary [&>option]:text-black"
            >
              <option value="all">All Status</option>
              <option value="unclaimed">Unclaimed</option>
              <option value="claimed">Claimed</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-white/60 mt-4">Loading...</p>
            </div>
          ) : codes.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-white/60">No codes found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-white/60 text-sm font-semibold pb-3 px-4">Code</th>
                    <th className="text-left text-white/60 text-sm font-semibold pb-3 px-4">Assigned Email</th>
                    <th className="text-left text-white/60 text-sm font-semibold pb-3 px-4">Status</th>
                    <th className="text-left text-white/60 text-sm font-semibold pb-3 px-4">Rekening</th>
                    <th className="text-left text-white/60 text-sm font-semibold pb-3 px-4">Usage</th>
                    <th className="text-left text-white/60 text-sm font-semibold pb-3 px-4">Commission</th>
                    <th className="text-left text-white/60 text-sm font-semibold pb-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {codes.map((code) => (
                    <tr key={code.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleViewDetails(code)}
                          className="text-primary font-bold font-mono text-lg hover:text-primary/80 underline decoration-dotted cursor-pointer"
                        >
                          {code.code}
                        </button>
                        {code.reservationCount > 0 && (
                          <span className="ml-2 text-xs text-white/40">
                            (klik untuk detail)
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {code.assignedEmail ? (
                          <span className="text-white/80 text-sm">{code.assignedEmail}</span>
                        ) : (
                          <span className="text-white/40 text-sm">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(code.status)}`}>
                          {code.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {code.bankAccount ? (
                          <span className="text-white/80 text-sm">
                            {code.bankAccount.bankName} - {code.bankAccount.accountNumber}
                          </span>
                        ) : (
                          <span className="text-white/40 text-sm">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-semibold">
                          {code.reservationCount}
                        </span>
                        <span className="text-white/40 text-sm ml-1">reservations</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-green-400 font-semibold">
                          {formatCurrency(code.totalCommission)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => handleCopyLink(code.code)}
                            className="bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary px-2 py-1 rounded text-xs font-semibold"
                          >
                            {copiedCode === code.code ? '✓ Copied' : 'Copy Link'}
                          </button>
                          <button
                            onClick={() => handleShowQR(code)}
                            className="text-primary hover:text-primary/80 text-xs font-semibold"
                            title="Show QR Code"
                          >
                            QR
                          </button>
                          {!code.assignedEmail && (
                            <button
                              onClick={() => {
                                setSelectedCode(code);
                                setShowAssignModal(true);
                              }}
                              className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 px-2 py-1 rounded text-xs font-semibold"
                            >
                              Assign
                            </button>
                          )}
                          {code.assignedEmail && code.status === 'unclaimed' && (
                            <button
                              onClick={() => {
                                setSelectedCode(code);
                                setClaimEmail(code.assignedEmail || '');
                                setShowClaimModal(true);
                              }}
                              className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400 px-2 py-1 rounded text-xs font-semibold"
                            >
                              Claim
                            </button>
                          )}
                          {code.status === 'claimed' && (
                            <button
                              onClick={() => {
                                setSelectedCode(code);
                                setShowTransferModal(true);
                              }}
                              className="bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-400 px-2 py-1 rounded text-xs font-semibold"
                            >
                              Transfer
                            </button>
                          )}
                          {code.status === 'unclaimed' && code.reservationCount === 0 && (
                            <button
                              onClick={() => {
                                setCodeToDelete(code);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-400 hover:text-red-300 text-xs font-semibold"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Generate Code Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair text-2xl font-bold text-white">
                Generate Affiliate Code
              </h3>
              <button
                onClick={() => {
                  setShowGenerateModal(false);
                  setCustomCode('');
                  setCodeNotes('');
                  setGenerateError('');
                  setGenerateSuccess('');
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
                <label className="text-white font-semibold mb-2 block">
                  Custom Code (opsional)
                </label>
                <input
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                  placeholder="Kosongkan untuk generate random"
                  className="w-full bg-black/50 border border-primary/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary font-mono uppercase"
                  maxLength={10}
                />
                <p className="text-white/40 text-xs mt-1">
                  4-10 karakter (huruf kapital & angka). Kosongkan untuk generate otomatis.
                </p>
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">
                  Notes (opsional)
                </label>
                <textarea
                  value={codeNotes}
                  onChange={(e) => setCodeNotes(e.target.value)}
                  placeholder="Catatan tentang kode ini..."
                  rows={2}
                  className="w-full bg-black/50 border border-primary/30 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary resize-none"
                />
              </div>

              {generateError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{generateError}</p>
                </div>
              )}

              {generateSuccess && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-400 text-sm">{generateSuccess}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowGenerateModal(false);
                  setCustomCode('');
                  setCodeNotes('');
                  setGenerateError('');
                  setGenerateSuccess('');
                }}
                className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-lg hover:bg-white/10 transition-colors font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleGenerateCode}
                className="flex-1 bg-primary/20 border border-primary/30 text-primary py-3 rounded-lg hover:bg-primary/30 transition-colors font-semibold"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && codeToDelete && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/30 rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair text-2xl font-bold text-white">
                Konfirmasi Hapus
              </h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCodeToDelete(null);
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
                  Anda akan menghapus kode affiliate ini secara permanen.
                </p>
              </div>

              <div className="bg-black/30 rounded-lg p-4">
                <p className="text-white/60 text-xs mb-1">Kode</p>
                <p className="text-primary font-bold font-mono text-2xl">
                  {codeToDelete.code}
                </p>
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
                  setCodeToDelete(null);
                  setDeleteError('');
                }}
                className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-lg hover:bg-white/10 transition-colors font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteCode}
                className="flex-1 bg-red-500/20 border border-red-500/30 text-red-400 py-3 rounded-lg hover:bg-red-500/30 transition-colors font-semibold"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal - Show reservations using this code */}
      {showDetailModal && selectedCodeDetail && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h3 className="font-playfair text-2xl font-bold text-white mb-1">
                  Detail Kode: <span className="text-primary font-mono">{selectedCodeDetail.code}</span>
                </h3>
                <p className="text-white/60 text-sm">
                  {codeReservations.length} reservasi menggunakan kode ini
                </p>
              </div>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedCodeDetail(null);
                  setCodeReservations([]);
                }}
                className="text-white/60 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {codeReservations.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-white/60">Belum ada reservasi yang menggunakan kode ini</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {codeReservations.map((reservation: CodeReservation) => (
                    <div key={reservation.id} className="bg-black/30 border border-white/10 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-white font-semibold text-lg">{reservation.patientName}</h4>
                          <p className="text-white/60 text-sm">{reservation.patientEmail}</p>
                          <p className="text-white/60 text-sm">{reservation.patientPhone}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          reservation.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          reservation.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                          reservation.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                          'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                        }`}>
                          {reservation.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-white/40 text-xs mb-1">Treatment</p>
                          <p className="text-white font-semibold">{reservation.treatment.name}</p>
                        </div>
                        <div>
                          <p className="text-white/40 text-xs mb-1">Tanggal</p>
                          <p className="text-white">{formatDate(reservation.reservationDate)}</p>
                        </div>
                        <div>
                          <p className="text-white/40 text-xs mb-1">Harga Final</p>
                          <p className="text-primary font-semibold">{formatCurrency(reservation.finalPrice)}</p>
                        </div>
                        <div>
                          <p className="text-white/40 text-xs mb-1">Komisi (10%)</p>
                          <p className="text-green-400 font-semibold">{formatCurrency(reservation.commissionAmount)}</p>
                        </div>
                      </div>

                      {reservation.patientNotes && (
                        <div className="mt-3 pt-3 border-t border-white/5">
                          <p className="text-white/40 text-xs mb-1">Catatan Pasien</p>
                          <p className="text-white/80 text-sm">{reservation.patientNotes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/10 bg-black/20">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-white/60 text-xs mb-1">Total Reservasi</p>
                  <p className="text-white font-bold text-xl">{codeReservations.length}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs mb-1">Completed</p>
                  <p className="text-green-400 font-bold text-xl">
                    {codeReservations.filter((r: CodeReservation) => r.status === 'completed').length}
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-xs mb-1">Total Komisi</p>
                  <p className="text-primary font-bold text-xl">
                    {formatCurrency(
                      codeReservations
                        .filter((r: CodeReservation) => r.status === 'completed')
                        .reduce((sum: number, r: CodeReservation) => sum + Number(r.commissionAmount), 0)
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Owner Modal */}
      {showAssignModal && selectedCode && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair text-2xl font-bold text-white">
                Assign Owner
              </h3>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedCode(null);
                  setAssignEmail('');
                  setActionError('');
                  setActionSuccess('');
                }}
                className="text-white/60 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <p className="text-white/60 text-sm mb-4">
                Assign kode <span className="text-primary font-bold">{selectedCode.code}</span> ke email berikut:
              </p>
              
              <input
                type="email"
                value={assignEmail}
                onChange={(e) => {
                  setAssignEmail(e.target.value);
                  setActionError('');
                }}
                placeholder="Email pemilik kode"
                className="w-full bg-black/30 border border-primary/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            {actionError && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
                {actionError}
              </div>
            )}

            {actionSuccess && (
              <div className="bg-green-500/20 border border-green-500/50 text-green-400 text-sm px-4 py-3 rounded-lg mb-4">
                {actionSuccess}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleAssignOwner}
                className="flex-1 bg-primary hover:bg-primary/90 text-dark font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Assign
              </button>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedCode(null);
                  setAssignEmail('');
                  setActionError('');
                  setActionSuccess('');
                }}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Claim Code Modal */}
      {showClaimModal && selectedCode && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair text-2xl font-bold text-white">
                Claim Code
              </h3>
              <button
                onClick={() => {
                  setShowClaimModal(false);
                  setSelectedCode(null);
                  setClaimEmail('');
                  setActionError('');
                  setActionSuccess('');
                }}
                className="text-white/60 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <p className="text-white/60 text-sm mb-4">
                Claim kode <span className="text-primary font-bold">{selectedCode.code}</span> untuk user dengan email:
              </p>
              
              <input
                type="email"
                value={claimEmail}
                onChange={(e) => {
                  setClaimEmail(e.target.value);
                  setActionError('');
                }}
                placeholder="Email user"
                className="w-full bg-black/30 border border-primary/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary"
              />
              
              <p className="text-white/40 text-xs mt-2">
                💡 Jika user belum punya akun, kode akan di-claim otomatis saat user login pertama kali
              </p>
            </div>

            {actionError && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
                {actionError}
              </div>
            )}

            {actionSuccess && (
              <div className="bg-green-500/20 border border-green-500/50 text-green-400 text-sm px-4 py-3 rounded-lg mb-4">
                {actionSuccess}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleClaimCode}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Claim
              </button>
              <button
                onClick={() => {
                  setShowClaimModal(false);
                  setSelectedCode(null);
                  setClaimEmail('');
                  setActionError('');
                  setActionSuccess('');
                }}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Ownership Modal */}
      {showTransferModal && selectedCode && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair text-2xl font-bold text-white">
                Transfer Ownership
              </h3>
              <button
                onClick={() => {
                  setShowTransferModal(false);
                  setSelectedCode(null);
                  setTransferEmail('');
                  setActionError('');
                  setActionSuccess('');
                }}
                className="text-white/60 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <p className="text-white/60 text-sm mb-2">
                Transfer kode <span className="text-primary font-bold">{selectedCode.code}</span>
              </p>
              <p className="text-white/40 text-xs mb-4">
                Pemilik saat ini: <span className="text-white">{selectedCode.assignedEmail || 'N/A'}</span>
              </p>
              
              <input
                type="email"
                value={transferEmail}
                onChange={(e) => {
                  setTransferEmail(e.target.value);
                  setActionError('');
                }}
                placeholder="Email pemilik baru"
                className="w-full bg-black/30 border border-primary/50 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-primary"
              />
              
              <p className="text-yellow-400/80 text-xs mt-2">
                ⚠️ Semua komisi akan dipindahkan ke pemilik baru
              </p>
            </div>

            {actionError && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
                {actionError}
              </div>
            )}

            {actionSuccess && (
              <div className="bg-green-500/20 border border-green-500/50 text-green-400 text-sm px-4 py-3 rounded-lg mb-4">
                {actionSuccess}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleTransferOwnership}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Transfer
              </button>
              <button
                onClick={() => {
                  setShowTransferModal(false);
                  setSelectedCode(null);
                  setTransferEmail('');
                  setActionError('');
                  setActionSuccess('');
                }}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && selectedCodeForQR && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-playfair text-2xl font-bold text-white">
                QR Code - {selectedCodeForQR.code}
              </h3>
              <button
                onClick={() => {
                  setShowQRModal(false);
                  setSelectedCodeForQR(null);
                }}
                className="text-white/60 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* QR Code Display */}
            <div className="bg-white p-6 rounded-lg mb-6 flex justify-center">
              <QRCodeCanvas
                value={`https://drwprime.com/reservation?ref=${selectedCodeForQR.code}`}
                size={256}
                level="H"
                includeMargin={true}
                ref={qrRef}
              />
            </div>

            {/* Code Info */}
            <div className="mb-6 space-y-3">
              <div className="bg-black/30 p-4 rounded-lg">
                <p className="text-white/60 text-xs mb-1">Kode Affiliate</p>
                <p className="text-primary font-bold font-mono text-xl">{selectedCodeForQR.code}</p>
              </div>
              <div className="bg-black/30 p-4 rounded-lg">
                <p className="text-white/60 text-xs mb-1">Link Referral</p>
                <p className="text-white text-sm break-all">
                  https://drwprime.com/reservation?ref={selectedCodeForQR.code}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/30 p-3 rounded-lg">
                  <p className="text-white/60 text-xs mb-1">Status</p>
                  <p className="text-white font-semibold capitalize">{selectedCodeForQR.status}</p>
                </div>
                <div className="bg-black/30 p-3 rounded-lg">
                  <p className="text-white/60 text-xs mb-1">Usage</p>
                  <p className="text-white font-semibold">{selectedCodeForQR.reservationCount}x</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleShareQR}
                className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-black font-semibold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-primary/50 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share QR
              </button>
              <button
                onClick={handleDownloadQR}
                className="flex-1 bg-white/10 border border-white/20 text-white font-semibold py-3 px-6 rounded-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
            </div>

            <p className="text-white/40 text-xs text-center mt-4">
              Scan QR code untuk langsung ke form reservasi dengan kode affiliate terisi otomatis
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
