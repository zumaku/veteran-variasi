# Product Requirements Document (PRD)
## BengkelAim - Sistem Pemesanan Layanan Bengkel Mobil Online

---

## 1. Overview

### 1.1 Ringkasan Produk
BengkelAim adalah platform web untuk pemesanan layanan bengkel mobil yang memungkinkan pengguna untuk melihat, memilih, dan memesan layanan perbaikan/perawatan mobil serta membeli sparepart secara online dengan sistem pembayaran di muka dan penjadwalan kunjungan ke bengkel.

### 1.2 Tujuan Produk
- Memudahkan pelanggan untuk memesan layanan bengkel tanpa harus datang langsung
- Meningkatkan efisiensi operasional bengkel melalui sistem penjadwalan
- Memberikan transparansi harga layanan dan sparepart
- Mengurangi waktu tunggu pelanggan di bengkel

### 1.3 Target Pengguna
- **Pengguna Umum**: Pemilik mobil yang membutuhkan layanan perbaikan/perawatan
- **Admin Bengkel**: Pengelola bengkel yang mengatur layanan, produk, dan pesanan

---

## 2. Fitur Utama

### 2.1 Halaman Public (Tanpa Login)

#### 2.1.1 Homepage
**Deskripsi**: Halaman pertama yang dilihat pengunjung website

**Komponen**:
- **Hero Section**: Banner utama dengan tagline bengkel dan CTA (Call-to-Action)
- **Layanan & Produk Unggulan**: Menampilkan layanan dan produk populer/unggulan (max 6-8 item)
- **Informasi Bengkel**: 
  - Deskripsi singkat tentang bengkel
  - Alamat lengkap
  - Peta lokasi (Google Maps embed)
  - Jam operasional
  - Nomor kontak
- **FAQ (Frequently Asked Questions)**: Pertanyaan umum seputar layanan bengkel
- **Footer**: 
  - Link navigasi
  - Informasi kontak
  - Social media links
  - Copyright info

**User Flow**:
1. User membuka website
2. Melihat hero section dan layanan unggulan
3. Dapat scroll untuk melihat informasi bengkel dan FAQ
4. Dapat klik CTA untuk melihat semua layanan atau melakukan login/register

---

#### 2.1.2 Halaman Produk & Layanan
**Deskripsi**: Halaman katalog yang menampilkan semua produk dan layanan yang ditawarkan

**Komponen**:
- **Filter & Kategori**: 
  - Filter berdasarkan kategori (Tune Up, Maintenance AC, Service Rem, dll)
  - Filter berdasarkan harga (range)
  - Search bar untuk mencari produk/layanan
- **Grid/List Produk & Layanan**:
  - Thumbnail image
  - Nama produk/layanan
  - Harga (untuk sparepart: harga barang, harga + pemasangan)
  - Rating/review (optional untuk fase 1)
  - Button "Lihat Detail"
- **Pagination**: Untuk navigasi antar halaman produk

**User Flow**:
1. User masuk ke halaman produk & layanan
2. User dapat memfilter atau search produk/layanan
3. User klik "Lihat Detail" untuk melihat detail lengkap

---

#### 2.1.3 Halaman Detail Produk/Layanan
**Deskripsi**: Halaman yang menampilkan informasi lengkap tentang satu produk atau layanan

**Komponen untuk Sparepart**:
- Galeri foto produk
- Nama produk
- Merek
- Deskripsi lengkap
- Spesifikasi teknis
- Harga satuan (hanya barang)
- Harga dengan pemasangan
- Estimasi waktu pemasangan
- Button "Tambah ke Keranjang" (akan redirect ke login jika belum login)
- Stok ketersediaan

**Komponen untuk Layanan**:
- Gambar ilustrasi layanan
- Nama layanan
- Kategori layanan
- Deskripsi lengkap layanan
- List sparepart yang dibutuhkan (jika ada):
  - Nama sparepart
  - Merek
  - Harga per item
  - Opsi untuk mengganti merek (jika tersedia alternatif)
- Total harga layanan (termasuk sparepart dan jasa)
- Estimasi durasi pengerjaan
- Button "Tambah ke Keranjang" (akan redirect ke login jika belum login)

**User Flow**:
1. User melihat detail lengkap produk/layanan
2. Untuk layanan, user dapat memilih alternatif merek sparepart jika tersedia
3. User klik "Tambah ke Keranjang"
4. Jika belum login → redirect ke halaman login
5. Jika sudah login → produk/layanan masuk ke keranjang + notifikasi sukses

---

#### 2.1.4 Halaman Login
**Deskripsi**: Halaman autentikasi untuk user masuk ke sistem

**Komponen**:
- Form login:
  - Email/Username
  - Password
  - Checkbox "Ingat Saya"
  - Button "Login"
- Link "Lupa Password?"
- Link "Belum punya akun? Daftar"
- Pesan error jika login gagal

**User Flow**:
1. User memasukkan email dan password
2. Sistem validasi kredensial
3. Jika berhasil → redirect ke dashboard sesuai role (user/admin)
4. Jika gagal → tampilkan pesan error

---

#### 2.1.5 Halaman Register
**Deskripsi**: Halaman pendaftaran akun baru

**Komponen**:
- Form registrasi:
  - Nama Lengkap
  - Email
  - Nomor Telepon
  - Alamat
  - Password
  - Konfirmasi Password
  - Checkbox persetujuan Terms & Conditions
  - Button "Daftar"
- Link "Sudah punya akun? Login"

**Validasi**:
- Email harus valid dan belum terdaftar
- Password minimal 8 karakter
- Password dan konfirmasi password harus sama
- Semua field wajib diisi

**User Flow**:
1. User mengisi form registrasi
2. Sistem validasi data
3. Jika valid → akun dibuat → redirect ke halaman login dengan pesan sukses
4. Jika tidak valid → tampilkan pesan error

---

### 2.2 Dashboard User (Pengguna Biasa)

#### 2.2.1 Sidebar Navigation
**Menu yang tersedia**:
- Dashboard/Home
- Etalase Produk & Layanan
- Keranjang
- Riwayat Pesanan
- Kelola Mobil
- Profil
- Logout

---

#### 2.2.2 Dashboard Home (User)
**Deskripsi**: Halaman utama setelah user login

**Komponen**:
- Welcome message dengan nama user
- Summary cards:
  - Jumlah pesanan aktif
  - Pesanan mendatang (upcoming appointments)
  - Total pesanan selesai
- Quick actions:
  - Button "Pesan Layanan"
  - Button "Lihat Riwayat"
- Upcoming appointments (list jadwal kunjungan mendatang)

---

#### 2.2.3 Etalase Produk & Layanan (User Dashboard)
**Deskripsi**: Sama seperti halaman produk & layanan public, namun dengan akses langsung untuk menambahkan ke keranjang

**Komponen**:
- Filter & search (sama seperti public page)
- Grid produk/layanan
- Button "Tambah ke Keranjang" langsung visible dan functional

---

#### 2.2.4 Halaman Keranjang
**Deskripsi**: Halaman untuk melihat dan mengelola item yang akan dipesan

**Komponen**:
- **List Item di Keranjang**:
  - Thumbnail produk/layanan
  - Nama produk/layanan
  - Harga satuan
  - Quantity selector (untuk sparepart yang bisa beli lebih dari 1)
  - Subtotal
  - Button hapus item
- **Pilih Mobil**:
  - Dropdown untuk memilih mobil yang terdaftar
  - Link "Tambah mobil baru" (ke halaman Kelola Mobil)
- **Pilih Jadwal Kunjungan**:
  - Date picker (minimal H+1 dari hari ini)
  - Time slot selector (berdasarkan slot yang tersedia)
  - Estimasi total durasi pengerjaan (dari semua layanan di keranjang)
- **Summary**:
  - Subtotal
  - Pajak/biaya admin (jika ada)
  - Total pembayaran
- **Button "Lanjut ke Checkout"**

**Business Logic - Booking System**:
- Sistem menghitung slot waktu yang tersedia berdasarkan:
  - Jam operasional bengkel (contoh: 08:00 - 17:00)
  - Durasi estimasi layanan
  - Pesanan yang sudah ada di tanggal tersebut
- Slot waktu dibagi per interval (contoh: setiap 30 menit atau 1 jam)
- Jika total durasi layanan user + layanan existing melebihi kapasitas, slot tersebut tidak tersedia
- User hanya bisa memilih slot yang berwarna hijau/available
- Sistem memberikan warning jika slot hampir penuh

**Contoh Logic Slot**:
```
Asumsi:
- Jam operasional: 08:00 - 17:00 (9 jam = 540 menit)
- Kapasitas bengkel: 2 mobil bersamaan (2 bay)
- User memilih layanan dengan durasi 120 menit

Perhitungan:
1. Sistem mengecek tanggal yang dipilih user
2. Mengambil semua booking di tanggal tersebut
3. Menghitung slot yang overlap
4. Jika di slot 08:00-10:00 sudah ada 2 booking → slot tidak tersedia
5. Jika di slot 08:00-10:00 hanya ada 1 booking → slot tersedia (masih ada 1 bay kosong)
```

**User Flow**:
1. User melihat item di keranjang
2. User memilih mobil yang akan diservice
3. User memilih tanggal kunjungan
4. Sistem menampilkan slot waktu yang tersedia
5. User memilih slot waktu
6. User review total pembayaran
7. User klik "Lanjut ke Checkout"

---

#### 2.2.5 Halaman Checkout
**Deskripsi**: Halaman untuk menyelesaikan pembayaran

**Komponen**:
- **Order Summary**:
  - List semua item yang dipesan
  - Mobil yang dipilih
  - Jadwal kunjungan (tanggal & waktu)
  - Estimasi durasi total
  - Total pembayaran
- **Informasi Kontak**:
  - Nama (auto-fill dari profil)
  - Email (auto-fill dari profil)
  - Nomor telepon (auto-fill dari profil)
  - Alamat (auto-fill dari profil)
  - Opsi untuk edit
- **Metode Pembayaran** (UI Only untuk fase 1):
  - Radio button pilihan:
    - Transfer Bank
    - E-Wallet (GoPay, OVO, Dana, ShopeePay)
    - Virtual Account
  - Informasi: "Pembayaran menggunakan Midtrans (akan diintegrasikan)"
- **Terms & Conditions**:
  - Checkbox persetujuan syarat dan ketentuan
- **Button "Konfirmasi Pesanan"**

**User Flow**:
1. User review semua informasi pesanan
2. User pilih metode pembayaran (UI only)
3. User centang persetujuan terms & conditions
4. User klik "Konfirmasi Pesanan"
5. Sistem membuat order dengan status "Menunggu Pembayaran"
6. Redirect ke halaman konfirmasi pembayaran

---

#### 2.2.6 Halaman Konfirmasi Pembayaran
**Deskripsi**: Halaman yang muncul setelah checkout berhasil

**Komponen**:
- Icon sukses
- Pesan "Pesanan berhasil dibuat!"
- Order ID/Nomor Pesanan
- Informasi pembayaran:
  - Total yang harus dibayar
  - Batas waktu pembayaran (contoh: 24 jam)
  - Instruksi pembayaran (untuk fase 1, bisa berupa teks manual)
- Jadwal kunjungan yang dipilih
- Button "Download Bukti Pesanan (PDF)"
- Button "Lihat Detail Pesanan"
- Button "Kembali ke Dashboard"

**Bukti Pesanan PDF berisi**:
- Logo BengkelAim
- Nomor Pesanan
- Tanggal Pesanan
- Informasi Customer (nama, email, telepon)
- Detail Mobil
- List item yang dipesan (nama, qty, harga)
- Total pembayaran
- Jadwal kunjungan (tanggal & waktu)
- Instruksi pembayaran
- Informasi bengkel (alamat, kontak)

---

#### 2.2.7 Halaman Riwayat Pesanan
**Deskripsi**: Halaman untuk melihat semua pesanan yang pernah dibuat

**Komponen**:
- **Filter & Search**:
  - Filter berdasarkan status:
    - Semua
    - Menunggu Pembayaran
    - Dikonfirmasi
    - Sedang Dikerjakan
    - Selesai
    - Dibatalkan
  - Search berdasarkan nomor pesanan
  - Filter tanggal
- **List Pesanan**:
  - Card untuk setiap pesanan berisi:
    - Nomor Pesanan
    - Tanggal Pesanan
    - Jadwal Kunjungan
    - Status (dengan badge warna)
    - Total Pembayaran
    - Button "Lihat Detail"
- **Pagination**

**Status Pesanan**:
1. **Menunggu Pembayaran** (Yellow): Pesanan dibuat, menunggu konfirmasi pembayaran dari admin
2. **Dikonfirmasi** (Blue): Admin sudah konfirmasi pembayaran, menunggu jadwal kunjungan
3. **Sedang Dikerjakan** (Orange): User sudah datang, mobil sedang dikerjakan
4. **Selesai** (Green): Layanan sudah selesai
5. **Dibatalkan** (Red): Pesanan dibatalkan

---

#### 2.2.8 Halaman Detail Pesanan
**Deskripsi**: Halaman detail dari satu pesanan

**Komponen**:
- Order header:
  - Nomor Pesanan
  - Status (badge)
  - Tanggal Pesanan
- Timeline status pesanan (visual stepper)
- Informasi mobil yang diservice
- Jadwal kunjungan (tanggal, waktu, estimasi durasi)
- List item yang dipesan (nama, qty, harga)
- Total pembayaran
- Metode pembayaran
- Button "Download Bukti Pesanan"
- Button "Hubungi Bengkel" (WhatsApp link)
- Jika status "Menunggu Pembayaran":
  - Menampilkan countdown batas waktu pembayaran
  - Instruksi pembayaran
  - Button "Upload Bukti Pembayaran" (optional untuk fase 1)

---

#### 2.2.9 Halaman Kelola Mobil
**Deskripsi**: Halaman untuk mengelola data mobil milik user

**Komponen**:
- Button "Tambah Mobil Baru"
- **List Mobil**:
  - Card untuk setiap mobil berisi:
    - Foto mobil (optional)
    - Merek/Brand (contoh: Toyota, Honda)
    - Model (contoh: Avanza, Jazz)
    - Tahun Produksi
    - Nomor Plat
    - Warna
    - Button "Edit"
    - Button "Hapus"

---

#### 2.2.10 Form Tambah/Edit Mobil
**Deskripsi**: Form untuk menambah atau mengedit data mobil

**Komponen**:
- Upload foto mobil (optional)
- Input Merek/Brand (dropdown atau text input)
- Input Model
- Input Tahun Produksi (dropdown atau number input)
- Input Nomor Plat
- Input Warna (dropdown atau text input)
- Input Nomor Rangka/VIN (optional)
- Textarea Catatan tambahan (optional)
- Button "Simpan"
- Button "Batal"

**Validasi**:
- Merek, Model, Tahun, dan Nomor Plat wajib diisi
- Nomor Plat harus unique untuk user tersebut

---

#### 2.2.11 Halaman Profil User
**Deskripsi**: Halaman untuk melihat dan mengedit profil user

**Komponen**:
- Form profil:
  - Nama Lengkap
  - Email (readonly/tidak bisa diedit)
  - Nomor Telepon
  - Alamat
  - Button "Simpan Perubahan"
- Section Ubah Password:
  - Input Password Lama
  - Input Password Baru
  - Input Konfirmasi Password Baru
  - Button "Ubah Password"

---

### 2.3 Dashboard Admin

#### 2.3.1 Sidebar Navigation (Admin)
**Menu yang tersedia**:
- Dashboard
- Kelola Pesanan
- Kelola Produk & Layanan
- Kelola Jadwal
- Laporan (optional untuk fase 1)
- Pengaturan
- Logout

---

#### 2.3.2 Dashboard Home (Admin)
**Deskripsi**: Halaman utama admin dengan overview bisnis

**Komponen**:
- Welcome message
- **Summary Cards**:
  - Total Pesanan Hari Ini
  - Pesanan Menunggu Konfirmasi (butuh action)
  - Pesanan Hari Ini (scheduled)
  - Revenue Bulan Ini
- **Chart/Graph** (optional untuk fase 1):
  - Grafik pesanan per minggu/bulan
  - Grafik revenue
- **Pesanan Terbaru**:
  - Tabel 10 pesanan terbaru
  - Quick action button (Lihat Detail, Konfirmasi)
- **Jadwal Hari Ini**:
  - List pesanan yang dijadwalkan hari ini
  - Informasi waktu, customer, dan layanan

---

#### 2.3.3 Halaman Kelola Pesanan
**Deskripsi**: Halaman untuk melihat dan mengelola semua pesanan

**Komponen**:
- **Filter & Search**:
  - Filter berdasarkan status (sama seperti user)
  - Filter berdasarkan tanggal pesanan
  - Filter berdasarkan tanggal kunjungan
  - Search berdasarkan nomor pesanan atau nama customer
- **Tabel Pesanan**:
  - Kolom: Nomor Pesanan, Customer, Tanggal Pesanan, Jadwal Kunjungan, Status, Total, Action
  - Action button: Lihat Detail
- **Pagination**

**User Flow**:
1. Admin melihat list pesanan
2. Admin dapat filter berdasarkan status atau tanggal
3. Admin klik "Lihat Detail" untuk melihat detail pesanan

---

#### 2.3.4 Halaman Detail Pesanan (Admin)
**Deskripsi**: Halaman detail pesanan dari sisi admin

**Komponen**:
- **Order Information**:
  - Nomor Pesanan
  - Status saat ini (badge)
  - Tanggal & Waktu Pesanan
  - Jadwal Kunjungan
- **Customer Information**:
  - Nama
  - Email
  - Nomor Telepon
  - Alamat
- **Mobil Information**:
  - Merek & Model
  - Tahun
  - Nomor Plat
  - Warna
- **Order Items**:
  - Tabel detail item (nama, qty, harga satuan, subtotal)
  - Total pembayaran
  - Metode pembayaran
- **Timeline/History Log**:
  - Log aktivitas pesanan (dibuat, dibayar, dikonfirmasi, dikerjakan, selesai)
  - Timestamp setiap aktivitas
- **Action Buttons** (conditional berdasarkan status):
  - Jika status "Menunggu Pembayaran":
    - Button "Konfirmasi Pembayaran" (hijau)
    - Button "Batalkan Pesanan" (merah)
  - Jika status "Dikonfirmasi":
    - Button "Mulai Pengerjaan" (biru)
    - Button "Batalkan Pesanan" (merah)
  - Jika status "Sedang Dikerjakan":
    - Button "Selesai" (hijau)
  - Jika status "Selesai" atau "Dibatalkan":
    - Tidak ada action button

**Business Logic - Update Status**:
- **Konfirmasi Pembayaran**: 
  - Admin memverifikasi pembayaran sudah diterima
  - Status berubah dari "Menunggu Pembayaran" → "Dikonfirmasi"
  - Customer menerima notifikasi (email/WA) bahwa pesanan dikonfirmasi
- **Mulai Pengerjaan**:
  - Digunakan saat customer datang dan mobil mulai dikerjakan
  - Status berubah dari "Dikonfirmasi" → "Sedang Dikerjakan"
- **Selesai**:
  - Digunakan saat layanan sudah selesai dan mobil sudah diserahkan ke customer
  - Status berubah dari "Sedang Dikerjakan" → "Selesai"
  - Customer menerima notifikasi pesanan selesai
- **Batalkan Pesanan**:
  - Admin dapat membatalkan pesanan dengan alasan tertentu
  - Status berubah menjadi "Dibatalkan"
  - Modal konfirmasi dengan textarea alasan pembatalan
  - Customer menerima notifikasi pembatalan

**User Flow**:
1. Admin membuka detail pesanan
2. Admin review informasi pesanan
3. Admin melakukan action sesuai status:
   - Untuk pesanan baru → konfirmasi pembayaran
   - Saat customer datang → mulai pengerjaan
   - Setelah selesai → klik selesai
4. Sistem update status dan mengirim notifikasi ke customer

---

#### 2.3.5 Halaman Kelola Produk & Layanan
**Deskripsi**: Halaman untuk mengelola katalog produk dan layanan

**Komponen**:
- **Tab/Toggle**: 
  - Tab "Semua"
  - Tab "Layanan"
  - Tab "Sparepart"
- Button "Tambah Produk/Layanan Baru"
- **Filter & Search**:
  - Filter berdasarkan kategori
  - Search berdasarkan nama
  - Filter status (Aktif/Tidak Aktif)
- **Tabel/Grid Produk & Layanan**:
  - Kolom: Thumbnail, Nama, Kategori, Tipe (Layanan/Sparepart), Harga, Status, Action
  - Action: Edit, Hapus, Toggle Status (Aktif/Nonaktif)
- **Pagination**

**User Flow**:
1. Admin melihat list produk & layanan
2. Admin dapat filter atau search
3. Admin dapat:
   - Tambah produk/layanan baru
   - Edit produk/layanan existing
   - Menonaktifkan produk/layanan (soft delete)
   - Menghapus produk/layanan (jika belum ada pesanan terkait)

---

#### 2.3.6 Form Tambah/Edit Layanan
**Deskripsi**: Form untuk menambah atau mengedit layanan

**Komponen**:
- Upload gambar/foto layanan (multiple images)
- Input Nama Layanan
- Dropdown Kategori (Tune Up, Maintenance AC, Service Rem, dll)
  - Button "Tambah Kategori Baru" (inline)
- Textarea Deskripsi Lengkap
- Input Harga Jasa (labor cost)
- Input Estimasi Durasi (dalam menit)
- **Section "Sparepart yang Dibutuhkan"**:
  - Button "Tambah Sparepart"
  - List sparepart yang sudah ditambahkan:
    - Nama sparepart (dropdown dari sparepart yang ada di sistem)
    - Quantity
    - Button "Hapus"
  - Total harga sparepart (auto-calculate)
- **Total Harga Layanan** (Harga Jasa + Total Sparepart) - readonly, auto-calculate
- Toggle Status (Aktif/Tidak Aktif)
- Button "Simpan"
- Button "Batal"

**Validasi**:
- Nama layanan wajib diisi dan harus unique
- Kategori wajib dipilih
- Harga jasa dan durasi wajib diisi
- Minimal 1 gambar harus diupload

**Business Logic**:
- Saat admin memilih sparepart dari dropdown, sistem auto-fill harga sparepart
- Total harga layanan = Harga Jasa + (Σ Harga Sparepart × Quantity)
- Admin dapat menambahkan multiple sparepart dengan merek berbeda untuk memberikan opsi kepada customer

---

#### 2.3.7 Form Tambah/Edit Sparepart
**Deskripsi**: Form untuk menambah atau mengedit sparepart

**Komponen**:
- Upload gambar/foto sparepart (multiple images)
- Input Nama Sparepart
- Input Merek/Brand
- Dropdown Kategori (optional, untuk grouping sparepart)
- Textarea Deskripsi & Spesifikasi Teknis
- Input Harga Satuan (hanya barang)
- Input Harga Pemasangan (biaya pasang)
- Input Estimasi Waktu Pemasangan (dalam menit)
- Input Stok Tersedia (quantity)
- Toggle Status (Aktif/Tidak Aktif)
- Button "Simpan"
- Button "Batal"

**Validasi**:
- Nama, merek, dan harga wajib diisi
- Stok minimal 0
- Estimasi waktu pemasangan wajib diisi

**Business Logic**:
- **Harga Total = Harga Satuan + Harga Pemasangan** (jika customer pilih dengan pemasangan)
- Jika sparepart digunakan dalam layanan, harga yang diambil adalah harga satuan saja (bukan dengan pemasangan, karena sudah termasuk dalam harga jasa layanan)
- Admin dapat membuat multiple entry untuk sparepart yang sama tapi beda merek, sehingga customer bisa pilih

**Contoh**:
```
Sparepart: Filter Oli
- Entry 1: Filter Oli - Merek A - Rp 50.000 (satuan) + Rp 25.000 (pasang) = Rp 75.000
- Entry 2: Filter Oli - Merek B - Rp 80.000 (satuan) + Rp 25.000 (pasang) = Rp 105.000

Dalam Layanan "Ganti Oli":
- Jika pakai Merek A: hitung harga Rp 50.000 (satuan saja)
- Jika pakai Merek B: hitung harga Rp 80.000 (satuan saja)
- Harga pemasangan sudah included dalam harga jasa layanan
```

---

#### 2.3.8 Halaman Kelola Kategori
**Deskripsi**: Halaman untuk mengelola kategori produk & layanan

**Komponen**:
- Button "Tambah Kategori Baru"
- **Tabel Kategori**:
  - Kolom: Nama Kategori, Jumlah Produk/Layanan, Action
  - Action: Edit, Hapus
- Modal/Form Tambah/Edit Kategori:
  - Input Nama Kategori
  - Textarea Deskripsi (optional)
  - Button "Simpan"

**Business Logic**:
- Kategori tidak bisa dihapus jika masih ada produk/layanan yang menggunakan kategori tersebut
- Admin harus memindahkan produk/layanan ke kategori lain terlebih dahulu

---

#### 2.3.9 Halaman Kelola Jadwal
**Deskripsi**: Halaman untuk melihat dan mengelola jadwal booking

**Komponen**:
- **Calendar View**:
  - Monthly calendar dengan indikator jumlah booking per hari
  - Warna/badge untuk hari yang penuh vs masih tersedia
  - Klik hari untuk melihat detail booking di hari tersebut
- **Daily View** (saat klik hari di calendar):
  - Date picker untuk navigasi hari
  - Timeline view (jam 08:00 - 17:00)
  - Card untuk setiap booking:
    - Waktu mulai - waktu selesai
    - Nama customer
    - Nomor pesanan
    - Mobil (merek, model, plat)
    - List layanan
    - Status
    - Button "Lihat Detail Pesanan"
  - Visual indicator untuk slot yang sudah terisi vs kosong

**Business Logic**:
- Admin dapat melihat ketersediaan slot secara visual
- Admin dapat mengidentifikasi konflik jadwal (jika ada)
- Admin tidak dapat mengubah jadwal booking dari sini (user yang tentukan saat checkout)
- Admin hanya bisa membatalkan pesanan jika ada masalah

**Additional Feature (Optional untuk fase 1)**:
- Setting kapasitas bengkel (jumlah bay/slot bersamaan)
- Setting jam operasional custom per hari
- Blocking date untuk hari libur

---

#### 2.3.10 Halaman Pengaturan
**Deskripsi**: Halaman untuk konfigurasi sistem

**Komponen**:
- **Tab "Informasi Bengkel"**:
  - Nama Bengkel
  - Alamat Lengkap
  - Nomor Telepon
  - Email
  - Link Google Maps
  - Jam Operasional (per hari)
  - Upload Logo Bengkel
  - Button "Simpan"
- **Tab "Konfigurasi Booking"**:
  - Setting kapasitas bengkel (jumlah bay/slot mobil bersamaan)
  - Setting interval slot waktu (30 menit, 60 menit, dll)
  - Setting buffer time antar booking (optional)
  - Setting batas waktu booking minimal (contoh: minimal H+1)
  - Setting batas waktu pembayaran (contoh: 24 jam)
  - Button "Simpan"
- **Tab "Notifikasi"**:
  - Toggle notifikasi email untuk pesanan baru
  - Toggle notifikasi WhatsApp (untuk fase selanjutnya)
  - Input email admin yang akan menerima notifikasi
  - Button "Simpan"
- **Tab "Ubah Password Admin"**:
  - Input Password Lama
  - Input Password Baru
  - Input Konfirmasi Password Baru
  - Button "Ubah Password"

---

## 3. User Roles & Permissions

### 3.1 User Biasa (Customer)
**Permissions**:
- ✅ Melihat semua produk & layanan
- ✅ Menambahkan produk/layanan ke keranjang
- ✅ Melakukan checkout dan pembayaran
- ✅ Melihat riwayat pesanan sendiri
- ✅ Mengelola data mobil sendiri
- ✅ Mengupdate profil sendiri
- ❌ Tidak dapat mengakses dashboard admin
- ❌ Tidak dapat mengubah status pesanan
- ❌ Tidak dapat mengelola produk/layanan

### 3.2 Admin
**Permissions**:
- ✅ Melihat semua pesanan dari semua customer
- ✅ Mengubah status pesanan (konfirmasi, proses, selesai, batal)
- ✅ Mengelola produk & layanan (CRUD)
- ✅ Mengelola kategori
- ✅ Melihat jadwal booking
- ✅ Mengakses laporan (jika diimplementasikan)
- ✅ Mengubah pengaturan sistem
- ❌ Tidak dapat mengubah harga pesanan setelah checkout
- ❌ Tidak dapat melihat password customer

---

## 4. User Flows

### 4.1 Flow User Memesan Layanan (Happy Path)

```
1. User buka website BengkelAim
   ↓
2. User browse homepage, lihat layanan unggulan
   ↓
3. User klik "Lihat Semua Layanan" atau menu "Produk & Layanan"
   ↓
4. User browse katalog, gunakan filter jika perlu
   ↓
5. User klik "Lihat Detail" pada layanan yang menarik
   ↓
6. User lihat detail layanan, pilih alternatif sparepart (jika ada)
   ↓
7. User klik "Tambah ke Keranjang"
   ↓
8. Sistem cek: User sudah login? 
   - Jika BELUM → Redirect ke halaman Login
     ↓
     8a. User login atau register
     ↓
     8b. Setelah login, redirect kembali ke halaman detail produk
     ↓
     8c. User klik "Tambah ke Keranjang" lagi
   ↓
9. Item masuk ke keranjang, tampil notifikasi sukses
   ↓
10. User dapat lanjut belanja atau klik "Lihat Keranjang"
   ↓
11. Di halaman keranjang, user pilih mobil yang akan diservice
   ↓
12. User pilih tanggal kunjungan
   ↓
13. Sistem tampilkan slot waktu yang tersedia di tanggal tersebut
   ↓
14. User pilih slot waktu yang sesuai
   ↓
15. User review total pembayaran
   ↓
16. User klik "Lanjut ke Checkout"
   ↓
17. Di halaman checkout, user review semua detail:
    - Order items
    - Mobil yang dipilih
    - Jadwal kunjungan
    - Info kontak (auto-fill, bisa edit)
   ↓
18. User pilih metode pembayaran (UI only)
   ↓
19. User centang "Setuju dengan syarat dan ketentuan"
   ↓
20. User klik "Konfirmasi Pesanan"
   ↓
21. Sistem create order dengan status "Menunggu Pembayaran"
   ↓
22. Redirect ke halaman konfirmasi pembayaran
   ↓
23. User lihat nomor pesanan, total pembayaran, instruksi pembayaran
   ↓
24. User download bukti pesanan (PDF)
   ↓
25. User melakukan pembayaran sesuai instruksi
   ↓
26. [Di sisi Admin] Admin menerima notifikasi pesanan baru
   ↓
27. Admin buka halaman kelola pesanan
   ↓
28. Admin klik "Lihat Detail" pada pesanan tersebut
   ↓
29. Admin verifikasi pembayaran sudah diterima
   ↓
30. Admin klik "Konfirmasi Pembayaran"
   ↓
31. Status pesanan berubah menjadi "Dikonfirmasi"
   ↓
32. User menerima notifikasi bahwa pembayaran dikonfirmasi
   ↓
33. [Saat jadwal kunjungan tiba] User datang ke bengkel dengan mobilnya
   ↓
34. Admin klik "Mulai Pengerjaan"
   ↓
35. Status berubah menjadi "Sedang Dikerjakan"
   ↓
36. Bengkel mengerjakan layanan sesuai pesanan
   ↓
37. Setelah selesai, admin klik "Selesai"
   ↓
38. Status berubah menjadi "Selesai"
   ↓
39. User menerima notifikasi pesanan selesai
   ↓
40. User dapat melihat detail pesanan di riwayat pesanan
```

### 4.2 Flow Admin Mengelola Produk Baru

```
1. Admin login ke dashboard
   ↓
2. Admin klik menu "Kelola Produk & Layanan"
   ↓
3. Admin klik "Tambah Produk/Layanan Baru"
   ↓
4. Pilih tipe: Layanan atau Sparepart
   ↓
5A. Jika LAYANAN:
    ↓
    5A.1. Admin upload foto layanan
    ↓
    5A.2. Admin isi nama layanan, pilih kategori
    ↓
    5A.3. Admin isi deskripsi lengkap
    ↓
    5A.4. Admin isi harga jasa dan estimasi durasi
    ↓
    5A.5. Admin klik "Tambah Sparepart" untuk menambahkan sparepart yang dibutuhkan
    ↓
    5A.6. Admin pilih sparepart dari dropdown, tentukan qty
    ↓
    5A.7. Sistem auto-calculate total harga sparepart
    ↓
    5A.8. Sistem auto-calculate total harga layanan (jasa + sparepart)
    ↓
    5A.9. Admin klik "Simpan"
    ↓
    5A.10. Sistem validasi data, jika valid → layanan tersimpan
    ↓
    5A.11. Layanan muncul di katalog (jika status Aktif)

5B. Jika SPAREPART:
    ↓
    5B.1. Admin upload foto sparepart
    ↓
    5B.2. Admin isi nama, merek, kategori
    ↓
    5B.3. Admin isi deskripsi & spesifikasi
    ↓
    5B.4. Admin isi harga satuan dan harga pemasangan
    ↓
    5B.5. Admin isi estimasi waktu pemasangan
    ↓
    5B.6. Admin isi stok tersedia
    ↓
    5B.7. Admin klik "Simpan"
    ↓
    5B.8. Sistem validasi data, jika valid → sparepart tersimpan
    ↓
    5B.9. Sparepart muncul di katalog dan dapat digunakan dalam layanan
```

### 4.3 Flow Booking System (Detail)

```
Saat User Memilih Jadwal di Keranjang:

1. User pilih tanggal kunjungan (contoh: 15 Februari 2026)
   ↓
2. Sistem query database:
   - Ambil semua pesanan dengan status "Dikonfirmasi" atau "Sedang Dikerjakan" di tanggal 15 Feb 2026
   - Ambil setting kapasitas bengkel (contoh: 2 bay)
   - Ambil jam operasional (contoh: 08:00 - 17:00)
   ↓
3. Sistem calculate:
   - Total estimasi durasi layanan user (dari keranjang)
   - Contoh: User punya 2 layanan: Service AC (120 menit) + Tune Up (90 menit) = 210 menit total
   ↓
4. Sistem generate slot waktu:
   - Interval: setiap 30 menit
   - Slot 1: 08:00 - 08:30
   - Slot 2: 08:30 - 09:00
   - Slot 3: 09:00 - 09:30
   - ... dst hingga 17:00
   ↓
5. Untuk setiap slot, sistem cek ketersediaan:
   
   Contoh untuk Slot 08:00:
   - User butuh 210 menit → selesai jam 11:30
   - Periode yang terpakai: 08:00 - 11:30
   - Cek: berapa banyak booking existing yang overlap dengan periode 08:00 - 11:30?
   
   Asumsi ada booking existing:
   - Booking A: 08:00 - 10:00 (120 menit)
   - Booking B: 09:00 - 10:30 (90 menit)
   
   Timeline overlap:
   08:00 -------- 10:00 = Booking A (bay 1)
       09:00 ---- 10:30 = Booking B (bay 2)
   
   Di periode 09:00 - 10:00 → ada 2 booking bersamaan (bay penuh!)
   
   Kesimpulan: Slot 08:00 TIDAK TERSEDIA (karena akan ada 3 booking overlap di periode 09:00-10:00, padahal kapasitas hanya 2 bay)
   
   ↓
6. Sistem marking slot:
   - Slot yang available = hijau
   - Slot yang penuh = abu-abu (disabled)
   ↓
7. User hanya bisa pilih slot hijau
   ↓
8. User pilih slot 11:00 (available)
   ↓
9. Sistem catat: 
   - Booking user: 11:00 - 14:30 (210 menit)
   - Slot ini akan direserve setelah checkout
   ↓
10. User lanjut ke checkout
   ↓
11. Setelah checkout, booking disimpan dengan status "Menunggu Pembayaran"
   ↓
12. Slot 11:00 - 14:30 sudah tercatat dalam sistem (tapi belum benar-benar "mengunci" slot sampai admin konfirmasi pembayaran)
   ↓
13. Setelah admin konfirmasi pembayaran → booking status jadi "Dikonfirmasi"
   ↓
14. Slot 11:00 - 14:30 RESMI TERKUNCI untuk user lain
```

**Business Rules untuk Booking System**:
- User tidak bisa booking di hari yang sama (minimal H+1)
- Jika pembayaran tidak dikonfirmasi dalam 24 jam, booking otomatis expire dan slot dikembalikan
- Admin bisa melihat real-time availability di halaman Kelola Jadwal
- Jika ada pembatalan, slot otomatis available lagi untuk user lain

---

## 5. Technical Requirements

### 5.1 Technology Stack (Rekomendasi)

**Frontend**:
- Framework: Nextjs untuk Frontend & Backend
- UI Library: Tailwind CSS, Material-UI, atau Ant Design
- HTTP Client: Axios

**Backend**:
- Framework: Nextjs
- Database: Supabase
- Authentication: Supabase

**Additional Tools**:
- File Upload: Multer atau Cloud Storage (Supabase)
- PDF Generation: jsPDF atau PDFKit
- Payment Gateway (fase 2): Midtrans SDK

### 5.2 Database Schema (High-Level)

**Table: users**
- id (PK)
- name
- email (unique)
- password (hashed)
- phone
- address
- role (enum: 'user', 'admin')
- created_at
- updated_at

**Table: cars**
- id (PK)
- user_id (FK → users.id)
- brand
- model
- year
- plate_number
- color
- vin (optional)
- notes (optional)
- photo_url (optional)
- created_at
- updated_at

**Table: categories**
- id (PK)
- name
- description
- created_at
- updated_at

**Table: products** (untuk layanan dan sparepart)
- id (PK)
- type (enum: 'service', 'sparepart')
- name
- category_id (FK → categories.id)
- description
- brand (untuk sparepart)
- price (untuk sparepart: harga satuan, untuk service: harga jasa)
- installation_price (untuk sparepart)
- installation_duration (dalam menit)
- duration (untuk service, dalam menit)
- stock (untuk sparepart)
- status (enum: 'active', 'inactive')
- images (JSON array of image URLs)
- created_at
- updated_at

**Table: service_spareparts** (relasi many-to-many antara service dan sparepart)
- id (PK)
- service_id (FK → products.id where type='service')
- sparepart_id (FK → products.id where type='sparepart')
- quantity
- created_at
- updated_at

**Table: orders**
- id (PK)
- order_number (unique, auto-generated)
- user_id (FK → users.id)
- car_id (FK → cars.id)
- scheduled_date
- scheduled_time
- total_duration (dalam menit)
- subtotal
- tax (optional)
- total_price
- payment_method
- status (enum: 'pending_payment', 'confirmed', 'in_progress', 'completed', 'cancelled')
- cancellation_reason (optional)
- created_at
- updated_at

**Table: order_items**
- id (PK)
- order_id (FK → orders.id)
- product_id (FK → products.id)
- product_name (snapshot)
- product_type (snapshot)
- quantity
- price (snapshot harga saat order)
- subtotal
- created_at
- updated_at

**Table: order_status_history** (untuk tracking perubahan status)
- id (PK)
- order_id (FK → orders.id)
- status
- changed_by (FK → users.id, admin yang melakukan perubahan)
- notes (optional)
- created_at

**Table: settings** (untuk konfigurasi sistem)
- id (PK)
- key (unique)
- value (JSON)
- created_at
- updated_at

---

### 5.3 API Endpoints (High-Level)

**Authentication**:
- POST /api/auth/register - Register user baru
- POST /api/auth/login - Login user/admin
- POST /api/auth/logout - Logout
- POST /api/auth/forgot-password - Request reset password
- POST /api/auth/reset-password - Reset password

**User Management**:
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile
- PUT /api/users/password - Change password

**Cars Management**:
- GET /api/cars - Get user's cars
- POST /api/cars - Add new car
- GET /api/cars/:id - Get car detail
- PUT /api/cars/:id - Update car
- DELETE /api/cars/:id - Delete car

**Products & Services**:
- GET /api/products - Get all products/services (with filters)
- GET /api/products/:id - Get product/service detail
- POST /api/products - Create new product/service (admin only)
- PUT /api/products/:id - Update product/service (admin only)
- DELETE /api/products/:id - Delete product/service (admin only)
- GET /api/categories - Get all categories
- POST /api/categories - Create category (admin only)
- PUT /api/categories/:id - Update category (admin only)
- DELETE /api/categories/:id - Delete category (admin only)

**Cart**:
- GET /api/cart - Get user's cart
- POST /api/cart - Add item to cart
- PUT /api/cart/:id - Update cart item
- DELETE /api/cart/:id - Remove item from cart

**Booking & Schedule**:
- GET /api/booking/available-slots - Get available time slots for a date
- POST /api/booking/check-availability - Check if a slot is available

**Orders**:
- GET /api/orders - Get user's orders (or all orders for admin)
- POST /api/orders - Create new order (checkout)
- GET /api/orders/:id - Get order detail
- PUT /api/orders/:id/status - Update order status (admin only)
- PUT /api/orders/:id/cancel - Cancel order
- GET /api/orders/:id/pdf - Download order PDF

**Admin Dashboard**:
- GET /api/admin/dashboard - Get dashboard statistics
- GET /api/admin/orders - Get all orders with filters
- GET /api/admin/schedule - Get booking schedule

**Settings**:
- GET /api/settings - Get system settings
- PUT /api/settings - Update system settings (admin only)

---

### 5.4 Non-Functional Requirements

**Performance**:
- Halaman harus load dalam < 3 detik
- API response time < 500ms
- Dapat handle minimal 100 concurrent users

**Security**:
- Password harus di-hash menggunakan bcrypt
- Implementasi JWT untuk authentication
- Input validation untuk semua form
- Protection terhadap SQL Injection dan XSS
- HTTPS untuk production

**Scalability**:
- Database harus dapat di-scale secara horizontal
- Gunakan caching untuk query yang sering diakses (Redis)
- CDN untuk static assets (images, CSS, JS)

**Usability**:
- Responsive design (mobile, tablet, desktop)
- Intuitive UI/UX
- Loading indicators untuk setiap action
- Error messages yang jelas dan helpful
- Confirmation dialogs untuk action yang critical (hapus, cancel order)

**Reliability**:
- Backup database harian
- Error logging dan monitoring
- Graceful error handling

---

## 6. UI/UX Guidelines

### 6.1 Design Principles
- **Clean & Modern**: Design yang bersih, tidak berantakan
- **Easy to Navigate**: Struktur menu yang jelas, breadcrumbs
- **Mobile-First**: Prioritas untuk mobile responsiveness
- **Consistent**: Color scheme, typography, spacing yang konsisten
- **Accessible**: Contrast ratio yang baik, font size yang readable

### 6.2 Color Palette (Rekomendasi)
- **Primary**: Biru/Hitam (untuk brand identity bengkel)
- **Secondary**: Orange/Merah (untuk CTA dan highlights)
- **Success**: Hijau (untuk status berhasil, konfirmasi)
- **Warning**: Kuning (untuk peringatan)
- **Danger**: Merah (untuk error, cancel, delete)
- **Neutral**: Abu-abu untuk text dan backgrounds

### 6.3 Typography
- **Heading**: Bold, besar, mudah dibaca
- **Body**: Regular, size 14-16px
- **Small Text**: Size 12-14px untuk caption dan metadata

### 6.4 Components
- **Buttons**: Rounded corners, clear labels, hover effects
- **Cards**: Untuk product listings, order cards, dengan shadow/border
- **Forms**: Clear labels, inline validation, helpful error messages
- **Modals**: Untuk confirmations, forms yang tidak terlalu panjang
- **Notifications/Toasts**: Untuk feedback setelah action (sukses, error)
- **Loading Indicators**: Spinner atau skeleton screens

---

## 7. Success Metrics (KPI)

### 7.1 Business Metrics
- **Conversion Rate**: % visitor yang melakukan pemesanan
- **Average Order Value (AOV)**: Rata-rata nilai transaksi per pesanan
- **Booking Completion Rate**: % booking yang selesai dilayani vs total booking
- **Customer Retention Rate**: % customer yang kembali memesan

### 7.2 Technical Metrics
- **Page Load Time**: < 3 detik
- **API Response Time**: < 500ms
- **Uptime**: > 99.5%
- **Error Rate**: < 1%

### 7.3 User Engagement Metrics
- **Daily Active Users (DAU)**
- **Monthly Active Users (MAU)**
- **Session Duration**: Rata-rata waktu user di website
- **Bounce Rate**: % visitor yang langsung pergi tanpa interaksi

---

## 8. Implementation Phases

### Phase 1: MVP (Minimum Viable Product) - 8-10 weeks
**Week 1-2: Setup & Authentication**
- Setup project structure (frontend & backend)
- Database design & setup
- User registration & login
- Admin authentication

**Week 3-4: Product & Service Management**
- CRUD untuk produk & layanan (admin)
- Kategori management
- Public product listing pages
- Product detail pages

**Week 5-6: Cart & Booking System**
- Add to cart functionality
- Cart management
- Booking system (date picker, slot selection)
- Available slots calculation

**Week 7-8: Checkout & Orders**
- Checkout flow
- Order creation
- Order management (admin & user)
- Order status updates
- PDF generation untuk bukti pesanan

**Week 9-10: UI Polish & Testing**
- UI/UX refinement
- Responsive design testing
- Bug fixing
- User acceptance testing (UAT)

### Phase 2: Payment Integration - 2-3 weeks
- Integrasi Midtrans payment gateway
- Payment confirmation flow
- Payment status handling

### Phase 3: Notifications & Enhancements - 2-3 weeks
- Dashboard notifications
- Review & rating system (optional)
- Promo/discount system (optional)
- Dashboard analytics & reporting

### Phase 4: Optimization & Scaling - Ongoing
- Performance optimization
- SEO optimization
- Marketing integrations (Google Analytics, Facebook Pixel)
- A/B testing
- Feature improvements based on user feedback

---

## 9. Risks & Mitigation

### 9.1 Technical Risks
**Risk**: Booking system conflict (double booking)
**Mitigation**: 
- Implement row-level locking pada database saat create booking
- Real-time availability check
- Konfirmasi pembayaran sebagai "lock" final untuk slot

**Risk**: Payment gateway integration issues
**Mitigation**:
- Fase 1 focus pada UI/flow tanpa integrasi real
- Dokumentasi API Midtrans yang lengkap
- Testing environment dari Midtrans (sandbox)

**Risk**: Database performance issues dengan banyak bookings
**Mitigation**:
- Indexing pada kolom yang sering di-query (scheduled_date, status)
- Caching untuk available slots
- Pagination untuk list orders

### 9.2 Business Risks
**Risk**: User tidak melakukan pembayaran setelah booking
**Mitigation**:
- Set expiration time untuk booking (24 jam)
- Reminder di dashboard sebelum expiration
- Sistem auto-cancel booking yang expired

**Risk**: Slot booking tidak akurat (estimasi durasi tidak sesuai)
**Mitigation**:
- Admin dapat adjust estimasi durasi per layanan
- Buffer time antar booking untuk antisipasi overrun
- Historical data analysis untuk improve estimasi

---

# 11. Appendix

### 11.1 Glossary
- **Bay**: Area/tempat di bengkel untuk mengerjakan satu mobil
- **Booking**: Reservasi jadwal kunjungan ke bengkel
- **Slot**: Periode waktu tertentu di jadwal booking
- **Order**: Pesanan yang dibuat oleh user
- **Checkout**: Proses finalisasi pesanan dan pembayaran
- **Admin**: Pengelola bengkel yang menggunakan dashboard admin

---

## 12. Sign-off & Approval

**Document Version**: 1.0
**Date**: 14 Februari 2026
**Prepared by**: Claude (AI Assistant)
**Status**: Draft - Pending Review

**Approval**:
- [ ] Product Owner
- [ ] Tech Lead
- [ ] UI/UX Designer
- [ ] Stakeholders
