# 📹 Cara Menambah Video Baru ke Portfolio

Cukup edit satu file: **`public/projects.json`**
Tidak perlu buka kode sama sekali.

---

## Langkah-langkah

### 1. Upload video ke YouTube
- Set visibilitas: **Tidak Tercantum (Unlisted)**
- Salin link videonya, contoh: `https://youtu.be/xxxxxxxxxx`

### 2. Buka file `public/projects.json`

### 3. Tambah entri baru di bagian akhir array (sebelum `]` penutup)

Salin template ini dan isi datanya:

```json
  ,{
    "id": "proj-6",
    "title": "JUDUL VIDEO KAMU DI SINI (HURUF KAPITAL)",
    "category": "Dokumentasi",
    "year": "2025",
    "client": "Nama Klien / Acara",
    "role": "Videografer & Editor",
    "camera": "Sony ZV-E10 / Kamera Sekolah",
    "lens": "Kit Lens 16–50mm",
    "description": "Deskripsi singkat 1-2 kalimat tentang video ini.",
    "story": "Cerita panjang di balik pengambilan video ini. Bisa beberapa kalimat.",
    "thumbnail": "/saifulduka1.jpg",
    "videoSrc": "https://youtu.be/GANTI_DENGAN_LINK_YOUTUBE",
    "stills": ["/saifulduka1.jpg"],
    "colorPalette": ["#0a0a0a", "#2c2c2c", "#5a5a5a", "#a0a0a0", "#f0f0f0"],
    "aspectRatio": "16:9 Widescreen",
    "duration": "Full Event",
    "featured": false
  }
```

> ⚠️ Ganti `proj-6` dengan angka berikutnya (`proj-7`, `proj-8`, dst.)

---

## Pilihan category (harus persis seperti ini):

| Nilai | Warna di web |
|-------|-------------|
| `"Dokumentasi"` | Kuning/Amber |
| `"Kegiatan Sekolah"` | Hijau |
| `"Seni & Budaya"` | Ungu |

---

## Mau jadikan video pertama / Karya Utama?

Ganti `"featured": false` menjadi `"featured": true` **dan** pindahkan entri itu ke posisi pertama dalam array.

---

## Colorpalette (opsional, bisa pakai default)

5 warna hex dari gelap ke terang yang mewakili tone video:
```json
"colorPalette": ["#warna1", "#warna2", "#warna3", "#warna4", "#warna5"]
```
Kalau tidak tahu, pakai default ini:
```json
"colorPalette": ["#0a0a0a", "#2c2c2c", "#5a5a5a", "#a0a0a0", "#f0f0f0"]
```

---

## 4. Simpan file → Push ke GitHub → Selesai!

Vercel akan otomatis deploy ulang dalam ~1 menit.
Video langsung tampil di portfolio dengan tampilan yang sama persis seperti video lainnya.
