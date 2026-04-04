# Veteran Variasi - Platform Bengkel & E-Commerce

Veteran Variasi adalah aplikasi web modern yang dibangun untuk bengkel servis dan aksesoris mobil yang berlokasi di Makassar. Platform ini berfungsi sebagai sistem e-commerce untuk pelanggan (klien) sekaligus sebagai dashboard manajemen operasional internal bengkel.

## 🚀 Fitur

### Untuk Klien (Pelanggan)
- **Katalog Produk:** Telusuri layanan bengkel dan aksesoris mobil modern.
- **Pemesanan Servis & Checkout:** Buat jadwal pemesanan servis (booking) dan lakukan pembayaran dengan mudah menggunakan berbagai metode pembayaran (E-wallet, Virtual Account, QRIS, Transfer Bank, Pembayaran di Gerai/OTC).
- **Garasi Virtual:** Daftarkan dan kelola data kendaraan pribadi untuk mempermudah proses pemesanan layanan.
- **Lacak Pesanan & Keranjang Belanja:** Tambahkan produk ke keranjang, lihat status aktif pesanan/booking, dan berikan ulasan setelah servis selesai.

### Untuk Admin
- **Dashboard Admin:** Dapatkan gambaran lengkap tentang operasi bengkel, pesanan pelanggan, dan statistik pendapatan.
- **Manajemen Pesanan:** Kontrol dan perbarui status pesanan (Tertunda, Terbayar, Diproses, Selesai, Dibatalkan).
- **Kontrol Inventori:** Tambahkan, kategorikan, dan kelola inventaris produk serta layanan servis.

## 💻 Teknologi yang Digunakan (Tech Stack)

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Bahasa Pemrograman:** TypeScript
- **Styling UI:** [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Database:** MariaDB / MySQL
- **ORM:** [Prisma](https://www.prisma.io/)
- **Form & Validasi:** React Hook Form + Zod
- **Animasi:** Framer Motion

## 🛠️ Prasyarat

Pastikan Anda memiliki beberapa instalasi berikut pada lingkungan lokal Anda:
- [Node.js](https://nodejs.org/) (Sangat disarankan v20+)
- Package manager `npm`
- Instance server MySQL atau MariaDB yang sedang berjalan

## 🏁 Memulai (Getting Started)

### 1. Instalasi Dependensi (Dependencies)
Masuk ke direktori proyek dan instal semua modul Node yang diperlukan:
```bash
npm install
```

### 2. Variabel Lingkungan (Environment Variables)
Pastikan Anda memiliki file `.env` di *root directory* (direktori utama) yang dikonfigurasi dengan string koneksi database serta *secret keys* yang dibutuhkan.
```env
DATABASE_URL="mysql://USER_ANDA:PASSWORD_ANDA@localhost:3306/NAMA_DATABASE_ANDA"
# Tambahkan variabel lingkungan lain yang dibutuhkan (misal: JWT secret, Key Payment Gateway)
```

### 3. Setup & Seeding Database
Proyek ini memuat skrip praktis untuk mengaplikasikan skema Prisma, membuat Prisma Client, dan mengisi data awal (*dummy data*) pada database. Jalankan:
```bash
npm run db:fresh
```

### 4. Menjalankan Server Pengembangan (Development Server)
Jalankan server untuk pengembangan lokal:
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada browser Anda untuk mencoba aplikasinya.

## 🗂️ Struktur Utama Proyek
- `app/`: Direktori utama pola Next.js App Router yang memuat seluruh pembuatan halaman dan API route (contoh: `/auth`, `/admin`, `/catalog`, `/dashboard`, `/checkout`).
- `features/`: Kumpulan komponen dan logika yang dipisah berdasarkan fiturnya (contoh: `cart`, `orders`, `profile`, `garage`).
- `components/`: Kumpulan komponen UI re-usable/global (termasuk *base components* dari Shadcn UI).
- `prisma/`: Berisi skema struktur database Prisma ORM (`schema.prisma`) dan skrip *seeding* (`seed.ts`).
- `public/`: Direktori aset statis seperti gambar, font, dan ikon.
