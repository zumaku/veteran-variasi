### 1. User Flow Pelanggan (Customer Journey)

**Fase Eksplorasi & Autentikasi**

1. **Eksplorasi (Guest Mode):** Pengguna masuk ke _website_ dan bisa langsung melihat-lihat katalog aksesoris serta layanan _Cleaning AC_ (dengan harga _flat_).
2. **Intersepsi Login:** Pengguna menekan "Tambah ke Keranjang" pada suatu produk/layanan. Sistem memunculkan _modal_ atau _redirect_ untuk _Login/Register_ karena ini wajib untuk bertransaksi.
3. **Setup "Garasi Saya":** Setelah registrasi berhasil, pengguna baru diwajibkan mengisi data mobil (Merek, Model, Tahun) ke dalam fitur Garasi. Setelah selesai, barang otomatis masuk ke keranjang tanpa harus dicari ulang.

**Fase Checkout & Penjadwalan** 4. **Review Keranjang & Pilih Mobil:** Pengguna membuka keranjang, melihat total harga (sudah termasuk biaya pasang/jasa). Pengguna memilih mobil mana dari "Garasi" yang akan dibawa. 5. **Pilih Jadwal (Sistem Slot 3 Jam):** Pengguna memilih tanggal kedatangan pada kalender. Sistem menampilkan 3 blok waktu. Slot yang sudah terisi oleh mobil lain akan tampil _disabled_ (tidak bisa diklik). Pengguna memilih satu slot yang kosong. 6. **Kunci Jadwal Sementara:** Saat pengguna klik "Lanjut Bayar", sistem mengunci slot waktu tersebut (misal selama 15 menit) dan memunculkan _countdown timer_.

**Fase Pembayaran & Eksekusi**

7. **Payment Gateway:** Pengguna menyelesaikan pembayaran (QRIS, VA, e-Wallet) sebelum waktu habis. Jika _expired_, pesanan batal dan slot kembali kosong.
8. **Konfirmasi:** Pembayaran berhasil, pengguna mendapatkan **Kode Booking**.
9. **Pelayanan di Bengkel:** Pengguna datang sesuai jadwal, menunjukkan Kode Booking. Mobil dikerjakan.
10. **Post-Service (Rating):** Setelah status diubah menjadi "Selesai" oleh admin, pengguna mendapat notifikasi untuk memberikan ulasan layanan.

---

### 2. User Flow Admin (Dashboard Management)

**Fase Persiapan & Manajemen Data**

1. **Manajemen Katalog:** Admin menambah/mengedit aksesoris, stok, dan deskripsi, serta mengelola tampilan layanan _Cleaning AC_.
2. **Manajemen Pelanggan:** Admin dapat melihat daftar pelanggan terdaftar beserta detail mobil di "Garasi" mereka untuk memastikan kesiapan alat/mekanik sebelum pelanggan tiba.

**Fase Operasional (Core Dashboard)** 3. **Pemantauan Jadwal Harian:** Admin membuka halaman utama _dashboard_ yang berisi tabel jadwal hari ini. Tampilan antarmuka di sini menggunakan logika _color-coded rows_ (baris dengan warna spesifik) untuk mempercepat pemahaman visual:

- **Baris Kuning:** _User_ sedang di tahap pembayaran (menahan slot sementara).
- **Baris Biru:** Lunas, menunggu kedatangan pelanggan di jam tersebut.
- **Baris Hijau:** Mobil sedang dikerjakan atau sudah selesai.
- **Baris Abu-abu:** Slot kosong atau pesanan batal/_expired_.

4. **Eksekusi Pesanan:** Pelanggan datang, admin memvalidasi Kode Booking. Admin mengubah status dari "Menunggu Kedatangan" $\rightarrow$ "Sedang Dikerjakan" $\rightarrow$ "Selesai".

---

### 1. Customer User Flow (Sisi Pelanggan)

**A. Skenario Eksplorasi & Autentikasi**
Buka Website Veteran Variasi ➔ Lihat Katalog Aksesoris & Cleaning AC (Guest Mode) ➔ Klik "Tambah ke Keranjang" ➔ Muncul Pop-up/Halaman Login ➔ Login / Register ➔ Isi Form "Garasi Saya" (Khusus User Baru) ➔ Barang Otomatis Masuk Keranjang.

**B. Skenario Checkout & Penjadwalan**
Buka Halaman Keranjang ➔ Cek Ringkasan Pesanan (Harga Final) ➔ Pilih Mobil dari "Garasi" ➔ Buka Kalender & Pilih Tanggal ➔ Pilih Slot 3 Jam (Hanya slot kosong yang bisa diklik) ➔ Klik "Lanjut Pembayaran".

**C. Skenario Pembayaran & Kedatangan**
Sistem Mengunci Slot (Timer 15 Menit Aktif) ➔ Masuk Halaman Payment Gateway Asli ➔ Lakukan Pembayaran (VA/QRIS/dll) ➔ Pembayaran Berhasil ➔ Dialihkan ke Halaman Sukses (Dapat Kode Booking) ➔ Datang ke Bengkel Sesuai Jadwal ➔ Tunjukkan Kode Booking ➔ Mobil Dikerjakan ➔ Terima Notifikasi ➔ Berikan Rating & Ulasan.

---

### 2. Admin User Flow (Sisi Pengelola Bengkel)

**A. Skenario Pemantauan Harian (Core Dashboard)**
Login Akun Admin ➔ Buka Dashboard Utama ➔ Lihat Tabel Jadwal Harian ➔ Pantau Status via Baris Kode Warna (Kuning: Menunggu Bayar, Biru: Lunas/Menunggu Datang, Hijau: Dikerjakan/Selesai, Abu-abu: Batal/Kosong).

**B. Skenario Penerimaan Pelanggan**
Pelanggan Tiba di Bengkel ➔ Admin Meminta Kode Booking ➔ Cari Kode di Sistem / Dashboard ➔ Validasi Data Mobil & Pesanan ➔ Ubah Status Pesanan Menjadi "Sedang Dikerjakan" ➔ Proses Pemasangan/Service Selesai ➔ Ubah Status Menjadi "Selesai" (Otomatis mengirim permintaan rating ke pelanggan).

**C. Skenario Manajemen Data (Opsional/Sesuai Kebutuhan)**
Buka Menu Manajemen Katalog ➔ Tambah/Edit Produk Variasi & Stok ➔ Simpan Perubahan ➔ Katalog Website Terupdate.
