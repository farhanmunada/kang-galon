# Product Requirement Document (PRD): Kang Galon Web System

## 1. Tujuan Produk (Objective)
Membangun platform operasional web terpadu untuk depot isi ulang air galon guna mengotomatisasi pencatatan langganan pelanggan, pembuatan jadwal antar berkala, pemisahan hak akses antara pemilik dan pekerja kurir, serta penyediaan data awal (dummy data) untuk uji operasional.

## 2. Asumsi dan Batasan (Assumptions)
1. Hak akses dibagi menjadi 2 peran:
   - Pemilik (OWNER): Akses penuh ke seluruh menu (Dasbor, Pelanggan, Langganan, Kurir).
   - Pekerja (COURIER): Akses terbatas hanya ke halaman tugas kurir (/courier). Akses ke halaman lain otomatis dialihkan ke /courier.
2. Autentikasi menggunakan session cookie aman HTTP-only dengan hashing password native scrypt.
3. Database menggunakan PostgreSQL di cloud provider Neon dengan Drizzle ORM.
4. Tersedia skrip dummy data yang dapat dijalankan secara instan via npm run db:seed.
5. Desain antarmuka modern, bersih, profesional, dan responsif untuk layar ponsel kurir maupun laptop pemilik.
6. Semua dokumen dan antarmuka bersih dari emoticon atau emoji dekoratif.

## 3. Fitur Utama

### 3.1. Autentikasi dan Pemisahan Hak Akses (RBAC)
- Halaman login (/login) dengan validasi email dan password.
- Peran OWNER:
  - Melihat dasbor metrik bisnis.
  - Menambah dan mengelola data pelanggan.
  - Menambah dan mengelola paket langganan galon.
  - Memantau seluruh antrean pengantaran.
- Peran COURIER:
  - Mengakses halaman /courier untuk melihat jadwal kirim dan mengubah status (Menunggu -> Di Jalan -> Terkirim).
  - Dilarang mengakses halaman admin (/customers, /subscriptions, dasbor analitik).
- Middleware route guard untuk memvalidasi sesi cookie sebelum memuat halaman.
- Tombol logout di bagian navigasi atas.

### 3.2. Data Awal Dummy (Seeding)
- Akun bawaan:
  - Pemilik: owner@kanggalon.id (kata sandi: owner123)
  - Kurir: kurir@kanggalon.id (kata sandi: kurir123)
- Data pelanggan dummy: 8 sampai 10 data pelanggan perumahan dengan variasi alamat dan nomor kontak WhatsApp aktif.
- Data langganan: Berbagai variasi kuota (1 hingga 4 galon) dan interval (2, 3, dan 7 hari).
- Data pengantaran: Ragam status (PENDING, DELIVERING, DELIVERED).

### 3.3. Modernisasi Antarmuka Pengguna (UI/UX)
- Palet warna modern: Slate, Sky Blue, Emerald Green.
- Kartu statistik dengan indikator tren dan ikon visual fungsional (Lucide).
- Tampilan kartu kurir ringkas dan tombol aksi terarah (Mulai Antar, Selesai, WhatsApp).
- Navigasi adaptif: Menampilkan identitas akun yang sedang login dan tombol keluar.

## 4. Rencana Skema Database (PostgreSQL)
- users: id (UUID), name (VARCHAR), email (VARCHAR UNIQUE), password_hash (TEXT), role (ENUM: OWNER, COURIER), created_at (TIMESTAMP).
- customers: id (UUID), name (VARCHAR), phone (VARCHAR UNIQUE), address (TEXT), created_at (TIMESTAMP).
- subscriptions: id (UUID), customer_id (UUID FK), bottles_per_delivery (INT), interval_days (INT), status (ENUM), start_date (DATE), created_at (TIMESTAMP).
- deliveries: id (UUID), subscription_id (UUID FK), delivery_date (DATE), bottle_count (INT), status (ENUM), notes (TEXT), updated_at (TIMESTAMP).

## 5. Standar Teknis dan Perintah
- Framework: Next.js 16, React 19, TypeScript.
- ORM: Drizzle ORM, @neondatabase/serverless.
- Styling: Tailwind CSS v4, Lucide React.
- Perintah:
  - npm run dev
  - npm run build
  - npm test
  - npm run db:push
  - npm run db:seed

## 6. Kriteria Keberhasilan (Success Criteria)
1. Pengguna dapat login sebagai Pemilik dan melihat semua menu.
2. Pengguna dapat login sebagai Kurir dan dilarang mengakses halaman admin (redirect otomatis ke /courier).
3. Skrip npm run db:seed berhasil mengisi data akun, pelanggan, langganan, dan jadwal antar tanpa error.
4. Desain antarmuka rapi, responsif, modern, dan bebas dari karakter emoticon.
5. Build dan Typecheck lulus 100% tanpa error.
