# ERD Veteran Variasi

### 1. Tabel `users`

Menyimpan data autentikasi baik untuk admin maupun pelanggan.

* `id` (Primary Key, UUID/Auto-increment)
* `name` (Varchar)
* `email` (Varchar, Unique)
* `password_hash` (Varchar)
* `role` (Enum: `'admin'`, `'customer'`)
* `phone` (Varchar)
* `created_at` (Timestamp)

### 2. Tabel `cars` (Fitur Garasi)

Menyimpan data mobil pelanggan. Satu *user* bisa memiliki banyak mobil (Relasi 1-to-N).

* `id` (Primary Key)
* `user_id` (Foreign Key $\rightarrow$ `users.id`)
* `brand` (Varchar) - *Contoh: Toyota, Honda*
* `model` (Varchar) - *Contoh: Avanza, Brio*
* `year` (Int)
* `license_plate` (Varchar)
* `image` (Varchar)
* `created_at` (Timestamp)

### 3. Tabel `products` (Katalog Aksesoris & Layanan)

Menyimpan data barang dan jasa. Layanan *Cleaning AC* dimasukkan ke sini dengan tipe berbeda agar bisa disatukan dalam satu keranjang belanja.

* `id` (Primary Key)
* `name` (Varchar)
* `type` (Enum: `'accessory'`, `'service'`)
* `description` (Text)
* `price` (Decimal/Int)
* `stock` (Int, Nullable) - *Bisa dikosongkan/NULL untuk tipe 'service'*

### 4. Tabel `orders` (Transaksi & Penjadwalan)

Ini adalah tabel paling krusial. Menyimpan data pesanan, jadwal 3 jam, dan status pembayaran yang nantinya akan dipetakan menjadi visual *color-coded rows* di *dashboard* admin.

* `id` (Primary Key, atau format Order ID unik misal: `ORD-123`)
* `user_id` (Foreign Key $\rightarrow$ `users.id`)
* `car_id` (Foreign Key $\rightarrow$ `cars.id`)
* `booking_date` (Date)
* `time_slot` (Int/Enum: `1`, `2`, `3`) - *Merepresentasikan 09:00-12:00, 12:00-15:00, 15:00-18:00*
* `total_amount` (Decimal/Int)
* `status` (Enum: `'PENDING'`, `'PAID'`, `'PROCESSING'`, `'COMPLETED'`, `'CANCELLED'`)
* `payment_token` (Varchar, Nullable) - *Untuk integrasi Payment Gateway*
* `expired_at` (Timestamp) - *Kunci waktu mundur (timer) 15 menit*
* `created_at` (Timestamp)

> **Catatan Penting untuk Keamanan Jadwal (Concurrency):**
> Agar kapasitas 1 mobil per 3 jam benar-benar aman dari *double-booking*, kamu harus menambahkan aturan *Partial Unique Index* pada tingkat *database* untuk kolom `(booking_date, time_slot)` dengan kondisi `status != 'CANCELLED'`. Jadi, sistem otomatis menolak jika ada dua pelanggan yang mencoba membidik slot yang sama di detik yang bersamaan.

### 5. Tabel `order_items` (Detail Keranjang/Pesanan)

Menyambungkan tabel `orders` dengan `products`. Satu pesanan bisa berisi banyak barang/jasa (Relasi N-to-N).

* `id` (Primary Key)
* `order_id` (Foreign Key $\rightarrow$ `orders.id`)
* `product_id` (Foreign Key $\rightarrow$ `products.id`)
* `quantity` (Int)
* `price_at_booking` (Decimal/Int) - *Wajib ada untuk merekam harga saat itu, jaga-jaga jika besok harga produk di tabel utama berubah.*

### 6. Tabel `reviews` (Ulasan Pelanggan)

* `id` (Primary Key)
* `order_id` (Foreign Key $\rightarrow$ `orders.id`, Unique)
* `rating` (Int, 1-5)
* `comment` (Text, Nullable)
* `created_at` (Timestamp)
