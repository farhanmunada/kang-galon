export type DeliveryStatus = 'PENDING' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED';

export const VALID_TRANSITIONS: Record<DeliveryStatus, DeliveryStatus[]> = {
  PENDING: ['DELIVERING', 'CANCELLED'],
  DELIVERING: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
};

export function canTransition(currentStatus: DeliveryStatus, nextStatus: DeliveryStatus): boolean {
  const allowed = VALID_TRANSITIONS[currentStatus];
  return Boolean(allowed && allowed.includes(nextStatus));
}

export function transitionStatus(currentStatus: DeliveryStatus, nextStatus: DeliveryStatus): DeliveryStatus {
  if (!VALID_TRANSITIONS[currentStatus]) {
    throw new Error(`Status asal tidak valid: "${currentStatus}"`);
  }

  if (!canTransition(currentStatus, nextStatus)) {
    throw new Error(
      `Transisi status ilegal: tidak bisa mengubah dari "${currentStatus}" ke "${nextStatus}". Pilihan: [${VALID_TRANSITIONS[
        currentStatus
      ].join(', ')}]`
    );
  }

  return nextStatus;
}
