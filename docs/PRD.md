# Product Requirements Document (PRD)

Project Name: Veteran Variasi (O2O Booking & E-Commerce)
Version: 1.0
Status: In Review
Target Platform: Web Application (Responsive Desktop & Mobile)

## **1. Product Overview**

Veteran Variasi adalah website untuk bengkel variasi mobil. Aplikasi ini memungkinkan pelanggan untuk mengeksplorasi katalog aksesoris dan layanan perawatan AC (harga flat), mengelola data kendaraan ("Garasi Saya"), melakukan pemesanan sekaligus booking jadwal pemasangan/servis di bengkel, dan melakukan pembayaran secara online.

Sistem dirancang dengan slot waktu presisi (1 mobil per 3 jam) untuk mencegah penumpukan antrean, dilengkapi dasbor admin berdasar kode warna (color-coded) untuk operasional bengkel yang efisien.

## **2. Tech Stack & Infrastructure**

- Framework: Next.js (App Router) dengan TypeScript.
- Styling & UI Components: Tailwind CSS dipadukan dengan shadcn/ui.
- Database: MySQL.
- ORM: Prisma ORM.
- Authentication: NextAuth.js (v5 / Auth.js).
- Payment Gateway: Midtrans (optional).

## **3. Architecture Structure (Feature-Based Folder)**

Proyek ini menggunakan pola Feature-Based Folder Architecture. Tujuannya agar kode lebih modular, mudah di-maintain, dan scalable. Struktur memisahkan antara modul global dan modul spesifik per fitur.

Struktur Direktori Inti:

```
veteran_variasi/
├── app/                    # Next.js App Router (Pages, Layouts, API Routes)
|   ├── auth/               # Fitur Autentikasi (Login, Register)
|   ├── catalog/            # Fitur Katalog (Produk Aksesoris & Layanan AC)
|   ├── garage/             # Fitur Garasi (Manajemen Mobil Pelanggan)
|   ├── checkout/           # Fitur Keranjang, Booking Jadwal & Pembayaran
|   ├── orders/             # Fitur Riwayat Pesanan & Ulasan
|   └── admin/              # Fitur Dashboard Admin & Manajemen Bengkel
├── components/             # Global Components (UI elements, Layout wrappers, shadcn)
├── lib/                    # Global Lib (Prisma client, NextAuth config)
├── data/                   # Global Data fetching/queries (opsional)
├── api/                    # Global API wrappers / Axios instances
├── utils/                  # Global Utilities (date formatter, currency formatter)
├── types/                  # Global TypeScript definitions
└── features/some-feature/  # Feature Modules
    ├── components/         # Komponen UI spesifik fitur (ex: TimeSlotSelector, CarSelectorCard).
    ├── lib/                # Logika bisnis spesifik fitur.
    ├── api/                # Fungsi pemanggilan API ke backend spesifik fitur.
    ├── data/               # Kumpulan fungsi akses database (Queries/Mutations).
    ├── utils/              # Fungsi pembantu (ex: calculateTimer, checkSlotAvailability).
    └── types/              # Definisi interface TypeScript spesifik fitur.
```

### Struktur Internal per Fitur (Contoh pada features/checkout):

Setiap folder di dalam features/ akan memiliki struktur independen:

- checkout/components/ : Komponen UI spesifik fitur (ex: TimeSlotSelector, CarSelectorCard).
- checkout/lib/ : Logika bisnis spesifik fitur.
- checkout/api/ : Fungsi pemanggilan API ke backend spesifik fitur.
- checkout/data/ : Kumpulan fungsi akses database (Queries/Mutations).
- checkout/utils/ : Fungsi pembantu (ex: calculateTimer, checkSlotAvailability).
- checkout/types/ : Definisi interface TypeScript spesifik fitur.

## 4. User Roles

- Guest (Unauthenticated): Bisa melihat halaman utama, membaca katalog produk dan layanan. Tidak bisa checkout.
- Customer (Authenticated): Memiliki garasi mobil, bisa checkout, memilih jadwal, membayar, dan memberi ulasan.
- Admin: Mengelola katalog, memantau pesanan harian, mengupdate status pengerjaan bengkel.

## 5. Core Features & Requirements

### 5.1. Customer Facing Features (Frontend)

- Guest Browsing & Intercept Login: \* Katalog produk (Aksesoris & AC) dapat diakses publik.
  - Klik "Tambah ke Keranjang" memicu modal Login/Register (NextAuth) jika user belum login, lalu otomatis mengembalikan state untuk memasukkan barang.

- Account & Garage Management (One-Page):
  - Manajemen Profil (Upload Foto Profil).
  - Garasi Saya: CRUD data mobil (Merek, Model, Tahun, Foto Mobil).

- Unified Cart & One-Page Checkout:
  - Menggabungkan item aksesoris dan layanan jasa dalam satu keranjang.
  - Pilih Mobil: Memilih mobil dari data Garasi.
  - Pilih Jadwal: Pemilihan tanggal dan 3 Slot Waktu (09:00-12:00, 12:00-15:00, 15:00-18:00).
  - Constraint: Sistem mendisable slot yang sudah dibooking.

- Payment & Slot Locking:
  - Klik "Bayar Sekarang" memicu lock sementara pada slot waktu selama 15 menit.
  - Tampil Countdown Timer.
  - Integrasi Payment Gateway. Jika expired, pesanan batal dan slot terbuka kembali.

- Order History & Reviews:
  - Melihat Kode Booking dan status pesanan.
  - Memberikan rating (1-5) dan ulasan setelah status "COMPLETED".

### 5.2. Admin Dashboard Features

- Daily Schedule View (Core Dashboard):
  - Tampilan jadwal harian berbasis Color-Coded Rows:
    - Kuning: PENDING (Menunggu Pembayaran / Timer aktif).
    - Biru: PAID (Lunas, Menunggu Kedatangan).
    - Hijau: PROCESSING / COMPLETED (Sedang dikerjakan / Selesai).
    - Abu-abu: CANCELLED / Kosong.

- Order Fulfillment:
  - Fitur pencarian Kode Booking.
  - Tombol update status pesanan.

- Catalog & Master Data Management:
  - CRUD Data Aksesoris (Nama, Harga, Stok, Gambar).
  - Edit Data Layanan AC.

- Customer Directory:
  - Melihat daftar user beserta daftar mobil di garasi mereka.

> Penjelasan terkait sitemap lebih detail ada di [**sitemap.md**](./sitemap/sitemap.md)

> Penjelasan terkait user flow lebih detail ada di [**user-flow.md**](./user-flow/user-flow.md)

## 6. Database Schema Summary (MySQL)

1. Tabel `users`: Menyimpan data autentikasi baik untuk admin maupun pelanggan.
2. Tabel `cars` (Fitur Garasi): Menyimpan data mobil pelanggan. Satu *user* bisa memiliki banyak mobil (Relasi 1-to-N).
3. Tabel `products` (Katalog Aksesoris & Layanan): Menyimpan data barang dan jasa. Layanan *Cleaning AC* dimasukkan ke sini dengan tipe berbeda agar bisa disatukan dalam satu keranjang belanja.
4. Tabel `orders` (Transaksi & Penjadwalan): Ini adalah tabel paling krusial. Menyimpan data pesanan, jadwal 3 jam, dan status pembayaran yang nantinya akan dipetakan menjadi visual *color-coded rows* di *dashboard* admin.
5. Tabel `order_items` (Detail Keranjang/Pesanan): Menyambungkan tabel `orders` dengan `products`. Satu pesanan bisa berisi banyak barang/jasa (Relasi N-to-N).
6. Tabel `reviews` (Ulasan Pelanggan)

Penjelasan terkait ERD lebih detail ada di [**ERD.md**](./erd/erd.md)

## 7. Non-Functional Requirements

- Performance: Halaman utama dan katalog harus di-render secara efisien (Gunakan Server Components / SSR / ISR Next.js).
- Responsive Design: Harus 100% fungsional di perangkat seluler (Mobile-First approach) menggunakan Tailwind CSS.
- Concurrency: Mencegah Double-Booking dengan menggunakan skema database constraint dan pengecekan API berlapis saat proses kunci jadwal.
