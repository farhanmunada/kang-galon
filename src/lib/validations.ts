import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  phone: z
    .string()
    .min(9, 'Nomor telepon minimal 9 digit')
    .max(20)
    .regex(/^[0-9+]+$/, 'Nomor telepon hanya boleh angka dan tanda +'),
  address: z.string().min(5, 'Alamat minimal 5 karakter'),
});

export const subscriptionSchema = z.object({
  customerId: z.string().uuid('ID Pelanggan tidak valid'),
  bottlesPerDelivery: z.coerce.number().int().min(1, 'Minimal 1 galon per pengantaran'),
  intervalDays: z.coerce.number().int().min(1, 'Interval minimal 1 hari'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
  batchCount: z.coerce.number().int().min(1).max(12).default(4),
});

export const updateDeliveryStatusSchema = z.object({
  deliveryId: z.string().uuid('ID Pengantaran tidak valid'),
  nextStatus: z.enum(['PENDING', 'DELIVERING', 'DELIVERED', 'CANCELLED']),
});

export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Kata sandi wajib diisi'),
});
