'use server';

import { db } from '@/db';
import { customers } from '@/db/schema';
import { customerSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';
import { desc } from 'drizzle-orm';

export async function getCustomers() {
  try {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  } catch (error) {
    console.error('Failed to get customers:', error);
    return [];
  }
}

export async function createCustomer(formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    address: formData.get('address'),
  };

  const parsed = customerSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(', '),
    };
  }

  try {
    const [inserted] = await db.insert(customers).values(parsed.data).returning();
    revalidatePath('/customers');
    revalidatePath('/');
    return { success: true, data: inserted };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message?.includes('unique')
        ? 'Nomor telepon sudah terdaftar.'
        : 'Gagal menyimpan data pelanggan.',
    };
  }
}
