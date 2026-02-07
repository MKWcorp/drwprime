# Fitur Tarik Komisi (Withdrawal) - DRW Prime

## 📋 Overview

Fitur ini memungkinkan affiliator untuk menarik komisi yang mereka dapatkan melalui sistem bank atau e-wallet.

## ✅ Fitur yang Sudah Dibuat

### 1. **Database Schema**
- **Tabel `bank_accounts`**: Menyimpan informasi rekening bank/e-wallet user
  - `accountType`: "bank" atau "ewallet"
  - `bankName`: Nama bank atau e-wallet
  - `accountNumber`: Nomor rekening/e-wallet
  - `accountName`: Nama pemilik rekening
  - `isDefault`: Flag untuk rekening default

- **Tabel `withdrawals`**: Menyimpan request penarikan komisi
  - `amount`: Jumlah yang ditarik
  - `status`: "pending", "approved", "rejected", "completed"
  - `bankAccountId`: Referensi ke tabel bank_accounts
  - `adminNotes`: Catatan dari admin
  - `processedBy`: Admin yang memproses
  - `processedDate`: Tanggal diproses

### 2. **Halaman My Prime (User Dashboard)**

**Tab "Tarik Komisi"** dengan fitur:
- Form penarikan komisi dengan input:
  - Jumlah penarikan (dari saldo tersedia)
  - Pilihan metode: Bank atau E-Wallet
  - Pilihan bank/e-wallet dari dropdown
  - Input nomor rekening/e-wallet
  - Input nama pemilik rekening
  
- **Bank yang didukung:**
  - Mandiri
  - BRI
  - BCA
  - BSI
  - CIMB Niaga
  - BPD DIY

- **E-Wallet yang didukung:**
  - DANA
  - GoPay
  - ShopeePay
  - OVO

- **Riwayat Penarikan:**
  - List semua withdrawal request
  - Status: Pending, Approved, Rejected, Completed
  - Catatan admin jika ada

### 3. **API Endpoints**

#### User Endpoints
**POST `/api/withdrawals`**
- Create withdrawal request
- Validasi saldo tersedia
- Auto-deduct dari totalEarnings
- Save bank account info (jika belum ada)

**GET `/api/withdrawals`**
- Get user's withdrawal history

#### Admin Endpoints (Front Office)
**GET `/api/front-office/withdrawals?status=xxx`**
- Get all withdrawal requests
- Filter by status: all, pending, approved, rejected, completed
- Include user info dan bank account details

**PATCH `/api/front-office/withdrawals`**
- Update withdrawal status
- Add admin notes
- Auto-return money jika rejected

### 4. **User API Update**
- Updated `/api/user` GET endpoint untuk include:
  - `bankAccounts`: List rekening user
  - `withdrawals`: List withdrawal history

## 🎯 Cara Menggunakan

### Untuk Affiliator (User):
1. Login ke dashboard My Prime
2. Klik tab **"Tarik Komisi"**
3. Isi form:
   - Masukkan jumlah yang ingin ditarik
   - Pilih metode (Bank/E-Wallet)
   - Pilih nama bank/e-wallet
   - Masukkan nomor rekening
   - Masukkan nama pemilik rekening
4. Klik **"Ajukan Penarikan"**
5. Tunggu admin memproses (1-3 hari kerja)
6. Cek status di **"Riwayat Penarikan"**

### Untuk Admin (Front Office):
1. Access API endpoint: `/api/front-office/withdrawals`
2. Filter by status untuk melihat pending requests
3. Update status withdrawal:
   - **Approved**: Siap diproses transfer
   - **Completed**: Transfer sudah dilakukan
   - **Rejected**: Ditolak (uang dikembalikan otomatis)
4. Tambahkan catatan admin jika perlu

## 🔐 Security & Validations

- ✅ User harus login untuk akses fitur
- ✅ Validasi saldo tersedia sebelum withdrawal
- ✅ Auto-deduct dari totalEarnings saat request
- ✅ Auto-return money jika rejected
- ✅ Admin-only access untuk manage withdrawals
- ✅ Bank account data tersimpan untuk kemudahan penarikan berikutnya

## 📊 Database Relations

```
User
  ├── bankAccounts (1:N)
  └── withdrawals (1:N)
      └── bankAccount (N:1)
```

## 🚀 Deployment Status

✅ **BERHASIL DEPLOY!**
- Database schema: ✅ Pushed to production
- Code: ✅ Pushed to GitHub (commit: b7976ca)
- Vercel: ✅ Deployed successfully
- Status: **READY**
- URL: https://drwprime.com

## 📝 Notes

- Tidak ada minimum/maksimum penarikan
- Data rekening disimpan untuk kemudahan penarikan berikutnya
- Admin bisa lihat semua data rekening di dashboard Front Office
- Status withdrawal bisa diupdate oleh admin
- Jika withdrawal ditolak, uang otomatis dikembalikan ke saldo user

## 🔄 Future Improvements (Optional)

- [ ] Email notification saat withdrawal diproses
- [ ] Auto-transfer integration dengan payment gateway
- [ ] Minimum withdrawal amount setting
- [ ] Withdrawal fee/admin fee
- [ ] Export withdrawal data to Excel
- [ ] UI untuk manage withdrawals di Front Office dashboard
