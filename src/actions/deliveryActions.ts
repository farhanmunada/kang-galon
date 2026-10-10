'use server';

import { db } from '@/db';
import { deliveries } from '@/db/schema';
import { updateDeliveryStatusSchema } from '@/lib/validations';
import { transitionStatus, DeliveryStatus } from '@/lib/domain/stateMachine';
import { eq, desc, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getDeliveries(statusFilter?: DeliveryStatus) {
  try {
    return await db.query.deliveries.findMany({
      where: statusFilter ? eq(deliveries.status, statusFilter) : undefined,
      with: {
        subscription: {
          with: {
            customer: true,
          },
        },
      },
      orderBy: [asc(deliveries.deliveryDate), desc(deliveries.updatedAt)],
    });
  } catch (error) {
    console.error('Failed to get deliveries:', error);
    return [];
  }
}

export async function updateDeliveryStatus(deliveryId: string, targetStatus: DeliveryStatus) {
  const parsed = updateDeliveryStatusSchema.safeParse({
    deliveryId,
    nextStatus: targetStatus,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(', '),
    };
  }

  try {
    const existing = await db.query.deliveries.findFirst({
      where: eq(deliveries.id, deliveryId),
    });

    if (!existing) {
      return { success: false, error: 'Data pengantaran tidak ditemukan.' };
    }

    // Validasi via Domain State Machine
    const nextStatus = transitionStatus(existing.status as DeliveryStatus, targetStatus);

    await db
      .update(deliveries)
      .set({
        status: nextStatus,
        updatedAt: new Date(),
      })
      .where(eq(deliveries.id, deliveryId));

    revalidatePath('/courier');
    revalidatePath('/');
    return { success: true, status: nextStatus };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Gagal mengubah status pengantaran.',
    };
  }
}
