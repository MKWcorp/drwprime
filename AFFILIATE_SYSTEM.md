# 🎯 DRW Prime Affiliate System

## 📋 Fitur Lengkap

### 1. **Sistem Affiliate**
- ✅ Kode affiliate unik 5 digit (2 huruf dari nama + 3 random)
- ✅ Otomatis generate saat user pertama kali login
- ✅ Komisi 10% dari setiap reservasi menggunakan kode affiliate
- ✅ Tracking total earnings dan referrals

### 2. **Dashboard Member (My Prime)**
URL: `/my-prime-new`

**Fitur:**
- **Dashboard Tab:**
  - Total Earnings (komisi yang didapat)
  - Total Referrals (jumlah referral)
  - Points (bisa ditukar voucher)
  - Loyalty Points (untuk leveling)
  - Progress bar ke level selanjutnya
  - Recent transactions

- **Referrals Tab:**
  - List semua orang yang direfer
  - Status reservation (pending, confirmed, completed)
  - Komisi per referral

- **Reservations Tab:**
  - List reservasi sendiri
  - Detail treatment
  - Status dan tanggal

- **Vouchers Tab:**
  - (Coming soon)

### 3. **Front Office Dashboard**
URL: `/front-office`

**Fitur:**
- ✅ List semua reservations
- ✅ Filter by status (pending, confirmed, completed, cancelled)
- ✅ Filter by date
- ✅ Stats cards (pending, confirmed, completed, total)
- ✅ Detail modal per reservation
- ✅ Action buttons:
  - Confirm reservation
  - Cancel reservation
  - Mark as completed
- ✅ Otomatis pay commission saat mark as completed

### 4. **Database Schema**

**Tables:**
1. **users** - Data member/affiliate
   - clerkUserId (sync dengan Clerk)
   - email, firstName, lastName
   - affiliateCode (5 digit unik)
   - points, loyaltyPoints, loyaltyLevel
   - totalReferrals, totalEarnings

2. **treatment_categories** - Kategori treatment
3. **treatments** - List treatment
4. **reservations** - Booking/reservasi
   - Patient info
   - Treatment details
   - Referral info (kode affiliate & referrer)
   - Commission tracking
   - Status workflow

5. **transactions** - History transaksi
6. **vouchers** - Voucher system
7. **voucher_redemptions** - Redemption voucher
8. **events** - Member events
9. **event_registrations** - Event registration

## 🚀 API Endpoints

### User Management
- `POST /api/user` - Sync user dengan database (auto create affiliate code)
- `GET /api/user` - Get user data lengkap dengan relations

### Reservations
- `POST /api/reservations` - Create new reservation
  - Auto calculate loyalty points
  - Auto link referrer jika ada kode affiliate
  - Calculate commission
- `GET /api/reservations` - Get user reservations

### Front Office
- `GET /api/front-office/reservations` - Get all reservations (untuk front office)
  - Query params: `status`, `date`
- `PATCH /api/front-office/reservations` - Update reservation status
  - Auto pay commission saat completed
  - Update referrer earnings

## 💰 Komisi & Points

### Affiliate Commission
- **Rate:** 10% dari harga treatment
- **Pembayaran:** Otomatis saat reservation status = completed
- **Tracking:** Semua komisi tercatat di tabel transactions

### Loyalty Points
- **Earn:** Setiap Rp 1,000 = 1 loyalty point
- **Source:** Dari reservation yang dibuat sendiri
- **Leveling:**
  - Bronze: 0 - 1,999 points
  - Silver: 2,000 - 4,999 points
  - Gold: 5,000 - 9,999 points
  - Platinum: 10,000+ points

### Points (untuk Voucher)
- **Earn:** Dari komisi affiliate (Rp 100 = 1 point)
- **Redeem:** Tukar dengan voucher (coming soon)

## 🔧 Setup & Installation

### 1. Database sudah dibuat ✅
```bash
npx prisma db push
```

### 2. Environment Variables
```env
DATABASE_URL="postgresql://berkomunitas:berkomunitas688@213.190.4.159/drwprime"
```

### 3. Running the App
```bash
npm run dev
```

## 📱 User Flow

### Flow Affiliate:
1. User sign up/sign in via Clerk
2. Otomatis create record di database dengan affiliate code
3. User dapat share affiliate code
4. Orang lain buat reservation menggunakan code tersebut
5. Saat reservation completed, affiliate dapat komisi 10%
6. Komisi masuk ke earnings + dapat points

### Flow Reservation:
1. User login
2. Browse treatments
3. Buat reservation (bisa input kode affiliate)
4. Reservation masuk ke Front Office dashboard
5. Front office confirm reservation
6. Patient datang dan treatment selesai
7. Front office mark as completed
8. Affiliate dapat komisi (jika ada referrer)
9. User dapat loyalty points

### Flow Front Office:
1. Buka `/front-office`
2. Lihat list reservations hari ini
3. Filter by status atau date
4. Klik reservation untuk detail
5. Confirm, cancel, atau complete reservation
6. System otomatis update earnings affiliate

## 🎨 Features per Role

### Member/Affiliate:
- Dashboard dengan stats
- Affiliate code untuk share
- Track earnings & referrals
- Manage reservations
- Redeem vouchers (soon)

### Front Office:
- Dashboard reservations
- Filter & search
- Update status
- View affiliate info
- Process completion & pay commission

### Admin:
- (Existing admin dashboard)
- Manage system

## 📊 Affiliate Code Format

**Format:** `XX999`
- **XX** = 2 huruf pertama dari first name (uppercase)
- **999** = 3 karakter random (huruf/angka)

**Contoh:**
- John Doe → `JO5X9`
- Sarah Johnson → `SA3K7`
- Ahmad Wijaya → `AH8M2`

**Generator:** Otomatis check uniqueness di database

## 🔐 Security

- ✅ User authentication via Clerk
- ✅ API routes protected dengan auth check
- ✅ Front office accessible (bisa ditambah auth jika perlu)
- ✅ Affiliate code unique constraint
- ✅ Transaction atomicity

## 📝 Next Steps

1. ✅ Database schema created
2. ✅ API endpoints ready
3. ✅ My Prime dashboard created
4. ✅ Front Office dashboard created
5. ⏳ Migrate `/my-prime` ke `/my-prime-new`
6. ⏳ Add reservation form di treatments page
7. ⏳ Add voucher redemption feature
8. ⏳ Add email notifications
9. ⏳ Add analytics dashboard untuk admin

## 🐛 Testing

### Test Affiliate Flow:
1. Login dengan 2 user berbeda
2. User 1 copy affiliate code
3. User 2 buat reservation dengan kode User 1
4. Front office complete reservation
5. Check User 1 earnings bertambah

### Test Front Office:
1. Buka `/front-office`
2. Filter by status
3. Click reservation
4. Update status
5. Verify commission paid

---

**Database:** PostgreSQL di 213.190.4.159
**Status:** ✅ Tables created and ready
**Next:** Replace `/my-prime` dengan `/my-prime-new` dan add reservation form
