# DRW Prime Aesthetic Clinic - Affiliate System

Website resmi klinik kecantikan **DRW Prime** dengan sistem affiliate marketing terintegrasi untuk member dan admin dashboard untuk mengelola reservasi.

## 🌟 Fitur Utama

### 1. **Landing Page**
- Hero section dengan informasi klinik
- Daftar treatment & layanan lengkap
- Problem & solution presentation
- Responsive design (mobile-first)

### 2. **Sistem Affiliate Marketing**
- Setiap member mendapat kode affiliate unik (auto-generated)
- Link referral: `https://drwprime.com/reservation?ref=KODE_AFFILIATE`
- Komisi 10% otomatis dari **pembayaran aktual** (bukan harga list)
- Dashboard "My Prime" untuk tracking:
  - Total komisi yang diterima
  - Total reservasi yang berhasil
  - Status: Pending, Confirmed, Completed
  - Daftar customer yang direferensikan
  - Edit kode affiliate (1x/90 hari)

### 3. **Public Reservation Form**
- Form booking treatment publik (tanpa login)
- **Otomatis capture kode affiliate dari URL** `?ref=XXXX`
- Validasi kode affiliate:
  - ✅ Kode harus valid (ada di database)
  - ✅ Tidak bisa self-referral
  - ✅ Error message jika invalid
- Pilihan treatment dengan kategori
- Date & time picker
- Input data pasien (nama, email, phone, notes)

### 4. **Front Office Dashboard** (Admin Only)
- View semua reservasi dengan filter:
  - Status: All, Pending, Confirmed, Completed, Cancelled
  - Filter by date
- Update status reservasi:
  - Pending → Confirmed
  - Confirmed → Completed (dengan input pembayaran)
  - Cancel reservation
- **Complete dengan Input Pembayaran:**
  - Input total pembayaran aktual
  - Auto-calculate komisi: `pembayaran × 10%`
  - Auto-bayar komisi ke referrer
  - Create transaction log
- **Add Affiliate ke Existing Reservation:**
  - Fitur untuk tambah referrer manual
  - Validasi kode affiliate
  - Auto-bayar jika status sudah completed

### 5. **Admin System**
- Role-based access menggunakan Clerk User ID
- Proteksi halaman Front Office untuk admin only
- Menu "FRONT OFFICE" di navbar hanya tampil untuk admin

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.9 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: PostgreSQL (213.190.4.159/drwprime)
- **ORM**: Prisma 5.22.0
- **Deployment**: Vercel
- **Scripts**: Python 3.x (for database management)

## 🔐 Environment Variables

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database
DATABASE_URL="postgresql://berkomunitas:berkomunitas688@213.190.4.159/drwprime"
```

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/MKWcorp/drwprime.git
cd drwprime

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

### Key Models

#### User
```prisma
- id: String (cuid)
- clerkUserId: String (unique)
- email: String
- firstName, lastName: String
- affiliateCode: String (unique, 5-10 chars)
- affiliateCodeUpdatedAt: DateTime
- isAdmin: Boolean
- points, loyaltyPoints: Int
- totalEarnings: Decimal
- totalReferrals: Int
```

#### Reservation
```prisma
- id: String (cuid)
- userId: String (who booked)
- treatmentId: String
- referredBy: String (affiliate code)
- referrerId: String (referrer user id)
- patientName, patientEmail, patientPhone: String
- reservationDate: DateTime
- reservationTime: String
- status: String (pending/confirmed/completed/cancelled)
- originalPrice, finalPrice: Decimal
- commissionAmount: Decimal
- commissionPaid: Boolean
```

#### Transaction
```prisma
- id: String (cuid)
- userId: String
- type: String (commission/points_earned/voucher_redeem)
- amount: Decimal
- points: Int
- description: String
- referenceId: String (reservation id)
```

## 🔑 Admin Access

Admin ditentukan berdasarkan Clerk User ID di file `src/lib/admin.ts`:

```typescript
export const ADMIN_USER_IDS = [
  'user_36gdG2sWQfY5wdGby1gGgML4ziC', // DRW Prime
  'user_36jTRE55RsrJHmYbYOaG2yK5MPf'  // MKW
];
```

**Untuk menambah admin:**
1. User harus signup dulu via Clerk
2. Ambil Clerk User ID dari dashboard Clerk
3. Tambahkan ke array `ADMIN_USER_IDS`
4. Deploy/restart aplikasi

## 📱 Pages & Routes

### Public Pages
- `/` - Landing page
- `/treatments` - Daftar semua treatment
- `/treatments/[slug]` - Detail treatment
- `/reservation?ref=CODE` - Form reservasi publik (capture affiliate)
- `/sign-in` - Clerk sign in
- `/sign-up` - Clerk sign up

### Protected Pages (Login Required)
- `/my-prime` - Dashboard affiliate member

### Admin Only Pages
- `/front-office` - Admin dashboard untuk manage reservasi

### API Endpoints

#### Public APIs
```
POST /api/reservations
  - Create new reservation
  - Body: { treatmentId, patientName, patientEmail, patientPhone, 
           patientNotes, reservationDate, reservationTime, referredBy }
  - Validasi affiliate code
  - Return error jika code invalid

GET /api/treatments
  - Get all treatments dengan categories
```

#### Protected APIs (Auth Required)
```
GET /api/user
  - Get user profile with referrals & transactions
  - Filter referrals: status = 'completed'

POST /api/user
  - Create/sync user with Clerk
  - Auto-generate affiliate code

PUT /api/user/affiliate-code
  - Update affiliate code (max 1x/90 days)
```

#### Admin APIs
```
GET /api/front-office/reservations?status=xxx&date=xxx
  - Get all reservations with filters

PATCH /api/front-office/reservations
  - Update reservation status & payment
  - Body: { reservationId, status, finalPrice }
  - Auto-calculate & pay commission

PUT /api/front-office/reservations
  - Add affiliate to existing reservation
  - Body: { reservationId, affiliateCode, action: 'addAffiliate' }
  - Auto-pay if already completed
```

## 🚀 Affiliate Workflow (Developer Guide)

### Flow 1: Customer Booking via Affiliate Link

```
1. Member share link: domain.com/reservation?ref=DRJJ9
2. Customer buka form → searchParams.get('ref') = "DRJJ9"
3. Customer submit form:
   POST /api/reservations
   Body: { ..., referredBy: "DRJJ9" }

4. API validasi:
   - Cek kode DRJJ9 ada di database? ✅
   - Apakah self-referral? ❌
   - Return error jika invalid

5. Create reservation:
   - referredBy: "DRJJ9"
   - referrerId: (user id dari DRJJ9)
   - commissionAmount: treatment.price * 0.10
   - status: "pending"

6. Admin update status: pending → confirmed

7. Admin complete dengan payment:
   PATCH /api/front-office/reservations
   Body: { 
     reservationId: "xxx",
     status: "completed",
     finalPrice: 2500000  // actual payment
   }

8. Backend process:
   - Recalculate: commissionAmount = 2500000 * 0.10 = 250000
   - Update referrer:
     * totalEarnings += 250000
     * totalReferrals += 1
     * points += 2500
   - Create transaction log
   - Set commissionPaid = true

9. Member cek My Prime → komisi muncul ✅
```

### Flow 2: Add Affiliate to Existing Reservation

```
1. Admin buka reservation detail (yang tidak punya referrer)
2. Klik "Add Referrer"
3. Input affiliate code: DRJJ9
4. Submit:
   PUT /api/front-office/reservations
   Body: {
     reservationId: "xxx",
     affiliateCode: "DRJJ9",
     action: "addAffiliate"
   }

5. Backend process:
   - Validate code exists
   - Prevent self-referral
   - Calculate commission: finalPrice * 0.10
   - Update reservation
   - If status = completed → pay immediately
   - If not → wait until completed

6. Done ✅
```

## 🔍 Important Code Locations

### Affiliate Code Generation
- **File:** `src/lib/affiliate.ts`
- **Function:** `generateAffiliateCode(firstName)` 
- **Format:** First 2 letters + 3 random alphanumeric (e.g., "JO5X9")

### Commission Calculation
- **File:** `src/lib/affiliate.ts`
- **Function:** `calculateCommission(price, rate = 0.10)`
- **Formula:** `Math.round(price * rate * 100) / 100`

### Affiliate Validation
- **File:** `src/lib/affiliate.ts`
- **Function:** `validateAffiliateCode(code)`
- **Rules:**
  - Length: 5-10 characters
  - Only alphanumeric (A-Z, 0-9)
  - No forbidden words

### Admin Check
- **File:** `src/lib/admin.ts`
- **Constant:** `ADMIN_USER_IDS`
- **Usage:** Check if `user.clerkUserId` in array

## 🐛 Troubleshooting

### Issue: Affiliate code tidak tersimpan
**Solution:** 
- Cek form mengirim `referredBy` (bukan `affiliateCode`)
- Cek URL parameter: `/reservation?ref=XXXX`
- Cek API log: `[AFFILIATE] Referral tracked: ...`

### Issue: Commission tidak dibayar
**Checklist:**
1. Status reservation = "completed"? ✅
2. Ada referrerId? ✅
3. commissionPaid = false? ✅
4. Check API log: `[COMMISSION] Paying commission...`

### Issue: Self-referral blocked
**Expected:** User tidak bisa pakai kode affiliate sendiri
**Log:** `[AFFILIATE] Self-referral blocked for user xxx`

### Issue: Database NULL constraint error
**Solution:** 
- Transaction ID harus auto-generated (cuid)
- Jangan manual insert ID
- Prisma schema: `id String @id @default(cuid())`

## 🧪 Testing

### Manual Testing Checklist

```bash
# 1. Test affiliate link capture
✓ Buka: /reservation?ref=TESTCODE
✓ Submit form
✓ Cek database: referredBy = "TESTCODE"

# 2. Test commission payment
✓ Create reservation with referrer
✓ Update status: pending → confirmed → completed
✓ Input payment amount
✓ Check referrer dashboard: earnings updated

# 3. Test validation
✓ Try invalid code → Error message
✓ Try self-referral → Blocked
✓ Try duplicate commission → Blocked (commissionPaid check)

# 4. Test add affiliate manual
✓ FO dashboard → Add Referrer
✓ Input valid code
✓ Check database updated
```

## 📊 Database Management Scripts

Python scripts tersedia di folder `scripts/`:

```bash
# Check reservations without referrer
python scripts/check_missing_referrals.py

# Verify all referrals in database
python scripts/verify_all_referrals.py

# Add specific referrer (example)
python scripts/add_drw_corp_referral.py
```

**Requirements:**
```bash
pip install psycopg2-binary python-dotenv
```

## 🚀 Deployment

Project ini di-deploy di **Vercel** dan terhubung ke GitHub untuk auto-deployment setiap push ke branch `main`.

```bash
# Build for production
npm run build

# Test build locally
npm start
```

**Build Success Indicators:**
- ✓ Compiled successfully
- ✓ Linting and checking validity of types
- ✓ Collecting page data
- ✓ Generating static pages

## 🔒 Security Features

- ✅ Latest Next.js 15.5.9 dengan security patches
- ✅ Clerk authentication untuk user management
- ✅ Admin role-based access control
- ✅ Environment variables untuk sensitive data
- ✅ SQL injection prevention via Prisma ORM
- ✅ Input validation & sanitization
- ✅ CORS handling di API endpoints
- ✅ Self-referral prevention
- ✅ Commission duplicate payment prevention

## 📈 Performance Optimizations

- Server-side rendering (SSR) untuk SEO
- Static site generation untuk landing pages
- Image optimization dengan Next.js Image
- API response caching
- Database query optimization dengan Prisma
- Lazy loading untuk components

## 📝 Code Style & Conventions

- **TypeScript** untuk type safety
- **ESLint** untuk code quality
- **Prettier** untuk code formatting
- **Tailwind CSS** untuk styling consistency
- **Conventional Commits** untuk commit messages

Example:
```bash
git commit -m "feat: add affiliate link tracking"
git commit -m "fix: commission calculation bug"
git commit -m "docs: update README with workflow"
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 License

Proprietary - DRW Prime Aesthetic Clinic

## 👥 Contact

- **Klinik**: DRW Prime Aesthetic Clinic
- **Developer**: MKW Corp
- **Repository**: https://github.com/MKWcorp/drwprime
- **Email**: drwprimegejayan@gmail.com

---

**Last Updated:** December 23, 2025
**Version:** 1.0.0
**Status:** ✅ Production Ready
