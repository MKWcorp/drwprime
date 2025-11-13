# Setup Instructions untuk DRW Prime

## Langkah-langkah untuk mengatasi redirect login ke halaman MY PRIME

Saya telah melakukan beberapa perubahan pada aplikasi untuk memastikan setelah login, user diarahkan ke halaman MY PRIME bukan halaman admin. Berikut langkah-langkah yang sudah dilakukan:

### 1. Environment Variables
Telah dibuat file `.env.local` dengan konfigurasi redirect yang tepat. **Anda perlu mengupdate file ini dengan Clerk keys yang sebenarnya:**

1. Buka [Clerk Dashboard](https://dashboard.clerk.com/last-active?path=api-keys)
2. Dapatkan `Publishable Key` dan `Secret Key` Anda
3. Update file `.env.local` dengan mengganti:
   - `pk_test_your_key_here` dengan Publishable Key Anda
   - `sk_test_your_key_here` dengan Secret Key Anda

### 2. Middleware Updates
- Menambahkan `/my-prime` route sebagai protected route
- User yang belum login akan diarahkan ke halaman login

### 3. SignIn/SignUp Components
- Menambahkan `fallbackRedirectUrl="/my-prime"` dan `forceRedirectUrl="/my-prime"` 
- Memastikan setelah login/register, user diarahkan ke halaman MY PRIME

### 4. Perubahan yang dilakukan:

#### File yang dimodifikasi:
1. `src/middleware.ts` - Menambahkan `/my-prime` ke protected routes
2. `src/app/sign-in/[[...sign-in]]/page.tsx` - Menambahkan redirect URLs
3. `src/app/sign-up/[[...sign-up]]/page.tsx` - Menambahkan redirect URLs
4. `.env.local` - Konfigurasi environment variables untuk redirect

### 5. Testing
Setelah setup Clerk keys yang benar:

```bash
npm run dev
```

Lalu test:
1. Akses halaman utama
2. Klik Sign In
3. Login dengan akun
4. Verify bahwa Anda diarahkan ke `/my-prime` bukan `/admin`

### 6. Verifikasi
- User biasa akan diarahkan ke `/my-prime` (halaman MY PRIME)
- Admin tetap bisa mengakses `/admin` (halaman admin) secara manual
- Routes yang tidak memerlukan authentication tetap dapat diakses publik

### 7. Troubleshooting
Jika masih ada masalah:
1. Pastikan Clerk keys sudah benar di `.env.local`
2. Restart development server setelah mengupdate `.env.local`
3. Clear browser cache
4. Check console untuk error messages

## Environment Variables yang perlu diset:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key
CLERK_SECRET_KEY=sk_test_your_actual_secret_key
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/my-prime
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/my-prime
```

Perubahan ini akan memastikan bahwa user biasa yang login akan langsung diarahkan ke halaman MY PRIME untuk mengakses fitur-fitur member seperti:
- Melihat poin loyalty
- Redeem voucher
- Daftar event member
- Profile member
