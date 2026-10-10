# Arsitektur Teknis: Depot Kang Galon (Next.js + Neon DB + RBAC Auth)

## 1. Desain Arsitektur Sistem & Hak Akses (RBAC)

Aplikasi menggunakan arsitektur modular Next.js App Router dengan pemisahan peran:
- **Presentation Layer**:
  - Halaman Publik: `/login`.
  - Halaman Pemilik (OWNER): `/`, `/customers`, `/subscriptions`.
  - Halaman Pekerja (COURIER): `/courier`.
- **Security & Route Guard**:
  - `src/middleware.ts`: Memeriksa session cookie HTTP-only terenkripsi/ditandatangani (HMAC-SHA256 native `node:crypto`).
  - Redirect otomatis jika kurir mencoba membuka halaman pemilik.
- **Data Access & Seeding**:
  - Drizzle ORM + Neon PostgreSQL.
  - Script seed terisolasi (`src/db/seed.ts`) untuk populasi data dummy awal.

## 2. Skema Database Relasional (PostgreSQL)

```sql
-- ENUM Tipe Role & Status
CREATE TYPE user_role AS ENUM ('OWNER', 'COURIER');
CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'PAUSED', 'CANCELLED');
CREATE TYPE delivery_status AS ENUM ('PENDING', 'DELIVERING', 'DELIVERED', 'CANCELLED');

-- Tabel Pengguna & Autentikasi
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role user_role DEFAULT 'COURIER' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabel Pelanggan
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabel Kontrak Langganan
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  bottles_per_delivery INT NOT NULL CHECK (bottles_per_delivery > 0),
  interval_days INT NOT NULL CHECK (interval_days > 0),
  status subscription_status DEFAULT 'ACTIVE' NOT NULL,
  start_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabel Jadwal & Tracking Pengantaran
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  delivery_date DATE NOT NULL,
  bottle_count INT NOT NULL CHECK (bottle_count > 0),
  status delivery_status DEFAULT 'PENDING' NOT NULL,
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
```

## 3. Alur Kerja Autentikasi Native & Session
1. Admin/Kurir input email dan password di `/login`.
2. Server Action `loginAction` memverifikasi hash via `scrypt` (`node:crypto`).
3. Jika valid, buat payload session: `{ userId, name, email, role }`, buat token HMAC-SHA256, lalu set ke cookie HTTP-only `auth_token` dengan `SameSite=Lax; HttpOnly; Secure; Path=/`.
4. `src/middleware.ts` membaca cookie pada setiap request:
   - Jika belum login dan mengakses selain `/login`: redirect ke `/login`.
   - Jika role `COURIER` mengakses selain `/courier`: redirect ke `/courier`.
   - Jika sudah login dan mengakses `/login`: redirect ke halaman yang sesuai perannya.
5. Logout: Server Action menghapus cookie `auth_token` dan redirect ke `/login`.

## 4. Rencana Tahapan Eksekusi (Tasks Breakdown)
- **Tahap 1**: Update skema database Drizzle (`src/db/schema.ts`) dengan tabel `users` & enum `user_role`.
- **Tahap 2**: Buat helper hashing password dan session token native di `src/lib/auth.ts`.
- **Tahap 3**: Buat script seeding `src/db/seed.ts` (akun owner, kurir, 8 pelanggan, paket langganan, jadwal antar) dan script npm `npm run db:seed`.
- **Tahap 4**: Buat middleware proteksi rute `src/middleware.ts` dan Server Actions login/logout.
- **Tahap 5**: Buat halaman login modern `/login` dan perbarui navbar dengan info profil, role badge, dan tombol logout.
- **Tahap 6**: Modernisasi UI seluruh halaman (dasbor, pelanggan, langganan, kurir) tanpa emoticon.
- **Tahap 7**: Verifikasi typecheck, unit test, build, dan commit + push ke GitHub.
