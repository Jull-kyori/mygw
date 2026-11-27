# Faza Ilmal Mughni — Portofolio

Portofolio pribadi dengan tampilan **liquid glass** yang lembut, animasi yang menghormati preferensi gerak, dan daftar proyek yang tersinkron dari GitHub. Dibangun dengan Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, dan lucide-react.

## Jalankan di komputer

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Periksa profil dan tautan sebelum membagikan situs.

## Atur profil

Edit `src/config/site.ts` untuk mengganti username GitHub, email, LinkedIn, URL situs, nama, dan deskripsi. Nilai profil hanya disimpan di satu konfigurasi agar mudah dirawat. Username GitHub sudah diatur ke `Jull-kyori`; email dan LinkedIn masih perlu Anda isi.

## Pilih proyek unggulan

Edit `src/config/featured.ts`. Tambahkan nama repository persis seperti di GitHub. Setiap pilihan bisa memiliki `title`, `description`, `image`, dan `demo` opsional. Repository unggulan tampil lebih dahulu. Thumbnail disediakan sebagai metadata konfigurasi dan dapat dipakai saat desain kartu membutuhkan gambar.

## GitHub API dan token

Daftar repository publik diambil di server melalui GitHub REST API dan di-cache selama satu jam. Repository fork dan arsip disembunyikan; urutan proyek mengikuti pilihan unggulan, jumlah bintang, lalu waktu pembaruan. README dan statistik bahasa diambil saat detail proyek dibuka. Bila username belum disetel, API gagal, atau batas pemakaian tercapai, situs menampilkan data contoh dari `src/data/fallback-projects.json`.

Untuk batas API yang lebih tinggi, salin `.env.example` menjadi `.env.local`, lalu isi token GitHub pribadi dengan izin baca repository publik:

```env
GITHUB_TOKEN=github_pat_token_anda
```

Token hanya digunakan di server dan jangan pernah memakai awalan `NEXT_PUBLIC_`. Jangan masukkan `.env.local` ke Git.

## Deploy ke Vercel

1. Dorong proyek ke repository GitHub.
2. Impor repository melalui [Vercel](https://vercel.com/new) dan biarkan pengaturan Next.js terdeteksi otomatis.
3. Atur `GITHUB_TOKEN` di **Project Settings → Environment Variables** bila diperlukan.
4. Deploy. Perbarui `url` di `src/config/site.ts` ke domain produksi agar metadata, sitemap, dan robots memakai alamat yang benar.

## Struktur utama

```text
src/
├── app/          # Halaman, metadata, sitemap, robots, dan API detail
├── components/   # Komponen antarmuka portofolio
├── config/       # Profil dan pilihan repository unggulan
├── data/         # Data contoh saat GitHub belum tersedia
├── lib/          # Integrasi GitHub sisi server
└── types/        # Tipe data GitHub
```

### Perintah

- `npm run dev` — jalankan server pengembangan.
- `npm run build` — buat build produksi.
- `npm run start` — jalankan build produksi.
