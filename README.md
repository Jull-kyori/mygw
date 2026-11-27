# Faza Ilmal Mughni · Portofolio

<div align="center">

### Ruang digital untuk ide, teknologi, dan eksperimen.

Portofolio pribadi bertema **liquid glass** yang menampilkan perjalanan, keahlian, dan proyek GitHub Faza Ilmal Mughni.

![Next.js](https://img.shields.io/badge/Next.js-14-111827?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Animasi-Framer%20Motion-8B5CF6)
![Status](https://img.shields.io/badge/status-portofolio%20pribadi-7C3AED)

[Lihat Situs](https://faza-portfolio.vercel.app) · [Jalankan Lokal](#-menjalankan-proyek) · [Deploy ke Vercel](#-deploy-ke-vercel)

</div>

---

## ✨ Tentang proyek

Situs satu halaman yang merangkum profil Faza sebagai mahasiswa Informatika semester 7 di **Universitas Muhammadiyah Ponorogo, Fakultas Teknik**. Fokus eksplorasi meliputi pengembangan web full stack, data dan kecerdasan buatan, serta perangkat IoT berbasis ESP32.

### Sorotan

- Antarmuka kaca transparan dengan tema gelap dan terang.
- Animasi halus, responsif, dan mengikuti preferensi pengurangan gerak perangkat.
- Daftar repository GitHub yang diperbarui otomatis dan di-cache selama satu jam.
- Pencarian, filter bahasa/topik, serta detail proyek dengan README dan statistik bahasa.
- Tata letak responsif, metadata SEO, sitemap, dan robots.
- Data cadangan agar bagian proyek tetap terisi saat GitHub API tidak tersedia.

## 🧰 Teknologi

| Bagian | Teknologi |
| --- | --- |
| Kerangka kerja | Next.js 14 · App Router |
| Bahasa | TypeScript · React 18 |
| Gaya | Tailwind CSS · CSS khusus |
| Animasi | Framer Motion |
| Ikon | lucide-react |
| Sumber proyek | GitHub REST API |
| Hosting | Vercel |

## 🚀 Menjalankan proyek

Pastikan Node.js dan npm sudah terpasang. Kemudian jalankan:

```bash
git clone https://github.com/Jull-kyori/mygw.git
cd mygw
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di peramban.

### Perintah yang tersedia

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan server pengembangan |
| `npm run build` | Memeriksa dan membuat build produksi |
| `npm run start` | Menjalankan build produksi |
| `npm run lint` | Menjalankan pemeriksaan lint Next.js |

## ⚙️ Pengaturan profil

Semua informasi profil utama dikumpulkan di **`src/config/site.ts`**. Ubah nilai berikut sebelum memakai situs untuk profil sendiri:

| Nilai | Contoh |
| --- | --- |
| `name` | Nama yang tampil di situs |
| `githubUsername` | `Jull-kyori` |
| `email` | Alamat email untuk kontak |
| `linkedin` | Tautan profil LinkedIn lengkap |
| `url` | Domain publik situs, untuk metadata dan sitemap |

Email dan LinkedIn saat ini masih berupa nilai pengganti. Ganti keduanya dengan tautan milik Anda.

### Memilih proyek unggulan

Edit **`src/config/featured.ts`** dan tulis nama repository persis seperti di GitHub. Setiap entri dapat memakai properti opsional:

```ts
{
  repo: 'nama-repository',
  title: 'Judul yang tampil',
  description: 'Ringkasan khusus untuk kartu proyek.',
  image: '/images/pratinjau-proyek.webp',
  demo: 'https://contoh-demo.vercel.app',
}
```

Proyek unggulan akan ditampilkan lebih menonjol. Letakkan gambar lokal di folder `public/images/`.

### Thumbnail dan teknologi proyek

Setiap proyek memakai gambar dari urutan berikut: nilai `image` pada konfigurasi unggulan, berkas lokal `public/projects/<nama-repo>.png`, lalu gambar Open Graph GitHub. Berkas lokal harus memakai nama repository yang sama persis, termasuk kapitalisasi. Tambahkan `tech` untuk menghubungkan kartu proyek dengan sorotan teknologi pada bagian Keahlian.

```ts
{
  repo: 'chat-bot-ai',
  title: 'Chatbot AI',
  description: 'Asisten percakapan berbasis kecerdasan buatan.',
  image: '/projects/chatbot-ai.webp',
  demo: 'https://contoh-demo.vercel.app',
  tech: ['Next.js', 'TypeScript', 'AI'],
}
```

`title`, `description`, `image`, `demo`, dan `tech` bersifat opsional. Tanpa `title`, nama repository otomatis dirapikan menjadi Title Case. Tanpa `image`, sistem mencoba gambar lokal PNG, kemudian memakai gambar Open Graph GitHub.

## 🐙 GitHub API dan token

Repository publik diambil di **server** dari akun pada `githubUsername`. Fork dan repository arsip disembunyikan; proyek unggulan diprioritaskan, lalu diurutkan berdasarkan bintang dan waktu pembaruan. Data repository di-cache selama satu jam.

Token bersifat **opsional** untuk daftar repository publik. Tanpa token, GitHub menerapkan batas permintaan yang lebih rendah. Untuk batas yang lebih tinggi:

1. Salin `.env.example` menjadi `.env.local`.
2. Buat token GitHub dengan akses baca seperlunya.
3. Isi token di `.env.local`:

   ```env
   GITHUB_TOKEN=github_pat_token_anda
   ```

Jangan menambahkan awalan `NEXT_PUBLIC_` pada token dan jangan pernah mengunggah `.env.local` ke Git. Saat deploy, masukkan `GITHUB_TOKEN` melalui pengaturan Environment Variables di Vercel.

Jika API gagal atau batas permintaan tercapai, situs memakai data di **`src/data/fallback-projects.json`**.

## ⌨️ Pintasan keyboard

| Pintasan | Aksi |
| --- | --- |
| `Ctrl + K` atau `⌘ + K` | Membuka pencarian cepat |
| `↑` / `↓` | Memilih hasil pencarian |
| `Enter` | Menjalankan hasil yang dipilih |
| `Esc` | Menutup pencarian atau panel detail proyek |

Pencarian cepat juga dapat dibuka lewat tombol kaca pembesar di navbar. Kontak email dan LinkedIn yang kosong disembunyikan otomatis; isi nilainya di `src/config/site.ts` jika ingin menampilkannya.

## ☁️ Deploy ke Vercel

1. Push repository ke GitHub.
2. Buka [vercel.com/new](https://vercel.com/new), impor repository **`Jull-kyori/mygw`**, lalu pilih **Deploy**. Vercel akan mendeteksi Next.js secara otomatis.
3. Jika menggunakan token GitHub, tambahkan `GITHUB_TOKEN` pada **Project Settings → Environment Variables** untuk lingkungan yang diinginkan, kemudian jalankan ulang deployment.
4. Tambahkan domain Anda melalui **Project Settings → Domains** dan ikuti instruksi DNS yang diberikan Vercel.
5. Perbarui nilai `url` di `src/config/site.ts` ke domain publik Anda, lalu commit dan push perubahan tersebut.

## 🗂️ Struktur folder

```text
src/
├── app/          # Halaman, metadata, sitemap, robots, dan API detail proyek
├── components/   # Komponen antarmuka dan bagian portofolio
├── config/       # Profil situs dan daftar proyek unggulan
├── data/         # Data cadangan GitHub
├── lib/          # Pengambilan dan pengolahan data GitHub
└── types/        # Tipe data TypeScript
```

## 📄 Catatan

README dan seluruh teks antarmuka ditulis dalam Bahasa Indonesia. Proyek ini dibuat sebagai portofolio pribadi; silakan jadikan inspirasi dan sesuaikan informasi profil sebelum digunakan.

<div align="center">

Dibuat dengan rasa ingin tahu dari Ponorogo ✦

</div>

