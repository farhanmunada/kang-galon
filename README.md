# Kang Galon - Sistem Manajemen dan Distribusi Depot Air

Aplikasi web profesional untuk operasional depot air isi ulang. Mengelola langganan berkala pelanggan, otomasi jadwal pengantaran, pelacakan tugas kurir secara real-time, dan pemisahan hak akses antara pemilik depot dan pekerja kurir.

## Tech Stack
- Framework: Next.js 16 (App Router, Server Actions, React 19)
- Database: PostgreSQL di Neon Serverless
- ORM: Drizzle ORM (drizzle-orm/neon-http)
- Autentikasi: Stateless HMAC-SHA256 Session Cookie dengan Web Crypto API dan scrypt native
- Validasi: Zod v4
- Desain UI: Tailwind CSS v4 dan Lucide React
- Pengujian Otomatis: Node.js Native Test Runner (node:test, node:assert/strict)

---

## Hak Akses Pengguna (Role-Based Access Control)

Sistem membedakan izin akses berdasarkan peran pengguna:

1. Peran Pemilik (OWNER):
   - Akses penuh ke seluruh halaman sistem.
   - Dasbor analitik operasional dan metrik bisnis (/).
   - Manajemen pelanggan (/customers).
   - Manajemen paket langganan dan jadwal (/subscriptions).
   - Pengawasan portal pengantaran kurir (/courier).

2. Peran Pekerja Kurir (COURIER):
   - Akses dibatasi hanya pada portal tugas pengantaran (/courier).
   - Memperbarui status pengantaran (Menunggu -> Di Jalan -> Terkirim).
   - Hubungi pelanggan via WhatsApp dengan pesan otomatis.
   - Upaya membuka halaman pemilik (/ atau /customers) otomatis dialihkan ke /courier oleh middleware.

---

## Akun Demo Bawaan

Tersedia akun bawaan dari skrip seeding:

1. Pemilik Depot:
   - Email: owner@kanggalon.id
   - Kata Sandi: owner123

2. Pekerja Kurir:
   - Email: kurir@kanggalon.id
   - Kata Sandi: kurir123

---

## Panduan Instalasi dan Menjalankan

### 1. Konfigurasi Lingkungan
Salin file .env.example menjadi .env.local:
```bash
cp .env.example .env.local
```
Isi variabel DATABASE_URL dengan connection string dari dashboard Neon Console.

### 2. Sinkronisasi Skema Database
Kirim definisi skema tabel ke instance Neon Postgres:
```bash
npm run db:push
```

### 3. Eksekusi Data Awal Dummy (Seeding)
Isi database dengan akun demo, data pelanggan realistis, paket langganan, dan jadwal pengantaran:
```bash
npm run db:seed
```

### 4. Jalankan Server Development
```bash
npm run dev
```
Buka peramban di http://localhost:3000. Pengguna yang belum login akan diarahkan ke http://localhost:3000/login.

### 5. Menjalankan Pengujian Otomatis
```bash
npm test
```

### 6. Pemeriksaan Tipe dan Build Produksi
```bash
npx tsc --noEmit
npm run build
```
