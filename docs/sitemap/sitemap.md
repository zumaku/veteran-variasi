# Sitemap veteran Variasi

### Pelanggan

- **Beranda (Home):** Halaman pendaratan (_landing page_) berisi penawaran utama, _highlight_ layanan Perawatan AC, dan deretan aksesoris variasi terlaris.
- **Katalog Aksesoris:** Menampilkan daftar produk fisik dengan filter kategori. Mengklik produk akan membuka halaman **Detail Produk** (berisi spesifikasi dan tombol _Add to Cart_).
- **Katalog Layanan (Perawatan AC):** Halaman khusus yang menjelaskan detail layanan _cleaning_ AC beserta harga _flat_-nya.
- **Autentikasi (Login & Daftar):** Didesain sebagai _modal pop-up_ di tengah layar (_centered UI_) yang menimpa halaman aktif, sehingga pengguna tidak perlu berpindah halaman saat harus _login_ untuk memasukkan barang ke keranjang.
- **Profil Saya (Dashboard Pelanggan):** Halaman ringkasan data diri pelanggan. Halaman ini juga berisi manajemen mobil di mana user dapat menambah, mengedit, atau menghapus data mobil (Merek, Model, Tahun) mereka.
- **Riwayat Pesanan:** Halaman berisi daftar transaksi, Kode Booking, status pengerjaan, dan form untuk memberikan ulasan (_rating_) ketika layanan selesai.
- **Keranjang Belanja:** Halaman untuk meninjau pesanan (barang dan jasa) beserta total harga.
- **Pilih Mobil & Jadwal (Checkout Step 1):** Halaman dengan tata letak minimalis yang menampilkan kartu pilihan mobil dari "Garasi" dan komponen Kalender interaktif dengan 3 tombol slot waktu pelayanan. Halaman ini juga berisi pilihan metode pembayaran.
- **Pembayaran (Checkout Step 2):** Halaman yang menampilkan _payment gateway_ dan _countdown timer_ di tengah layar untuk menahan slot 3 jam tersebut.
- **Halaman Sukses:** Layar konfirmasi yang menampilkan Invoice dan Kode Booking setelah pembayaran berhasil.

---

### Area Admin (Dashboard Panel)

- **Dashboard Utama (Jadwal Harian):** Halaman layar utama admin. Berisi tabel atau kalender jadwal hari ini. Tampilan di sini wajib mengimplementasikan baris dengan kode warna (_color-coded rows_) untuk setiap status slot waktu (Kuning, Biru, Hijau, Abu-abu) agar admin bisa membaca situasi bengkel dalam hitungan detik.
- **Manajemen Pesanan:** Halaman berisi daftar seluruh transaksi masuk. Admin menggunakan halaman ini untuk mencari Kode Booking, memvalidasi kedatangan, dan memperbarui status pesanan.
- **Manajemen Katalog (Aksesoris):** Halaman _CRUD_ (Create, Read, Update, Delete) untuk mengatur inventaris barang variasi, harga, dan gambar produk.
- **Manajemen Layanan (AC):** Halaman pengaturan untuk memperbarui deksripsi atau harga _flat_ layanan perawatan AC.
- **Manajemen Pelanggan:** Database visual berisi daftar pengguna terdaftar beserta data mobil di "Garasi" mereka untuk keperluan teknis mekanik.
- **Ulasan & Rating:** Halaman untuk memantau kepuasan pelanggan dari _feedback_ yang masuk setelah pelayanan selesai.
