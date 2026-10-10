'use server';

import { db } from '@/db';
import { subscriptions, deliveries } from '@/db/schema';
import { subscriptionSchema } from '@/lib/validations';
import { generateDeliveryDates } from '@/lib/domain/scheduler';
import { revalidatePath } from 'next/cache';
import { desc } from 'drizzle-orm';

export async function getSubscriptions() {
  try {
    return await db.query.subscriptions.findMany({
      with: {
        customer: true,
      },
      orderBy: [desc(subscriptions.createdAt)],
    });
  } catch (error) {
    console.error('Failed to get subscriptions:', error);
    return [];
  }
}

export async function createSubscription(formData: FormData) {
  const rawData = {
    customerId: formData.get('customerId'),
    bottlesPerDelivery: formData.get('bottlesPerDelivery'),
    intervalDays: formData.get('intervalDays'),
    startDate: formData.get('startDate'),
    batchCount: formData.get('batchCount') || 4,
  };

  const parsed = subscriptionSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(', '),
    };
  }

  const { customerId, bottlesPerDelivery, intervalDays, startDate, batchCount } = parsed.data;

  try {
    // 1. Simpan langganan
    const [sub] = await db
      .insert(subscriptions)
      .values({
        customerId,
        bottlesPerDelivery,
        intervalDays,
        startDate,
        status: 'ACTIVE',
      })
      .returning();

    // 2. Generate tanggal pengantaran dengan domain logic
    const dates = generateDeliveryDates(startDate, intervalDays, batchCount);

    // 3. Batch insert ke tabel pengantaran
    const deliveryRows = dates.map((dateStr) => ({
      subscriptionId: sub.id,
      deliveryDate: dateStr,
      bottleCount: bottlesPerDelivery,
      status: 'PENDING' as const,
    }));

    await db.insert(deliveries).values(deliveryRows);

    revalidatePath('/subscriptions');
    revalidatePath('/courier');
    revalidatePath('/');
    return { success: true, subscriptionId: sub.id, generatedDates: dates };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Gagal membuat paket langganan.',
    };
  }
}
