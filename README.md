# Kang Galon - Sistem Manajemen & Distribusi Depot Air

Aplikasi web profesional untuk operasional depot air isi ulang. Mengelola langganan berkala pelanggan, otomasi jadwal pengantaran, dan pelacakan kurir secara real-time.

## Tech Stack
- **Framework**: Next.js 16 (App Router, Server Actions, React 19)
- **Database**: PostgreSQL di Neon Serverless
- **ORM**: Drizzle ORM (`drizzle-orm/neon-http`)
- **Validasi**: Zod v4
- **Styling**: Tailwind CSS v4 & Lucide React
- **Testing**: Node.js Native Test Runner (`node:test`, `node:assert/strict`)

---

## Fitur Utama

1. **Dasbor Ringkasan (`/`)**
   - Metrik total pelanggan, paket aktif, dan antrean pengantaran.
   - Tabel jadwal pengantaran terdekat.

2. **Manajemen Pelanggan (`/customers`)**
   - Pendaftaran pelanggan baru dengan validasi data nomor HP dan alamat.
   - Daftar riwayat pelanggan terdaftar.

3. **Paket Langganan & Generator Jadwal (`/subscriptions`)**
   - Pembuatan paket galon rutin (misal 2 galon tiap 3 hari).
   - Generator jadwal otomatis terintegrasi dengan penanganan hari libur depot.

4. **Operasional Kurir (`/courier`)**
   - Tampilan mobile-friendly untuk kurir di lapangan.
   - Finite State Machine: `PENDING` -> `DELIVERING` -> `DELIVERED`.
   - Tombol cepat chat WhatsApp pelanggan tujuan.

---

## Panduan Instalasi & Menjalankan

### 1. Konfigurasi Lingkungan
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Isi variabel `DATABASE_URL` dengan connection string dari dashboard [Neon Console](https://console.neon.tech).

### 2. Sinkronisasi Skema Database
Push skema Drizzle ke instance Neon Postgres:
```bash
npm run db:push
```

### 3. Jalankan Mode Development
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

### 4. Menjalankan Pengujian Otomatis
```bash
npm test
```

### 5. Typecheck & Production Build
```bash
npx tsc --noEmit
npm run build
```
