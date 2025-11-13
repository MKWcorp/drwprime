# Troubleshooting Video Hero Section

## Masalah yang Dihadapi
Video `drwprime_section_1.mp4` tidak tampil di hero section halaman utama.

## Diagnosis Masalah
Berdasarkan log server, ada beberapa kemungkinan masalah:

1. **File video tidak dapat diakses** - Error 404 pada `/drwprime_section_1.mp4`
2. **Browser autoplay policy** - Browser modern memblokir autoplay video
3. **File video terlalu besar** - Loading lambat atau timeout
4. **Format video tidak compatible** - Browser tidak support codec

## Solusi yang Diterapkan

### 1. Fallback System
Dibuat sistem fallback yang selalu menampilkan background image sebagai base, dengan video sebagai enhancement:

```tsx
// Background Image (Always present)
<Image src="/drwprime-spa.png" />

// Video Overlay (Optional enhancement)
<video onError={handleVideoError}>
  <source src="/drwprime_section_1.mp4" type="video/mp4" />
</video>
```

### 2. Error Handling
Menambahkan error handling yang proper:
- Jika video gagal load, otomatis switch ke background image
- Console logging untuk debugging
- Development controls untuk testing

### 3. Next.js Configuration
Update `next.config.ts` untuk:
- Mengizinkan image quality 90
- Cache control untuk video files
- Headers untuk optimasi loading

### 4. Browser Compatibility
Menambahkan attributes untuk compatibility:
- `muted` - Required untuk autoplay di modern browsers
- `playsInline` - Untuk mobile devices
- `preload="metadata"` - Optimasi loading

## Troubleshooting Steps

### Step 1: Cek File Video
```bash
# Cek apakah file ada dan ukurannya
ls -la public/drwprime_section_1.mp4

# Test akses langsung ke video
curl -I http://localhost:3000/drwprime_section_1.mp4
```

### Step 2: Test di Browser
1. Buka Developer Console (F12)
2. Cek tab Network untuk melihat request ke video
3. Cek tab Console untuk error messages
4. Gunakan toggle control di development mode

### Step 3: Alternative Solutions

#### Option A: Menggunakan poster image
```tsx
<video poster="/drwprime-spa.png" ...>
```

#### Option B: Lazy loading video
```tsx
const [loadVideo, setLoadVideo] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => setLoadVideo(true), 1000);
  return () => clearTimeout(timer);
}, []);
```

#### Option C: Convert video format
- Compress video untuk ukuran lebih kecil
- Convert ke format yang lebih compatible (WebM, MP4 dengan H.264)

### Step 4: Optimasi Video
```bash
# Compress video dengan ffmpeg
ffmpeg -i drwprime_section_1.mp4 -vcodec libx264 -crf 25 -preset medium -acodec aac -ab 128k drwprime_section_1_compressed.mp4

# Buat multiple formats
ffmpeg -i drwprime_section_1.mp4 -c:v libvpx-vp9 -c:a libvorbis drwprime_section_1.webm
```

## Implementasi Saat Ini

File `src/components/Hero.tsx` sudah diupdate dengan:
✅ Fallback image system  
✅ Error handling untuk video  
✅ Development controls untuk testing  
✅ Proper browser compatibility attributes  
✅ Console logging untuk debugging  

## Testing

1. **Akses halaman utama** - http://localhost:3000
2. **Cek developer console** untuk melihat status video
3. **Gunakan toggle control** (development mode) untuk switch antara video/image
4. **Cek network tab** untuk melihat request ke file video

## Expected Behavior

- **Jika video berhasil load**: Video akan autoplay di background
- **Jika video gagal load**: Background image akan ditampilkan
- **Development mode**: Ada control untuk toggle dan status indicator

## Fallback yang Reliable

Sistem fallback memastikan halaman selalu tampil dengan background yang bagus, baik video berhasil load atau tidak. User experience tetap optimal dalam semua kondisi.
