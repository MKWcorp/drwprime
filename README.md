# DRW Prime Aesthetic Clinic - Affiliate System

Website resmi klinik kecantikan **DRW Prime** dengan sistem affiliate marketing terintegrasi untuk member dan admin dashboard untuk mengelola reservasi.

## 🌟 Fitur Utama

### 1. **Landing Page**
- Hero section dengan informasi klinik
- Daftar treatment & layanan lengkap
- Problem & solution presentation
- Responsive design (mobile-first)

### 2. **Sistem Affiliate Marketing**
- Setiap member mendapat kode affiliate unik
- Link referral: `https://drwprime.com/reservation?ref=KODE_AFFILIATE`
- Komisi 10% otomatis dari setiap reservasi via link affiliate
- Dashboard "My Prime" untuk tracking:
  - Total komisi
  - Total reservasi
  - Status pending & completed
  - Daftar customer yang direferensikan

### 3. **Public Reservation Form**
- Form booking treatment publik
- Otomatis capture kode affiliate dari URL parameter
- Pilihan treatment dengan kategori
- Date & time picker
- Input data pasien (nama, email, phone)

### 4. **Front Office Dashboard** (Admin Only)
- View semua reservasi dengan filter:
  - Status: All, Pending, Confirmed, Completed, Cancelled
  - Filter by date
- Dropdown/accordion list untuk list panjang
- Update status reservasi
- Complete reservation dengan input pembayaran aktual
- Auto-calculate komisi affiliate (10% dari total pembayaran)

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

## 🔐 Environment Variables

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

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

## 🗄️ Database Schema

### User
- Clerk integration untuk authentication
- `affiliateCode`: Kode referral unik (6 karakter)
- `isAdmin`: Boolean untuk akses admin
- `loyaltyPoints`: System loyalty points
- Relations: reservations, referrals

### Reservation
- Patient data (name, email, phone, notes)
- Treatment selection via treatmentId
- Date & time booking
- Status: pending, confirmed, completed, cancelled
- `referredBy`: Affiliate code (nullable)
- `referrerId`: Foreign key ke User (nullable)
- `commissionAmount`: Komisi untuk affiliate
- `originalPrice` & `finalPrice`: Untuk diskon/promo

### Treatment
- Name, description, slug
- Price (Decimal)
- Category relation
- Images & benefits

### Category
- Kategori treatment (Facial, HIFU, Laser, Body, dll)

## 🔑 Admin Access

Admin ditentukan berdasarkan Clerk User ID di file `src/lib/admin.ts`:

```typescript
export const ADMIN_USER_IDS = [
  'user_36gdG2sWQfY5wdGby1gGgML4ziC',
  'user_36jTRE55RsrJHmYbYOaG2yK5MPf'
];
```

## 📱 Pages Structure

- `/` - Landing page
- `/treatments` - Daftar treatment
- `/treatments/[slug]` - Detail treatment
- `/reservation?ref=CODE` - Form reservasi publik
- `/my-prime` - Dashboard affiliate member (protected)
- `/front-office` - Admin dashboard (admin only)
- `/sign-in` - Clerk sign in
- `/sign-up` - Clerk sign up

## 🚀 Deployment

Project ini di-deploy di **Vercel** dan terhubung ke GitHub untuk auto-deployment setiap push ke branch `main`.

```bash
# Build for production
npm run build

# Preview build locally
npm start
```

## 📊 Affiliate Flow

1. Member login → Dashboard My Prime → Copy link affiliate
2. Share link ke customer: `https://drwprime.com/reservation?ref=KODE_AFFILIATE`
3. Customer buka link → Form reservasi otomatis capture kode
4. Customer submit booking
5. Admin confirm & complete di Front Office
6. Admin input total pembayaran aktual
7. System auto-calculate komisi 10%
8. Komisi muncul di dashboard My Prime member

## 🔒 Security

- Latest Next.js 15.5.9 dengan security patches:
  - CVE-2025-55184 (DoS)
  - CVE-2025-55183 (Source Code Exposure)
- Clerk authentication untuk user management
- Admin role-based access control
- Environment variables untuk sensitive data
- Database credentials tidak di-hardcode

## 📝 License

Proprietary - DRW Prime Aesthetic Clinic

## 👥 Contact

- **Klinik**: DRW Prime Aesthetic Clinic
- **Developer**: MKW Corp
- **Repository**: https://github.com/MKWcorp/drwprime
